'use client';

import { useTranslation } from './TranslationProvider';

export default function OwnerSection() {
  const { t } = useTranslation();

  return (
    <section className="owner-section-new w-full max-w-screen-xl mx-auto px-4 py-12">
      <div className="owner-content flex flex-col lg:flex-row items-center justify-center gap-0">
        {/* Left - Doctor Image */}
        <div className="owner-image-container flex-shrink-0">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/162a45b1f8aeaf482997e94404164e4f4972cfa2?width=829" 
            alt="Д-р Юлиана Соколова"
            className="owner-doctor-image w-full lg:w-[414px] h-auto object-contain"
          />
        </div>

        {/* Right - Info Container */}
        <div className="owner-info-wrapper relative w-full lg:w-auto flex items-center justify-center">
          <div className="owner-info-container flex flex-col items-start gap-8 p-8 w-full max-w-[472px] min-h-[281px]">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/fe1bdd9c428249fffc1cbd019d7e3ecb5d256f59?width=263" 
              alt="MadaraVet Logo"
              className="owner-logo h-auto"
            />
            
            <div className="owner-description max-w-[335px] text-[#303030] font-raleway text-[16px] md:text-[18px] font-normal leading-[1.8]">
              <span suppressHydrationWarning data-i18n="owner_text">
                От 2014 е собственик и управител на Мадара Вет.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
