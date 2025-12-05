import type { Metadata } from "next";
import { Geist, Geist_Mono, Advent_Pro, Raleway, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import React from "react";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TranslationProvider from "../components/TranslationProvider";
import WorkingHoursSection from "../components/WorkingHoursSection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const adventPro = Advent_Pro({
  variable: "--font-advent-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "MadaraVet",
  description: "Д-р Юлиана Соколова",
  icons: {
    icon: '/images/favicon/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${adventPro.variable} ${raleway.variable} ${plusJakarta.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Custom stylesheet */}
        <link rel="stylesheet" href="/custom.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
      </head>
      <body>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WT554JVCVS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WT554JVCVS');
          `}
        </Script>
        <TranslationProvider>
          <Header />
          <main className="main-content">
            {children}
            <div id="working-hours-section">
              <WorkingHoursSection />
            </div>
          </main>
          <Footer />
        </TranslationProvider>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/DrawSVGPlugin.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Physics2DPlugin.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/PhysicsPropsPlugin.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollToPlugin.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/TextPlugin.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CSSRulePlugin.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
        <script src="/custom.js"></script>
        <script src="/menu-home.js"></script>
      </body>
    </html>
  );
}
