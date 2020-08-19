import './styles/main.scss'
import 'tippy.js/dist/tippy.css';

import * as d3 from "d3"
import 'd3-dsv'
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import tippy, {sticky} from 'tippy.js';

UIkit.use(Icons);

import * as dataInPrev from '../data/bill_campbell.json'
import DataHandler from './js/dataHandler.ts'
import Graph from './js/graph.ts'
import Menu from './js/menu.ts'
import Intro from './js/intro.ts'
import { debounce } from './js/utilities.ts'

let dataHandler, graph;

document.addEventListener('DOMContentLoaded', _ => {

	UIkit.modal("#modal").show();

	const vizNode = d3.select("#viz");
	const menuNode = d3.select("#search-overlay");

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

	const intro = Intro(dataHandler, graph);

	d3.select("#modal-skip").on("click", _ => graph.data(dataHandler.recenter()));
	d3.select("#modal-tour").on("click", _ => {
					intro(0);
				});

	window.addEventListener("resize",debounce(function(e){
		graph();
	}));
})

function parseTable(dataTable) {

	const dataOut = {
		links: [],
		nodes: []
	};

	const dbStructOut = [];

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
				let dbStructRow = {};
				dbStructRow.author = "Alan Eagle; Eric Schmidt; Jonathan Rosenberg";
				dbStructRow.firstname = "Alan; Eric; Jonathan";
				dbStructRow.lastname = "Eagle; Schmidt; Rosenberg";
				dbStructRow.birthdate = "";
				dbStructRow.deaddate = "";
				dbStructRow.citation = cIn.Citation;
				dbStructRow.language = "EN";
				dbStructRow.label = tag;
				dbStructRow["relation-citation-label"] = parseFloat(cIn[tag] / 4);
				dbStructRow.source = "Trillion Dollar Coach: The Leadership Playbook of Silicon Valley's Bill Campbell";
				dbStructRow.published = "2019-04-16";
				dbStructRow.link = "https://www.trilliondollarcoach.com"; // url?
				dbStructOut.push(dbStructRow);
			}
		}
		dataOut.nodes.push(newNode);
	});
	dataOut.nodes.forEach((v, i) => v.id = i);
	console.log(JSON.stringify(dbStructOut));
	const tsv = d3.tsvFormat(dbStructOut);
	console.log(tsv)
	const csv = d3.csvFormat(dbStructOut);
	console.log(csv)	
	// console.log(dataOut);
	return dataOut;
}
