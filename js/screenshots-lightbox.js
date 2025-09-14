(function(){
  const lb = document.getElementById('screenshots-lightbox');
  if(!lb) return;

  const imageEl = lb.querySelector('.lightbox-image');
  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn = lb.querySelector('.lightbox-prev');
  const nextBtn = lb.querySelector('.lightbox-next');
  let triggers = [];
  let current = 0;
  let lastFocused = null;

  // helpers for focus trapping
  function getFocusableElements(root) {
    return Array.from(root.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]')).filter(el => el.offsetParent !== null);
  }

  function refreshTriggers(){
    triggers = Array.from(document.querySelectorAll('.lb-trigger'));
  }

  function open(index){
    refreshTriggers();
    if(!triggers[index]) return;
    current = index;
    const src = triggers[current].getAttribute('src');
    const alt = triggers[current].getAttribute('alt') || '';
    imageEl.setAttribute('src', src);
    imageEl.setAttribute('alt', alt);
    // store last focused element so we can restore focus when closing
    lastFocused = document.activeElement;

    // hide the rest of the page from assistive tech
    document.querySelectorAll('body > *').forEach(node => {
      if(node !== lb) node.setAttribute && node.setAttribute('aria-hidden', 'true');
    });

    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // focus the close button for immediate keyboard access
    setTimeout(() => { closeBtn.focus(); }, 10);
  }

  function close(){
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    imageEl.setAttribute('src', '');
    // restore aria-hidden on background
    document.querySelectorAll('body > *').forEach(node => {
      if(node !== lb) node.removeAttribute && node.removeAttribute('aria-hidden');
    });

    // restore focus
    if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function prev(){
    refreshTriggers();
    current = (current - 1 + triggers.length) % triggers.length;
    open(current);
  }

  function next(){
    refreshTriggers();
    current = (current + 1) % triggers.length;
    open(current);
  }

  // delegation: listen for clicks on document and open when .lb-trigger clicked
  document.addEventListener('click', function(e){
    const t = e.target.closest && e.target.closest('.lb-trigger');
    if(t){
      e.preventDefault();
      refreshTriggers();
      const idxAttr = t.getAttribute('data-index');
      const idx = idxAttr !== null ? parseInt(idxAttr,10) : triggers.indexOf(t);
      open(isNaN(idx) ? triggers.indexOf(t) : idx);
    }
    // if the view-more button was clicked, open first screenshot
    const vm = e.target.closest && e.target.closest('.screenshots-viewmore');
    if(vm){
      e.preventDefault();
      refreshTriggers();
      if(triggers.length > 0) open(0);
    }
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  lb.addEventListener('click', (e)=>{ if(e.target === lb.querySelector('.lightbox-backdrop')) close(); });

  document.addEventListener('keydown', (e)=>{
    if(lb.getAttribute('aria-hidden') === 'true') return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  });

  // focus trap: keep tab navigation within the lightbox while it's open
  document.addEventListener('focus', function(e){
    if(lb.getAttribute('aria-hidden') === 'true') return;
    if(!lb.contains(e.target)){
      // move focus back to the first focusable element inside the lightbox
      const foc = getFocusableElements(lb)[0] || imageEl;
      if(foc && typeof foc.focus === 'function') foc.focus();
    }
  }, true);

  // handle tab cycling inside the lightbox explicitly
  lb.addEventListener('keydown', function(e){
    if(lb.getAttribute('aria-hidden') === 'true') return;
    if(e.key !== 'Tab') return;
    const focusable = getFocusableElements(lb);
    if(focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if(e.shiftKey){
      if(document.activeElement === first){
        e.preventDefault();
        last.focus();
      }
    } else {
      if(document.activeElement === last){
        e.preventDefault();
        first.focus();
      }
    }
  });
})();
