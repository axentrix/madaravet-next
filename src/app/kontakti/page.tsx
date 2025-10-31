export default function KontaktiPage() {
  return (
    <div className="kontakti-page">
      <section className="kontakti-hero">
        <div className="hero-banner-wrapper">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/ec41bb7093e610d71d15c9b52b2acae8209657e8?width=2400"
            alt="MadaraVet Contact"
            className="hero-banner-image"
          />
        </div>
      </section>

      <section className="kontakti-title">
        <h1 className="title-text">КОНТАКТИ</h1>
      </section>

      <section className="kontakti-content">
        <div className="content-wrapper">
          <div className="info-cards">
            <div className="address-card">
              <h2 className="address-title">Адрес на кабинета</h2>
              <p className="address-text">
                За спешни случаи или за профилактика, можете да ни потърсите на: тел: 024428585, 0888198585 ул. Тунджа 22 1606 София
              </p>
            </div>

            <div className="map-card">
              <h3 className="map-title">Намерете ни накартата</h3>
            </div>
          </div>

          <div className="map-wrapper">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/0a2132d26a82191b6bd4e5a61054101aa2155574?width=3840"
              alt="Location Map"
              className="map-image"
            />
          </div>
        </div>
      </section>

      <section className="kontakti-hours">
        <div className="hours-circle">
          <h2 className="hours-main-title">МАДАРАВЕТ</h2>
          <h3 className="hours-subtitle">Работно време</h3>

          <div className="hours-schedule">
            <div className="schedule-row">
              <div className="day-label">пон</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label">ВТОРНИК</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label">СРЯДА</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label">ЧЕТВ</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label">ПЕТЪК</div>
              <div className="time-slot">9:00 - 12:00</div>
              <div className="time-slot">15:00 - 19:00</div>
            </div>

            <div className="schedule-row">
              <div className="day-label">СЪБОТА</div>
              <div className="time-slot">10:00 - 13:00</div>
              <div className="time-slot empty"></div>
            </div>

            <div className="schedule-row">
              <div className="day-label">НЕДЕЛЯ</div>
              <div className="time-slot closed">ПОЧИВЕН ДЕН</div>
            </div>

            <div className="schedule-row">
              <div className="day-label">ОФИЦИАЛЕН ПРАЗНИК</div>
              <div className="time-slot closed">ПОЧИВЕН ДЕН</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
