"use client";

import React from "react";
import { useTranslation } from './TranslationProvider';

export default function Footer() {
  const { t } = useTranslation();
  return (
    // Section 11: Footer
    <footer className="bg-[#11294B] text-white text-center py-10">
      <img src="/images/logo_white.svg" alt="Logo White" className="mx-auto w-32 mb-6" />
      <div className="flex justify-center gap-6 mb-4">
        <a href="#"><img suppressHydrationWarning src="/images/fb.svg" alt="social_facebook" data-i18n-alt="social_facebook" className="w-6 h-6" /></a>
        <a href="#"><img suppressHydrationWarning src="/images/instagram.svg" alt="social_instagram" data-i18n-alt="social_instagram" className="w-6 h-6" /></a>
        <a href="#"><img suppressHydrationWarning src="/images/whatapp.svg" alt="social_whatsapp" data-i18n-alt="social_whatsapp" className="w-6 h-6" /></a>
      </div>
      <p suppressHydrationWarning className="text-lg" data-i18n="photos">photos</p>
      <p suppressHydrationWarning className="text-lg" data-i18n="copyright">copyright</p>

    </footer>
  );
}
