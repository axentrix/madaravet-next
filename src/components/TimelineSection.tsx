'use client';

import { useTranslation } from './TranslationProvider';

export default function TimelineSection() {
  const { t } = useTranslation();

  return (
    <section className="timeline-section-new w-full max-w-screen-xl mx-auto px-4 py-12">
      <div className="timeline-content flex flex-col lg:flex-row items-start gap-6">
        {/* Left Column - Timeline */}
        <div className="timeline-left flex flex-col items-start gap-6 flex-1">
          <h2 className="timeline-main-title text-[#4868EC] font-raleway text-[28px] md:text-[42px] font-bold leading-[1.3] tracking-tight">
            <span suppressHydrationWarning data-i18n="timeline_title">
              Д-р Юлиана Соколова
            </span>
          </h2>

          <div className="timeline-entries flex flex-col items-start gap-6 w-full">
            {/* Entry 1992 */}
            <div className="timeline-entry flex flex-col justify-center items-start gap-2.5 w-full">
              <div className="entry-year text-[#4868EC] font-raleway text-[24px] md:text-[32px] font-bold leading-[1] tracking-tight">
                1992
              </div>
              <div className="entry-text text-[#303030] font-raleway text-[16px] md:text-[18px] font-normal leading-[1.8]">
                <span suppressHydrationWarning data-i18n="timeline_1992">
                  През 1993 завършва Френска езикова гимназия „Алфонс дьо Ламартин" гр. София.
                </span>
              </div>
            </div>

            {/* Entry 2005 */}
            <div className="timeline-entry flex flex-col justify-center items-start gap-2.5 w-full">
              <div className="entry-year text-[#4868EC] font-raleway text-[24px] md:text-[32px] font-bold leading-[1] tracking-tight">
                2005
              </div>
              <div className="entry-text text-[#303030] font-raleway text-[16px] md:text-[18px] font-normal leading-[1.8]">
                <span suppressHydrationWarning data-i18n="timeline_2005">
                  придобива докторска степен по Ветеринарна медицина в Юстус Либиг университет, Гийсен, Германия.
                </span>
              </div>
            </div>

            {/* Entry 1993-1996 */}
            <div className="timeline-entry flex flex-col justify-center items-start gap-2.5 w-full">
              <div className="entry-year text-[#4868EC] font-raleway text-[24px] md:text-[32px] font-bold leading-[1] tracking-tight">
                1993-1996
              </div>
              <div className="entry-text text-[#303030] font-raleway text-[16px] md:text-[18px] font-normal leading-[1.8]">
                <span suppressHydrationWarning data-i18n="timeline_1993_1996">
                  следва Ветеринарна медицина в Тракийски университет, гр. Стара Загора.
                </span>
              </div>
            </div>

            {/* Entry 2001 */}
            <div className="timeline-entry flex flex-col justify-center items-start gap-2.5 w-full">
              <div className="entry-year text-[#4868EC] font-raleway text-[24px] md:text-[32px] font-bold leading-[1] tracking-tight">
                2001
              </div>
              <div className="entry-text text-[#303030] font-raleway text-[16px] md:text-[18px] font-normal leading-[1.8]">
                <span suppressHydrationWarning data-i18n="timeline_2001">
                  завършва ветеринарна медицина в Юстус Либиг университет, Гийсен, Германия.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="timeline-right flex-shrink-0 w-full lg:w-auto">
          <img 
            src="/images/1a24856c5cc134e75f8bd5c039afb786fae0f425.png"
            alt="Д-р Юлиана Соколова"
            className="timeline-doctor-image w-full lg:w-[573px] h-auto aspect-square rounded-[24px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
