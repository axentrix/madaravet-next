"use client";

import React from "react";
import Link from 'next/link';
import { useTranslation } from './TranslationProvider';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="footer-wrapper w-full py-6">
      <div className="footer-container max-w-screen-xl mx-auto">
        <div className="footer-content bg-[#182559] rounded-[24px] px-6 md:px-11 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="footer-left flex flex-col items-start gap-6 w-full md:w-auto">
            <Link href="/" prefetch={false} aria-label="Home" className="footer-logo-link">
              <img 
                src="/images/4f01c17a3e7c7e39392bda7cb892bf8d0eb1683d.png"
                alt="MadaraVet Logo"
                className="footer-logo max-w-[256px] w-full h-auto"
              />
            </Link>
            
            <div className="footer-credits flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="photo-credit text-white text-xs font-raleway">
                <span suppressHydrationWarning data-i18n="footer_photos">Фотографии: </span>
                <a 
                  href="https://www.facebook.com/p/Fotorismi-100063472399562/" 
                  className="underline hover:opacity-80 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                  suppressHydrationWarning
                >
                
                </a>
              </div>
              
              <div className="copyright text-white text-xs font-raleway">
                <span suppressHydrationWarning data-i18n="footer_rights">© 2025 MadaraVet. Всички права запазени.</span>
              </div>
            </div>
          </div>
          
          <div className="footer-right flex flex-col items-start md:items-end gap-1 w-full md:w-auto">
            <a 
              href="https://www.facebook.com/madaravet" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="footer-social-icon hover:opacity-80 transition-opacity"
            >
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
              >
                <path 
                  d="M29.3334 16C29.3334 8.63996 23.36 2.66663 16 2.66663C8.64002 2.66663 2.66669 8.63996 2.66669 16C2.66669 22.4533 7.25335 27.8266 13.3334 29.0666V20H10.6667V16H13.3334V12.6666C13.3334 10.0933 15.4267 7.99996 18 7.99996H21.3334V12H18.6667C17.9334 12 17.3334 12.6 17.3334 13.3333V16H21.3334V20H17.3334V29.2666C24.0667 28.6 29.3334 22.92 29.3334 16Z" 
                  fill="white"
                />
              </svg>
            </a>
            
            <div className="footer-address text-white text-sm font-raleway leading-6">
              <span suppressHydrationWarning data-i18n="section1_address">ул. Тунджа 22 1606 СофиЯ</span>
            </div>
            
            <div className="footer-phone text-white text-sm font-raleway leading-6">
              <a 
                href="tel:+359888198585" 
                className="hover:opacity-80 transition-opacity"
                suppressHydrationWarning
              >
                +888 198 585
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
