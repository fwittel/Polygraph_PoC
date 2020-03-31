console.log('To be a good host is an art.');

import './styles/main.scss'
import 'tippy.js/dist/tippy.css';

import * as d3 from "d3"
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import tippy, {sticky} from 'tippy.js';

UIkit.use(Icons);


import * as dataInPrev from '../data/bill_campbell.json'
import DataHandler from './js/dataHandler.ts'
import Graph from './js/graph.ts'
import Menu from './js/menu.ts'

let dataHandler, graph;

document.addEventListener('DOMContentLoaded', _ => {

	console.log("here")

	const vizNode = d3.select("#viz");
	const menuNode = d3.select("#menu");

	UIkit.modal("#modal").show();
	d3.select("#modal-button").on("click", _ => {
					intro(0);
				});

	const dataPrev = parseTable(dataInPrev.default);

	dataHandler = DataHandler(dataPrev);
	graph = Graph()
		.node(vizNode)
		.click(recenterGraph);

	function recenterGraph(centerNode) {
		const centeredData = dataHandler.recenter(centerNode);
		graph.data(centeredData);
	}

	function searchString(searchString) {
		const foundData = dataHandler.search(searchString);
		menu.data(foundData);
	}

	let menu = Menu(menuNode, {recenterGraph, searchString});

	let searchData = dataHandler.search("");
	menu.data(searchData);

})

function intro(step) {

	step = step || 0;
	let idleInterval;

	[...document.querySelectorAll('#viz div, #menubutton')].forEach(node => {
	  if (node._tippy) {
	    node._tippy.destroy();
	  }
	});

	switch (step) {
		case 0:
			// Block mouse interaction on viz:
			d3.select("#viz").style("pointer-events", "none");
			// Prep minimal data:
			graph.data(dataHandler.intro(0));
			tippy("#viz div", {
				appendTo: () => document.body,
				trigger: "manual",
				allowHTML: true,
				content: "<div><p>This is a citation from the book</p><button id='intro-button' class='uk-button uk-button-small uk-button-primary'>Ok</button></div>", 
				onShown: _ => d3.select("#intro-button").on("click", _ => {
					intro(1);
				}),
				interactive: true,
				hideOnClick: false,
				showOnCreate: true,
				delay: 500,
				sticky: true,
				plugins: [sticky]
			});
			break;
		case 1:
			graph.data(dataHandler.intro(1));
			tippy("#viz div.tag", {
				appendTo: () => document.body,
				trigger: "manual",
				allowHTML: true,
				content: "<div><p>This is a tag. Tags group citations.</p><button id='intro-button' class='uk-button uk-button-small uk-button-primary'>Ok</button></div>", 
				onShown: _ => d3.select("#intro-button").on("click", _ => {
					intro(2);
				}),
				interactive: true,
				hideOnClick: false,
				showOnCreate: true,
				delay: 1000,
				sticky: true,
				plugins: [sticky]
			});
			break;
		case 2:
			graph.data(dataHandler.intro(2));
			const suitableNode = d3.selectAll("#viz div.citation").filter(d => d.iteration === 1);
			console.log(suitableNode);
			tippy(suitableNode.node(), {
				appendTo: () => document.body,
				trigger: "manual",
				allowHTML: true,
				content: "<div><p>Click any tag or citation to find related information.</p><p>Have fun :)</p></div>", 
				interactive: true,
				hideOnClick: true,
				showOnCreate: true,
				delay: 1500,
				sticky: true,
				plugins: [sticky]
			});
			// Events & visibility back to default:
			d3.select("#viz").style("pointer-events", "auto");
			// Detect idle time and show menu on idle:
			let idleTime = 0;
			idleInterval = setInterval(timerIncrement, 1000);
			d3.select("#viz").on("click", _ => idleTime = 0);
			function timerIncrement() {
			    idleTime = idleTime + 1;
			    if (idleTime > 15) {
			    	intro(3);
			        clearInterval(idleInterval);
			    }
			}
			break;
		case 3:
			console.log("intro 3");
			tippy("#menubutton", {
				appendTo: () => document.body,
				trigger: "manual",
				allowHTML: true,
				content: "<div><p>If you want to search all citations and tags click here.</p><button id='intro-button' class='uk-button uk-button-small uk-button-primary'>Ok</button></div>", 
				onShown: _ => d3.select("#intro-button").on("click", _ => {
					intro(4);
				}),
				interactive: true,
				hideOnClick: false,
				showOnCreate: true,
				delay: 0,
				placement: "right"
			});
		case 4:
			break;
	}

}


function parseTable(dataTable) {

	const dataOut = {
		links: [],
		nodes: []
	};

	dataTable.forEach(cIn => {
		let newNode = {content: cIn.Citation, type: "citation"};
		for (let tag in cIn) {
			if (tag !== 'Citation' && +cIn[tag]) {
				let tagsFound = dataOut.nodes.filter(n => n.type === "tag" && n.content === tag)
				let tagO;
				if (tagsFound.length > 0) {
					tagO = tagsFound[0];
				}
				else {
					tagO = {content: tag, type: "tag"};
					dataOut.nodes.push(tagO);
				}
				dataOut.links.push({source: tagO, target: newNode, value: parseFloat(cIn[tag] / 4)});
			}
		}
		dataOut.nodes.push(newNode);
	});
	dataOut.nodes.forEach((v, i) => v.id = i);
	// console.log(dataOut);
	return dataOut;
}
