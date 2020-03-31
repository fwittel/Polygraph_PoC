import * as d3 from "d3";
import 'd3-force';
var clamp = require('text-overflow-clamp')


export default function() {

	let node, data, clickCallback, lastCenterNode;

	// const forceCenter = d3.forceCenter();
	const forceX = d3.forceX()
		.strength(n => !n.iteration ? 0.03 : n.renderValue * 0.015);
	const forceY = d3.forceY()
		.strength(n => !n.iteration ? 0.04 : n.renderValue * 0.02);
	const forceManyBody = d3.forceManyBody()
		.strength(n => {
			const f = n.type === "tag" ? 1 : 2;
			const b = !n.iteration ? -600 : n.renderValue * -400;
			return f * b;
		});
	const forceLink = d3.forceLink()
		.strength(l => l.value * 0.005);

	const timing = {
		removalDelayMax: 500,
		removalDurationMax: 1000,
		entryDelayMax: 3000,
		entryDurationMax: 5000,
	}

	let graphLayout = d3.forceSimulation()
		.alphaDecay(0.005)
		.velocityDecay(0.6)
		// .force("center", forceCenter)
		.force("forceX", forceX)
		.force("forceY", forceY)
		.force("manybody", forceManyBody)
		.force("links", forceLink)
		.on("tick", _ => {
			node.selectAll("div")
				// .style("transform", n => `translate(${n.x}px, ${n.y}px)`)
				.style("left", n => n.x + "px")
				.style("top", n => n.y + "px");
		});

	// let drag = d3.drag();

	// graphLayout.resume = function() {
	//   var alpha = force.alpha()
	//   if( alpha < 0.005 ){ alpha = 0.0055 }
	//   else if( alpha < 0.11 ){ alpha += 0.0006 }
	//   return force.alpha(alpha);
	// };

	function update() {
		if (!node || !data) return

		let {width, height} = node.node().parentNode.getBoundingClientRect();
		
		// forceCenter
		// 	.x(width * 0.5)
		// 	.y(height * 0.5);

		forceX.x(width * 0.5);
		forceY.y(height * 0.5);
		
		forceLink.links(data.links);

		graphLayout
			.nodes(data.nodes)
			.alpha(.7)
			.alphaMin(0.01)
			.restart();

		// Better create once and use same?
		const ti = node.transition()
		    .duration(1000)
		    .ease(d3.easeQuadInOut);

		const to = node.transition()
		    .duration(1000)
		    .ease(d3.easePolyOut);

		node.selectAll("div")	
			.data(data.nodes, n => n.id)
			.join(
				enter => enter.append("div")
					.on("click", n => {
						if (clickCallback) clickCallback(n)
					})
					.attr("class", n => n.type)
					// Let nodes appear outside the screen, however 
					.each((d, i) => {d.y = Math.random() > 0.5 ? height : 0, d.x = Math.random() > 0.5 ? width : 0})
					// px
					.style("transform", "scale(0.1)")
					.style("opacity", 0.1)
					.style("filter", "blur(1)"),
				update => update,
				exit => exit
					.style("transition-delay", d => `${Math.random() * timing.removalDelayMax / 1000}s`)
					.style("transition-duration", d => `${(Math.random() * timing.removalDurationMax) / 1000}s`)
					.style("transition-property", "transform, opacity")
					.style("transform", n => `scale(0.01)`)
					.style("opacity", 0)
					.remove()
			)
				.style("transition-property", "transform, opacity")
				// .style("transition-delay", `1s`)
				.style("transition-delay", d => {`${((!d.iteration || d === lastCenterNode) ? 1 : timing.removalDelayMax * 0.3 + (1 - d.renderValue) * timing.entryDelayMax) / 1000}s`})
				// .style("transition-duration", `1s`)
				.style("transition-duration", d => `${((1 + Math.random()) * 0.5 * timing.entryDurationMax) / 1000}s`)
					.style("transform", n => `scale(${0.1 + 0.9 * n.renderValue}) translate(-50%, -50%)`)
					.style("opacity", n => n.renderValue > 0.8 ? 1 : n.renderValue / 0.8)
					.style("filter", n => n.renderValue > 0.4 ? null : `blur(${1 - n.renderValue / 0.4}em)`)
				.text(n => n.content); // Reuired as long as clamping is used

		// d3.selectAll("#viz div").call(drag);

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