"use client";

"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from './TranslationProvider';

export default function Header() {
  const { t, locale, setLocale } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showingClone, setShowingClone] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const cloneRef = useRef<HTMLDivElement | null>(null);
  const portalRootRef = useRef<HTMLElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);
  const closeMenuRef = useRef<(() => void) | null>(null);

  const toggleLocale = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = locale === 'bg' ? 'en' : 'bg';
    setLocale(next);
  };

  const openMenu = () => {
    setShowingClone(true);
    setTimeout(() => { setMenuOpen(true); }, 20);
  };
  const closeMenu = () => { 
    setMenuOpen(false);
    setShowingClone(false);
    prevOpenRef.current = false;
  };
  
  // Expose closeMenu globally with fresh reference
  useEffect(() => {
    (window as any).reactCloseMenu = () => {
      setMenuOpen(false);
      setShowingClone(false);
      prevOpenRef.current = false;
    };
    return () => {
      delete (window as any).reactCloseMenu;
    };
  }, [setMenuOpen, setShowingClone]);
  
  const toggleMenu = (e?: React.MouseEvent | Event) => {
    if (e && 'preventDefault' in e) (e as Event).preventDefault();
    if (!showingClone) openMenu(); else closeMenu();
  };

  // create portal root
  useEffect(() => {
    const root = document.createElement('div');
    root.id = 'react-menu-clone-root';
    document.body.appendChild(root);
    portalRootRef.current = root;
    return () => {
      if (portalRootRef.current && portalRootRef.current.parentNode) portalRootRef.current.parentNode.removeChild(portalRootRef.current);
      portalRootRef.current = null;
    };
  }, []);

  // handle close animation/unmount when menuOpen -> false
  useEffect(() => {
    const gsap = (window as any)?.gsap;
    if (!showingClone) return;

    // If we're opening, animate open.
    if (menuOpen) {
      if (cloneRef.current) {
        try {
          gsap?.set(cloneRef.current, { scale: 0.25, opacity: 0 });
          gsap?.to(cloneRef.current, { scale: 1, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
          const inner = cloneRef.current.querySelector('.react-clone-inner');
          if (inner) gsap?.to(inner, { opacity: 1, duration: 0.3, delay: 0.35 });
        } catch (e) { /* ignore */ }
        // fallback when gsap is not available: make clone visible immediately
        if (!gsap) {
          try {
            cloneRef.current.style.opacity = '1';
            const innerEl = cloneRef.current.querySelector('.react-clone-inner') as HTMLElement | null;
            if (innerEl) innerEl.style.opacity = '1';
          } catch (e) {}
        }
      }
      prevOpenRef.current = true;
      return;
    }

    // Only run closing animation if the menu was previously open. This avoids immediate close when showingClone is first set.
    if (!menuOpen && prevOpenRef.current) {
      if (cloneRef.current) {
        try {
          gsap?.to(cloneRef.current, { scale: 0.95, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => { setShowingClone(false); prevOpenRef.current = false; } });
        } catch (e) { setShowingClone(false); prevOpenRef.current = false; }
      } else {
        setShowingClone(false);
        prevOpenRef.current = false;
      }
    }
  }, [menuOpen, showingClone]);

  // Close on ESC or outside click (for original button and clone overlay)
  useEffect(() => {
    function onKey(ev: KeyboardEvent) { if (ev.key === 'Escape') { setMenuOpen(false); } }
    function onDocClick(evt: MouseEvent) {
      if (!showingClone) return;
      const target = evt.target as Node;
      if (menuRef.current && menuRef.current.contains(target)) return;
      if (cloneRef.current && cloneRef.current.contains(target)) return;
      setMenuOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDocClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDocClick);
    };
  }, [showingClone]);

  // keep html lang
  useEffect(() => { try { if (typeof document !== 'undefined') document.documentElement.lang = locale; } catch (e) {} }, [locale]);

  // Close menu when navigation occurs (app router pathname change)
  const pathname = usePathname();
  useEffect(() => {
    // when route changes, immediately close and unmount portal to avoid overlay blocking
    if (showingClone) {
      setMenuOpen(false);
      setShowingClone(false);
      prevOpenRef.current = false;
    }
  }, [pathname]);

  // Add event listener to worktime link after translation system runs
  useEffect(() => {
    let listeners: Array<() => void> = [];
    
    const attachWorktimeListener = () => {
      setTimeout(() => {
        const worktimeLinks = document.querySelectorAll('[data-i18n="header_worktime"]');
        
        worktimeLinks.forEach((link) => {
          const handler = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentPath = window.location.pathname;
            const isHomePage = currentPath === '/' || currentPath === '';
            
            // Close React menu
            try {
              if (typeof (window as any).reactCloseMenu === 'function') {
                (window as any).reactCloseMenu();
                console.log('REACT MENU CLOSED');
              }
            } catch (e) { console.log('React menu close failed', e); }
            
            // Close legacy menu
            try {
              if (typeof (window as any).legacyCloseMenu === 'function') {
                (window as any).legacyCloseMenu();
                console.log('LEGACY MENU CLOSED');
              }
            } catch (e) { console.log('Legacy menu close failed', e); }
      
            // Force remove menuCircleClone and restore original menu
            try {
              const menuClone = document.getElementById('menuCircleClone');
              const bgOverlay = document.querySelector('.bg-overlay');
              const originalMenu = document.getElementById('menuCircle');
              
              if (menuClone) {
                menuClone.remove();
                console.log('MENU CLONE REMOVED');
              }
              if (bgOverlay) {
                bgOverlay.remove();
                console.log('BG OVERLAY REMOVED');
              }
              if (originalMenu) {
                (originalMenu as HTMLElement).style.opacity = '1';
                console.log('ORIGINAL MENU RESTORED');
              }
            } catch (e) { console.log('Menu cleanup failed', e); }
            
            if (isHomePage) {
              setTimeout(() => {
                const section5 = document.getElementById('section5');
                if (section5) {
                  section5.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 450);
            } else {
              window.location.href = '/contact#hours';
            }
          };
          
          link.addEventListener('click', handler);
          listeners.push(() => link.removeEventListener('click', handler));
        });
      }, 500);
    };

    attachWorktimeListener();
    
    return () => {
      listeners.forEach(cleanup => cleanup());
    };
  }, [pathname, menuOpen, setMenuOpen]);

  // Handle worktime click - scroll to section5 on homepage, otherwise link to /contact#hours
  const handleWorktimeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isHomePage = pathname === '/' || pathname === '';
    
    setMenuOpen(false);
    
    if (isHomePage) {
      setTimeout(() => {
        const section5 = document.getElementById('section5');
        if (section5) {
          section5.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
    } else {
      window.location.href = '/contact#hours';
    }
  };

  // Build portal content when showingClone is true
  const portalContent = showingClone && portalRootRef.current ? (
    createPortal(
      <>
        <div
          className="react-clone-bg"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 9998 }}
          onClick={() => setMenuOpen(false)}
        />

        <div
          ref={cloneRef}
          className="circle-clone react-clone-wrapper"
          style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#167DFF', borderRadius: '50%', width: window.innerWidth < 768 ? '120vw' : '70vh', height: window.innerWidth < 768 ? '120vw' : '70vh' }}
          role="dialog"
          aria-modal="true"
        >
          <div className="react-clone-inner" style={{ opacity: menuOpen ? 1 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 12 }}>
            <Link href="https://www.madaravet.com" aria-label="Home" onClick={() => { setMenuOpen(false); }}>
              <img src="/images/logo_white.svg" alt="Logo" className="menu-logo" style={{ width: 140, opacity: menuOpen ? 1 : 0, transition: 'opacity 0.25s ease', position: 'relative', zIndex: 10000 }} />
            </Link>
            <ul className="menu-list react-clone-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, width: '100%', alignItems: 'center', opacity: menuOpen ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: menuOpen ? 'auto' : 'none' }}>
              <li style={{ width: '100%' }}>
                <button
                  type="button"
                  suppressHydrationWarning 
                  className="block w-full text-center py-3 font-bold text-white cursor-pointer bg-transparent border-0" 
                  onClick={(e) => {
                    handleWorktimeClick(e as any);
                  }}
                  data-i18n="header_worktime"
                  style={{ background: 'transparent', border: 'none', font: 'inherit' }}
                >
                  header_worktime
                </button>
              </li>
              <li style={{ width: '100%' }}><Link href="/about" onClick={() => { setMenuOpen(false); }} prefetch={false} className="block w-full text-center py-3 font-bold text-white">{t('nav_about') || 'ABOUT'}</Link></li>
              <li style={{ width: '100%' }}><Link href="/services" onClick={() => { setMenuOpen(false); }} prefetch={false} className="block w-full text-center py-3 font-bold text-white">{t('nav_services') || 'SERVICES'}</Link></li>
              <li style={{ width: '100%' }}><Link href="/blog" onClick={() => { setMenuOpen(false); }} prefetch={false} className="block w-full text-center py-3 font-bold text-white">{t('nav_blog') || 'BLOG'}</Link></li>
              <li style={{ width: '100%' }}><Link href="/contact" onClick={() => { setMenuOpen(false); }} prefetch={false} className="block w-full text-center py-3 font-bold text-white">{t('nav_contact') || 'CONTACT'}</Link></li>
            </ul>
          </div>
        </div>
      </>,
      portalRootRef.current
    )
  ) : null;

  return (
    <>
      <header className="site-header fixed w-full left-0 right-0 z-[8888]">
        <div className="header-inner max-w-screen-xl mx-auto mt-4 px-4 md:px-8">
          <div className="header-card bg-white rounded-[18px] shadow-md py-3 px-6 flex justify-between items-center">
            <Link href="https://www.madaravet.com" aria-label="Home">
              <img src="/images/logo.svg" alt="MadaraVet logo" className="h-10 md:h-12" />
            </Link>

            <div className="header-info flex items-center gap-4 text-lg md:text-lg font-semibold">
              <a suppressHydrationWarning className="header-worktime hidden md:inline text-[#177DDF] cursor-pointer" onClick={handleWorktimeClick} data-i18n="header_worktime" >header_worktime</a>
              <span suppressHydrationWarning className="header-phone hidden md:inline text-[#177DDF]" data-i18n="header_phone1">header_phone1</span>
              <span suppressHydrationWarning className="header-alt-phone hidden md:inline text-[#177DDF]" data-i18n="header_phone2">header_phone2</span>
              <a id="language-toggle" suppressHydrationWarning href="#" onClick={toggleLocale} className="header-language text-[#FF8F8F]" data-i18n="header_language">header_language</a>

              <div
                id="menuCircle"
                data-react-controlled="true"
                ref={menuRef}
                onClick={toggleMenu}
                className={`menu-circle relative w-[60px] h-[60px] rounded-full bg-[#167DFF] flex items-center justify-center z-[9000] cursor-pointer ${menuOpen ? 'open' : ''}`}
                aria-expanded={menuOpen}
                aria-label="Toggle menu"
                role="button"
              >
                <div className="menu-circle-core absolute inset-0 rounded-full bg-[#167DFF]"></div>

                <div className="bars absolute flex flex-col justify-between w-8 h-3">
                  <div className="line h-[2px] bg-white rounded" />
                  <div className="line h-[2px] bg-white rounded" />
                </div>

            

                <ul
                  role="menu"
                  aria-hidden={!menuOpen}
                  className={`menu-list  top-full left-1/2  mt-4 transition-opacity ease-in-out flex flex-col items-center space-y-4 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} text-white rounded-lg py-2 px-3 w-70 md:w-64 z-[9999]`}
                  style={{ display: 'none' }}
                >
                  <li>   <Link href="https://www.madaravet.com" aria-label="Home">  <img src="/images/logo_white.svg" alt="Logo" className={`menu-logo relative w-40 mt-4 mb-4 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} /></Link> </li>
                              <li style={{ width: '100%' }} id="headerworktime"><a suppressHydrationWarning className="block w-full text-center py-3 font-bold text-white cursor-pointer"  onClick={handleWorktimeClick}  data-i18n="header_worktime">header_worktime</a></li>
                
                 <li className="w-full text-center"><Link href="/about" prefetch={false} className="text-white hover:text-[#FF8F8F] transition-colors block w-full py-3" role="menuitem"><span suppressHydrationWarning data-i18n="nav_about">nav_about</span></Link></li>
                  <li className="w-full text-center"><Link href="/services" prefetch={false} className="text-white hover:text-[#FF8F8F] transition-colors block w-full py-3" role="menuitem"><span suppressHydrationWarning data-i18n="nav_services">nav_services</span></Link></li>
                  <li className="w-full text-center"><Link href="/blog" prefetch={false} className="text-white hover:text-[#FF8F8F] transition-colors block w-full py-3" role="menuitem"><span suppressHydrationWarning data-i18n="nav_blog">nav_blog</span></Link></li>
                  <li className="w-full text-center"><Link href="/contact" prefetch={false} className="text-white hover:text-[#FF8F8F] transition-colors block w-full py-3" role="menuitem"><span suppressHydrationWarning data-i18n="nav_contact">nav_contact</span></Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {portalContent}
    </>
  );
}
