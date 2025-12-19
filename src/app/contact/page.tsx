"use client";

export default function ContactPage() {
  return (
    <div id="contact-page" className="contact-page page-contact">
      <section className="contact-hero">
        <div className="hero-banner-wrapper">
          <img
            src="/images/ec41bb7093e610d71d15c9b52b2acae8209657e8.png"
            alt="MadaraVet Contact"
            className="hero-banner-image"
            data-i18n-alt="contact_hero_alt"
          />
        </div>
      </section>



      <section className="contact-content">
        <div className="content-wrapper">
          <div className="info-cards">
            <div className="address-card">
              <h5 className="address-title" data-i18n="contact_address_label" suppressHydrationWarning>MadaraVet</h5>
              <p className="address-text" data-i18n="contact_address_text" suppressHydrationWarning>
                Тел: 024428585, 0888198585 ул. Тунджа 22 1606 София
              </p>
            </div>

           
          </div>

          <div className="map-wrapper">
            <img
              src="/images/0a2132d26a82191b6bd4e5a61054101aa2155574.png"
              alt="Location Map"
              className="map-image"
              data-i18n-alt="contact_map_alt"
            />
          </div>
        </div>
      </section>

      
    </div>
  );
}
