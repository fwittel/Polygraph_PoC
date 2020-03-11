import * as d3 from "d3";

export default function(dInit) {

	//  Closure
	let data;

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

		do {
			for (var node of nodesAround.filter(n => n.iteration === iteration - 1)) {
				// console.log(node);
				const sourceLinks = data.links.filter(l => l.source.id === node.id);
				const targetLinks = data.links.filter(l => l.target.id === node.id);
				linksAround = linksAround.concat(sourceLinks).concat(targetLinks); // includes links to already found nodes
				// console.log(linksAround);
				// console.log(sourceLinks);
				const sourceLinkNodes = sourceLinks.map(l => Object.assign(l.target, {linkValue: l.value}));
				const targetLinkNodes = targetLinks.map(l => Object.assign(l.source, {linkValue: l.value}));
				// console.log(sourceLinkNodes);
				const childNodes = [...sourceLinkNodes, ...targetLinkNodes].filter(n => !foundIds.some(f => f === n.id));
				childNodes.forEach(c => {
					c.iteration = iteration;
					c.multipliedLinkValue = node.multipliedLinkValue * c.linkValue / iteration;
				});
				// console.log(childNodes);
				foundIds = foundIds.concat(childNodes.map(n => n.id));
				// console.log(foundIds);
				nodesAround = nodesAround.concat(childNodes);
				// console.log(nodesAround);
				// console.log(nodesAround.length);
			}
			iteration++;
				
		} while (nodesAround.length < 50 && iteration < 10);

		// Rough data-cleanup:
		nodesAround = nodesAround.sort((a, b) => a.multipliedLinkValue > b.multipliedLinkValue);
		nodesAround = nodesAround.slice(0, 30);
		for (let i in nodesAround) {
			if (i === 0) nodesAround[i].renderValue = 1 
			else if (i < 4) nodesAround[i].renderValue = 0.6;
			else if (i < 12) nodesAround[i].renderValue = 0.3;
			else nodesAround[i].renderValue = 0.1;
		}
		linksAround = linksAround.filter(l => nodesAround.some(n => n === l.source) && nodesAround.some(n => n === l.target));

		// for (let n of data.nodes) {
		// 	const found = nodesAround.find(d => +d.id === +n.id);
		// 	n.iteration = found ? found.iteration : null;
		// }

		return {nodes: nodesAround, links: linksAround};
	}

	return dataHandler;
}