import * as d3 from "d3";
import 'd3-force';
var clamp = require('text-overflow-clamp')


export default function() {

	let node, data, clickCallback;

	const forceCenter = d3.forceCenter();
	const forceX = d3.forceX()
		.strength(n => n.iteration === 0 ? .1 : n.renderValue * .0003);
		// .strength(n => n.renderValue ? .05 / n.renderValue ** 2 : .005);
	const forceY = d3.forceY()
		.strength(n => n.iteration === 0 ? .1 : n.renderValue * .002);
		// .strength(n => n.renderValue ? .05 / n.renderValue ** 2 : .005);
	const forceManyBody = d3.forceManyBody()
		// .strength(-100)
		.strength(n => n.renderValue * -300);
	const forceCollide = d3.forceCollide()
		.radius(n => n.renderValue * 10)
		.radius(10)
		.strength(n => n.renderValue);
	const forceLink = d3.forceLink()
		.strength(l => l.value * 0.005);

	let graphLayout = d3.forceSimulation()
		.alphaDecay(0.01)
		.force("center", forceCenter)
		.force("forceX", forceX)
		.force("forceY", forceY)
		.force("manybody", forceManyBody)
		// .force("collide", forceCollide)
		.force("links", forceLink)
		.on("tick", _ => {
			node.selectAll("div")
				.style("left", n => n.x + "px")
				.style("top", n => n.y + "px");
		});

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
			.nodes(data.nodes)
			// .alphaTarget(0)
			.alpha(1)
			.restart();

		// Better create once and use same?
		var t = d3.transition()
		    .duration(750)
		    .ease(d3.easePolyInOut);

		node.selectAll("div")	
			.data(data.nodes, n => n.id)
			.join("div")
				.text(n => `${n.iteration} / ${n.renderValue} / ${n.content}`)
				.on("click", n => {
					console.log(n);
					if (clickCallback) clickCallback(n)
				})
				.attr("class", n => n.type)
				.style("font-size", n => `${(n.renderValue * 20)}pt`)
				.style("filter", n => {
					if (n.renderValue > .4) return null;
					return `blur(${(.4 - n.renderValue) * 1}em)`
				})
				.style("opacity", n => {
					if (n.renderValue > .4) return 1;
					return n.renderValue / .4;
				})
				// .call(graphLayout.drag)

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

	graph.click = function(_){
		if (_) {
			clickCallback = _;
		}
		return this;
	}

	return graph;

}