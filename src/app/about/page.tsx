import OwnerSection from '@/components/OwnerSection';
import MembershipSection from '@/components/MembershipSection';
import TimelineSection from '@/components/TimelineSection';

export default function AboutPage() {
  return (
    <div id="about-page" className="about-page page-about">
      <section className="hero-section flex flex-wrap justify-center items-center content-center gap-3 py-16 md:py-24 lg:py-32 px-4">
        <h1 className="title-text text-center uppercase leading-tight flex flex-wrap justify-center items-center gap-3">
          <span className="title-part title-blue" data-i18n="about_intro">Ние, екипът на</span>
    <img
            src="/images/aboutlogo.svg"
            alt="MadaraVet"
           
            data-i18n-alt="contact_hero_alt"
          />
          <span className="title-part">
            <span className="text-blue-primary" data-i18n="company_name">Мадара вет</span>
            <span className="text-red-primary">,</span>
          </span>
          <span className="title-part title-red" data-i18n="about_welcome">ви очакваме!</span>
        </h1>
      </section>

      <TimelineSection />
      <OwnerSection />
      <MembershipSection />
    </div>
  );
}
