gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, Physics2DPlugin, SplitText);


// Wait until key DOM elements are present before initializing animations to avoid null queries
async function waitForInitElements(timeout = 5000) {
  const selectors = ['#section1', '#section2', '#section3', '#section4', '#section5', '#section6', '.mySwiper'];
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
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      640: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
    },
  });


  // Header opacity on scroll (guard header existence)
  const headerEl = document.querySelector('header');
  if (headerEl && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const scrollDirection = self.direction;
        if (scrollDirection === 1) { // Scrolling down
          gsap.to(headerEl, { opacity: 0, duration: 0.3 });
        } else if (scrollDirection === -1) { // Scrolling up
          gsap.to(headerEl, { opacity: 1, duration: 0.3 });
        }
      }
    });
  }

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
  let splitH1 = { chars: [] };
  let splitinfo1 = { chars: [] };
  let splitinfo2 = { chars: [] };

  // First try the safer helper which waits for fonts and uses SplitText if available
  try {
    splitH1 = await createSplitSafely('h1');
    if (splitH1 && splitH1.chars && splitH1.chars.length) gsap.from(splitH1.chars, { opacity: 0, stagger: 0.05, duration: 1 });
  } catch (e) { console.warn('splitH1 via createSplitSafely failed', e); }

  try {
    splitinfo1 = await createSplitSafely('.infobox1');
    if (splitinfo1 && splitinfo1.chars && splitinfo1.chars.length) gsap.from(splitinfo1.chars, { opacity: 0, stagger: 0.05, duration: 1 });
  } catch (e) { console.warn('splitinfo1 via createSplitSafely failed', e); }

  try {
    splitinfo2 = await createSplitSafely('.infobox2');
    if (splitinfo2 && splitinfo2.chars && splitinfo2.chars.length) gsap.from(splitinfo2.chars, { opacity: 0, stagger: 0.05, duration: 1 });
  } catch (e) { console.warn('splitinfo2 via createSplitSafely failed', e); }

  // Additionally, try the exact snippet the user provided (direct SplitText constructor) if the global constructor exists.
  // This covers cases where createSplitSafely may have returned a fallback but the user expects the SplitText API to be used.
  try {
    if (typeof SplitText !== 'undefined') {
      try {
        const directSplitH1 = document.querySelector('h1') ? new SplitText('h1', { type: 'chars' }) : null;
        const directSplitInfo1 = document.querySelector('.infobox1') ? new SplitText('.infobox1', { type: 'chars' }) : null;
        const directSplitInfo2 = document.querySelector('.infobox2') ? new SplitText('.infobox2', { type: 'chars' }) : null;

        if (directSplitH1 && directSplitH1.chars && directSplitH1.chars.length) {
          gsap.from(directSplitH1.chars, { opacity: 0, stagger: 0.05, duration: 1 });
          splitH1 = directSplitH1;
        }
        if (directSplitInfo1 && directSplitInfo1.chars && directSplitInfo1.chars.length) {
          gsap.from(directSplitInfo1.chars, { opacity: 0, stagger: 0.05, duration: 1 });
          splitinfo1 = directSplitInfo1;
        }
        if (directSplitInfo2 && directSplitInfo2.chars && directSplitInfo2.chars.length) {
          gsap.from(directSplitInfo2.chars, { opacity: 0, stagger: 0.05, duration: 1 });
          splitinfo2 = directSplitInfo2;
        }
      } catch (innerErr) {
        console.warn('Direct SplitText usage failed, falling back to already-created splits', innerErr);
      }
    } else {
      // If SplitText truly isn't available, ensure we still split via JS fallback and animate (reinforce fallback)
      try {
        const fallbackH1 = document.querySelector('h1') ? fallbackSplit('h1') : null;
        const fallbackI1 = document.querySelector('.infobox1') ? fallbackSplit('.infobox1') : null;
        const fallbackI2 = document.querySelector('.infobox2') ? fallbackSplit('.infobox2') : null;
        if (fallbackH1 && fallbackH1.chars && fallbackH1.chars.length) gsap.from(fallbackH1.chars, { opacity: 0, stagger: 0.05, duration: 1 });
        if (fallbackI1 && fallbackI1.chars && fallbackI1.chars.length) gsap.from(fallbackI1.chars, { opacity: 0, stagger: 0.05, duration: 1 });
        if (fallbackI2 && fallbackI2.chars && fallbackI2.chars.length) gsap.from(fallbackI2.chars, { opacity: 0, stagger: 0.05, duration: 1 });
      } catch (fbErr) { console.warn('fallback split for h1/infoboxes failed', fbErr); }
    }
  } catch (e) {
    console.warn('SplitText/direct attempt block failed', e);
  }

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

  const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: "#section1",
        start: "top 20%",
        end: "bottom top",
        scrub: true,
  toggleActions:"play, reverse, play, restart",
      }
    });

 tl1
     .from(".puppies2", {  x: -40, duration: 1,   ease: "power3.out" }, "<")
      .from(".puppies1", { xPercent: 10, duration: 1,   ease: "power3.out" }, "<")
   




.to([".circle-init1"], {
  scale: 1.4,
  
  duration: 1,
  ease: "power3.out",
  stagger: 0.3
}, 1)

.to([".circle-init2"], {
  scale: 1.4,
  
  duration: 1,
  ease: "power3.out",
  stagger: 0.3
}, 1)





 const scrollTrack = document.getElementById("scrollTrack");
const isMobile = window.innerWidth <= 768;
  // Create the looping animation timeline (paused initially)
  const scrollTimeline = gsap.timeline({ repeat: -1, paused: true })
    .to(scrollTrack, {
      xPercent: isMobile ? -100 : -80,
      ease: "linear",
        duration: isMobile ? 28 : 16
    });

  // Wrap in a ScrollTrigger-bound timeline
  const controlTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#section2",
    start: "top bottom",
    end: "bottom top",
    onEnter: () => scrollTimeline.restart(true),
    onLeave: () => scrollTimeline.pause(),
    onEnterBack: () => scrollTimeline.restart(true),
    onLeaveBack: () => scrollTimeline.pause(),
  
      toggleActions: "play reverse play reverse" // animate in and out
      
  }


   
});


 controlTimeline.from("#scrollRibbon", {
    xPercent: 100,     // start off-screen to the right
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });


  const scaleMax = gsap.utils.mapRange(1, document.querySelectorAll(".image-card").length, 0.6, 1); 

const time = 3; 
const imageCards = gsap.utils.toArray(".image-card");
const circleCards = gsap.utils.toArray(".circle-card");
const floatingContainer = document.getElementById("floatingBallsContainer");
//circleCards.forEach(card => floatingContainer.appendChild(card));
circleCards.forEach((card, i) => {  
    const parent = card.parentElement;
    const centerX = parent.offsetWidth / 2 - card.offsetWidth / 2;
 const z = circleCards.length - i; 
    gsap.set(card, {
    
       position: "fixed",
  top: "100%",         // just below viewport
  left: "50%",
  xPercent: -50,
  y: 100,              // push it just below screen
  opacity: 0,
     zIndex: z,
     onUpdate: self => {
      const y = gsap.getProperty(card, "y");
      console.log("Current y:", y);
    }
    });

  });

if (isMobile) {
  circleCards.forEach(card => {
    gsap.set(card, {

      left: "50%",
      xPercent: -50,  
    
      
    });
  });

}
const step = 0.8;
gsap.set('.image-card', {
  //y: (index) => 30 * index, // set offset
  transformStyle: "preserve-3d", // For the perspecitve effect
  transformPerspective: 1000, // For the perspecitve effect
  transformOrigin: "center top", 
});
gsap.set('.big-circle', {
  scale:0
});
   const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: "#section3",
      start: "top top",
       end: `+=4200`,
      scrub: true,
      pin: true,
      pinSpacing:0,
   toggleActions: "play none restart none",
    onEnter:() =>{
 
    },
  

    }
  });
tl3.set(imageCards, {
 // autoAlpha: 0,
 scale: 1.1,
 // rotationX: -30,
 // transformOrigin: "center center"
});
tl3.set(imageCards[0], { autoAlpha: 100, rotationX: 0});
// === STEP 1: image-card 1 appears smoothly
tl3.to(imageCards[0], {
  autoAlpha: 1,
  rotationX: 0,
  scale: 0.98,
  duration: 0.4,
  ease: "power2.out"
}, 0 * step);

tl3.to(circleCards[0], {
 autoAlpha: 1,
  top: "50%",
  yPercent: -50,
  zIndex: 34,
  rotation: 0,
  scale: 1.2,
  ease: "power2.out",
  duration: 0.4
}, 0 * step + 0.1);

tl3.to(circleCards[0], {
  y: window.innerHeight,
  autoAlpha: 0,
  ease: "power2.in",
  duration: 0.4
}, 0 * step + 0.5);

tl3.to(imageCards[0], {
  y: window.innerHeight,
  autoAlpha: 0,
  ease: "power2.inOut",
  duration: 0.4
}, 0 * step + 0.6);

// === STEP 4: image-card 2 enters slightly before image-card 1 exits
tl3.fromTo(imageCards[1], {
  autoAlpha: 0,
  yPercent: 50,
  rotationX: -30,
  scale: 1,
  transformOrigin: "center center"
}, {
  autoAlpha: 1,
  scale: 0.98,
  yPercent: 0,
  rotationX: 0,
  duration: 0.4,
  ease: "power2.out"
}, 1 * step);

tl3.to(circleCards[1], {
  autoAlpha: 1,
  top: "50%",
  yPercent: -50,
  zIndex: 34,
  rotation: 0,
  scale: 1.2,
  ease: "power2.out",
  duration: 0.4
}, 1 * step + 0.1);

tl3.to(circleCards[1], {
  y: window.innerHeight,
  autoAlpha: 0,
  ease: "power2.in",
  duration: 0.4
}, 1 * step + 0.5);

tl3.to(imageCards[1], {
  y: window.innerHeight,
  autoAlpha: 0,
  ease: "power2.inOut",
  duration: 0.4
}, 1 * step + 0.6);

// === STEP 7: image-card 3 enters with overlap
tl3.fromTo(imageCards[2], {
  autoAlpha: 0,
  yPercent: 50,
  rotationX: -30,
  scale: 1,
  transformOrigin: "center center"
}, {
  autoAlpha: 1,
  yPercent: 0,
  rotationX: 0,
  scale: 0.98,
  duration: 0.4,
  ease: "power2.out"
}, 2 * step);

tl3.to(circleCards[2], {
  autoAlpha: 1,
  top: "50%",
  yPercent: -50,
  zIndex: 34,
  rotation: 0,
  scale: 1.2,
  ease: "power2.out",
  duration: 0.4
}, 2 * step + 0.1);

tl3.to(circleCards[2], {
  y: window.innerHeight,
  autoAlpha: 0,
  ease: "power2.in",
  duration: 0.4
}, 2 * step + 0.5);

tl3.to(imageCards[2], {
  scale: 0.8,
 
  ease: "power2.inOut",
  duration: 0.4
}, 2 * step + 0.6);


tl3.add(gsap.fromTo("#theMask1 .masker", {
  drawSVG: "0%"
}, {
  drawSVG: "100%",
  ease: "none",
  duration: 1.2 // match tl3 total duration
}), 0);

tl3.add(gsap.fromTo("#theMask1 .masker", {
  drawSVG: "100%"
}, {
  drawSVG: "0%",
  ease: "none",
  duration: 1.2 // match tl3 total duration
}), 1.4);

// Create tl4 only if section4 exists to avoid ScrollTrigger warnings and ensure animations run
const section4El = document.querySelector("#section4");
let tl4 = null;
if (section4El) {
  // create paused timeline — we'll control playback via ScrollTrigger callbacks to guarantee play on enter/back
  tl4 = gsap.timeline({ paused: true });

  // start of section4
  const masked = document.querySelector("#maskedImage");
  if (masked) {
    tl4.fromTo("#maskedImage", {
      clipPath: "inset(50% 50% 150% 50% round 44px)",
    }, {
      clipPath: isMobile ? "inset(0% 0% round 20px)" : "inset(5% 5% round 20px)",
      ease: "power2.out",
      duration: 1
    }, 0);
  }

  // Scale image inside the div if img exists
  if (document.querySelector("#maskedImage img")) {
    tl4.fromTo("#maskedImage img", {
      scale: 1.4
    }, {
      scale: 1,
      duration: 2,
      ease: "power3.out"
    }, 0);
  }

  if (document.querySelector(".dogcat")) {
    tl4.to(".dogcat", {
      scale: isMobile ? 3 : 2.5,
      duration: 1,
      ease: "power3.out"
    }, 0);
  }

  // Keep previous big-circle target but only if present
  if (document.querySelector(".big-circle")) {
    tl4.to(".big-circle", {
      scale: isMobile ? 3 : 2.5,
      duration: 1,
      ease: "power3.out"
    }, 0);
  }

  // Use a dedicated ScrollTrigger to control playback so enter/enterBack reliably restart the paused timeline
  ScrollTrigger.create({
    trigger: "#section4",
    start: "top 60%",
    end: "bottom top",
    onEnter: () => {
      try { tl4.restart(true); } catch(e){}
      // animate dogcat and big-circle on enter to ensure they trigger even if inserted late
      animateIfPresent('.dogcat', { scale: isMobile ? 3 : 2.5, duration: 1, ease: 'power3.out' });
      animateIfPresent('.big-circle', { scale: isMobile ? 3 : 2.5, duration: 1, ease: 'power3.out' });
    },
    onEnterBack: () => {
      try { tl4.restart(true); } catch(e){}
      animateIfPresent('.dogcat', { scale: isMobile ? 3 : 2.5, duration: 1, ease: 'power3.out' });
      animateIfPresent('.big-circle', { scale: isMobile ? 3 : 2.5, duration: 1, ease: 'power3.out' });
    },
    onLeave: () => { try { tl4.pause(0); } catch(e){} },
    onLeaveBack: () => { try { tl4.pause(0); } catch(e){} },
    invalidateOnRefresh: true,
    // set markers to true temporarily if you need to debug positions
    markers: false
  });
}





const section5 = document.querySelector("#section5");



// Section5 timeline: paused by default and controlled via ScrollTrigger callbacks for clean enter/leave behavior
const tl5 = gsap.timeline({ paused: true });

// helper to ensure fonts and window load before using SplitText
async function ensureFontsLoaded(timeout = 3000) {
  try {
    const fontReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const loadEvent = new Promise((res) => {
      if (document.readyState === 'complete') return res();
      window.addEventListener('load', () => res(), { once: true });
    });
    await Promise.race([ Promise.all([fontReady, loadEvent]), new Promise(res => setTimeout(res, timeout)) ]);
  } catch (e) {}
}

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

let split1 = null;
let split2 = null;
// create splits synchronously here so following timeline code can reference them
await ensureFontsLoaded(3000);
try {
  split1 = document.querySelector('.splittitle1') ? await createSplitSafely('.splittitle1') : null;
  split2 = document.querySelector('.splittitle2') ? await createSplitSafely('.splittitle2') : null;
} catch (e) {
  // fallback
  split1 = document.querySelector('.splittitle1') ? fallbackSplit('.splittitle1') : null;
  split2 = document.querySelector('.splittitle2') ? fallbackSplit('.splittitle2') : null;
}
// ensure variables exist even if null
if (!split1) split1 = { chars: [] };
if (!split2) split2 = { chars: [] };

gsap.set('.big-circle1', { scale: 0 });
gsap.set('.big-circle-inner', { scale: 0 });
// Ensure the decorative circles animate when section5 is entered (covers cases where tl4 timing may not fire)
tl5.to(".big-circle1", {
  scale: isMobile ? 2.8 : 1,
  ease: "power3.out",
  duration: 1,
  overwrite: 'auto'
}, 0);

tl5.to(".big-circle-inner", {
  scale: isMobile ? 2.6 : 1,
  ease: "power3.out",
  duration: 0.4,
  overwrite: 'auto'
}, 0.3);

// animate split1 chars if available
if (split1 && split1.chars && split1.chars.length) {
  tl5.from(split1.chars, {
    opacity: 0,
    y: 20,
    stagger: 0.05,
    duration: 2,
    ease: "power2.out"
  }, "+=0.2"); // starts right after previous
}



// Removed tl4 overriding big-circle1/big-circle-inner to avoid conflicts with section5 timeline

if (split2 && split2.chars && split2.chars.length) {
  tl5.from(split2.chars, {
    opacity: 0,
    y: 20,
    stagger: 0.05,
    duration: 2,
    ease: "power2.out"
  }, "+=0.5"); // starts shortly after split1
}

if (document.querySelector('.hours')) {
  tl5.from(".hours", {
    opacity: 0,
    ease: "power2.out",
    duration: 1
  }, "0.1");
}

// Control playback of tl5 via a dedicated ScrollTrigger so enter/leave behaviors are consistent
ScrollTrigger.create({
  trigger: '#section5',
  start: 'top 80%',
  end: 'bottom 20%',
  onEnter: () => {
    try { tl5.play(); } catch(e){}
  },
  onEnterBack: () => {
    try { tl5.play(); } catch(e){}
  },
  onLeave: () => {
    try { tl5.reverse(); } catch(e){}
  },
  onLeaveBack: () => {
    try { tl5.reverse(); } catch(e){}
  },
  invalidateOnRefresh: true,
  markers: false
});




tl5.add(gsap.fromTo("#theMask2 .masker", {
  drawSVG: "0%"
}, {
  drawSVG: "100%",
  ease: "none",
  duration: 2.4 // match tl3 total duration
}), 0);
gsap.fromTo(
  "#theMask2 .masker1",
  { drawSVG: "0%" },
  {
    drawSVG: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: "#section5",
      start: "top top",
      end: "+=200%",
      scrub: true
    }
  }
);



const circleAnim = gsap.timeline({
  scrollTrigger: {
    trigger: "#section3",
    start: "top top",
    end: "+=3400", // matches tl3
    scrub: true
  }
});
const fullDuration = 3.4; // match the tl3 timeline range
circleAnim.to(".big-circle", {
  scale: isMobile ? 0.8 : 1.3,
  ease: "none",
  duration: fullDuration * 0.25
}, 0);

circleAnim.to(".dogcat", {
  scale: isMobile ? 1.8 : 2.5,
  ease: "none",
  duration: fullDuration * 0.25
}, 0.1);

circleAnim.to(".dogcat", {
  scale: isMobile ? 1.4 : 3,
  ease: "none",
  duration: fullDuration * 0.25
}, 0.7);

circleAnim.to(".big-circle", {
  scale: isMobile ? 1 : 1,
  ease: "none",
  duration: fullDuration * 0.25
}, 1);

circleAnim.to(".dogcat", {
  scale: isMobile ? 1.4 : 2,
  ease: "none",
  duration: fullDuration * 0.25
}, 1.8);

 const tl6 = gsap.timeline({
    scrollTrigger: {
      trigger: "#section6",
      start: "top 20%",
      end: isMobile ? "+=1200" : "+=2000",
      scrub:false,
      pin: false,
      toggleActions: "play reverse play reverse",
      onEnter: () => tl6.restart(true),
      onEnterBack: () => tl6.restart(true),
      onLeave: () => tl6.pause(0),
      onLeaveBack: () => tl6.pause(0),
      invalidateOnRefresh: true
    }
  });


 //ottuk
 //ottuk
 const { Engine, World, Bodies, Runner } = Matter || {};

  let engine, world, runner;
  let animationFrame;
  const section = document.querySelector("#section6");
  let reviews = [];
  const radius = 50;

  if (section) {
    const found = Array.from(section.querySelectorAll(".google-review"));
    if (found && found.length) reviews = found;
  }

  function createPhysicsWorld() {
    if (!section || !reviews || !reviews.length) return;

    engine = Engine.create();
    world = engine.world;
    runner = Runner.create();

    const boundsHeight = section.offsetHeight || window.innerHeight;
    const floorY = window.innerHeight - 30; // or section.getBoundingClientRect().bottom
    const floor = Bodies.rectangle(window.innerWidth / 2, floorY, window.innerWidth, 60, { isStatic: true });

   // const floor = Bodies.rectangle(window.innerWidth / 2, boundsHeight - 90, window.innerWidth, 60, { isStatic: true });
    const wallL = Bodies.rectangle(-10, boundsHeight / 2, 50, boundsHeight, { isStatic: true });
    const wallR = Bodies.rectangle(window.innerWidth + 10, boundsHeight / 2, 50, boundsHeight, { isStatic: true });
    World.add(world, [floor, wallL, wallR]);

    const bubbles = reviews.map((el) => {
      try { el.style.opacity = "1"; el.style.display = "block"; } catch(e){}
      const percentX = parseFloat(el.dataset.x || "50");
      const x = (percentX / 100) * window.innerWidth;
      const y = -150 - Math.random() * 100;
      const { Body } = Matter || {};
      const body = Bodies.circle(x, y, radius, {
        restitution: 0.9,
        friction: 0.05,
        frictionAir: 0.01,
        density: 0.001
      });
      try { Body.setVelocity(body, { x: gsap.utils.random(-1, 1), y: gsap.utils.random(5, 12) }); } catch(e){}
      World.add(world, body);
      return { el, body };
    });

    function animate() {
      bubbles.forEach(({ el, body }) => {
        try { el.style.transform = `translate(${body.position.x - radius}px, ${body.position.y - radius}px)`; } catch(e){}
      });
      animationFrame = requestAnimationFrame(animate);
    }

    try { Runner.run(runner, engine); } catch(e){}
    animate();
  }

  function clearPhysicsWorld() {
  if (engine) {
    try { cancelAnimationFrame(animationFrame); } catch(e){}
    try { Runner.stop(runner); } catch(e){}
    try { World.clear(world); } catch(e){}
    try { Engine.clear(engine); } catch(e){}
    engine = null;
    world = null;
    runner = null;
  }

  if (reviews && reviews.forEach) {
    reviews.forEach(el => {
      try { el.style.transition = ""; el.style.opacity = "0"; } catch(e){}
    });
  }

  try { if (reviews && reviews.length) gsap.set(reviews, { clearProps: "transform,y" }); } catch(e){}
}

  ScrollTrigger.create({
  trigger: "#section6",
  start: "top top",
  onEnter: () => {
    clearPhysicsWorld();
    createPhysicsWorld();
  },
  onEnterBack: () => {
    clearPhysicsWorld();
    createPhysicsWorld();
  },
  onLeaveBack: () => {
  cancelAnimationFrame(animationFrame);
  if (runner) Matter.Runner.stop(runner);

  gsap.to(reviews, {
    y: window.innerHeight + 300,
    duration: () => gsap.utils.random(0.6, 1.4),
    delay: () => gsap.utils.random(0, 0.4),
    ease: "power2.in",
    overwrite: true
  });
}
});

  window.addEventListener("resize", () => {
    clearPhysicsWorld();
    createPhysicsWorld();
  });
 //dotuk
const maskedImage2 = document.querySelector("#maskedImage2");



tl6.fromTo("#maskedImage2", {
  clipPath: "inset(50% 50% 50% 50% round 44px)",
}, {
 clipPath: isMobile ? "inset(0% 0% round 20px)" : "inset(5% 5% round 20px)",
  ease: "power2.out",
  duration: 1
}, 0);

// Scale image inside the div
tl6.fromTo("#maskedImage2 img", {
  scale: 1.2
}, {
  scale: 1,
  duration: 2,
  ease: "power3.out"
}, 0);
tl6.fromTo(".google", {
  scale: 1
}, {
  scale: 1.4,
  duration: 2,
  ease: "power3.out"
}, 0);
let split3 = { chars: [] };
try {
  split3 = document.querySelector('.splittitle3') ? await createSplitSafely('.splittitle3') : { chars: [] };
} catch (e) {
  if (document.querySelector('.splittitle3')) split3 = fallbackSplit('.splittitle3');
}

if (split1 && split1.chars && split1.chars.length) {
  tl6.from(split1.chars, {
    opacity: 0,
    y: 20,
    stagger: 0.05,
    duration: 1,
    ease: "power2.out"
  });
} 

 //dotuk
 
  const menuBtn = document.getElementById('menuCircle');
    const closeBtn = document.getElementById('bg-overlay');
  const menuCircle = document.getElementById('menuCircle');
  let menuOpen = false;
  const lines = document.querySelectorAll('.bars .line');
  // If React has mounted a controlled header, skip the legacy handler entirely
  if (document.querySelector('[data-react-controlled="true"]')) {
    // React controls the menu; skip legacy handler
  } else {
    menuBtn.addEventListener('click', () => {
      if (!menuOpen) {
        // Rotate lines to form an X
        //gsap.to(lines[0], { rotation: 45, y: 6, duration: 0.3 });
        //gsap.to(lines[1], { rotation: 135, y: -16, duration: 0.3 });

        // Add open class to trigger the overlay
        menuCircle.classList.add('open');

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
          duration: 1
        });

        const menuItems = menuClone.querySelector('ul');
        const menuLogo = menuClone.querySelector('img');
        if (menuItems && menuLogo) {
          gsap.to([menuItems, menuLogo], {
            opacity: 1,
            duration: 0.2,
            delay: 0.5
          });
        }

        // ✅ Click anywhere on bg or menuClone .bars to close
        function closeMenu() {
          const lines = menuClone.querySelectorAll('.bars .line');
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3 });
          gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3 });

          menuCircle.classList.remove('open');

          gsap.to(menuClone, {
            top: menuCircle.getBoundingClientRect().top + "px",
            left: menuCircle.getBoundingClientRect().left + "px",
            width: "60px",
            height: "60px",
            borderRadius: "100%",
            ease: "power2.inOut",
            duration: 0.5,
            onComplete: function () {
              gsap.set(menuCircle, { opacity: 1 });
              menuClone.remove();
              bg.remove();
            }
          });

          menuOpen = false;
        }

        bg.addEventListener('click', closeMenu);

        const cloneBars = menuClone.querySelector('.bars');
        if (cloneBars) {
          cloneBars.addEventListener('click', closeMenu);
        }

        menuOpen = true;
      }
    });
  }
  // Ensure big-circle and dogcat animate reliably even if ScrollTrigger misfires: use IntersectionObserver fallback
  (function setupBigCircleObserver(){
    try {
      const bigEl = document.querySelector('.big-circle');
      const dogEl = document.querySelector('.dogcat');
      const targetScale = isMobile ? 3 : 2.5;
      if (bigEl) gsap.set(bigEl, { scale: 0, transformOrigin: 'center center', willChange: 'transform' });
      if (dogEl) gsap.set(dogEl, { scale: 0, transformOrigin: 'center center', willChange: 'transform' });

      if (!bigEl && !dogEl) return;

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          console.debug('BigCircle IO:', entry.target, 'isIntersecting', entry.isIntersecting, 'intersectionRatio', entry.intersectionRatio);
          if (entry.isIntersecting) {
            try {
              if (bigEl) gsap.to(bigEl, { scale: targetScale, duration: 1, ease: 'power3.out', overwrite: true });
              if (dogEl) gsap.to(dogEl, { scale: targetScale, duration: 1, ease: 'power3.out', overwrite: true });
            } catch(e){ console.warn('bigcircle animation failed', e); }
          } else {
            try {
              if (bigEl) gsap.to(bigEl, { scale: 0, duration: 0.6, ease: 'power2.inOut', overwrite: true });
              if (dogEl) gsap.to(dogEl, { scale: 0, duration: 0.6, ease: 'power2.inOut', overwrite: true });
            } catch(e){ console.warn('bigcircle reverse failed', e); }
          }
        });
      }, { threshold: 0.45 });

      // observe the section containing bigEl or fallback to bigEl itself
      const rootToObserve = document.querySelector('#section4') || bigEl || dogEl;
      if (rootToObserve) io.observe(rootToObserve);
    } catch (e) {
      // no-op
    }
  })();

  window.addEventListener("load", () => {
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
});

// Refresh ScrollTrigger when the page becomes visible again to ensure enter/enterBack firing reliably
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
}
window.addEventListener("resize", () => {
  ScrollTrigger.refresh(true);

  // Optional: reset flag so physics re-creates on next scroll into view
  physicsCreated = false;

  // Optionally hide and reset reviews
  reviews.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "";
  });
});

  
}

let currentLang = 'bg';
let translations = {};

async function loadTranslations() {
  try {
    const response = await fetch('/madaravet-next/lang.json');
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
      el.innerHTML = translations[lang][key];
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
