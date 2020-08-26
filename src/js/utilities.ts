import * as d3 from "d3"

function debounce(func){
  var timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,100,event);
  };
}

// This is only for reading Excel tables
function parseTable(dataTable) {

   // console.log(dataTable);

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
   // console.log(JSON.stringify(dbStructOut));
   const tsv = d3.tsvFormat(dbStructOut);
   // console.log(tsv)
   const csv = d3.csvFormat(dbStructOut);
   // console.log(csv)   
   // console.log(dataOut);
   return dataOut;
}

export { debounce, parseTable }