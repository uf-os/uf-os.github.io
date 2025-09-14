// Bento grid helper: measure items and set grid-row-end to create masonry-like packing
// Inspired by https://iamsteve.me/blog/bento-layout-css-grid
(function(){
  'use strict';
  function px(value){
    return value && value.indexOf('px') > -1 ? parseFloat(value) : null;
  }

  function resizeBentoGrid(gridSelector){
    var grids = document.querySelectorAll(gridSelector || '.built-in-grid');
    grids.forEach(function(grid){
      var style = getComputedStyle(grid);
      // gap may be 'row-gap column-gap' or single value; prefer row-gap if present
      var rowGap = px(style.getPropertyValue('row-gap')) || px(style.getPropertyValue('gap')) || 0;
  // read the grid-auto-rows so span calculations match CSS; fallback to 12px
  // which is the base row used in CSS to reduce rounding errors
  var rowHeight = px(style.getPropertyValue('grid-auto-rows')) || 12;

      Array.prototype.forEach.call(grid.children, function(item){
        var content = item;
        // reset any inline span before measuring
        content.style.gridRowEnd = '';
        var itemHeight = Math.ceil(content.getBoundingClientRect().height);
        var span = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
        content.style.gridRowEnd = 'span ' + Math.max(span, 1);
        // ensure items align to start so heights don't stretch
        content.style.alignSelf = 'start';
      });
    });
  }

  if (typeof window !== 'undefined'){
    function init(){
      resizeBentoGrid();
    }
    window.addEventListener('load', init);
    window.addEventListener('resize', function(){
      // debounce
      clearTimeout(window.__bentoResizeTimer);
      window.__bentoResizeTimer = setTimeout(function(){ resizeBentoGrid(); }, 150);
    });
    // images might change height after load
    document.addEventListener('load', function(e){
      if (e.target && e.target.tagName === 'IMG') resizeBentoGrid();
    }, true);
    // expose for manual triggering
    window.resizeBentoGrid = resizeBentoGrid;
  }
})();
