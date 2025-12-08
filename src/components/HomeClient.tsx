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

      <section className="quality-services-section">
        <div className="quality-services-container">
          <div className="quality-services-image-wrapper">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/868cd1376e0694256f9aeaad40258acb0bef6a25?width=1224"
              alt="High quality veterinary services"
              className="quality-services-image"
            />
          </div>
          <div className="quality-services-content">
            <svg className="quality-services-logo" width="108" height="99" viewBox="0 0 108 99" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_305_322)">
                <path d="M10.1846 23.9081C10.1846 23.9081 10.3397 23.8045 10.4258 23.77C11.029 23.5456 11.7183 24.0462 11.9251 24.6676C12.1319 25.2891 11.9768 25.9623 11.839 26.5838C10.7705 31.2274 8.9438 36.1644 9.35739 40.9806C9.59866 43.8289 11.1669 47.4886 13.3899 49.3357C17.3536 52.6155 22.5752 47.5576 20.6279 43.242C19.749 41.2914 18.3186 39.4615 18.715 37.1656C19.0769 35.0251 20.4555 33.7477 22.3512 35.5257C24.4191 37.4764 27.366 40.6699 26.1425 44.4504C25.0223 47.9201 21.4206 50.9411 19.1458 53.6513C10.5982 63.8534 10.3569 75.0912 9.16783 87.7618C8.80593 91.6804 8.56467 92.2846 8.56467 92.2846C8.56467 92.2846 6.73796 91.8012 5.99693 89.7125C5.68674 88.8321 5.32484 87.9517 4.92848 87.0886C4.77338 86.7606 3.96343 83.7569 3.41197 84.8617C3.0156 85.6731 2.75711 86.7433 3.05007 87.641C3.54983 89.2119 4.49765 92.0429 5.25591 93.4929C6.35883 95.5644 8.30617 98.3092 13.321 98.5508C23.3679 99.0342 33.2942 98.9824 43.3411 98.9133C46.5292 98.8961 51.5786 97.0663 53.9912 94.7358C56.3866 92.4054 51.5441 89.6607 49.4761 91.1798C47.6494 92.5262 47.77 91.4214 47.77 91.4214C47.6666 82.6349 49.4416 73.7792 47.8907 65.0272C46.805 58.8645 42.2727 54.7733 40.2047 49.094C39.2224 46.401 38.7399 43.7081 38.7399 42.2408C38.7399 34.3519 50.062 32.2458 54.2497 27.4469C54.2497 27.4469 58.4029 22.6825 59.2645 19.8687C60.1262 17.0549 60.85 11.7899 60.85 9.59755C60.85 7.40522 59.8677 7.26712 61.2119 5.55814C62.5561 3.84916 62.5561 0.672877 60.85 0.293104C56.8864 -0.552755 56.8864 0.206792 54.8701 3.22772C54.3876 3.97 45.5814 4.45335 43.1516 4.09084C37.4646 3.24498 31.2435 2.98604 25.6427 4.45335C19.1975 6.16233 14.9237 11.8589 10.3052 16.3126C7.70301 18.8329 4.35979 21.2324 2.29181 24.3914C0.89593 26.4629 -0.103592 29.3976 -0.000193154 31.8488C0.120439 34.6453 3.0156 38.1323 6.16927 36.2162C7.08262 35.6638 7.53068 34.559 7.78918 33.506C8.49574 30.5196 8.18554 27.2397 9.66759 24.5641C9.80546 24.3224 9.97779 24.0635 10.2018 23.8908L10.1846 23.9081Z" fill="#1872D9"/>
                <path d="M61.6605 93.9248C61.7812 93.9248 61.9018 93.8903 62.0224 93.8213C62.0397 92.2849 61.6261 90.7831 61.2814 89.2985C59.7132 82.5662 59.4375 75.4195 61.0057 68.6527C61.7639 65.3383 62.9703 61.9894 64.7453 59.072C66.7099 55.8612 70.7424 52.1325 70.3805 48.0758C70.0186 44.0192 66.4686 42.0858 63.4356 40.3768C61.988 39.5655 60.5749 38.4089 60.1613 36.8035C59.5236 34.3695 61.3331 32.0563 62.2292 29.6914C63.3494 26.7395 63.0737 23.5287 63.7458 20.4905C63.9526 19.5411 64.5212 16.8136 65.6586 16.5029C66.9683 16.1576 68.2264 18.0737 69.1225 18.7297C73.1206 21.5608 77.9631 19.4202 81.7199 17.2797C83.8223 16.0713 85.1148 16.9344 85.4767 19.1785C85.8731 21.6125 85.718 24.0983 85.942 26.5496C86.166 29.0009 86.9243 31.4521 86.9588 33.9724C86.9932 37.1315 85.8386 40.0833 83.0469 41.7405C80.6859 43.1388 75.6883 43.5358 75.7572 47.299C75.8606 52.1152 82.7194 55.188 85.6318 58.2089C90.0435 62.7834 93.6108 68.2211 95.7994 74.2112C96.6783 76.6279 97.3503 79.1482 97.247 81.7203C97.1436 84.5168 96.1613 87.2098 94.9722 89.7473C93.9037 92.0432 92.5768 94.3391 90.4571 95.7374C88.1479 97.2565 85.2355 97.4809 82.4782 97.619C74.8267 98.016 67.0545 98.1369 59.6443 96.1862C58.438 95.8582 57.1455 95.4094 56.4734 94.3564C55.8013 93.3034 56.3355 91.5081 57.5935 91.4563C59.2134 91.3873 60.213 94.0629 61.6433 93.9248H61.6605ZM64.4695 89.7991C64.4695 89.7991 64.5729 89.9545 64.6419 90.0063C65.1244 90.3688 65.7103 89.9545 65.7103 89.333C65.7103 87.9866 65.1244 83.0323 65.9171 81.634C66.7099 80.2357 68.6572 78.7512 69.2431 78.216C69.829 77.6809 71.7075 76.7487 71.6558 75.0398C71.6041 73.3308 71.5007 70.6896 69.9841 69.7747C68.4676 68.8598 68.5883 69.3431 67.3475 69.9646C66.1067 70.586 64.8314 71.8635 64.7108 73.2617C64.5902 74.66 64.28 74.9707 64.2283 76.6797C64.1766 78.3887 63.6941 81.3923 63.7458 82.9805C63.8147 84.8793 63.9181 86.7955 64.1766 88.6771C64.2283 88.9878 64.2627 89.4884 64.4351 89.8164L64.4695 89.7991Z" fill="#DE3D37"/>
                <path d="M93.5757 92.0778C97.7806 92.0087 101.899 91.042 103.502 86.7091C105.415 81.5477 102.744 76.1791 100.745 71.4664C98.625 66.4603 92.6106 54.3594 98.6767 50.1819C101.107 48.5074 105.897 48.9735 106.19 52.7022C106.225 53.2546 106.276 55.8785 106.276 55.8785" stroke="#DE3D37" strokeWidth="1.63061" strokeLinecap="round"/>
              </g>
              <defs>
                <clipPath id="clip0_305_322">
                  <rect width="108" height="99" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <h2 className="quality-services-title">
              Висококачествени услуги за вашия домашен любимец
            </h2>
          </div>
        </div>
      </section>

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
