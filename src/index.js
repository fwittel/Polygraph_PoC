console.log('To be a good host is an art.');

import './styles/main.scss'

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

import * as d3 from "d3"

// UIkit.notification('Hello world.');

import * as dataIn from '../data/data.json'
import * as dataInRaw from '../data/bill_campbell_raw.json'
import * as dataInPrev from '../data/bill_campbell_preview.json'
import DataHandler from './js/dataHandler.ts'
import Graph from './js/graph.ts'
import Menu from './js/menu.ts'

const vizNode = d3.select("#viz");
const menuNode = d3.select("#menu");

const dataPrev = parseTable(dataInPrev.default);

let dataHandler = DataHandler(dataPrev);
let graph = Graph()
	.node(vizNode)
	.click(recenterGraph);

function recenterGraph(centerNodeId) {
	const centeredData = dataHandler.recenter(centerNodeId);
	console.log(centeredData);
	graph.data(centeredData);
}

function searchString(searchString) {
	const foundData = dataHandler.search(searchString);
	menu.data(foundData);
}

let menu = Menu(menuNode, {recenterGraph, searchString});

let centeredData = dataHandler.recenter("0") 
centeredData = dataHandler.recenter("0") 

graph.data(centeredData);

// graph.highlightWord("not");

let searchData = dataHandler.search("");
menu.data(searchData);

// const newD = [];
// for (let o of dataInRaw.h3) {
// 	console.log(o);
// 	newD.push ({
// 		content: o.div['#text'],
// 		origin: o['#text'][1].substring(4)
// 	});
// }
// console.log(newD.map(c => `${c.content}	${c.origin}`).join(`
// 	`));


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
	console.log(dataOut);
	return dataOut;
}
