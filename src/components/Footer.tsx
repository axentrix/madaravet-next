"use client";

import React from "react";
import Link from 'next/link';
import { useTranslation } from './TranslationProvider';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#11294B] text-white text-center py-10">
      {/* Mobile-only contact info */}
      <div className="md:hidden flex flex-col items-center gap-2 mb-6 text-base">
        <span suppressHydrationWarning className="text-white" data-i18n="header_worktime">header_worktime</span>
        <span suppressHydrationWarning className="text-white" data-i18n="header_phone1">header_phone1</span>
        <span suppressHydrationWarning className="text-white" data-i18n="header_phone2">header_phone2</span>
      </div>

      <Link href="https://www.madaravet.com" aria-label="Home" className="inline-block">
        <img src="/images/logo_white.svg" alt="Logo White" className="mx-auto w-32 mb-6" />
      </Link>
      <div className="flex justify-center gap-6 mb-4">
        <a href="https://www.facebook.com/madaravet"><img suppressHydrationWarning src="/images/fb.svg" alt="social_facebook" data-i18n-alt="social_facebook" className="w-6 h-6" /></a>
        <a href="https://www.instagram.com/madaravet/"><img suppressHydrationWarning src="/images/instagram.svg" alt="social_instagram" data-i18n-alt="social_instagram" className="w-6 h-6" /></a>
        <a href="https://wa.me/359888198585"><img suppressHydrationWarning src="/images/whatapp.svg" alt="social_whatsapp" data-i18n-alt="social_whatsapp" className="w-6 h-6" /></a>
      </div>
      <Link href="https://www.madaravet.com" aria-label="Home" className="inline-block">
        <img src="/images/logo_white.svg" alt="Logo White" className="mx-auto w-32 mb-6" />
      </Link>
      <div className="flex justify-center gap-6 mb-4">
        <a href="https://www.facebook.com/madaravet"><img suppressHydrationWarning src="/images/fb.svg" alt="social_facebook" data-i18n-alt="social_facebook" className="w-6 h-6" /></a>
        <a href="https://www.instagram.com/madaravet/"><img suppressHydrationWarning src="/images/instagram.svg" alt="social_instagram" data-i18n-alt="social_instagram" className="w-6 h-6" /></a>
        <a href="https://wa.me/359888198585"><img suppressHydrationWarning src="/images/whatapp.svg" alt="social_whatsapp" data-i18n-alt="social_whatsapp" className="w-6 h-6" /></a>
      </div>
      <p suppressHydrationWarning className="text-lg" data-i18n="photos">photos</p>
      <p suppressHydrationWarning className="text-lg" data-i18n="copyright">copyright</p>

    </footer>
  );
}
