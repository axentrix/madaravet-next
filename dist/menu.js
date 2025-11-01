(function(){
  // Standalone menu handler for all pages. Depends on GSAP if available, but has graceful fallbacks.
  function waitForGsap(timeout = 3000) {
    return new Promise((resolve) => {
      const start = Date.now();
      (function check(){
        if (typeof window !== 'undefined' && window.gsap) return resolve(window.gsap);
        if (Date.now() - start > timeout) return resolve(null);
        setTimeout(check, 100);
      })();
    });
  }

  function createOverlay() {
    const bg = document.createElement('div');
    bg.id = 'bg-overlay';
    bg.className = 'bg-overlay';
    bg.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;background:rgba(0,0,0,0.3)';
    return bg;
  }

  function openMenuWithGsap(gsap, menuCircle) {
    if (!menuCircle) return;
    if (document.getElementById('menuCircleClone')) return; // already open

    const bg = createOverlay();
    document.body.appendChild(bg);

    const clone = menuCircle.cloneNode(true);
    clone.id = 'menuCircleClone';
    clone.classList.add('circle-clone');
    document.body.appendChild(clone);

    // initial set
    gsap.set(clone, {
      position: 'fixed',
      top: menuCircle.getBoundingClientRect().top + 'px',
      left: menuCircle.getBoundingClientRect().left + 'px',
      width: menuCircle.offsetWidth + 'px',
      height: menuCircle.offsetHeight + 'px',
      zIndex: 9999,
      backgroundColor: '#167DFF',
      borderRadius: '50%',
      overflow: 'hidden'
    });

    gsap.set(menuCircle, { opacity: 0 });

    const cloneSize = window.innerWidth < 768 ? '120vw' : '70vh';

    gsap.to(clone, {
      top: '50%', left: '50%', xPercent: -50, yPercent: -50,
      width: cloneSize, height: cloneSize, borderRadius: '50%',
      ease: 'elastic.out(1, 0.5)', duration: 0.35
    });

    // reveal menu items / logo inside clone
    const menuItems = clone.querySelector('ul');
    const menuLogo = clone.querySelector('img');
    if (menuItems) gsap.set(menuItems, { opacity: 0 });
    if (menuLogo) gsap.set(menuLogo, { opacity: 0 });

    gsap.to([menuItems, menuLogo], { opacity: 1, duration: 0.3, delay: 0.12 });

    // robust closeMenu with safe cleanup
    let cloneBars = null;
    function closeMenu() {
      // prevent double close
      if (!document.getElementById('menuCircleClone')) return;

      // remove listeners early
      try { if (bg) bg.removeEventListener('click', closeMenu); } catch(e) {}
      try { document.removeEventListener('keydown', escHandler); } catch(e) {}
      try { if (cloneBars) cloneBars.removeEventListener('click', closeMenu); } catch(e) {}

      // animate bars back
      try {
        const lines = clone.querySelectorAll('.bars .line');
        if (lines && lines.length >= 2) {
          try { gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.2 }); } catch(e){}
          try { gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.2 }); } catch(e){}
        }
      } catch (e) {}

      function finalize() {
        try { if (clone && clone.parentNode) clone.remove(); } catch(e) {}
        try {
          const overlay = (bg && bg.parentNode) ? bg : document.querySelector('.bg-overlay') || document.getElementById('bg-overlay');
          if (overlay && overlay.parentNode) overlay.remove();
        } catch(e) {}
        try { gsap.set(menuCircle, { opacity: 1 }); } catch(e) {}
        try { if (menuCircle && menuCircle.classList) menuCircle.classList.remove('open'); } catch(e) {}
      }

      try {
        gsap.to(clone, {
          top: menuCircle.getBoundingClientRect().top + 'px',
          left: menuCircle.getBoundingClientRect().left + 'px',
          width: menuCircle.offsetWidth + 'px',
          height: menuCircle.offsetHeight + 'px',
          borderRadius: '100%', ease: 'power2.inOut', duration: 0.35,
          onComplete: finalize,
          onInterrupt: finalize
        });
      } catch (e) {
        finalize();
      }

      // safety removal in case of interruptions
      setTimeout(function() {
        try { const overlay = document.querySelector('.bg-overlay') || document.getElementById('bg-overlay'); if (overlay && overlay.parentNode) overlay.remove(); } catch(e) {}
      }, 400);
    }

    function escHandler(ev) { if (ev.key === 'Escape') closeMenu(); }

    bg.addEventListener('click', closeMenu);
    const cloneBars = clone.querySelector('.bars'); if (cloneBars) cloneBars.addEventListener('click', closeMenu);
    document.addEventListener('keydown', escHandler);
  }

  function openMenuFallback(menuCircle) {
    if (!menuCircle) return;
    if (document.getElementById('menuCircleClone')) return;

    const bg = createOverlay(); document.body.appendChild(bg);
    const rect = menuCircle.getBoundingClientRect();
    const clone = menuCircle.cloneNode(true);
    clone.id = 'menuCircleClone'; clone.classList.add('circle-clone');

    // start at button position
    clone.style.position = 'fixed';
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.borderRadius = '50%';
    clone.style.zIndex = 9999;
    clone.style.background = '#167DFF';

    // smooth CSS transition so opening is immediate and smooth even without GSAP
    clone.style.transition = 'all 0.35s cubic-bezier(.22,1,.36,1)';
    clone.style.overflow = 'hidden';

    document.body.appendChild(clone);

    // force a frame then animate to center & large size
    requestAnimationFrame(() => {
      const cloneSize = window.innerWidth < 768 ? (window.innerWidth * 1.2) + 'px' : Math.round(window.innerHeight * 0.7) + 'px';
      clone.style.top = '50%';
      clone.style.left = '50%';
      clone.style.transform = 'translate(-50%, -50%)';
      clone.style.width = cloneSize;
      clone.style.height = cloneSize;
      clone.style.borderRadius = '50%';
    });

    // show items after the expansion animation starts
    const menuItems = clone.querySelector('ul');
    const menuLogo = clone.querySelector('img');
    if (menuItems) {
      menuItems.style.opacity = '0';
      menuItems.style.pointerEvents = 'none';
      setTimeout(() => { menuItems.style.opacity = '1'; menuItems.style.pointerEvents = 'auto'; }, 120);
    }
    if (menuLogo) { menuLogo.style.opacity = '0'; setTimeout(() => { menuLogo.style.opacity = '1'; }, 120); }

    // robust fallback closeMenu
    let cloneBarsFallback = null;
    function closeMenu() {
      try { if (bg) bg.removeEventListener('click', closeMenu); } catch(e) {}
      try { document.removeEventListener('keydown', escHandler); } catch(e) {}
      try { if (cloneBarsFallback) cloneBarsFallback.removeEventListener('click', closeMenu); } catch(e) {}

      try { if (clone && clone.parentNode) clone.remove(); } catch(e) {}
      try { const overlay = (bg && bg.parentNode) ? bg : document.querySelector('.bg-overlay') || document.getElementById('bg-overlay'); if (overlay && overlay.parentNode) overlay.remove(); } catch(e) {}
      try { if (menuCircle && menuCircle.classList) menuCircle.classList.remove('open'); } catch(e) {}
    }
    bg.addEventListener('click', closeMenu);
    cloneBarsFallback = clone.querySelector('.bars'); if (cloneBarsFallback) cloneBarsFallback.addEventListener('click', closeMenu);
  }

  // main attach function: delegated click so it works across pages and re-renders
  function attach() {
    document.addEventListener('click', async function (e) {
      const trigger = e.target && e.target.closest ? e.target.closest('#menuCircle') : null;
      if (!trigger) return;

      const menuCircle = document.getElementById('menuCircle');
      if (!menuCircle) return;

      // Avoid opening multiple times
      if (document.getElementById('menuCircleClone')) return;

      const gsapLib = await waitForGsap(2000);
      if (gsapLib) {
        try { openMenuWithGsap(gsapLib, menuCircle); } catch (err) { console.error('menu open gsap error', err); openMenuFallback(menuCircle); }
      } else {
        openMenuFallback(menuCircle);
      }
    });
  }

  // Start attaching after DOM is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') attach(); else document.addEventListener('DOMContentLoaded', attach);
})();
