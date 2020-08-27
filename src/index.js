import './styles/main.scss'

import * as d3 from "d3"
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

UIkit.use(Icons);

// import * as dataInPrev from '../data/bill_campbell.json'
import DataHandler from './js/dataHandler.ts'
import Graph from './js/graph.ts'
import Menu from './js/menu.ts'
import Sequencer from './js/sequencer.ts'
import TagMode from './js/tagMode.ts'
// import Intro from './js/intro.ts'
import { debounce, parseTable } from './js/utilities.ts'

let dataHandler, graph;
const dataUrl = "http://j-m-z.eu:8083/api/auth0%7C5ec026be5c51d10be8f99fce/graph";

document.addEventListener('DOMContentLoaded', _ => {

	const vizNode = d3.select("#viz");
	const menuNode = d3.select("#search-overlay");
	const historyNode = d3.select("#icons-history");
	const tagNode = d3.select("#tag-mode");
	// const tourNode = d3.select("#tour-overlay");

	// const dataPrev = parseTable(dataInPrev.default);

	dataHandler = DataHandler(dataUrl);
	graph = Graph()
		.node(vizNode)
		.click(recenterGraph);

	dataHandler.callback(d => {
		graph.data(d);
		menu.data(dataHandler.search(""));
	});

	function recenterGraph(centerNode) {
		const centeredData = dataHandler.recenter(centerNode);
		sequencer.addHistory(centerNode);
		graph.data(centeredData);
	}

	function searchString(searchString) {
		const foundData = dataHandler.search(searchString);
		menu.data(foundData);
	}

	function filterGraph(filterConfig) {
		console.log(filterConfig);
		dataHandler.filter(filterConfig);
	}

	let menu = Menu(menuNode, {recenterGraph, searchString});

	let sequencer = Sequencer(historyNode).recenterCallback(recenterGraph);

	let tagMode = TagMode(tagNode).filterCallback(filterGraph);

	// const intro = Intro(dataHandler, graph);

	// d3.select("#modal-skip").on("click", _ => graph.data(dataHandler.recenter()));
	// d3.select("#modal-tour").on("click", _ => {
	// 				intro(0);
	// 			});

	document.querySelector("#icon-help").addEventListener("click", _ => UIkit.modal("#modal-info").show());

	window.addEventListener("resize",debounce(function(e){
		graph();
	}));

	recenterGraph();

})