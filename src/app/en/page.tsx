"use client";

import { useEffect } from 'react';
import { useTranslation } from '@/components/TranslationProvider';
import HomeClient from '@/components/HomeClient';

export default function EnglishPage() {
  const { setLocale } = useTranslation();

  useEffect(() => {
    // Set locale to English on mount
    setLocale('en');
  }, [setLocale]);

  return (
    <div id="home-page" className="page-home">
      <HomeClient />
      <div className="fixed top-[55%] left-6 flex flex-col gap-4 z-[99991]">
        <a href="https://www.facebook.com/madaravet" className="w-12 h-12 rounded-full bg-[#167DFF] flex items-center justify-center text-white shadow-lg hover:bg-[#145fc4] transition">
          <img src="/images/fb.svg" alt="Facebook" className="w-6 h-6"/>
        </a>
        <a href="https://www.instagram.com/madaravet/" className="w-12 h-12 rounded-full bg-[#167DFF] flex items-center justify-center text-white shadow-lg hover:bg-[#145fc4] transition">
          <img src="/images/instagram.svg" alt="Instagram" className="w-6 h-6"/>
        </a>
        <a href="https://wa.me/359888198585" className="w-12 h-12 rounded-full bg-[#167DFF] flex items-center justify-center text-white shadow-lg hover:bg-[#145fc4] transition">
          <img src="/images/whatapp.svg" alt="WhatsApp" className="w-6 h-6"/>
        </a>
      </div>
    </div>
  );
}
