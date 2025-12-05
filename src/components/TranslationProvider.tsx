"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Translations = Record<string, Record<string, string>>;

const TranslationContext = createContext<{ t: (key: string) => string; locale: string; setLocale: (l: string) => void }>({
  t: (k) => k,
  locale: "bg",
  setLocale: () => {}
});

export function useTranslation() {
  return useContext(TranslationContext);
}

export default function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [locale, setLocale] = useState<string>('bg');

  // Load locale from localStorage after hydration
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('site_locale');
      if (saved && saved !== locale) {
        setLocale(saved);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch('/lang.json').then(res => res.json()).then((data) => {
      if (!mounted) return;
      setTranslations(data);
    }).catch((e) => {
      console.warn('Failed to load translations', e);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('site_locale', locale);
        document.documentElement.lang = locale;
      }
    } catch (e) {}
  }, [locale]);

  // Apply translations to any non-React DOM nodes (or nodes using data-i18n attributes)
  useEffect(() => {
    if (!translations) return;
    const apply = () => {
      const dict = translations[locale] || {};
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n') || '';
        const val = (dict[key] ?? translations['en']?.[key]);
        if (typeof val !== 'undefined') {
          (el as HTMLElement).innerHTML = val;
        }
      });
      document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
        const key = el.getAttribute('data-i18n-alt') || '';
        const val = (dict[key] ?? translations['en']?.[key]);
        if (typeof val !== 'undefined' && el instanceof HTMLImageElement) {
          el.alt = val;
        }
      });
    };
    apply();
    const t = setTimeout(apply, 100);
    return () => clearTimeout(t);
  }, [translations, locale]);

  const tFunc = (key: string) => {
    if (!translations) return key;
    const primary = translations[locale]?.[key];
    if (typeof primary !== 'undefined') return primary;
    const fallback = translations['en']?.[key];
    return typeof fallback !== 'undefined' ? fallback : key;
  };

  const setLocaleWrapper = (l: string) => {
    // update only if translations available and locale exists, otherwise still set
    if (translations && !translations[l]) {
      console.warn('Requested locale not available:', l);
    }
    try { if (typeof window !== 'undefined') window.localStorage.setItem('site_locale', l); } catch (e) {}
    setLocale(l);
  };

  return (
    <TranslationContext.Provider value={{ t: tFunc, locale, setLocale: setLocaleWrapper }}>
      {children}
    </TranslationContext.Provider>
  );
}
