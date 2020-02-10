console.log('To be a good host is an art.');

import './styles/main.scss'

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

import * as d3 from "d3"

// UIkit.notification('Hello world.');

import * as dataIn from '../data/data.json'
import DataHandler from './js/dataHandler.ts'
import Graph from './js/graph.ts'
import Menu from './js/menu.ts'

const vizNode = d3.select("#viz");
const menuNode = d3.select("#menu");

let dataHandler = DataHandler(dataIn.default);
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

let centeredData = dataHandler.recenter("6") 
console.log(centeredData);

graph.data(centeredData);
graph.highlightWord("not");

let searchData = dataHandler.search("");
menu.data(searchData);