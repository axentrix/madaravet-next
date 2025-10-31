'use client';

import { useEffect, useRef } from 'react';

export default function MembershipSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const membershipCardRef = useRef<HTMLDivElement>(null);
  const internshipCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
      gsap.registerPlugin(ScrollTrigger);

      const image = imageRef.current;
      const logo = logoRef.current;
      const membershipCard = membershipCardRef.current;
      const internshipCard = internshipCardRef.current;

      if (!image || !logo || !membershipCard || !internshipCard) return;

      gsap.set(image, { x: 50, opacity: 0 });
      gsap.set(logo, { scale: 0.5, opacity: 0 });
      gsap.set(membershipCard, { x: -100, opacity: 0 });
      gsap.set(internshipCard, { x: 100, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1,
          toggleActions: 'play reverse play reverse'
        }
      });

      tl.to(image, { x: 0, opacity: 1, duration: 1 }, 0)
        .to(logo, { scale: 1, opacity: 1, duration: 1 }, 0.2)
        .to(membershipCard, { x: 0, opacity: 1, duration: 1 }, 0.3)
        .to(internshipCard, { x: 0, opacity: 1, duration: 1 }, 0.4);
    };

    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} className="membership-section py-16 md:py-24">
      <div className="membership-container">
        <div className="membership-grid">
          
          <div className="membership-card" ref={membershipCardRef}>
            <p className="membership-text">
              Член е на Българския ветеринарен съюз и на Немската асоциация на ветеринарните лекари (Deutche Tierärztekammer).
            </p>
          </div>

          <div className="membership-image-wrapper">
            <img 
              ref={imageRef}
              src="https://api.builder.io/api/v1/image/assets/TEMP/15898fbe6f12a68965017813f45627e5743e89f1?width=963" 
              alt="Dr. Yuliana Sokolova with dog"
              className="membership-image"
            />
          </div>

          <div className="membership-logo-wrapper">
            <img 
              ref={logoRef}
              src="https://api.builder.io/api/v1/image/assets/TEMP/11e3b4f043a4a62984ec65e650790e850e7d08a3?width=554" 
              alt="Deutscher Tierschutzbund logo" 
              className="membership-logo"
            />
          </div>

          <div className="internship-card" ref={internshipCardRef}>
            <p className="internship-text">
              Провела е стажове в:<br />
              • Дуисбург (Ветеринарна клиника Кайзерберг)<br />
              • Бохум (Клиника „Д-р Хесе")<br />
              • Марбург (Клиника „Д-р Бирке")
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
