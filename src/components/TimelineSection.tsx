'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from './TranslationProvider';

export default function TimelineSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only run animations on desktop
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const loadGSAP = async () => {
      // Prefer global GSAP from CDN if available
      const gsap = (window as any).gsap || (await import('gsap')).default;
      const ScrollTrigger = (window as any).ScrollTrigger || (await import('gsap/ScrollTrigger')).default;
      
      if (!gsap || !ScrollTrigger) {
        console.warn('GSAP or ScrollTrigger not available');
        return;
      }
      
      gsap.registerPlugin(ScrollTrigger);

      const cards = cardsRef.current.filter(Boolean);
      const title = titleRef.current;

      if (!cards.length || !title) return;

      // Set initial state - all cards centered with opacity
      gsap.set(cards, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1
      });

      gsap.set(title, {
        opacity: 0,
        scale: 0.8
      });

      // Create disperse animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1,
          toggleActions: 'play reverse play reverse'
        }
      });

      // Disperse cards outward in different directions
      tl.to(cards[0], { x: -280, y: -180, scale: 0.95, duration: 1 }, 0)
        .to(cards[1], { x: 280, y: -150, scale: 0.95, duration: 1 }, 0)
        .to(cards[2], { x: -200, y: 200, scale: 0.95, duration: 1 }, 0)
        .to(cards[3], { x: 200, y: 180, scale: 0.95, duration: 1 }, 0)
        .to(cards[4], { x: 0, y: -280, scale: 0.95, duration: 1 }, 0)
        .to(title, { opacity: 1, scale: 1, duration: 0.8 }, 0.3);
    };

    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} className="timeline-section py-24 md:py-32 relative overflow-hidden">
      <div className="timeline-container px-4">
        {/* Title - visible on mobile, animated on desktop */}
        <h2 
          ref={titleRef}
          className="timeline-title block md:absolute z-10 text-center uppercase font-bold text-[#09284B] mb-8 md:mb-0"
          suppressHydrationWarning
          data-i18n="timeline_title"
        >
          {t('timeline_title')}
        </h2>

        <div className="timeline-grid relative md:min-h-[800px] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">

          {/* Card 1 - 1992 (Pink) */}
          <div 
            ref={el => { cardsRef.current[0] = el; }}
            className="timeline-card card-1992 relative md:absolute w-full md:w-auto"
          >
            <div className="card-year">1992</div>
            <div className="card-text" suppressHydrationWarning data-i18n="timeline_1992">
              {t('timeline_1992')}
            </div>
          </div>

          {/* Card 2 - 1993-1996 (Yellow) */}
          <div 
            ref={el => { cardsRef.current[1] = el; }}
            className="timeline-card card-1993 relative md:absolute w-full md:w-auto"
          >
            <div className="card-year">1993-1996</div>
            <div className="card-text" suppressHydrationWarning data-i18n="timeline_1993_1996">
              {t('timeline_1993_1996')}
            </div>
          </div>

          {/* Card 3 - 2001 (Green) */}
          <div 
            ref={el => { cardsRef.current[2] = el; }}
            className="timeline-card card-2001 relative md:absolute w-full md:w-auto"
          >
            <div className="card-year">2001</div>
            <div className="card-text" suppressHydrationWarning data-i18n="timeline_2001">
              {t('timeline_2001')}
            </div>
          </div>

          {/* Card 4 - 2005 (Blue) */}
          <div 
            ref={el => { cardsRef.current[3] = el; }}
            className="timeline-card card-2005 relative md:absolute w-full md:w-auto"
          >
            <div className="card-year">2005</div>
            <div className="card-text" suppressHydrationWarning data-i18n="timeline_2005">
              {t('timeline_2005')}
            </div>
          </div>

          {/* Photo card */}
          <div 
            ref={el => { cardsRef.current[4] = el; }}
            className="timeline-card card-photo relative md:absolute w-full md:w-auto"
          >
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/8c79fa4446a479806f0d11a64004d98ef9308f84?width=572" 
              alt="Dr. Yuliana Sokolova" 
              className="card-image"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
