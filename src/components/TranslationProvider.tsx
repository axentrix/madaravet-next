"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  
  // Initialize locale based on pathname (works in both SSR and client)
  const initialLocale = pathname.startsWith('/en') ? 'en' : 'bg';
  
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [locale, setLocale] = useState<string>(initialLocale);

  // Detect locale from pathname
  useEffect(() => {
    const pathLocale = pathname.startsWith('/en') ? 'en' : 'bg';
    if (pathLocale !== locale) {
      console.log('Locale change detected:', { pathname, pathLocale, currentLocale: locale });
      setLocale(pathLocale);
    }
  }, [pathname, locale]);

  // Reinitialize swiper when navigating to home page
  useEffect(() => {
    const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/en/';
    
    if (isHomePage) {
      const initSwiper = () => {
        const swiperContainer = document.querySelector('.mySwiper');
        if (swiperContainer && typeof window !== 'undefined' && (window as any).Swiper) {
          // Destroy existing swiper instance if it exists
          const existingSwiper = (swiperContainer as any).swiper;
          if (existingSwiper) {
            existingSwiper.destroy(true, true);
          }
          
          // Create new swiper instance
          try {
            const newSwiper = new (window as any).Swiper('.mySwiper', {
              loop: true,
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 16,
              autoplay: {
                delay: 3000,
                disableOnInteraction: false,
              },
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
              breakpoints: {
                0: {
                  slidesPerView: 5,
                  slidesPerGroup: 1,
                  centeredSlides: true,
                  spaceBetween: 8,
                },
                640: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                  centeredSlides: true,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                },
              },
            });
            console.log('Swiper initialized on navigation');
          } catch (e) {
            console.warn('Error initializing swiper:', e);
          }
        }
      };
      
      // Try to initialize immediately
      initSwiper();
      
      // Also try after a delay to catch dynamic content
      const timeout = setTimeout(initSwiper, 500);
      const timeout2 = setTimeout(initSwiper, 1000);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(timeout2);
      };
    }
  }, [pathname]);

  // Note: localStorage detection is removed to prevent conflicts with pathname-based locale detection
  // The pathname will always take precedence when navigating to /en/ or / routes

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
    console.log('Locale state updated to:', locale);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('site_locale', locale);
        document.documentElement.lang = locale;
        
        // Reinitialize swiper after language change
        setTimeout(() => {
          const swiperContainer = document.querySelector('.mySwiper');
          if (swiperContainer && typeof window !== 'undefined' && (window as any).Swiper) {
            // Destroy existing swiper instance if it exists
            const existingSwiper = (swiperContainer as any).swiper;
            if (existingSwiper) {
              existingSwiper.destroy(true, true);
            }
            
            // Create new swiper instance
            const newSwiper = new (window as any).Swiper('.mySwiper', {
              loop: true,
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 16,
              autoplay: {
                delay: 3000,
                disableOnInteraction: false,
              },
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
              breakpoints: {
                0: {
                  slidesPerView: 5,
                  slidesPerGroup: 1,
                  centeredSlides: true,
                  spaceBetween: 8,
                },
                640: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                  centeredSlides: true,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                },
              },
            });
            console.log('Swiper reinitialized after language change');
          }
        }, 500); // Wait for DOM to be ready
      }
    } catch (e) {
      console.warn('Error reinitializing swiper:', e);
    }
  }, [locale]);

  // Apply translations to any non-React DOM nodes (or nodes using data-i18n attributes)
  useEffect(() => {
    if (!translations) return;
    
    let applyTimeout: NodeJS.Timeout;
    let isApplying = false;
    const appliedValues = new Map<Element, string>();
    
    const apply = () => {
      if (isApplying) return; // Prevent concurrent applications
      isApplying = true;
      
      const dict = translations[locale] || {};
      const elements = document.querySelectorAll('[data-i18n]');
      
      elements.forEach((el) => {
        const key = el.getAttribute('data-i18n') || '';
        const val = (dict[key] ?? translations['en']?.[key]);
        if (typeof val !== 'undefined') {
          const htmlEl = el as HTMLElement;
          const lastApplied = appliedValues.get(el);
          
          // Only update if the value has actually changed
          if (lastApplied !== val) {
            htmlEl.innerHTML = val;
            appliedValues.set(el, val);
          }
        }
      });
      
      document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
        const key = el.getAttribute('data-i18n-alt') || '';
        const val = (dict[key] ?? translations['en']?.[key]);
        if (typeof val !== 'undefined' && el instanceof HTMLImageElement) {
          if (el.alt !== val) {
            el.alt = val;
          }
        }
      });
      
      setTimeout(() => {
        isApplying = false;
      }, 50);
    };
    
    // Debounced apply - only run once after a short delay
    const debouncedApply = () => {
      clearTimeout(applyTimeout);
      applyTimeout = setTimeout(apply, 100);
    };
    
    // Initial application
    debouncedApply();
    
    // Apply after dynamic content loads
    const t1 = setTimeout(apply, 400);
    
    // Set up MutationObserver to watch for new elements (debounced)
    let observerTimeout: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(observerTimeout);
      observerTimeout = setTimeout(() => {
        if (!isApplying) {
          debouncedApply();
        }
      }, 200);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    return () => {
      clearTimeout(applyTimeout);
      clearTimeout(observerTimeout);
      clearTimeout(t1);
      observer.disconnect();
      appliedValues.clear();
    };
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
