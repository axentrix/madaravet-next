"use client";
import React from 'react';
import Link from 'next/link';

type Post = {
  slug: string;
  title: string;
  date_text?: string;
  image?: string | null;
};

export default function BlogSwiper({ posts }: { posts: Post[] }) {
  return (
    <div className="blog-grid-wrapper">
      <div className="blog-grid">
        {posts.map((p) => (
          <article className="blog-card" key={p.slug}>
            <Link href={`/blog/${p.slug}`} prefetch={false} className="block h-full">
              <div className="card-media">
                <img src={p.image || '/images/gallery2/487976955_1204896294975029_3511982287838473220_n.jpg'} alt={p.title} />
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span className="card-tag">Блог</span>
                  <time className="card-date">{p.date_text}</time>
                </div>

                <h3 className="card-title">{p.title}</h3>

                {/* optional excerpt area - left empty if not provided */}
                <p className="card-excerpt">{(p as any).excerpt ? (p as any).excerpt : ''}</p>

             
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
