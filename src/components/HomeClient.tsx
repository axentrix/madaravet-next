"use client";
import React, { useEffect, useState } from "react";

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const links = [
      "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css",
    ];
    const createdLinks: HTMLLinkElement[] = [];
    links.forEach(href => {
      const exists = Array.from(document.querySelectorAll('link')).some(l => l.href && l.href.includes(href));
      if (!exists) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        document.head.appendChild(l);
        createdLinks.push(l);
      }
    });

    const scripts = [
      { src: "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js", id: "swiper-cdn" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js", id: "gsap" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js", id: "gsap-scrolltrigger" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Draggable.min.js", id: "gsap-draggable" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CSSRulePlugin.min.js", id: "gsap-cssrule" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/DrawSVGPlugin.min.js", id: "gsap-drawsvg" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Physics2DPlugin.min.js", id: "gsap-physics2d" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/PhysicsPropsPlugin.min.js", id: "gsap-physicsprops" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollToPlugin.min.js", id: "gsap-scrollto" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js", id: "gsap-splittext" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/TextPlugin.min.js", id: "gsap-textplugin" },
      { src: "https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js", id: "matterjs" },
      { src: "/custom.js", id: "custom-js" },
    ];

    const loadSequential = async () => {
      for (const item of scripts) {
        const { src, id } = item;
        const exists = !!document.querySelector(`script[data-loader-id="${id}"]`) ||
          !!Array.from(document.scripts).some(s => s.src && s.src.includes(src));
        if (exists) continue;

        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = src;
          s.async = false;
          s.setAttribute("data-loader-id", id);
          s.onload = () => resolve();
          s.onerror = () => {
            console.error("Failed to load script:", src);
            resolve();
          };
          document.body.appendChild(s);
        });
      }
    };

    loadSequential();

    // fallback: ensure loader is hidden after 7s in case custom.js or translations fail
    const loaderTimeout = window.setTimeout(() => {
      const loaderEl = document.getElementById('loader');
      if (loaderEl) {
        loaderEl.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        loaderEl.style.opacity = '0';
        loaderEl.style.transform = 'scale(0.95)';
        setTimeout(() => { loaderEl.style.display = 'none'; }, 500);
      }
    }, 7000);

    return () => {
      createdLinks.forEach(l => l.remove());
      clearTimeout(loaderTimeout);
    };
  }, []);

  if (!mounted) return <div />;

  return (
    <div className="bg-[#F6FEFF] text-blue-900 overflow-x-hidden relative">
      <section id="section1" className="relative w-full min-h-screen flex align-items-center justify-start flex-col">
        <div className="max-w-screen-xl mx-auto pt-32 px-6 md:pt-32 relative pb-32 items-center justify-center text-center">
          <div className="relative z-[89] flex align-items-center justify-center flex-col">
            <div className="flex gap-4 mb-10 justify-center flex-col md:flex-row items-start md:order-2">
              <div className="flex w-auto infobox1 split-text items-center gap-2 bg-[#177DDF] text-white px-4 py-2 rounded-full text-lg">
                <img src="/images/pin.svg" className="w-4 h-4" alt="pin" />
                <span data-i18n="section1_address"></span>
              </div>
              <div className="flex w-auto infobox2 split-text items-center gap-2 bg-[#177DDF] text-white px-4 py-2 rounded-full text-lg">
                <img src="/images/phone.svg" className="w-4 h-4" alt="phone" />
                <span>+888 198 585</span>
              </div>
            </div>

            <h1 className="text-[#E3362D] text-4xl split-text md:text-8xl font-bold leading-tight text-center mb-8">
              <span data-i18n="section1_title_line1"></span>
              <br />
              <span data-i18n="section1_title_line2"></span>
              <br />
              <span data-i18n="section1_title_line3"></span>
            </h1>
          </div>
        </div>

        <div className="circle-init2 absolute left-[-100px] md:left-[200px] bottom-[100px] w-[360px] h-[360px] rounded-full bg-[#FFF5DA] z-[74]" />
        <img src="/images/puppies.png" alt="Д-р Юлиана Соколова" className="puppies1 absolute left-[-100px] md:left-[200px] bottom-[5vh] w-auto h-[40vh] max-w-[90vw] md:h-[60vh] md:w-auto z-[81]" />
        <div className="circle-init1 absolute right-[-160px] top-[180px] w-[560px] h-[560px] rounded-full bg-[#D8F1FF] z-[76]" />
        <img src="/images/puppies2.png" alt="Dr. Juliana Sokolova" className="absolute puppies2 right-[0] w-auto h-[55vh] max-w-none md:h-[90vh] md:w-auto bottom-[-50px] md:bottom-[-10vh] z-[82]" />
      </section>

      <section id="section2" className="relative w-full min-h-screen flex items-center justify-center px-4 py-20 z-[106]">
        <div id="scrollRibbon" className="bg-[#FFF0F0] py-4 relative z-40">
          <div className="relative w-full">
            <div id="scrollTrack" className="whitespace-nowrap text-[#11294B] text-6xl font-light flex gap-6 px-4">
              <span data-i18n="section2_ribbon"></span>
              <span data-i18n="section2_ribbon"></span>
              <span data-i18n="section2_ribbon"></span>
              <span data-i18n="section2_ribbon"></span>
              <span data-i18n="section2_ribbon"></span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-screen flex items-start justify-center z-30" id="section3">
        <div id="floatingBallsContainer" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[9999]">

          <div className="circle-card z-68 absolute top-1/2 transform -translate-y-1/2 left-1/2 w-[30vh] h-[30vh] flex flex-col items-center justify-center text-center px-4">
            <div className="circle absolute bg-[#FFF5DA] w-full h-full flex rounded-full z-[-1]" />
            <img src="/images/ico1.svg" alt="Icon" className="w-6 mb-2" />
            <p className="text-[#E3362D] text-xl font-bold leading-tight" data-i18n="section3_card1">ДИАГНОСТИЧНИ<br />ТЕСТОВЕ</p>
          </div>

          <div className="circle-card z-69 absolute top-1/2 left-1/2 transform -translate-y-1/2 w-[30vh] h-[30vh] rounded-full flex flex-col items-center justify-center text-center px-4">
            <div className="circle absolute bg-[#FFEAEA] w-full h-full flex rounded-full z-[-1]" />
            <img src="/images/ico2.svg" alt="Icon" className="w-6 mb-2" />
            <p className="text-[#E3362D] text-xl font-bold leading-tight" data-i18n="section3_card2">ИНДИВИДУАЛНО<br />НАСОЧЕНА<br />ПРОФИЛАКТИКА</p>
          </div>

          <div className="circle-card z-70 absolute top-1/2 left-1/2 transform -translate-y-1/2 w-[30vh] h-[30vh] rounded-full flex flex-col items-center justify-center text-center px-4">
            <div className="circle absolute bg-[#E0FFD4] w-full h-full flex rounded-full z-[-1]" />
            <img src="/images/ico3.svg" alt="Icon" className="w-6 mb-2" />
            <p className="text-[#E3362D] text-xl font-bold leading-tight" data-i18n="section3_card3">ХИРУРГИЧНО<br />ЛЕЧЕНИЕ</p>
          </div>

        </div>

        <div className="absolute top-[-50px] left-0 w-100 h-100 md:w-[40vw] md:h-[50vh] ">
          {/* SVG mask inserted via dangerouslySetInnerHTML to preserve original markup */}
          <div dangerouslySetInnerHTML={{ __html: `
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 908 743" style="enable-background:new 0 0 908 743;" xml:space="preserve">\n<defs>\n <mask id="theMask1" maskUnits="userSpaceOnUse">\n<path class="masker" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M731.1,86.1c-11.8-62.1-115.6-43.5-159.9-46c-22.2-1.2-60.7-0.5-78.1-17C476.4,7.3,411.6,0.5,325.6,8.4\n\tc-25.3,2.3-56.8,5-76.3,23.8c-8.4,8.1-12.3,18.2-18.2,28C208.2,97.7,166,97.4,127.3,99.7c-26.2,1.6-55.4-1.4-79.5,11.5\n\tc-29,15.6-36.7,50.9-36.2,81.8c1.2,74.7,7.3,149.2,12.1,223.7c1.8,28.5-1.5,62.1,10.9,88.7c11.8,25.1,41.4,37.1,67.2,39.9\n\tc46,5,94.6,6.6,140.5-0.3c38.7-5.8,82.3-25,119.3-2.6c42.2,25.5,83.7,50.6,134.8,47.3c50.9-3.3,85.7-43.4,114.5-82.6\n\tc19.4-26.3,45-35.2,75.1-21.5c21.5,9.8,45.8,38.3,19,57.5c-32.2,23.1-51.2-20-16.6-18.8c66.3,2.2,150.7,26.2,187.6,87\n\tc21.4,35.1,23.5,76.7,16.9,116.5"/>\n<path class="masker" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M891.9,733.8c-0.4,2-0.8,3.9-1.2,5.9"/>\n    </mask>\n  </defs>\n <g id="maskReveal1" mask="url(#theMask1)">\n  <path class="draw1 " stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M732,104.1c0.1-2.1,0.2-4.1,0.2-6"/>\n<path class="draw1" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M731.1,86.1c-11.8-62.1-115.6-43.5-159.9-46c-22.2-1.2-60.7-0.5-78.1-17C476.4,7.3,411.6,0.5,325.6,8.4\n\tc-25.3,2.3-56.8,5-76.3,23.8c-8.4,8.1-12.3,18.2-18.2,28C208.2,97.7,166,97.4,127.3,99.7c-26.2,1.6-55.4-1.4-79.5,11.5\n\tc-29,15.6-36.7,50.9-36.2,81.8c1.2,74.7,7.3,149.2,12.1,223.7c1.8,28.5-1.5,62.1,10.9,88.7c11.8,25.1,41.4,37.1,67.2,39.9\n\tc46,5,94.6,6.6,140.5-0.3c38.7-5.8,82.3-25,119.3-2.6c42.2,25.5,83.7,50.6,134.8,47.3c50.9-3.3,85.7-43.4,114.5-82.6\n\tc19.4-26.3,45-35.2,75.1-21.5c21.5,9.8,45.8,38.3,19,57.5c-32.2,23.1-51.2-20-16.6-18.8c66.3,2.2,150.7,26.2,187.6,87\n\tc21.4,35.1,23.5,76.7,16.9,116.5"/>\n<path class="draw1" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M891.9,733.8c-0.4,2-0.8,3.9-1.2,5.9"/></g>\n</svg>
          `}} />
        </div>

        <div className="image-cards relative z-20">
          <div className="image-card flex w-[80vw] h-[80vh] md:w-auto md:h-auto max-w-[640px] max-h-[640px]">
            <div className="image1 service">
              <img src="/images/service1.png" alt="Диагностика" className="rounded-xl w-full object-cover" data-i18n-alt="section3_img1" />
            </div>
          </div>

          <div className="image-card flex w-[80vw] h-[80vh] md:w-auto md:h-auto max-w-[640px] max-h-[640px]">
            <div className="image2 service">
              <img src="/images/service2.png" alt="Профилактика" className="rounded-xl w-full object-cover" data-i18n-alt="section3_img2" />
            </div>
          </div>

          <div className="image-card flex w-[80vw] h-[80vh] md:w-auto md:h-auto max-w-[640px] max-h-[640px]">
            <div className="image2 service">
              <img src="/images/service3.png" alt="Хирургия" className="rounded-xl w-full object-cover" data-i18n-alt="section3_img3" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden z-69 align-items-end " id="section4">
        <div id="maskedImage" className="w-full overflow-hidden rounded-[40px]">
          <img src="/images/landscape.jpg" alt="Dr.Juliana Sokolova" className="w-full h-auto" />
        </div>
      </section>

      <section className="relative w-full min-h-screen flex items-center justify-center px-4 py-20 z-[70] overflow-visible" id="section5">
        <div className="absolute top-[20vh] left-1/2 w-100 h-100 md:w-[40vw] md:h-[50vh] top-1/2 z-0">
          {/* SVG mask2 inserted */}
          <div dangerouslySetInnerHTML={{ __html: `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 28.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 908 743" style="enable-background:new 0 0 908 743;" xml:space="preserve">
<defs>
    <mask id="theMask2" maskUnits="userSpaceOnUse">
<path class="masker" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M175.9,103.2c-0.1-2.1-0.2-4.1-0.2-6"/>
<path class="masker" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M176.8,85.2c11.8-62.1,115.6-43.5,159.9-46c22.2-1.2,60.7-0.5,78.1-17C431.6,6.4,496.4-0.4,582.4,7.6
	c25.3,2.3,56.8,5,76.3,23.8c8.4,8.1,12.3,18.2,18.2,28c22.9,37.5,65.1,37.2,103.7,39.5c26.2,1.6,55.4-1.4,79.5,11.5
	c29,15.6,36.7,50.9,36.2,81.8c-1.2,74.7-7.3,149.2-12.1,223.7c-1.8,28.5,1.5,62.1-10.9,88.7c-11.8,25.1-41.4,37.1-67.2,39.9
	c-46,5-94.6,6.6-140.5-0.3c-38.7-5.8-82.3-25-119.3-2.6c-42.2,25.5-83.7,50.6-134.8,47.3c-50.9-3.3-85.7-43.4-114.5-82.6
	c-19.4-26.3-45-35.2-75.1-21.5c-21.5,9.8-45.8,38.3-19,57.5c32.2,23.1,51.2-20,16.6-18.8c-66.3,2.2-150.7,26.2-187.6,87
C10.5,645.6,8.3,687.2,15,727"/>
<path class="masker1" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M16,732.9c0.4,2,0.8,3.9,1.2,5.9"/>
    </mask>
  </defs>
   <g id="maskReveal2" mask="url(#theMask2)">
<path class="draw2" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M175.9,103.2c-0.1-2.1-0.2-4.1-0.2-6"/>
<path class="draw2" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M176.8,85.2c11.8-62.1,115.6-43.5,159.9-46c22.2-1.2,60.7-0.5,78.1-17C431.6,6.4,496.4-0.4,582.4,7.6
	c25.3,2.3,56.8,5,76.3,23.8c8.4,8.1,12.3,18.2,18.2,28c22.9,37.5,65.1,37.2,103.7,39.5c26.2,1.6,55.4-1.4,79.5,11.5
	c29,15.6,36.7,50.9,36.2,81.8c-1.2,74.7-7.3,149.2-12.1,223.7c-1.8,28.5,1.5,62.1-10.9,88.7c-11.8,25.1-41.4,37.1-67.2,39.9
	c-46,5-94.6,6.6-140.5-0.3c-38.7-5.8-82.3-25-119.3-2.6c-42.2,25.5-83.7,50.6-134.8,47.3c-50.9-3.3-85.7-43.4-114.5-82.6
	c-19.4-26.3-45-35.2-75.1-21.5c-21.5,9.8-45.8,38.3-19,57.5c32.2,23.1,51.2-20,16.6-18.8c-66.3,2.2-150.7,26.2-187.6,87
C10.5,645.6,8.3,687.2,15,727"/>
<path class="draw2" stroke="#FF8F8F" stroke-width="8" fill="none" stroke-dasharray="10" d="M16,732.9c0.4,2,0.8,3.9,1.2,5.9"/></g>
</svg>` }} />
        </div>

        <div className="absolute big-circle1 w-[60vw] h-[60vw] bg-[#D0F3FF] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-66" />
        <div className="absolute big-circle-inner w-[55vw] h-[55vw] bg-[#FFEBEB] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-67" />

        <div className="relative z-80 max-w-3xl w-full text-left md:text-center">
          <h2 className="splittitle1 text-center text-3xl md:text-6xl font-bold text-[#177DDF]" data-i18n="section5_title1">МАДАРАВЕТ</h2>
          <h3 className="splittitle2 text-center text-2xl md:text-6xl font-semibold text-[#11294B] mb-8" data-i18n="section5_title2">РАБОТНО ВРЕМЕ</h3>

          <div className="hours grid gap-y-2 text-lg md:text-xl text-[#11294B] max-w-xl mx-auto">
            <div className="grid grid-cols-3 gap-x-4 text-left border-b border-gray-300 pb-2">
              <p data-i18n="mon">ПОН</p>
              <p>9:00 - 12:00</p>
              <p>15:00 - 19:00</p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 text-left border-b border-gray-300 pb-2">
              <p data-i18n="tue">ВТОРНИК</p>
              <p>9:00 - 12:00</p>
              <p>15:00 - 19:00</p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 text-left border-b border-gray-300 pb-2">
              <p data-i18n="wed">СРЯДА</p>
              <p></p>
              <p>15:00 - 19:00</p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 text-left border-b border-gray-300 pb-2">
              <p data-i18n="thu">ЧЕТВ</p>
              <p>9:00 - 12:00</p>
              <p>15:00 - 19:00</p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 text-left border-b border-gray-300 pb-2">
              <p data-i18n="fri">ПЕТЪК</p>
              <p>9:00 - 12:00</p>
              <p>15:00 - 19:00</p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 text-left border-b border-gray-300 pb-2">
              <p data-i18n="sat">СЪБОТА</p>
              <p>10:00 - 13:00</p>
              <p></p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 text-left border-b border-gray-300 pb-2">
              <p data-i18n="sun">НЕДЕЛЯ</p>
              <p></p>
              <p data-i18n="dayoff">ПОЧИВЕН ДЕН</p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 text-left border-b border-gray-300 pb-2">
              <p data-i18n="holiday">ОФИЦИАЛЕН ПРАЗНИК</p>
              <p></p>
              <p data-i18n="dayoff">ПОЧИВЕН ДЕН</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden flex-col z-64 " id="section6">
        <div id="maskedImage2" className="w-full overflow-hidden rounded-[40px]">
          <img id="dogImage" src="/images/dogs.jpg" alt="Dogs" className="w-full h-auto" />
        </div>

        <div className="absolute google top-[240px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center text-center text-lg font-bold z-10">
          <img src="/images/google.svg" alt="Google" className="w-20 mb-1" />
          <div className="text-yellow-500 text-xl">★★★★★</div>
          <div className="text-[#11294B] mt-1">199+ REVIEWS</div>
        </div>

        <div className="relative reviews">

          <div className="google-review  w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center text-center text-lg font-bold ">

            <div className="text-yellow-500 text-xl">★★★★★</div>
            <div className="text-[#11294B] mt-1">Dr. Sokolova really helped us</div>
          </div>
          <div className="google-review  w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center text-center text-lg font-bold ">

            <div className="text-yellow-500 text-xl">★★★★★</div>
            <div className="text-[#11294B] mt-1">Exceptional in everything.</div>
          </div>
          <div className="google-review  w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center text-center text-lg font-bold ">

            <div className="text-yellow-500 text-xl">★★★★★</div>
            <div className="text-[#11294B] mt-1">Actually really nice vet.</div>
          </div>
          <div className="google-review  w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center text-center text-lg font-bold ">

            <div className="text-yellow-500 text-xl">★★★★★</div>
            <div className="text-[#11294B] mt-1">It is a fantastic place to bring your friend</div>
          </div>
          <div className="google-review  w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center text-center text-lg font-bold ">

            <div className="text-yellow-500 text-xl">★★★★★</div>
            <div className="text-[#11294B] mt-1">A great team of dedicated veterinarians.</div>
          </div>
        </div>

        <div className="relative facebook py-24 flex flex-col items-center justify-center text-center">

          <h2 className="split-text splittitle3 mb-3"><span className="text-[#177DDF] text-3xl">MADARAVET/</span><span className="text-3xl text-[#E3362D]">FACEBOOK</span></h2>

          <div className="swiper mySwiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide"><img src="/images/gallery/1.jpg" alt="1" /></div>
              <div className="swiper-slide"><img src="/images/gallery/2.jpg" alt="2" /></div>
              <div className="swiper-slide"><img src="/images/gallery/3.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/4.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/5.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/6.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/7.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/8.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/9.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/10.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/11.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/12.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/13.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/14.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/15.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/16.jpg" alt="3" /></div>
            </div>
            <div className="swiper-pagination"></div>
          </div>

        </div>

      </section>

      <div className="absolute big-circle w-[90vh] h-[90vh] bg-[#D8F1FF] rounded-full top-1/2 left-1/2">
        <img src="/images/catdog.svg" alt="Cat and Dog" className="absolute dogcat w-[60vh] max-w-[80vh]" />
      </div>

    </div>
  );
}
