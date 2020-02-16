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
		// 		console.log("Sorce data contains link without corresponding nodes: ", link);
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

	dataHandler.recenter = function (centerNodeId) {

		if (!data) return null;
		
		let iteration = 1;
		let nodesAround = [{id: centerNodeId, iteration: iteration}];
		
		do {
			let newNodeIds = [];
			for (var node of nodesAround.filter(n => n.iteration === iteration)) {
				newNodeIds = newNodeIds.concat(data.links.filter(l => l.source.id === node.id).map(l => l.target.id));
				newNodeIds = newNodeIds.concat(data.links.filter(l => l.target.id === node.id).map(l => l.source.id));
			}
			iteration++;	
			for (var newNodeId of newNodeIds) {
				if(!nodesAround.some(n => n.id === newNodeId)) {
					nodesAround.push({id: newNodeId, iteration: iteration})
				}
			}
		} while (Object.keys(nodesAround).length < 30 && iteration < 10);

		// const links = data.links.map(d => Object.create(d));
		// const nodes = data.nodes.map(d => Object.create(d));
		for (let n of data.nodes) {
			const found = nodesAround.find(d => +d.id === +n.id);
			n.iteration = found ? found.iteration : null;
		}

		return data;
	}

	return dataHandler;
}