console.log('To be a good host is an art.');

import './styles/main.scss'
// import 'tippy.js/dist/tippy.css';
// import 

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

import * as d3 from "d3"

// import tippy from 'tippy.js';
// import { dataLoader } from './js/dataLoader.ts'
// import { dataParser } from './js/dataParser.ts'
// import { dataFilter } from './js/dataFilter.ts'
// import { vizRender } from './js/vizRender.ts'
// import { vizHighlighter } from './js/vizHighlighter.ts'
// import { menu } from './js/menu.ts'
// import { debounce } from './js/utilities.ts'

// UIkit.notification('Hello world.');

import * as dataIn from '../data/data.json'
import DataHandler from './js/dataHandler.ts'
import Graph from './js/graph.ts'
import Menu from './js/menu.ts'

const vizNode = d3.select("#viz");
const menuNode = d3.select("#menu");

let dataHandler = DataHandler(dataIn.default);
let graph = Graph()
	.node(vizNode);

function recenterGraph(centerNodeId) {
	console.log(centerNodeId);
	const centeredData = dataHandler.recenter(centerNodeId);
	console.log(centeredData);
	graph.data(centeredData);
}

function searchString(searchString) {
	const foundData = dataHandler.search(searchString);
	menu.data(foundData);
}

let menu = Menu(menuNode, {recenterGraph, searchString});

let centeredData = dataHandler.recenter("6") 
console.log(centeredData);

graph.data(centeredData);
graph.highlightWord("not");

let searchData = dataHandler.search("Invent");
menu.data(searchData);