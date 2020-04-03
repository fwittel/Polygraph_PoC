import * as d3 from "d3";
import 'd3-force';
var clamp = require('text-overflow-clamp')


export default function() {

	let node, data, clickCallback, lastCenterNode;

	const forceX = d3.forceX()
		.strength(n => !n.iteration ? 0.1 : n.renderValue * 0.05);
	const forceY = d3.forceY()
		.strength(n => !n.iteration ? 0.1 : n.renderValue * 0.05);
	const forceManyBody = d3.forceManyBody()
		// .theta([0.5, 0.5])
		.strength(n => {
			const f = n.type === "tag" ? 1 : 2;
			const b = !n.iteration ? -1200 : n.renderValue * -600;
			return n.renderValue * f * b;
		});
	const forceLink = d3.forceLink()
		.strength(l => l.value * 0.004);

	const timing = {
		removalDelayMax: 500,
		removalDurationMax: 1000,
		entryDelayMax: 3000,
		entryDurationMax: 5000,
	}

	let graphLayout = d3.forceSimulation()
		.alphaDecay(0.01)
		.velocityDecay(0.5)
		// .alphaMin(0.05)
		.force("forceX", forceX)
		.force("forceY", forceY)
		.force("manybody", forceManyBody)
		.force("links", forceLink)
		.on("tick", _ => {
			node.selectAll("div")
				.style("left", n => n.x + "px")
				.style("top", n => n.y + "px");
		});

	const blueMountainScale = d3.scaleLinear()
		.domain([1, 0.5, 0])
		.range(["#333", "#333", "#235"]);

	function update() {
		// (Performance gains possible by separation in geometry-update and data-update)

		if (!node || !data) return

		let {width, height} = node.node().parentNode.getBoundingClientRect();
		const maxDim = width > height ? width : height;

		forceX.x(width * 0.5);
		forceY.y(height * 0.45);
		
		forceLink.links(data.links);

		graphLayout
			.nodes(data.nodes)
			.alpha(.9)
			.restart();

		node.selectAll("div")	
			.data(data.nodes, n => n.id)
			.join(
				enter => enter.append("div")
					.on("click", n => {
						if (clickCallback) clickCallback(n)
					})
					.attr("class", n => n.type)
					// Let nodes appear outside the screen in the direction of average connected nodes vector, however 
					.each((d, i) => {
						const connectedNodes = [...data.links.filter(l => l.target === d).map(l => l.source), ...data.links.filter(l => l.source === d).map(l => l.target)];
						const vectorSum = connectedNodes.reduce((a, b) => ({x: a.px + b.px - width * 0.5 || 0, y: a.py + b.py - height * 0.5 || 0}), {x: 0, y: 0})
						if (vectorSum.x || vectorSum.y) {
							const vectorL = Math.sqrt(Math.pow(vectorSum.x, 2) + Math.pow(vectorSum.y, 2));
							const vectorF = maxDim / vectorL;
							d.x = width * 0.5 + vectorSum.x * vectorF;
							d.y = height * 0.5 + vectorSum.y * vectorF;
						}
						else {
							d.x = Math.random() > 0.5 ? width : 0
							d.y = Math.random() > 0.5 ? height : 0;
						}
					}),
					// .style("transform", "scale(0.1)")
					// .style("opacity", 0.1)
					// .style("filter", "blur(1)"),
				update => update,
				exit => exit
					// .style("transition-property", "transform, opacity")
					.style("transition-delay", d => `${Math.random() * timing.removalDelayMax / 1000}s`)
					.style("transition-duration", d => `${(Math.random() * timing.removalDurationMax) / 1000}s`)
					.style("transform", n => `scale(0.01)`)
					// .style("opacity", 0)
					.remove()
			)
				.text(n => n.content) // Reuired as long as clamping is used
				// Bug: certain transitions seem not to be executed.
				.style("transition-delay", d => {`${((!d.iteration || d === lastCenterNode) ? 100 : timing.removalDelayMax * 0.3 + (1 - d.renderValue) * timing.entryDelayMax) / 1000}s`})
				.style("transition-duration", d => `${((1 + Math.random()) * 0.5 * timing.entryDurationMax) / 1000}s`)
					.style("transform", n => `scale(${0.1 + 0.9 * n.renderValue}) translate(-50%, -50%)`)
					.style("opacity", n => n.renderValue > 0.8 ? 1 : n.renderValue * 0.7 + 0.3)
					.style("color", n => blueMountainScale(n.renderValue))
					.style("filter", n => n.renderValue > 0.4 ? null : `blur(${1 - n.renderValue / 0.4}em)`)

		for (let element of document.querySelectorAll("#viz div")) {
			if (d3.select(element).datum().iteration) {
				clamp(element, 6);
			}
		}

		if (data.nodes.length === 1) {
			data.nodes[0].x = width * 0.5;
			data.nodes[0].y = height * 0.5;
		}

		lastCenterNode = data.nodes[0];

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