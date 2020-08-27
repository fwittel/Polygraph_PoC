export default function(node) {

   let menuNode,
      iconBackward,
      iconForward,
      history = [],
      indexInHistory = 0;

   // Seems stupid: recenterGraph is a callback and defined at creation. However I get a type error if I don't create it as a function in the beginning.
   function recenterGraph() {
   }

   menuNode = node;
   iconBackward = node.select("#history-backward");
   iconForward = node.select("#history-forward");

   iconBackward.on("click", _ => visitHistory(-1));
   iconForward.on("click", _ => visitHistory(1));

   function updateUI() {
      if (!menuNode) return;
      iconBackward.classed("inactive", indexInHistory < 1);
      iconForward.style("visibility", indexInHistory < history.length - 1 ? "visible" : "hidden");
   }

   updateUI();

   function visitHistory(step) {
      if (!step) return;
      if (indexInHistory < 1 && step < 0) return;
      indexInHistory += step;
      recenterGraph(history[indexInHistory]);
      updateUI();
   }

   function sequencer() {
      return this;
   }

   sequencer.addHistory = function(node) {
      // (In case the user went back and now clicks another node history has to be rebuilt from that point.)
      if(!node) return;
      if(node === history[indexInHistory]) return;
      history.splice(indexInHistory + 1, 999, node)
      indexInHistory = history.length - 1;
      if (history.length > 30) {
         history.shift();
         indexInHistory -= 1;
      }
      updateUI();
   }

   sequencer.visitHistory = visitHistory;

   sequencer.recenterCallback = function(_) {
      if (_) {
         recenterGraph = _;
         return this;
      }
      return recenterGraph;
   }

   return sequencer;
}