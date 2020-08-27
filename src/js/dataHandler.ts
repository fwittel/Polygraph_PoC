import * as d3 from "d3";

export default function(dataUrl) {

	let data;
	let callback;
	let centerNode;
	let filterFunc;
	const targetNodeCount = 20;
	const targetAverageValue = .2;
	const targetCurve = [
		1,
		0.707,
		0.693,
		0.679,
		0.643,
		0.607,
		0.571,
		0.514,
		0.429,
		0.357,
		0.3,
		0.25,
		0.221,
		0.2,
		0.179,
		0.157,
		0.136,
		0.121,
		0.107,
		0.093,
		0.079,
		0.064,
		0.05,
		0.043,
		0.029
	];

	function loadData(dataUrl) {
		if (!dataUrl) return;
		// Asynchronous call:
		console.log("dataHandler: Calling REST API");
		d3.json(dataUrl).then(d => parseData(d));
	}

	function parseData(dataIn) {
		console.log("dataHandler: REST API response");
		if(!dataIn.records) return {};
		
		// Generic transfer of neo4j-structure to map of elements by type and id to have unique elements:
		let dataBuffer = {};
		for (let record of dataIn.records) {
			for (let key of record.keys) {
				let fieldIndex = record._fieldLookup[key];
				for (let field of record._fields[fieldIndex]) {
					if (!dataBuffer[key]) dataBuffer[key] = {};
					dataBuffer[key][field.identity] = field;
				}
			}
		}
		// Change object to array, change "rels" to "links":
		let dataOut = {};
		for (let keyIn in dataBuffer) {
			let keyOut = keyIn === "rels" ? "links" : "nodes";
			dataOut[keyOut] = [];
			for (let index in dataBuffer[keyIn]) {
				let elementIn = dataBuffer[keyIn][index];
				let elementOut = {};
				elementOut.id = index;
				elementOut.createdOn = new Date(`${elementIn.properties.created_on.year.low}-${elementIn.properties.created_on.month.low}-${elementIn.properties.created_on.day.low}`);
				if (elementIn.start) {
					// Relations:
					elementOut.source = elementIn.start;
					elementOut.target = elementIn.end;
					elementOut.value = .9;
				}
				else {
					// Other elements, e.g. tags:
					elementOut.content = elementIn.properties.content;
					elementOut.type = elementIn.labels[0] === "Label" ? "tag" : elementIn.labels[0];
				}
				dataOut[keyOut].push(elementOut);
			}
		}
		// Replace link node IDd with references:
		for (let link of dataOut.links) {
			let source = dataOut.nodes.find(n => n.id === link.source);
			let target = dataOut.nodes.find(n => n.id === link.target);
			if (source && target) {
				link.source = source;
				link.target = target;
			}
			else {
				console.log("dataHandler: backend seems to deliver links without nodes.");
			}
		}
		console.log(dataOut);
		data = dataOut;
		let centeredData = dataHandler.recenter();
		callback(centeredData);
	}

	loadData(dataUrl);

	function dataHandler() {
		return data;
	}

	dataHandler.dataUrl = function(_) {
		if (_) loadData(_);
		return dataUrl;
	}

	dataHandler.callback = function(_) {
		if (_) callback = _;
		return dataHandler;
	}

	dataHandler.filter = function(_) {
		if (_) filterFunc = _;
		return filterFunc;
	}

	dataHandler.search = function (searchString) {
		
		if (!data) return null;
		if (!searchString || searchString.length < 1) return {tags: data.nodes.filter(d => d.type === "tag"), citations: []};

		let result = {};
				
		result.citations = data.nodes.filter(d => d.type !== "tag" && d.content.toLowerCase().search(searchString.toLowerCase()) > -1);
		result.tags = data.nodes.filter(d => d.type === "tag" && d.content.toLowerCase().search(searchString.toLowerCase()) > -1)
		
		return result;
	}

	dataHandler.recenter = function (centerNodeIn) {

		if (centerNodeIn) {
			centerNode = centerNodeIn;
		}

		if (!data) return null;

		if (!centerNode) {
			centerNode = data.nodes[parseInt(Math.random() * data.nodes.length)];
		}
		
		centerNode.iteration = 0;
		let iteration = 1;
		centerNode.multipliedLinkValue = 1;
		let nodesAround = [centerNode];
		let linksAround = [];
		
		let foundIds = [centerNode.id];

		// Get the elements closest to source node:
		do {
			for (var node of nodesAround.filter(n => n.iteration === iteration - 1)) {
				const sourceLinks = data.links.filter(l => l.source.id === node.id);
				const targetLinks = data.links.filter(l => l.target.id === node.id);
				linksAround = linksAround.concat(sourceLinks).concat(targetLinks); // includes links to already found nodes
				const sourceLinkNodes = sourceLinks.map(l => Object.assign(l.target, {linkValue: l.value}));
				const targetLinkNodes = targetLinks.map(l => Object.assign(l.source, {linkValue: l.value}));
				const childNodes = [...sourceLinkNodes, ...targetLinkNodes].filter(n => !foundIds.some(f => f === n.id));
				childNodes.forEach(c => {
					c.iteration = iteration;
					c.multipliedLinkValue = node.multipliedLinkValue * c.linkValue / iteration;
				});
				foundIds = foundIds.concat(childNodes.map(n => n.id));
				nodesAround = nodesAround.concat(childNodes);
			}
			iteration++;
				
		} while (nodesAround.length < 50 && iteration < 10);

		// Stretch closest nodes' distances to better fit UI expectations:
		let nodesAroundSlice;
		while (true) {
			nodesAround.sort((a, b) => (a.multipliedLinkValue > b.multipliedLinkValue ? -1 : 1));
			nodesAroundSlice = nodesAround.slice(0, targetNodeCount)
			break;
		}
		let targetIntegralFactor = targetAverageValue / nodesAroundSlice.map(n => n.multipliedLinkValue).reduce((a, b) => a + b, 0) * nodesAroundSlice.length;
		for (let i in nodesAroundSlice) {
			// Adjust curve in direction of target curve to  add perspecitve:
			nodesAroundSlice[i].renderValue = (nodesAroundSlice[i].multipliedLinkValue + (targetCurve[i] || 0.01)) * 0.5
			// Adjust cuve in direction of weighted  total size:
			nodesAroundSlice[i].renderValue *= (1 + +i * 2 / nodesAroundSlice.length * (targetIntegralFactor - 1));
		}
		linksAround = linksAround.filter(l => nodesAroundSlice.some(n => n === l.source) && nodesAroundSlice.some(n => n === l.target));
		// Make unique:
		linksAround = [...new Set(linksAround.map(l => l.id))].map(id => linksAround.find(l => l.id === id));

		return {nodes: nodesAroundSlice, links: linksAround};
	}

	// ### Move to intro to better modularize. Add options here if neccessary

	// dataHandler.intro = (_ => {

	// 	let introData = {};

	// 	return function(step) {
	// 		// Can go back-and forth, must start with step 1:
	// 		console.log(step);
	// 		switch (step) {
	// 			case 0:
	// 				introData.nodes = [data.nodes.find(n => n.content === "Bill always counseled us to try to cut through those opinions and get to the heart of the matter.")];
	// 				introData.nodes[0].iteration = 0;
	// 				introData.nodes[0].renderValue = 1;
	// 				introData.links = [];
	// 				return introData;
	// 			case 1:
	// 				introData.nodes.push(data.nodes.find(n => n.content === "Decisions"))
	// 				introData.nodes[0].iteration = 1;
	// 				introData.nodes[1].iteration = 0;
	// 				introData.nodes[1].renderValue = 1;
	// 				introData.nodes[1].x = 1;
	// 				introData.nodes[1].y = 1;
	// 				return introData;
	// 			case 2:
	// 				return dataHandler.recenter(introData.nodes[1]);
	// 		}
	// 	}
	// })();

	return dataHandler;
}
















