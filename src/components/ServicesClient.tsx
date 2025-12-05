'use client';

import { useEffect, useRef, useState } from 'react';

export default function ServicesClient() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    // No scripts needed - physics animations removed
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;

    // Physics animations removed from services page
    const section = sectionRef.current;
    if (!section) return;

    const circles = Array.from(section.querySelectorAll('.service-circle'));
    circles.forEach((el: any) => {
      el.style.opacity = "1";
      el.style.display = "flex";
    });
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
