'use client';

import { useTranslation } from './TranslationProvider';

export default function MembershipSection() {
  const { t } = useTranslation();

  return (
    <section className="membership-section-new w-full max-w-screen-xl mx-auto px-4 py-12">
      <div className="membership-content flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-11">
        {/* Left Column - Text Content */}
        <div className="membership-text-column flex flex-col justify-center items-start gap-12 lg:gap-[85px] flex-1 max-w-full lg:max-w-[400px]">
          {/* Membership Text */}
          <div className="membership-info-card flex flex-col justify-center items-start gap-2.5 w-full rounded-[24px]">
            <div className="membership-info-text w-full text-[#303030] font-raleway text-[16px] md:text-[18px] font-normal leading-[1.8]">
              <span suppressHydrationWarning data-i18n="membership_text">
                Член е на Българския ветеринарен съюз и на Немската асоциация на ветеринарните лекари (Deutche Tierärztekammer).
              </span>
            </div>
          </div>

          {/* Internship Text */}
          <div className="internship-info-card flex flex-col justify-center items-start gap-2.5 w-full rounded-[24px]">
            <div className="internship-info-text w-full text-[#303030] font-raleway text-[16px] md:text-[18px] font-normal leading-[1.8] whitespace-pre-line">
              <span suppressHydrationWarning data-i18n="internship_text">
                Провела е стажове в:
Дуисбург (Ветеринарна клиника Кайзерберг)
Бохум (Клиника „Д-р Хесе")
Марбург (Клиника „Д-р Бирке")
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="membership-image-column flex flex-col items-center relative w-full lg:w-[482px] flex-shrink-0">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/e5ce8d9c364b837e1b56d2cda6bb216aa878c00a?width=963" 
            alt="Д-р Юлиана Соколова"
            className="membership-doctor-image w-full max-w-[482px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
