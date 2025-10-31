"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Loader() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);
  const hideTimeout = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // helper to show/hide the static loader div via class
  const setVisible = (v: boolean) => {
    try {
      const el = document.getElementById('loader');
      if (!el) return;
      if (v) {
        el.classList.add('visible');
        el.setAttribute('aria-hidden', 'false');
      } else {
        el.classList.remove('visible');
        el.setAttribute('aria-hidden', 'true');
      }
    } catch (e) {}
  };

  useEffect(() => {
    prev.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prev.current === null) {
      prev.current = pathname;
      return;
    }
    if (pathname === prev.current) return;

    // route changed
    setVisible(true);

    // cleanup previous observer/timers
    try { if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; } } catch (e) {}
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    const main = document.querySelector('main');
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setVisible(false);
      try { if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; } } catch (e) {}
      if (hideTimeout.current) { window.clearTimeout(hideTimeout.current); hideTimeout.current = null; }
    };

    // If main already has meaningful content, hide immediately
    const mainInitial = main ?? document.body;
    const hasMeaningfulContent = (el: Element) => {
      try {
        if (!el) return false;
        if (el.querySelector('#section1')) return true;
        if ((el.textContent || '').trim().length > 20) return true;
        const imgs = Array.from(el.querySelectorAll('img'));
        if (imgs.length === 0 && el.querySelectorAll('*').length > 0) return true;
        return false;
      } catch (e) { return false; }
    };

    if (hasMeaningfulContent(mainInitial)) {
      // small delay to let hydration/paint occur
      hideTimeout.current = window.setTimeout(finish, 80);
    } else {
      // observe main for additions
      try {
        const obs = new MutationObserver((mutations) => {
          if (hasMeaningfulContent(mainInitial)) finish();
          // also check images loading
          const imgs = Array.from((mainInitial as Element).querySelectorAll('img'));
          if (imgs.length > 0) {
            const unloaded = imgs.filter(i => !((i as HTMLImageElement).complete));
            if (unloaded.length === 0) finish();
            else {
              let remaining = unloaded.length;
              const doneListener = () => {
                remaining -= 1;
                if (remaining <= 0) finish();
              };
              unloaded.forEach(img => {
                img.addEventListener('load', doneListener);
                img.addEventListener('error', doneListener);
              });
            }
          }
        });
        observerRef.current = obs;
        obs.observe(mainInitial, { childList: true, subtree: true, characterData: true });

        // Safety fallback: hide after 6s even if content not detected
        hideTimeout.current = window.setTimeout(finish, 6000);
      } catch (e) {
        // fallback
        hideTimeout.current = window.setTimeout(finish, 700);
      }
    }

    prev.current = pathname;

    return () => {
      try { if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; } } catch (e) {}
      if (hideTimeout.current) { window.clearTimeout(hideTimeout.current); hideTimeout.current = null; }
    };
  }, [pathname]);

  useEffect(() => {
    return () => {
      try { if (observerRef.current) observerRef.current.disconnect(); } catch (e) {}
      if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
    };
  }, []);

  return null;
}
