"use client";
import React from 'react';

export default function WorkingHoursSection() {
  return (
    <section className="working-hours-section">
      <div className="working-hours-container">
        <div className="hours-content">
          <h2 className="hours-title" suppressHydrationWarning data-i18n="section5_worktime">Работно време</h2>
          
          <div className="schedule-table">
            <div className="schedule-row">
              <span className="day-name" suppressHydrationWarning data-i18n="day_mon">пон</span>
              <span className="time-morning">9:00 - 12:00</span>
              <span className="time-afternoon">15:00 - 19:00</span>
            </div>
            
            <div className="schedule-row">
              <span className="day-name" suppressHydrationWarning data-i18n="day_tue">вторник</span>
              <span className="time-morning">9:00 - 12:00</span>
              <span className="time-afternoon">15:00 - 19:00</span>
            </div>
            
            <div className="schedule-row">
              <span className="day-name" suppressHydrationWarning data-i18n="day_wed">сряда</span>
              <span className="time-morning"></span>
              <span className="time-afternoon">15:00 - 19:00</span>
            </div>
            
            <div className="schedule-row">
              <span className="day-name" suppressHydrationWarning data-i18n="day_thu">четв</span>
              <span className="time-morning">9:00 - 12:00</span>
              <span className="time-afternoon">15:00 - 19:00</span>
            </div>
            
            <div className="schedule-row">
              <span className="day-name" suppressHydrationWarning data-i18n="day_fri">петък</span>
              <span className="time-morning">9:00 - 12:00</span>
              <span className="time-afternoon">15:00 - 19:00</span>
            </div>
            
            <div className="schedule-row">
              <span className="day-name" suppressHydrationWarning data-i18n="day_sat">събота</span>
              <span className="time-morning">10:00 - 13:00</span>
              <span className="time-afternoon"></span>
            </div>
            
            <div className="schedule-row">
              <span className="day-name" suppressHydrationWarning data-i18n="day_sun">неделя</span>
              <span className="time-special" suppressHydrationWarning data-i18n="off">почивен ден</span>
              <span className="time-afternoon"></span>
            </div>
            
            <div className="schedule-row">
              <span className="day-name" suppressHydrationWarning data-i18n="day_holiday">официален празник</span>
              <span className="time-special" suppressHydrationWarning data-i18n="off">почивен ден</span>
              <span className="time-afternoon"></span>
            </div>
          </div>
        </div>
        
        <div className="hours-image-wrapper">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/308ca62ad79a6ae658ebc5dc5106f40826f8f4aa?width=1240" 
            alt="Veterinary clinic staff" 
            className="hours-image"
          />
        </div>
      </div>
    </section>
  );
}
