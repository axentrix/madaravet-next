// ScrollTrigger disabled - removed from plugins
gsap.registerPlugin(DrawSVGPlugin, Physics2DPlugin, SplitText);


// Wait until key DOM elements are present before initializing animations to avoid null queries
async function waitForInitElements(timeout = 5000) {
  const selectors = ['#section1', '#section2', '#section6'];
  const start = Date.now();
  return new Promise((resolve) => {
    (function check() {
      const allPresent = selectors.every(sel => document.querySelector(sel) !== null);
      if (allPresent || Date.now() - start > timeout) return resolve();
      requestAnimationFrame(check);
    })();
  });
}

async function initAnimations() {
  await waitForInitElements();

  // helper to animate a selector if present now (used for elements injected later)
  function animateIfPresent(selector, props, opts = {}) {
    try {
      const el = document.querySelector(selector);
      if (!el) return null;
      return gsap.to(selector, Object.assign({ overwrite: true }, props));
    } catch (e) {
      return null;
    }
  }

  // Safe SplitText creator: waits for fonts (with timeout) and falls back to a JS-based splitter
  async function createSplitSafely(selector) {
    if (!document.querySelector(selector)) return { chars: [] };
    try {
      if (document.fonts) await Promise.race([document.fonts.ready, new Promise(res => setTimeout(res, 2000))]);
    } catch (e) {}
    try {
      if (typeof SplitText !== 'undefined') {
        return new SplitText(selector, { type: 'chars' });
      }
    } catch (e) {
      console.warn('SplitText creation failed for', selector, e);
    }
    return fallbackSplit(selector);
  }

  const swiper = new Swiper('.mySwiper', {
    loop: true,
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 16,

    autoplay: {
      delay: 3000,
     disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 5,
        slidesPerGroup: 1,
        centeredSlides: true,
        spaceBetween: 8,
      },
      640: {
        slidesPerView: 1,
        slidesPerGroup: 1,
          centeredSlides: true,
  spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
    },
  });


  // Header opacity on scroll (guard header existence)
  //const headerEl = document.querySelector('header');
  //if (headerEl && typeof ScrollTrigger !== 'undefined') {
    //ScrollTrigger.create({
      //start: 0,
     // end: "max",
     // onUpdate: (self) => {
     //  const scrollDirection = self.direction;
     //   if (scrollDirection === 1) { // Scrolling down
///    gsap.to(headerEl, { opacity: 0, duration: 0.3 });
     //   } else if (scrollDirection === -1) { // Scrolling up
      //    gsap.to(headerEl, { opacity: 1, duration: 0.3 });
      //  }
     // }
   // });
 // }

  // Wait for fonts to be ready before using SplitText to avoid "SplitText called before fonts loaded"
  if (document.fonts) {
    try {
      // wait up to 2s for fonts; proceed sooner if ready
      await Promise.race([
        document.fonts.ready,
        new Promise((res) => setTimeout(res, 2000))
      ]);
    } catch (e) {}
  } else {
    // fallback small delay
    await new Promise((res) => setTimeout(res, 200));
  }

  // Debug: log SplitText availability and targets
  console.debug('SplitText', typeof SplitText, 'h1 present', !!document.querySelector('h1'));

  // Create SplitText targets safely (explicit attempt using SplitText per user's request, with robust fallback)
  // NOTE: h1.hero-title is excluded from SplitText to prevent duplication issues with translatable spans
  let splitinfo1 = { chars: [] };
  let splitinfo2 = { chars: [] };

  try {
    splitinfo1 = await createSplitSafely('.infobox1');
    if (splitinfo1 && splitinfo1.chars && splitinfo1.chars.length) gsap.from(splitinfo1.chars, { opacity: 0, stagger: 0.05, duration: 1 });
  } catch (e) { console.warn('splitinfo1 via createSplitSafely failed', e); }

  try {
    splitinfo2 = await createSplitSafely('.infobox2');
    if (splitinfo2 && splitinfo2.chars && splitinfo2.chars.length) gsap.from(splitinfo2.chars, { opacity: 0, stagger: 0.05, duration: 1 });
  } catch (e) { console.warn('splitinfo2 via createSplitSafely failed', e); }



  // Additionally handle all elements with class .split-text (supports multiple instances)
  try {
    const splitTextChars = [];
    const els = Array.from(document.querySelectorAll('.split-text'));
    for (const el of els) {
      let s = null;
      try {
        if (typeof SplitText !== 'undefined') {
          s = new SplitText(el, { type: 'chars' });
        }
      } catch (err) {
        // fallback per element
        const text = el.textContent || '';
        el.innerHTML = '';
        const frag = document.createDocumentFragment();
        const elChars = [];
        text.split('').forEach(ch => {
          const span = document.createElement('span');
          span.textContent = ch;
          span.className = 'split-char';
          frag.appendChild(span);
          elChars.push(span);
        });
        el.appendChild(frag);
        s = { chars: elChars };
      }
      if (s && s.chars && s.chars.length) splitTextChars.push(...s.chars);
    }
    if (splitTextChars.length) {
      gsap.from(splitTextChars, { opacity: 0, y: 20, stagger: 0.03, duration: 1, ease: 'power2.out' });
      console.debug('Animated', splitTextChars.length, '.split-text chars');
    }
  } catch (e) { console.warn('split-text batch failed', e); }

  // Animate circle-inits only if present
  if (document.querySelector('.circle-init1') || document.querySelector('.circle-init2')) {
    gsap.fromTo(
      [".circle-init1", ".circle-init2"],
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: "power3.out",
        stagger: 0.3
      }
    );
  }

  // Scroll animations disabled - removed ScrollTrigger animations





 const isMobile = window.innerWidth <= 768;


// Big circle animation removed





function fallbackSplit(selector) {
  const els = document.querySelectorAll(selector);
  const allChars = [];
  els.forEach(el => {
    const text = el.textContent || '';
    el.innerHTML = '';
    const frag = document.createDocumentFragment();
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.className = 'split-char';
      frag.appendChild(span);
      allChars.push(span);
    });
    el.appendChild(frag);
  });
  return { chars: allChars };
}

  // Section 6 scroll animations disabled - removed ScrollTrigger
 

  // ScrollTrigger refresh listeners removed - no scroll animations

  
}

let currentLang = 'bg';
let translations = {};

async function loadTranslations() {
  try {
    const response = await fetch('/lang.json');
    translations = await response.json();
    applyTranslations(currentLang);
   initAnimations(); // initialize animations after translations are applied
    
    // Hide the loader element after loading and initialization
    const loader = document.getElementById('loader');

if (loader) {
  gsap.to(loader, {
    scale: 0,
    duration: 0.6,
    ease: "power2.inOut",
    transformOrigin: "center center",
    onComplete: () => loader.style.display = "none"
  });
}
    
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      // For section1_title_line11, use textContent to avoid innerHTML issues that cause duplication
      if (key === 'section1_title_line11') {
        el.textContent = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  // Update toggle button text
  const toggleBtn = document.getElementById('language-toggle');
  if (toggleBtn && translations[lang]['languageToggle']) {
    toggleBtn.textContent = translations[lang]['languageToggle'];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTranslations();

  const toggleBtn = document.getElementById('language-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'bg' ? 'en' : 'bg';
      applyTranslations(currentLang);
     // initAnimations(); // re-initialize animations on language toggle
    });
  }
});
