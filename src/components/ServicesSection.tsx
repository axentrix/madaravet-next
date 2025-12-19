'use client';

export default function ServicesSection() {
  return (
    <section id="section2" className="services-section mx-auto max-w-screen-xl flex flex-col items-center gap-6 w-full ">
      <h2 className="services-title text-[#2A2F35] text-[38px] font-bold leading-normal">
        <span suppressHydrationWarning data-i18n="doctor_name">Д-р Юлиана Соколова</span>
      </h2>

      <div className=" flex justify-center items-start gap-11 w-full flex-wrap">
        <div className="flex flex-col justify-center items-center gap-3 flex-1 min-w-[280px] h-[300px] rounded-[24px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/bf380c429ad7a98bf3e47059bc582cf3766eb963.png')" }}>
          <div className="service-label flex h-16 px-4 py-3 justify-center items-center gap-2.5 rounded-[48px] bg-white mt-auto mb-4">
            <span className="text-[#182559] text-lg font-bold leading-6" suppressHydrationWarning data-i18n="service1_label">Диагностични тестове</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 flex-1 min-w-[280px] h-[300px] rounded-[24px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/4f274a883bc24a9c47b65489bb8b87fe6c161054.png')" }}>
          <div className="service-label flex h-16 px-4 py-3 justify-center items-center gap-2.5 rounded-[48px] bg-white mt-auto mb-4">
            <span className="text-[#182559] text-lg font-bold leading-6" suppressHydrationWarning data-i18n="service2_label">Хирургично лечение</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 flex-1 min-w-[280px] h-[300px] rounded-[24px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/a0ab34c309401396fc970780fec9d5ed5f970158.png')" }}>
          <div className="service-label flex h-16 px-4 py-3 justify-center items-center gap-2.5 rounded-[48px] bg-white mt-auto mb-4">
            <span className="text-[#182559] text-lg font-bold leading-6" suppressHydrationWarning data-i18n="service3_label">Индивидуална профилактика  ❤️</span>
          </div>
        </div>
      </div>
    </section>
  );
}
