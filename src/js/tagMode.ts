export default function(n) {

   let node,
      tagModeActive,
      filterCb;

   node = n;

   n.on("click", _ => tagMode());

   function tagFilter(node) {
      return node.type === "tag";
   }

   function tagMode() {
      tagModeActive = !tagModeActive;
      n.classed("active", tagModeActive);
      console.log(tagModeActive);
      filterCb(tagModeActive ? tagFilter : null);
      return this;
   }

   tagMode.filterCallback = function(_) {
      if (_) filterCb = _;
      return this;
   }

   tagMode.getState = function() {
      return tagModeActive;
   }

   return tagMode;
}