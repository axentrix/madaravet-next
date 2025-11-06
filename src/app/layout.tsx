import type { Metadata } from "next";
import { Geist, Geist_Mono, Advent_Pro } from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TranslationProvider from "../components/TranslationProvider";
import Loader from "../components/Loader";

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${adventPro.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Custom stylesheet */}
        <link rel="stylesheet" href="/custom.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
      </head>
      <body>
        <TranslationProvider>
          <Loader />
          <div id="loader" className="visible" suppressHydrationWarning style={{ 
            position: 'fixed', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#177DDF', 
            color: 'white', 
            zIndex: 99999,
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <div style={{ 
              borderRadius: '999px', 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              padding: '2rem' 
            }}>
              Loading...
            </div>
          </div>
          <Header />
          <main className="main-content">{children}</main>
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
