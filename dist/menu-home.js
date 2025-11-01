(function(){
  // Robust menu initializer: waits for #menuCircle to exist before attaching handlers
  function waitForElement(selector, timeout = 8000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      (function check(){
        try {
          const el = document.querySelector(selector);
          if (el) return resolve(el);
          if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for ' + selector));
        } catch (e) {}
        setTimeout(check, 100);
      })();
    });
  }

  function waitForGsap(timeout = 800) {
    return new Promise((resolve) => {
      const start = Date.now();
      (function check(){
        if (typeof window !== 'undefined' && window.gsap) return resolve(window.gsap);
        if (Date.now() - start > timeout) return resolve(null);
        setTimeout(check, 50);
      })();
    });
  }

  // Compute menu sizing so total items height is less than the clone's height
  function setMenuSizing(menuClone) {
    try {
      if (!menuClone) return;
      const menuList = menuClone.querySelector('ul');
      if (!menuList) return;
      const items = Array.from(menuList.querySelectorAll('li'));
      const itemCount = Math.max(1, items.length);
      // available height inside clone (reserve 12% for logo/spacing)
      const cloneRect = menuClone.getBoundingClientRect();
      const available = Math.max(0, cloneRect.height * 0.86);
      const perItem = Math.floor(available / itemCount);
      // Apply sizing and ensure no overflow on the ul
      menuList.style.overflow = 'visible';
      menuList.style.maxHeight = (available) + 'px';
      items.forEach((li) => {
        li.style.maxHeight = perItem + 'px';
        li.style.height = perItem + 'px';
      });

      // also watch resize to adapt
      if (typeof window !== 'undefined') {
        let rTimer = null;
        const onResize = () => {
          if (rTimer) clearTimeout(rTimer);
          rTimer = setTimeout(() => setMenuSizing(menuClone), 80);
        };
        window.addEventListener('resize', onResize, { passive: true });
        // attach a cleanup on the clone for when it's removed
        const observer = new MutationObserver(() => {
          if (!document.body.contains(menuClone)) {
            window.removeEventListener('resize', onResize);
            try { observer.disconnect(); } catch (e) {}
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    } catch (e) {}
  }

  try {
    let menuOpen = false;

    waitForElement('#menuCircle', 8000).then((menuBtn) => {
      const menuCircle = menuBtn;
      const lines = document.querySelectorAll('.bars .line');

      menuBtn.addEventListener('click', async () => {
        if (!menuOpen) {
          const gsapLib = await waitForGsap(800);
          // Add open class to trigger the overlay
          try { menuCircle.classList.add('open'); } catch(e){}

          // Create the background overlay
          const bg = document.createElement("div");
          bg.className = "bg-overlay";
          bg.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9998;
            background: rgba(0,0,0,0.3);
          `;
          document.body.appendChild(bg);

          // Create and style the clone
          const menuClone = menuCircle.cloneNode(true);
          menuClone.id = "menuCircleClone";
          menuClone.classList.add("circle-clone");
          document.body.appendChild(menuClone);
          try { setMenuSizing(menuClone); } catch(e) {}

          if (gsapLib) {
            const gsap = gsapLib;
            try {
              gsap.set(menuClone, {
                position: "fixed",
                top: menuCircle.getBoundingClientRect().top + "px",
                left: menuCircle.getBoundingClientRect().left + "px",
                width: menuCircle.offsetWidth + "px",
                height: menuCircle.offsetHeight + "px",
                zIndex: 9999,
                backgroundColor: "#167DFF",
                borderRadius: "50%"
              });

              gsap.set(menuCircle, { opacity: 0 });

              const cloneSize = window.innerWidth < 768 ? "120vw" : "70vh";

              gsap.to(menuClone, {
                top: "50%",
                left: "50%",
                xPercent: -50,
                yPercent: -50,
                width: cloneSize,
                height: cloneSize,
                borderRadius: "50%",
                ease: "elastic.out(1, 0.5)",
                duration: 0.35
              });

              const menuItems = menuClone.querySelector('ul');
              const menuLogo = menuClone.querySelector('img');
              if (menuItems) gsap.set(menuItems, { opacity: 0 });
              if (menuLogo) gsap.set(menuLogo, { opacity: 0 });
              gsap.to([menuItems, menuLogo], { opacity: 1, duration: 0.3, delay: 0.12 });
            } catch (e) {
              // fallthrough to fallback
            }
          } else {
            // Fallback simple expand with CSS transition
            try {
              const rect = menuCircle.getBoundingClientRect();
              menuClone.style.position = 'fixed';
              menuClone.style.top = rect.top + 'px';
              menuClone.style.left = rect.left + 'px';
              menuClone.style.width = rect.width + 'px';
              menuClone.style.height = rect.height + 'px';
              menuClone.style.zIndex = '9999';
              menuClone.style.background = '#167DFF';
              menuClone.style.borderRadius = '50%';
              menuClone.style.transition = 'all 0.35s cubic-bezier(.22,1,.36,1)';

              requestAnimationFrame(() => {
                const cloneSize = window.innerWidth < 768 ? (window.innerWidth * 1.2) + 'px' : Math.round(window.innerHeight * 0.7) + 'px';
                menuClone.style.top = '50%';
                menuClone.style.left = '50%';
                menuClone.style.transform = 'translate(-50%, -50%)';
                menuClone.style.width = cloneSize;
                menuClone.style.height = cloneSize;
                menuClone.style.borderRadius = '50%';
              });

              const menuItems = menuClone.querySelector('ul');
              const menuLogo = menuClone.querySelector('img');
              if (menuItems) { menuItems.style.opacity = '1'; menuItems.style.pointerEvents = 'auto'; }
              if (menuLogo) menuLogo.style.opacity = '1';
            } catch (e) {}
          }

          // Close function with robust cleanup
          let cloneBars = null;
          function closeMenu() {
            // prevent double-closing
            if (!menuOpen) return;
            menuOpen = false;

            try { if (bg) bg.removeEventListener('click', closeMenu); } catch (e) {}
            try { if (cloneBars) cloneBars.removeEventListener('click', closeMenu); } catch (e) {}
            try { document.removeEventListener('keydown', escHandler); } catch (e) {}

            try {
              const linesLocal = menuClone.querySelectorAll('.bars .line');
              if (linesLocal && linesLocal.length >= 2 && typeof window !== 'undefined' && window.gsap) {
                try { window.gsap.to(linesLocal[0], { rotation: 0, y: 0, duration: 0.2 }); } catch (e) {}
                try { window.gsap.to(linesLocal[1], { rotation: 0, y: 0, duration: 0.2 }); } catch (e) {}
              }
            } catch (e) {}

            function finalize() {
              try { if (menuClone && menuClone.parentNode) menuClone.remove(); } catch (e) {}
              try {
                const overlay = (typeof bg !== 'undefined' && bg && bg.parentNode) ? bg : document.querySelector('.bg-overlay') || document.getElementById('bg-overlay');
                if (overlay && overlay.parentNode) overlay.remove();
              } catch (e) {}
              try { if (typeof window !== 'undefined' && window.gsap) window.gsap.set(menuCircle, { opacity: 1 }); } catch (e) {}
              try { if (menuCircle && menuCircle.classList) menuCircle.classList.remove('open'); } catch (e) {}
            }

            if (typeof window !== 'undefined' && window.gsap) {
              try {
                window.gsap.to(menuClone, {
                  top: menuCircle.getBoundingClientRect().top + "px",
                  left: menuCircle.getBoundingClientRect().left + "px",
                  width: "60px",
                  height: "60px",
                  borderRadius: "100%",
                  ease: "power2.inOut",
                  duration: 0.35,
                  onComplete: finalize,
                  onInterrupt: finalize
                });
              } catch (e) {
                finalize();
              }
            } else {
              finalize();
            }

            setTimeout(function() {
              try {
                const overlay = document.querySelector('.bg-overlay') || document.getElementById('bg-overlay');
                if (overlay && overlay.parentNode) overlay.remove();
              } catch (e) {}
            }, 400);
          }

          try { bg.addEventListener('click', closeMenu); } catch (e) {}

          cloneBars = menuClone.querySelector('.bars');
          if (cloneBars) {
            try { cloneBars.addEventListener('click', closeMenu); } catch (e) {}
          }

          function escHandler(e) { if (e && (e.key === 'Escape' || e.key === 'Esc')) closeMenu(); }
          try { document.addEventListener('keydown', escHandler); } catch (e) {}

          menuOpen = true;
        }
      });
    }).catch((err) => {
      // element not found - nothing to attach
      // console.warn('menu-home: menuCircle not found:', err && err.message);
    });
  } catch (e) {
    console.error('menu-home error', e);
  }
})();
