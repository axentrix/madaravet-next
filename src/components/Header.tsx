"use client";

"use client";
import React from "react";
import Link from 'next/link';
import { useTranslation } from './TranslationProvider';

export default function Header() {
  const { t, locale, setLocale } = useTranslation();

  const toggleLocale = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = locale === 'bg' ? 'en' : 'bg';
    setLocale(next);
  };

  return (
    <header className="site-header fixed w-full left-0 right-0 z-[8888]">
      <div className="header-inner max-w-screen-xl mx-auto mt-4 px-4 md:px-8">
        <div className="header-card bg-white rounded-[18px] shadow-md py-3 px-6 flex justify-between items-center">
          <Link href="/" aria-label="Home">
            <img src="/images/logo.svg" alt="MadaraVet logo" className="h-10 md:h-12" />
          </Link>

          <div className="header-info flex items-center gap-4 text-lg md:text-lg font-semibold">
            <span suppressHydrationWarning className="header-worktime text-[#177DDF] cursor-pointer" data-i18n="header_worktime">header_worktime</span>
            <span suppressHydrationWarning className="header-phone text-[#177DDF]" data-i18n="header_phone1">header_phone1</span>
            <span suppressHydrationWarning className="header-alt-phone text-[#177DDF]" data-i18n="header_phone2">header_phone2</span>
            <a id="language-toggle" suppressHydrationWarning href="#" onClick={toggleLocale} className="header-language text-[#FF8F8F]" data-i18n="header_language">header_language</a>

            <div
              id="menuCircle"
              className="menu-circle relative w-[60px] h-[60px] rounded-full bg-[#167DFF] flex items-center justify-center z-[9000] cursor-pointer"
              aria-expanded={false}
              aria-label="Toggle menu"
              role="button"
            >
              <div className="menu-circle-core absolute inset-0 rounded-full bg-[#167DFF]"></div>

              <div className="bars absolute flex flex-col justify-between w-8 h-3">
                <div className="line h-[2px] bg-white rounded"></div>
                <div className="line h-[2px] bg-white rounded"></div>
              </div>

              <img src="/images/logo_white.svg" alt="Logo" className="menu-logo relative w-40 mb-4 transition-opacity duration-300 opacity-0" />

              <ul className="menu-list absolute top-full mt-4 transition-opacity ease-in-out flex flex-col items-center space-y-4 opacity-0 pointer-events-none">
                <li className="w-full text-center"><Link href="/about" className="text-white hover:text-[#FF8F8F] transition-colors block w-full py-4"><span suppressHydrationWarning data-i18n="nav_about">nav_about</span></Link></li>
                <li className="w-full text-center"><Link href="/services" className="text-white hover:text-[#FF8F8F] transition-colors block w-full py-4"><span suppressHydrationWarning data-i18n="nav_services">nav_services</span></Link></li>
                <li className="w-full text-center"><Link href="/blog" className="text-white hover:text-[#FF8F8F] transition-colors block w-full py-4"><span suppressHydrationWarning data-i18n="nav_blog">nav_blog</span></Link></li>
                <li className="w-full text-center"><Link href="/contact" className="text-white hover:text-[#FF8F8F] transition-colors block w-full py-4"><span suppressHydrationWarning data-i18n="nav_contact">nav_contact</span></Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
