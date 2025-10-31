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
        <a href="#"><img src="/images/fb.svg" alt={t('social_facebook') || 'Facebook'} className="w-6 h-6" /></a>
        <a href="#"><img src="/images/instagram.svg" alt={t('social_instagram') || 'Instagram'} className="w-6 h-6" /></a>
        <a href="#"><img src="/images/whatapp.svg" alt={t('social_whatsapp') || 'WhatsApp'} className="w-6 h-6" /></a>
      </div>
      <p className="text-lg">{t('photos') || 'Фотографии: Fotorismi'}</p>
      <p className="text-lg">{t('copyright') || '© 2025 MadaraVet. Всички права запазени.'}</p>

    </footer>
  );
}
