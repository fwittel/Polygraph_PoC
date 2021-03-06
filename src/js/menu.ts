import * as d3 from "d3";

export default function(n, cbs) {

	let data, 
		node,
		callbacks;

	node = n;
	callbacks = cbs;

	node.selectAll("#tags, #citations")
		.on('click', function() {
			const targetData = d3.select(d3.event.target).datum();
			if (targetData) {
				callbacks.recenterGraph(targetData);
			}
		});

	node.select("#search form")
		.on("input", function() {
			const searchQuery = document.querySelector("#search input").value;
			callbacks.searchString(searchQuery);
		});

	function update() {
		if (!data || !node || !cbs) return;

		node.select("#tags-header")
			.style("visibility", data.tags.length || data.citations.length > 0 ? "visible" : "hidden");

		node.select("#citations-header")
			.style("visibility", data.citations.length > 0 ? "visible" : "hidden");

		node.select("#tags")
			.selectAll("span")
			.data(data.tags, n => n ? n.id : null)
			.join("span")
				.classed("uk-label", true)
				.text(n => n.content);

		// node.select("#citations-header")
		// 	.style("visibility", data.citations.length > 0 ? "visible" : "hidden");
			
		node.select("#citations")
			.selectAll("div")
			.data(data.citations, n => n ? n.id : null)
			.join("div")
				.text(n => n.content);

	}

	function menu() {
		update();
		return this;
	}

	menu.data = function(_) {
		console.log(_);
		if (_) {
			data = _;
			update();
			return this;	
		} 
		return data;
	}

	menu.update = function() {
		update();
	}

	return menu;

}