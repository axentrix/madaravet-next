"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

type Post = {
  slug: string;
  title: string;
  date_text?: string;
  image?: string | null;
};

export default function BlogSwiper({ posts }: { posts: Post[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const swiperInstanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!mounted) return;
      if (typeof window === 'undefined') return;

      try {
        // dynamically load swiper to avoid build-time module resolution issues
        // prefer CDN/global Swiper if available (homepage loads CDN), otherwise use imported module
        const globalSwiper = typeof window !== 'undefined' ? (window as any).Swiper : undefined;
        let SwiperConstructor: any = null;
        let Autoplay: any = null;
        let Pagination: any = null;
        let Navigation: any = null;

        if (globalSwiper) {
          // use CDN version
          SwiperConstructor = globalSwiper;
        } else {
          // dynamically import Swiper modules
          const SwiperModule = await import('swiper');
          const SwiperModules = await import('swiper/modules');
          
          SwiperConstructor = SwiperModule.default || SwiperModule.Swiper;
          Autoplay = SwiperModules.Autoplay;
          Pagination = SwiperModules.Pagination;
          Navigation = SwiperModules.Navigation;
        }

        // instantiate on the rendered container
        if (containerRef.current) {
          // destroy existing if present
          if (swiperInstanceRef.current && swiperInstanceRef.current.destroy) {
            try { swiperInstanceRef.current.destroy(true, true); } catch(e){}
            swiperInstanceRef.current = null;
          }

          const el = containerRef.current.querySelector('.blog-swiper') || containerRef.current;
          const paginationEl = containerRef.current.querySelector('.swiper-pagination');
          const nextEl = containerRef.current.querySelector('.swiper-button-next');
          const prevEl = containerRef.current.querySelector('.swiper-button-prev');

          const options: any = {
            spaceBetween: 16,
            loop: true,
            autoplay: { delay: 3500, disableOnInteraction: false },
            pagination: { el: paginationEl, clickable: true },
            navigation: { nextEl, prevEl },
            breakpoints: {
              0: { slidesPerView: 1.2, centeredSlides: true },
              420: { slidesPerView: 1.8, centeredSlides: true },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }
          };

          // if using module-based Swiper that needs modules array
          if (!globalSwiper && Autoplay && Pagination && Navigation) {
            options.modules = [Autoplay, Pagination, Navigation];
          }

          try {
            swiperInstanceRef.current = new SwiperConstructor(el, options);
          } catch (e) {
            // last resort: try using selector string
            try { swiperInstanceRef.current = new SwiperConstructor('.blog-swiper', options); } catch (err) { console.error('Swiper init failed', err); }
          }
        }
      } catch (e) {
        console.error('Failed to init Swiper dynamically', e);
      }
    }

    init();

    return () => {
      mounted = false;
      try { if (swiperInstanceRef.current && swiperInstanceRef.current.destroy) swiperInstanceRef.current.destroy(true, true); } catch(e) {}
    };
  }, [posts]);

  return (
    <div className="blog-swiper-wrapper" ref={containerRef}>
      <div className="blog-swiper swiper">
        <div className="swiper-wrapper">
          {posts.map(p => (
            <div className="swiper-slide" key={p.slug}>
              <article className="blog-card">
                <Link href={`/blog/${encodeURIComponent(p.slug)}`} prefetch={false} className="block h-full">
                  <div className="card-media">
                    {p.image ? <img src={p.image} alt={p.title} /> : <div className="card-media-fallback">No image</div>}
                  </div>

                  <div className="card-body">
                    <div className="card-meta">
                      <span className="card-tag">Блог</span>
                      <time className="card-date">{p.date_text}</time>
                    </div>

                    <h3 className="card-title">{p.title}</h3>

                    {/* optional excerpt area - left empty if not provided */}
                    <p className="card-excerpt">{(p as any).excerpt ? (p as any).excerpt : ''}</p>

                    <div className="card-cta">Read article →</div>
                  </div>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="swiper-button-prev" />
      <div className="swiper-button-next" />
      <div className="swiper-pagination" />
    </div>
  );
}
