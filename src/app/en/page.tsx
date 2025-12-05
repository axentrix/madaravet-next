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
    </div>
  );
}
