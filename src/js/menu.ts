import * as d3 from "d3";

export default function(n, cbs) {

	let data, node, callbacks;

	node = n;
	callbacks = cbs;

	node.selectAll("#tags, #citations")
		.on('click', function() {
			console.log(this);
			callbacks.recenter("node recenter id");
		});

	node.select("#search form")
		.on("input", function() {
			console.log(this);
		});

	function update() {
		if (!data || !node || !cbs) return;

		node.select("#tags")
			.selectAll("div")
			.data(data.authors, n => n.id)
			.join("div")
				.text(n => n.content);

console.log(data.citations);
		node.select("#citations")
			.selectAll("div")
			// .data(data.citations, n => n.id)
			.data(data.citations)
			.join("div")
				.text(n => n.content);

	}

	function menu() {
		update();
		return this;
	}

	menu.data = function(_) {
		if (_) {
			data = _;
			console.log(data);
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