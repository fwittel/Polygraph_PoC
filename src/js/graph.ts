import * as d3 from "d3";
import 'd3-force';
var clamp = require('text-overflow-clamp')


export default function() {

	let node, data;

	const forceCenter = d3.forceCenter();
	const forceX = d3.forceX()
		.strength(n => n.iteration ? .05 / n.iteration : 0);
	const forceY = d3.forceY()
		.strength(n => n.iteration ? .05 / n.iteration : 0);
	const forceManyBody = d3.forceManyBody()
		.strength(n => n.iteration ? -100 / n.iteration : -100 / 4);
		// .strength(-50);
	// const forceCollide = d3.forceCollide()
	// 	.radius(n => n.)
	const forceLink = d3.forceLink()
		.strength(0);

	let graphLayout = d3.forceSimulation()
		.force("center", forceCenter)
		.force("forceX", forceX)
		.force("forceY", forceY)
		.force("manybody", forceManyBody)
		.force("links", forceLink)
		.on("tick", _ =>
			node.selectAll("div")
				.style("left", n => n.x + "px")
				.style("top", n => n.y + "px")
			);

	function update() {
		if (!node || !data) return

		let {width, height} = node.node().parentNode.getBoundingClientRect();
		
		forceCenter
			.x(width * 0.5)
			.y(height * 0.5);

		forceX.x(width * 0.5);
		forceY.y(height * 0.5);
		
		forceLink.links(data.links);

		graphLayout
			.nodes(data.nodes);

		node
		node.selectAll("div")	
			.data(data.nodes, n => n.id)
			.join("div")
				.text(n => n.content)
				.style("font-size", n => {
					switch (n.iteration) {
						case 1: return "12pt";
						case 2: return "10pt";
						case 3: return "8pt";
						case 4: return "6pt";
						default: return "4pt";
					}
				})
				.style("filter", n => {
					if (n.iteration) {
						if (n.iteration < 3) return null;
						return `blur(${(n.iteration - 3) * .2}em)`
					}
					return `blur(1em)`
				});

		for (let element of document.querySelectorAll("#viz div")) {
			clamp(element, 6);
		}

	}

	function graph() {
		update();
		return this;
	}

	graph.data = function(_) {
		if (_) {
			data = _;
			update();
			return this;
		}
		return data;
	}

	graph.node = function (_) {
		if (_) {
			node = _;
			update();
			return this;
		}
		return node;
	}

	graph.highlightWord = function(searchString) {
		node.selectAll("div")
			.text(n => n.content.replace(new RegExp(searchString, "gi"), (match) => `<b>${match}</b>`));
		for (let element of document.querySelectorAll("#viz div")) {
			clamp(element, 6);
		}
	}

	return graph;

}