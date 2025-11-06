"use client";

export default function ContactPage() {
  return (
    <div id="contact-page" className="contact-page page-contact">
      <section className="contact-hero">
        <div className="hero-banner-wrapper">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/ec41bb7093e610d71d15c9b52b2acae8209657e8?width=2400"
            alt="MadaraVet Contact"
            className="hero-banner-image"
            data-i18n-alt="contact_hero_alt"
          />
        </div>
      </section>

      <section className="contact-title">
        <h1 className="title-text" data-i18n="contact_title" suppressHydrationWarning>КОНТАКТИ</h1>
      </section>

      <section className="contact-content">
        <div className="content-wrapper">
          <div className="info-cards">
            <div className="address-card">
              <h2 className="address-title" data-i18n="contact_address_label" suppressHydrationWarning>Адрес на кабинета</h2>
              <p className="address-text" data-i18n="contact_address_text" suppressHydrationWarning>
                Тел: 024428585, 0888198585 ул. Тунджа 22 1606 София
              </p>
            </div>

            <div className="map-card">
              <h3 className="map-title" data-i18n="contact_find_us" suppressHydrationWarning>Намерете ни на картата</h3>
            </div>
          </div>

          <div className="map-wrapper">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/0a2132d26a82191b6bd4e5a61054101aa2155574?width=3840"
              alt="Location Map"
              className="map-image"
              data-i18n-alt="contact_map_alt"
            />
          </div>
        </div>
      </section>

      <section className="contact-hours" id="hours">
        <div className="hours-circle">
          <h2 className="hours-main-title" data-i18n="section5_title1" suppressHydrationWarning>МАДАРАВЕТ</h2>
          <h3 className="hours-subtitle" data-i18n="section5_title2" suppressHydrationWarning>РАБОТНО ВРЕМЕ</h3>

          <div className="hours-schedule">
            <div className="schedule-row">
              <div className="day-label" data-i18n="mon" suppressHydrationWarning>ПОН</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label" data-i18n="tue" suppressHydrationWarning>ВТОРНИК</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label" data-i18n="wed" suppressHydrationWarning>СРЯДА</div>
              <div className="time-slot"></div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label" data-i18n="thu" suppressHydrationWarning>ЧЕТВ</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label" data-i18n="fri" suppressHydrationWarning>ПЕТЪК</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label" data-i18n="sat" suppressHydrationWarning>СЪБОТА</div>
              <div className="time-slot">10:00 - 13:00</div>
              <div className="time-slot empty"></div>
            </div>

            <div className="schedule-row">
              <div className="day-label" data-i18n="sun" suppressHydrationWarning>НЕДЕЛЯ</div>
              <div className="time-slot closed" data-i18n="dayoff" suppressHydrationWarning>ПОЧИВЕН ДЕН</div>
            </div>

            <div className="schedule-row">
              <div className="day-label" data-i18n="holiday" suppressHydrationWarning>ОФИЦИАЛЕН ПРАЗНИК</div>
              <div className="time-slot closed" data-i18n="dayoff" suppressHydrationWarning>ПОЧИВЕН ДЕН</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
