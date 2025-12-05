"use client";
import React, { useEffect, useState } from "react";
import ServicesSection from './ServicesSection';

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

    return () => {
      createdLinks.forEach(l => l.remove());
    };
  }, []);

  if (!mounted) return <div />;

  return (
    <>
      <section id="section1" className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-container">
            <div className="hero-info-chips">
              <div className="info-chip">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/449be3664ee1a46544b6055a8002f47e7cd8a8a4?width=49" alt="location" className="chip-icon" />
                <span data-i18n="section1_address">ул. Тунджа 22 1606 СофиЯ</span>
              </div>
              <div className="info-chip">
                <svg className="chip-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.707 13.707L20.355 16.355C20.44 16.4396 20.5074 16.5401 20.5534 16.6508C20.5994 16.7615 20.6231 16.8802 20.6231 17C20.6231 17.1199 20.5994 17.2386 20.5534 17.3493C20.5074 17.46 20.44 17.5605 20.355 17.645C19.4239 18.5764 18.188 19.1405 16.8743 19.2338C15.5607 19.3271 14.2574 18.9434 13.204 18.153L11.629 16.971C9.88547 15.6634 8.33665 14.1146 7.029 12.371L5.847 10.796C5.05665 9.74258 4.67289 8.43936 4.76621 7.1257C4.85953 5.81205 5.42367 4.57616 6.355 3.64502C6.43956 3.56006 6.54007 3.49264 6.65076 3.44664C6.76145 3.40064 6.88013 3.37695 7 3.37695C7.11987 3.37695 7.23856 3.40064 7.34924 3.44664C7.45993 3.49264 7.56044 3.56006 7.645 3.64502L10.293 6.29302C10.4805 6.48055 10.5858 6.73486 10.5858 7.00002C10.5858 7.26519 10.4805 7.51949 10.293 7.70702L9.272 8.72802C9.19231 8.80692 9.13969 8.90905 9.12172 9.01974C9.10376 9.13043 9.12136 9.24397 9.172 9.34402C10.3584 11.7173 12.2827 13.6416 14.656 14.828C14.7561 14.8787 14.8696 14.8963 14.9803 14.8783C15.091 14.8603 15.1931 14.8077 15.272 14.728L16.292 13.708C16.3849 13.615 16.4952 13.5413 16.6166 13.491C16.738 13.4406 16.8681 13.4147 16.9995 13.4147C17.1309 13.4147 17.261 13.4406 17.3824 13.491C17.5038 13.5413 17.6141 13.615 17.707 13.708V13.707Z" stroke="#4868EC" strokeWidth="2"/>
                </svg>
                <span>+888 198 585</span>
              </div>
            </div>

            <div className="hero-description-container">
              <h1 className="hero-title">
                <span data-i18n="section1_title_line11">Ветеринарен кабинет в самия център на София</span>
              </h1>
              <button className="hero-cta-button" onClick={() => {
                document.getElementById('working-hours-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <span data-i18n="section1_cta">Работно време</span>
                <svg className="cta-arrow" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M31.5 18L24 10.5M31.5 18L24 25.5M31.5 18H4.5" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

           
          </div>
           <div className="hero-image-wrapper">
              <img src="https://api.builder.io/api/v1/image/assets/TEMP/ac4e0fc5c38342d112f11dbdc90966eadd496a34?width=2126" alt="Hero image container" className="hero-main-image" />
            </div>
        </div>
      </section>

      <ServicesSection />

      <section className="relative w-full overflow-hidden z-64" id="section6">
        <div className="relative facebook py-4 flex flex-col items-center justify-center text-center">
          <h2 className="mb-8">
            <span className="text-[#177DDF] text-3xl md:text-4xl font-bold font-advent">MADARAVET/</span>
            <span className="text-3xl md:text-4xl font-bold text-[#E3362D] font-advent">FACEBOOK</span>
          </h2>

          <div className="swiper mySwiper w-full">
            <div className="swiper-wrapper">
              <div className="swiper-slide"><img src="/images/gallery/1.jpg" alt="1" /></div>
              <div className="swiper-slide"><img src="/images/gallery/2.jpg" alt="2" /></div>
              <div className="swiper-slide"><img src="/images/gallery/3.jpg" alt="3" /></div>
              <div className="swiper-slide"><img src="/images/gallery/4.jpg" alt="4" /></div>
              <div className="swiper-slide"><img src="/images/gallery/5.jpg" alt="5" /></div>
              <div className="swiper-slide"><img src="/images/gallery/6.jpg" alt="6" /></div>
              <div className="swiper-slide"><img src="/images/gallery/7.jpg" alt="7" /></div>
              <div className="swiper-slide"><img src="/images/gallery/8.jpg" alt="8" /></div>
              <div className="swiper-slide"><img src="/images/gallery/9.jpg" alt="9" /></div>
              <div className="swiper-slide"><img src="/images/gallery/10.jpg" alt="10" /></div>
              <div className="swiper-slide"><img src="/images/gallery/11.jpg" alt="11" /></div>
              <div className="swiper-slide"><img src="/images/gallery/12.jpg" alt="12" /></div>
              <div className="swiper-slide"><img src="/images/gallery/13.jpg" alt="13" /></div>
              <div className="swiper-slide"><img src="/images/gallery/14.jpg" alt="14" /></div>
              <div className="swiper-slide"><img src="/images/gallery/15.jpg" alt="15" /></div>
              <div className="swiper-slide"><img src="/images/gallery/16.jpg" alt="16" /></div>
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>

     
    </>
  );
}
