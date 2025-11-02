'use client';

import { useEffect, useRef, useState } from 'react';

export default function ServicesClient() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);

    const scripts = [
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js", id: "gsap" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js", id: "gsap-scrolltrigger" },
      { src: "https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js", id: "matterjs" },
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
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;

    const loadPhysicsAnimation = async () => {
      // Wait for Matter.js and GSAP to be available
      const checkLibraries = (timeout = 3000) => {
        return new Promise<{ ok: boolean }>((resolve) => {
          const start = Date.now();
          const interval = setInterval(() => {
            const hasMatter = typeof (window as any).Matter !== 'undefined';
            const hasGsap = typeof (window as any).gsap !== 'undefined';
            const hasScroll = typeof (window as any).ScrollTrigger !== 'undefined';
            if (hasMatter && hasGsap && hasScroll) {
              clearInterval(interval);
              return resolve({ ok: true });
            }
            if (Date.now() - start > timeout) {
              clearInterval(interval);
              return resolve({ ok: false });
            }
          }, 100);
        });
      };

      const libs = await checkLibraries(4000);

      const Matter = (window as any).Matter || null;
      const gsap = (window as any).gsap || null;
      const ScrollTrigger = (window as any).ScrollTrigger || null;

      // If Matter is missing, we'll fallback to a GSAP-only drop animation, or simple show
      const useMatter = !!Matter;
      const useGsap = !!gsap;

      const { Engine, World, Bodies, Runner, Body } = Matter || {};

      let engine: any, world: any, runner: any;
      let animationFrame: number;
      const section = sectionRef.current;
      if (!section) return;

      const circles = Array.from(section.querySelectorAll('.service-circle'));
      const radius = 138.5; // half of 277px
      const isMobile = window.innerWidth <= 768;

      // compute footer top to use as floor
      const footerEl = document.querySelector('footer');
      const footerTop = footerEl ? (footerEl.getBoundingClientRect().top + window.scrollY) : (document.body.scrollHeight);

      // If Matter is not available but GSAP is, use a simpler GSAP drop animation
      if (!useMatter && useGsap) {
        gsap.registerPlugin(ScrollTrigger);

        const sectionRect = section.getBoundingClientRect();
        const sectionLeft = sectionRect.left + window.scrollX;
        const sectionTop = sectionRect.top + window.scrollY;

        // Start circles centered in viewport
        const centerXDoc = window.scrollX + window.innerWidth / 2;
        const centerYDoc = window.scrollY + window.innerHeight / 2 - 100;

        circles.forEach((el: any, i) => {
          // position fixed to avoid affecting document height
          el.style.position = 'fixed';
          el.style.zIndex = '9999';
          el.style.opacity = '1';

          const startX = centerXDoc + (i - 1) * (radius * 0.6) - radius;
          const startY = centerYDoc - radius;

          // convert doc coords to viewport coords for fixed element
          el.style.left = `${startX - window.scrollX}px`;
          el.style.top = `${startY - window.scrollY}px`;
          el.style.transform = `rotate(${gsap.utils.random(-1,1)}rad)`;
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          onEnter: () => {
            const floorYDoc = sectionTop + sectionRect.height - 10; // land at bottom of last section
            const targetTop = floorYDoc - radius - window.scrollY;

            circles.forEach((el: any, i) => {
              gsap.to(el, {
                top: targetTop,
                duration: 1.2 + i * 0.12,
                ease: 'bounce.out',
                delay: i * 0.06,
                overwrite: true,
                onUpdate() {
                  // add subtle rotation during drop
                  const r = gsap.utils.random(-1, 1);
                  el.style.transform = `rotate(${r}rad)`;
                }
              });
            });
          }
        });

        return;
      }

      function createPhysicsWorld() {
        if (!section) return;
        
        engine = Engine.create();
        world = engine.world;
        runner = Runner.create();

        const sectionRect = section.getBoundingClientRect();
        const sectionLeft = sectionRect.left + window.scrollX;
        const sectionTop = sectionRect.top + window.scrollY;

        // floor positioned at bottom of this section (so circles land on last section before footer)
        const floorYDoc = sectionTop + sectionRect.height - 10; // document coord for floor
        const floorWidth = isMobile ? window.innerWidth : sectionRect.width + 400;
        const floorX = isMobile ? window.scrollX + window.innerWidth / 2 : sectionLeft + sectionRect.width / 2;
        const floor = Bodies.rectangle(floorX, floorYDoc, floorWidth, 60, { isStatic: true, restitution: 0.2 });

        // On mobile: walls at viewport edges, On desktop: walls at section edges
        let wallL, wallR;
        if (isMobile) {
          const wallHeight = sectionRect.height + 2000;
          const wallCenterY = sectionTop + sectionRect.height / 2;
          // Left wall - positioned at left edge of viewport (document coords)
          wallL = Bodies.rectangle(window.scrollX + radius, wallCenterY, 40, wallHeight, { 
            isStatic: true, 
            restitution: 0.3,
            friction: 0.5 
          });
          // Right wall - positioned at right edge of viewport (document coords)
          wallR = Bodies.rectangle(window.scrollX + window.innerWidth - radius, wallCenterY, 40, wallHeight, { 
            isStatic: true, 
            restitution: 0.3,
            friction: 0.5 
          });
        } else {
          wallL = Bodies.rectangle(sectionLeft - 50, sectionTop + sectionRect.height / 2, 100, sectionRect.height + 600, { isStatic: true, restitution: 0.8 });
          wallR = Bodies.rectangle(sectionLeft + sectionRect.width + 50, sectionTop + sectionRect.height / 2, 100, sectionRect.height + 600, { isStatic: true, restitution: 0.8 });
        }
        World.add(world, [floor, wallL, wallR]);

        const bubbles = circles.map((el: any, i) => {
          el.style.opacity = "1";
          el.style.display = "flex";
          el.style.position = "fixed"; // fixed so they don't affect page height
          el.style.transform = 'none';
          el.style.zIndex = "9999";

          // start centered horizontally, staggered vertically from top (document coords for physics)
          let xDoc, yDoc;
          
          if (isMobile) {
            // On mobile: all start at center horizontally, staggered vertically above section
            xDoc = sectionLeft + sectionRect.width / 2;
            yDoc = sectionTop - 300 - (i * 200); // stagger vertically so they drop in sequence
          } else {
            // On desktop: start with horizontal spread
            xDoc = sectionLeft + sectionRect.width / 2 + (i - 1) * (radius * 0.6);
            yDoc = sectionTop + 200 - Math.random() * 40;
          }

          const body = Bodies.circle(xDoc, yDoc, radius, {
            restitution: isMobile ? 0.2 : 0.6, // Very little bounce on mobile
            friction: isMobile ? 0.3 : 0.1, // More friction on mobile
            frictionAir: isMobile ? 0.01 : 0.02,
            density: 0.002
          });

          // give them some initial spin and sideways force
          if (isMobile) {
            // On mobile: no horizontal movement, straight drop
            Body.setAngularVelocity(body, 0);
            Body.setVelocity(body, {
              x: 0, // No horizontal movement
              y: 4 // Consistent drop speed
            });
          } else {
            // On desktop: more dynamic physics
            Body.setAngularVelocity(body, gsap.utils.random(-0.3, 0.3));
            Body.setVelocity(body, {
              x: gsap.utils.random(-3, 3),
              y: gsap.utils.random(2, 6)
            });
          }

          World.add(world, body);
          return { el, body };
        });

        function animate() {
          let allStatic = true;

          bubbles.forEach(({ el, body }: any) => {
            // compute speed magnitude
            const speed = Math.sqrt(body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y);

            // If body has reached floor (document coord) and is slow, make it static so it stops without jittering
            if (!body.isStatic && body.position.y >= floorYDoc - 6 && speed < 0.5) {
              try { Body.setStatic(body, true); } catch (e) {}
            }
            if (!body.isStatic) allStatic = false;

            // For fixed positioning, convert document coords to viewport coords
            const leftViewport = body.position.x - radius - window.scrollX;
            const topViewport = body.position.y - radius - window.scrollY;

            el.style.left = `${leftViewport}px`;
            el.style.top = `${topViewport}px`;

            // Apply rotation based on body.angle
            el.style.transform = `rotate(${body.angle}rad)`;
          });

          if (allStatic) {
            // stop physics loop
            cancelAnimationFrame(animationFrame);
            try { Runner.stop(runner); } catch (e) {}
            return;
          }

          animationFrame = requestAnimationFrame(animate);
        }

        Runner.run(runner, engine);
        animate();
      }

      function clearPhysicsWorld() {
        if (engine) {
          cancelAnimationFrame(animationFrame);
          Runner.stop(runner);
          World.clear(world);
          Engine.clear(engine);
          engine = null;
          world = null;
          runner = null;
        }

        // Keep circles visible and keep their final transform so they appear landed
        circles.forEach((el: any) => {
          el.style.transition = "";
          el.style.opacity = "1";
          el.style.display = "flex";
        });

        // Do not clear transform props so elements remain where physics placed them
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          clearPhysicsWorld();
          createPhysicsWorld();
        },
        onEnterBack: () => {
          clearPhysicsWorld();
          createPhysicsWorld();
        },
        onLeaveBack: () => {
          if (runner) Runner.stop(runner);
          cancelAnimationFrame(animationFrame);

          // animate fixed elements out of viewport downward
          const targetTopViewport = window.innerHeight + 300;
          gsap.to(circles, {
            top: targetTopViewport,
            duration: () => gsap.utils.random(0.6, 1.4),
            delay: () => gsap.utils.random(0, 0.4),
            ease: "power2.in",
            overwrite: true
          });
        }
      });

      const handleResize = () => {
        if (engine) {
          clearPhysicsWorld();
          createPhysicsWorld();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearPhysicsWorld();
      };
    };

    loadPhysicsAnimation();
  }, [mounted]);

  if (!mounted) return <div />;

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="hero-image-wrapper">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/a056edc7a36d1c06ac38264667fdd6f4f759149f?width=2400" 
            alt="MadaraVet Services" 
            className="hero-banner"
          />
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/a34c1bcf3a52820f290388bdab8f338f6902a4cb?width=475" 
            alt="Logo" 
            className="hero-logo"
          />
          <svg className="hero-circle hero-circle-1" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="29.7558" cy="29.7558" r="27.7558" stroke="white" strokeWidth="4"/>
          </svg>
          <svg className="hero-circle hero-circle-2" width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22.6306" cy="22.6306" r="20.6306" stroke="#1872D9" strokeWidth="4"/>
          </svg>
          <svg className="hero-circle hero-circle-3" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15.8064" cy="15.8064" r="15.8064" fill="#1872D9"/>
          </svg>
          <svg className="hero-circle hero-circle-4" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12.0439" cy="12.0439" r="12.0439" fill="white"/>
          </svg>
        </div>
      </section>

      <section className="services-title">
        <h1 className="title-text">
          <span className="title-blue" data-i18n="company_name">Мадара вет</span>
          {' '}
          <span className="title-red" data-i18n="services_heading">УСЛУГИ</span>
        </h1>
      </section>

      <section className="services-description">
        <div className="description-container">
          <div className="description-text" data-i18n="services_description">
            Ние сме модерен ветеринарен кабинет в самия център на София и предлагаме цялостна гама висококачествени услуги за вашия домашен любимец. Основната дейност на нашия кабинет е лечение и профилактика на болестите при кучетата, котките, гризачите и другите домашни животни.<br /><br />Екипът ни с радост ще ви консултира както при избора на нов домашен любимец, така и след неговото придобиване. Изготвяме индивидуални планове за хранене, обезпаразитяване и ваксинация на нашите пациенти. Наред с адекватна профилактика и лечение на домашните животни, Мадара Вет предлага широка гама диагностични изследвания и тестове, както и редица хирургични интервенции и стационарно лечение в рамките на деня.<br /><br />Също така ние можем да се погрижим и за красивия външен вид на вашият любимец: кабинетът предлага разнообразни фризьорски услуги за кучета и котки и стоматологични процедури за зъбен камък.<br /><br />Ние, екипът на Мадара Вет, ви очакваме!
          </div>
        </div>
      </section>

      <section ref={sectionRef} className="services-cards">
        <div className="cards-wrapper">
          <div className="service-image-container">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/faec516e4685c7a35f85075370206aaf70ddc0f9?width=870" 
              alt="Kitten" 
              className="service-main-image"
            />
          </div>
          
          <div className="service-circles">
            <div className="service-circle service-circle-green">
              <div className="circle-icon-wrapper">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/2502f593de911d2af0e17fa025aec209fd0f196c?width=120" 
                  alt="Test icon" 
                  className="circle-icon"
                />
              </div>
              <h3 className="circle-title" data-i18n="section3_card1">ДИАГНОСТИЧНИ<br />ТЕСТОВЕ</h3>
            </div>

            <div className="service-circle service-circle-cyan">
              <div className="circle-icon-wrapper">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/db17e0bd97d0efaee3f0ff160bb4dcd9a9824b1c?width=120" 
                  alt="Hospital icon" 
                  className="circle-icon"
                />
              </div>
              <h3 className="circle-title" data-i18n="section3_card3">ХИРУРГИЧНО<br />ЛЕЧЕНИЕ</h3>
            </div>

            <div className="service-circle service-circle-pink">
              <div className="circle-icon-wrapper circle-icon-right">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/0148673fb5abbf3e3d21120016a4739cb9d13357?width=120" 
                  alt="Dog icon" 
                  className="circle-icon"
                />
              </div>
              <h3 className="circle-title circle-title-right" data-i18n="section3_card2">ИНДИВИДУАЛНО<br />НАСОЧЕНА<br />ПРОФИЛАКТИКА</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
