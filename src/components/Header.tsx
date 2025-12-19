"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from './TranslationProvider';

export default function Header() {
  const { t, locale, setLocale } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = locale === 'bg' ? 'en' : 'bg';
    setLocale(next);

    // Navigate to the appropriate language version of the current page
    let newPath = pathname;

    if (next === 'en') {
      // Switch to English
      if (pathname === '/' || pathname === '') {
        newPath = '/en';
      } else if (!pathname.startsWith('/en')) {
        // Add /en prefix
        newPath = `/en${pathname}`;
      }
      // Handle blog pages - no English version, redirect to home
      if (pathname.startsWith('/blog')) {
        newPath = '/en';
      }
    } else {
      // Switch to Bulgarian
      if (pathname === '/en' || pathname === '/en/') {
        newPath = '/';
      } else if (pathname.startsWith('/en/')) {
        // Remove /en prefix
        newPath = pathname.slice(3);
      }
    }

    router.push(newPath);
  };

  const toggleMenu = (e?: React.MouseEvent | Event) => {
    if (e && 'preventDefault' in e) (e as Event).preventDefault();
    setMenuOpen(prev => !prev);
  };

  // Handle scroll shadow
  useEffect(() => {
    function onScroll() {
      setHasScrolled(window.scrollY > 0);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on ESC or outside click
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    function onDocClick(evt: MouseEvent) {
      if (!menuOpen) return;
      const target = evt.target as Node;
      if (menuRef.current && menuRef.current.contains(target)) return;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      setMenuOpen(false);
    }

    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDocClick);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDocClick);
    };
  }, [menuOpen]);

  // keep html lang
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') document.documentElement.lang = locale;
    } catch (e) {}
  }, [locale]);

  // Close menu when navigation occurs
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [pathname]);

  // Handle worktime click
  const handleWorktimeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const isHomePage = pathname === '/' || pathname === '' || pathname === '/en' || pathname === '/en/';

    setMenuOpen(false);

    if (isHomePage) {
      setTimeout(() => {
        const section6 = document.getElementById('section6');
        if (section6) {
          section6.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const homeUrl = locale === 'en' ? '/en/#section6' : '/#section6';
      window.location.href = homeUrl;
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="site-header fixed w-full left-0 right-0 z-[8888]"
      suppressHydrationWarning
    >
      <div className="header-inner max-w-screen-xl mx-auto mt-4" suppressHydrationWarning>
        <div className={`header-card bg-white rounded-[24px] py-4 px-4 flex justify-between items-center transition-shadow duration-300 ${hasScrolled ? 'shadow-md' : ''}`} suppressHydrationWarning={true}>
          <Link href={locale === 'en' ? '/en' : '/'} aria-label="Home" className="header-logo-wrapper flex items-start gap-2" suppressHydrationWarning>
            <svg className="header-logo-svg" width="52" height="47" viewBox="0 0 52 47" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_305_495)">
                <path d="M4.81838 11.2918C4.81838 11.2918 4.89176 11.2429 4.93252 11.2266C5.21788 11.1206 5.544 11.357 5.64184 11.6505C5.73967 11.9441 5.6663 12.262 5.60107 12.5555C5.09558 14.7487 4.23136 17.0805 4.42703 19.3552C4.54118 20.7004 5.2831 22.4289 6.33485 23.3012C8.21004 24.8503 10.6804 22.4615 9.75912 20.4232C9.34332 19.5019 8.66662 18.6377 8.85414 17.5533C9.02535 16.5424 9.67759 15.939 10.5744 16.7788C11.5528 17.7001 12.947 19.2084 12.3681 20.9939C11.8381 22.6327 10.1342 24.0595 9.05796 25.3395C5.01405 30.1579 4.89991 35.4656 4.33735 41.4499C4.16614 43.3006 4.052 43.586 4.052 43.586C4.052 43.586 3.18777 43.3577 2.83719 42.3712C2.69044 41.9554 2.51922 41.5396 2.3317 41.1319C2.25833 40.977 1.87513 39.5584 1.61424 40.0802C1.42672 40.4634 1.30442 40.9689 1.44302 41.3928C1.67946 42.1348 2.12788 43.4719 2.48661 44.1567C3.00841 45.1351 3.9297 46.4314 6.30223 46.5456C11.0555 46.7738 15.7516 46.7494 20.5048 46.7168C22.0131 46.7086 24.402 45.8444 25.5434 44.7437C26.6767 43.6431 24.3857 42.3467 23.4073 43.0642C22.5431 43.7001 22.6002 43.1783 22.6002 43.1783C22.5512 39.0285 23.391 34.8459 22.6572 30.7124C22.1436 27.8017 19.9993 25.8694 19.021 23.1871C18.5563 21.9152 18.328 20.6433 18.328 19.9503C18.328 16.2244 23.6845 15.2297 25.6657 12.9632C25.6657 12.9632 27.6306 10.7129 28.0382 9.384C28.4459 8.05506 28.7883 5.56838 28.7883 4.53294C28.7883 3.49751 28.3236 3.43228 28.9595 2.62513C29.5955 1.81798 29.5955 0.317822 28.7883 0.138455C26.9131 -0.261043 26.9131 0.0976903 25.9592 1.52447C25.7309 1.87505 21.5647 2.10334 20.4151 1.93212C17.7246 1.53262 14.7814 1.41033 12.1317 2.10334C9.08242 2.91049 7.06047 5.60099 4.87545 7.70448C3.64434 8.89482 2.06265 10.0281 1.08429 11.5201C0.423893 12.4985 -0.0489835 13.8845 -6.52473e-05 15.0422C0.057006 16.363 1.42672 18.0099 2.91872 17.1049C3.35083 16.844 3.56281 16.3222 3.68511 15.8249C4.01938 14.4144 3.87263 12.8653 4.57379 11.6016C4.63901 11.4875 4.72054 11.3652 4.82653 11.2837L4.81838 11.2918Z" fill="#1872D9"/>
                <path d="M29.1718 44.3606C29.2289 44.3606 29.2859 44.3443 29.343 44.3117C29.3512 43.5861 29.1555 42.8768 28.9924 42.1756C28.2505 38.996 28.1201 35.6206 28.862 32.4246C29.2207 30.8592 29.7914 29.2775 30.6312 27.8997C31.5606 26.3832 33.4684 24.6221 33.2972 22.7062C33.126 20.7902 31.4465 19.8771 30.0116 19.0699C29.3267 18.6867 28.6582 18.1405 28.4625 17.3822C28.1608 16.2327 29.0169 15.1402 29.4408 14.0232C29.9708 12.629 29.8403 11.1126 30.1583 9.67762C30.2562 9.2292 30.5252 7.94102 31.0633 7.79427C31.6829 7.63121 32.2781 8.53619 32.7021 8.84601C34.5936 10.1831 36.8846 9.17213 38.6619 8.16115C39.6566 7.59044 40.2681 7.99809 40.4393 9.05799C40.6268 10.2076 40.5534 11.3816 40.6594 12.5393C40.7654 13.6971 41.1242 14.8548 41.1405 16.0451C41.1568 17.5371 40.6105 18.9313 39.2897 19.714C38.1728 20.3744 35.8084 20.5619 35.841 22.3393C35.8899 24.614 39.1348 26.0652 40.5127 27.492C42.5999 29.6526 44.2875 32.2208 45.323 35.0499C45.7388 36.1913 46.0567 37.3816 46.0078 38.5965C45.9589 39.9172 45.4942 41.1891 44.9316 42.3876C44.4261 43.472 43.7984 44.5563 42.7955 45.2167C41.703 45.9342 40.3252 46.0402 39.0207 46.1054C35.4007 46.2929 31.7237 46.35 28.2179 45.4287C27.6472 45.2738 27.0357 45.0618 26.7177 44.5645C26.3998 44.0671 26.6525 43.2192 27.2477 43.1948C28.0141 43.1622 28.4869 44.4259 29.1636 44.3606H29.1718ZM30.5007 42.4121C30.5007 42.4121 30.5497 42.4855 30.5823 42.5099C30.8106 42.6811 31.0878 42.4855 31.0878 42.1919C31.0878 41.556 30.8106 39.2161 31.1856 38.5557C31.5606 37.8953 32.4819 37.1941 32.7591 36.9414C33.0363 36.6886 33.925 36.2484 33.9006 35.4412C33.8761 34.6341 33.8272 33.3867 33.1097 32.9545C32.3922 32.5224 32.4493 32.7507 31.8623 33.0442C31.2753 33.3377 30.672 33.9411 30.6149 34.6015C30.5578 35.2619 30.4111 35.4086 30.3866 36.2158C30.3621 37.0229 30.1339 38.4415 30.1583 39.1916C30.1909 40.0885 30.2398 40.9934 30.3621 41.8821C30.3866 42.0289 30.4029 42.2653 30.4844 42.4202L30.5007 42.4121Z" fill="#DE3D37"/>
                <path d="M44.2709 43.4883C46.2602 43.4557 48.2088 42.9991 48.967 40.9527C49.872 38.5149 48.6083 35.9793 47.6625 33.7536C46.6597 31.3892 43.8143 25.6739 46.6842 23.7009C47.8338 22.91 50.1003 23.1302 50.2389 24.8912C50.2552 25.1521 50.2797 26.3914 50.2797 26.3914" stroke="#DE3D37" strokeWidth="1.63061" strokeLinecap="round"/>
              </g>
              <defs>
                <clipPath id="clip0_305_495">
                  <rect width="51.0951" height="46.7577" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <div className="header-logo-text flex flex-col justify-center items-center">
              <div className="header-logo-title text-[#1872D9] font-bold text-[33px] leading-none font-sansation">MadaraVet</div>
              <div className="header-logo-subtitle text-[#1872D9] text-[15px] leading-none font-sansation" data-i18n="header_subtitle">Д-р Юлиана Соколова</div>
            </div>
          </Link>

          <nav className="desktop-menu hidden lg:flex items-center gap-6 px-8 py-6 rounded-[24px]" suppressHydrationWarning>
            <Link href={locale === 'en' ? '/en/about' : '/about'} className="menu-item text-[#182559] text-[14px] font-bold leading-6 hover:text-[#1872D9] transition-colors font-raleway">
              <span suppressHydrationWarning data-i18n="nav_about">За нас</span>
            </Link>
            <Link href={locale === 'en' ? '/en/services' : '/services'} className="menu-item text-[#182559] text-[14px] font-bold leading-6 hover:text-[#1872D9] transition-colors font-raleway">
              <span suppressHydrationWarning data-i18n="nav_services">Услуги</span>
            </Link>
            {locale === 'bg' && (
              <Link href="/blog" className="menu-item text-[#182559] text-[14px] font-bold leading-6 hover:text-[#1872D9] transition-colors font-raleway">
                <span suppressHydrationWarning data-i18n="nav_blog">Блог</span>
              </Link>
            )}
            <Link href={locale === 'en' ? '/en/contact' : '/contact'} className="menu-item text-[#182559] text-[14px] font-bold leading-6 hover:text-[#1872D9] transition-colors font-raleway">
              <span suppressHydrationWarning data-i18n="nav_contact">Контакти</span>
            </Link>
            <a
              id="language-toggle"
              suppressHydrationWarning
              href="#"
              onClick={toggleLocale}
              className="menu-item text-[#E32C14] text-[14px] font-semibold leading-6 hover:opacity-80 transition-opacity font-raleway"
              data-i18n="header_language"
            >
              ENG
            </a>
          </nav>

          <div className="mobile-menu-wrapper lg:hidden flex flex-col items-end gap-1.5 relative">
            <div
              ref={menuRef}
              onClick={toggleMenu}
              className="menu-toggle-button w-11 h-11 rounded-full bg-[#4868EC] flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              role="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8H20M4 16H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            <div
              ref={dropdownRef}
              className={`mobile-menu-dropdown absolute top-full right-0 mt-2 bg-white rounded-[24px] shadow-lg overflow-hidden transition-all duration-300 ease-out origin-top-right ${
                menuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
              }`}
              style={{ minWidth: '179px' }}
              suppressHydrationWarning={true}
            >
              <div className="flex flex-col items-start gap-6 py-6 px-8">
                <Link
                  href={locale === 'en' ? '/en/about' : '/about'}
                  onClick={handleLinkClick}
                  className="menu-dropdown-item text-[#182559] text-[14px] font-bold leading-6 hover:text-[#4868EC] transition-colors font-raleway"
                >
                  <span suppressHydrationWarning data-i18n="nav_about">За нас</span>
                </Link>
                <Link
                  href={locale === 'en' ? '/en/services' : '/services'}
                  onClick={handleLinkClick}
                  className="menu-dropdown-item text-[#182559] text-[14px] font-bold leading-6 hover:text-[#4868EC] transition-colors font-raleway"
                >
                  <span suppressHydrationWarning data-i18n="nav_services">Услуги</span>
                </Link>
                {locale === 'bg' && (
                  <Link
                    href="/blog"
                    onClick={handleLinkClick}
                    className="menu-dropdown-item text-[#182559] text-[14px] font-bold leading-6 hover:text-[#4868EC] transition-colors font-raleway"
                  >
                    <span suppressHydrationWarning data-i18n="nav_blog">Блог</span>
                  </Link>
                )}
                <Link
                  href={locale === 'en' ? '/en/contact' : '/contact'}
                  onClick={handleLinkClick}
                  className="menu-dropdown-item text-[#182559] text-[14px] font-bold leading-6 hover:text-[#4868EC] transition-colors font-raleway"
                >
                  <span suppressHydrationWarning data-i18n="nav_contact">Контакти</span>
                </Link>
                <a
                  href="#"
                  onClick={(e) => {
                    toggleLocale(e);
                    handleLinkClick();
                  }}
                  className="menu-dropdown-item text-[#E32C14] text-[18px] font-semibold leading-6 hover:opacity-80 transition-opacity font-raleway"
                >
                  <span suppressHydrationWarning data-i18n="header_language">ENG</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
