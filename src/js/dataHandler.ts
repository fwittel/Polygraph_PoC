import * as d3 from "d3";

export default function(dInit) {

	let data;
	const targetNodeCount = 20;
	const targetAverageValue = .4;
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

	function dataUpdate(dataIn) {
		if (!dataIn) return;
		// for (let link of dataIn.links) {
		// 	const sourceNode = dataIn.nodes.find(n => n.id === link.source);
		// 	const targetNode = dataIn.nodes.find(n => n.id === link.target);
		// 	if (sourceNode && targetNode) {
		// 		link.source = sourceNode;
		// 		link.target = targetNode;
		// 	}
		// 	else {
				// console.log("Sorce data contains link without corresponding nodes: ", link);
		// 	}
		// }
		// console.log(dataIn);
		data = dataIn;
	}

	dataUpdate(dInit);

	function dataHandler() {
		return data
	}

	dataHandler.data = function(dataIn) {
		dataUpdate(dataIn);
		return data;
	}

	dataHandler.search = function (searchString) {
		
		if (!data) return null;

		let result = {};
		
		result.citations = data.nodes.filter(d => d.type !== "tag" && d.content.toLowerCase().search(searchString.toLowerCase()) > -1);
		result.tags = data.nodes.filter(d => d.type === "tag" && d.content.toLowerCase().search(searchString.toLowerCase()) > -1)
		
		return result;
	}

	dataHandler.recenter = function (centerNode) {

		if (!data) return null;
		
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
		// We want at least two tags in the list, correct as long as that works:
		let nodesAroundSlice;
		while (true) {
			nodesAround.sort((a, b) => (a.multipliedLinkValue > b.multipliedLinkValue ? -1 : 1));
			nodesAroundSlice = nodesAround.slice(0, targetNodeCount)
			// if (nodesAroundSlice.filter(n => n.type === "tag").length > 1) break;
			// for (let i = targetNodeCount; i < nodesAround.length; i++) {
			// 	if (nodesAround[i].type === "tag") nodesAround[i].multipliedLinkValue *= 1.1;
			// }
			break;
		}
		let targetIntegralFactor = targetAverageValue / (nodesAroundSlice.map(n => n.multipliedLinkValue).reduce((a, b) => a + b, 0) / nodesAroundSlice.length);
		for (let i in nodesAroundSlice) {
			// Adjust curve in direction of target curve to  add perspecitve:
			nodesAroundSlice[i].renderValue = (nodesAroundSlice[i].multipliedLinkValue + (targetCurve[i] || 0.01)) * 0.5
			// Adjust cuve in direction of weighted  total size:
			// nodesAroundSlice[i].renderValue *= (targetIntegralFactor * i / nodesAroundSlice.length);
		}
		// console.log(nodesAroundSlice.map(n => Math.round(n.multipliedLinkValue * 100)/100 + "-" + Math.round(n.renderValue * 100)/100).join("	"));
		linksAround = linksAround.filter(l => nodesAroundSlice.some(n => n === l.source) && nodesAroundSlice.some(n => n === l.target));

		return {nodes: nodesAroundSlice, links: linksAround};
	}

	dataHandler.intro = (_ => {

		let introData = {};

		return function(step) {
			// Can go back-and forth, must start with step 1:
			console.log(step);
			switch (step) {
				case 0:
					introData.nodes = [data.nodes.find(n => n.content === "Bill always counseled us to try to cut through those opinions and get to the heart of the matter.")];
					introData.nodes[0].iteration = 0;
					introData.nodes[0].renderValue = 1;
					introData.links = [];
					return introData;
				case 1:
					introData.nodes.push(data.nodes.find(n => n.content === "Decisions"))
					introData.nodes[0].iteration = 1;
					introData.nodes[1].iteration = 0;
					introData.nodes[1].renderValue = 1;
					introData.nodes[1].x = 1;
					introData.nodes[1].y = 1;
					return introData;
				case 2:
					return dataHandler.recenter(introData.nodes[1]);
			}
		}
	})();

	return dataHandler;
}
















