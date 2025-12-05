import fs from 'fs';
import path from 'path';
import React from 'react';

type Props = {
  params: any; // params may be a Promise in newer Next.js — await below
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'madaravet_export', 'posts');

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files = fs.readdirSync(postsDir);
  return files
    .filter(file => file.endsWith('.html'))
    .map(file => ({
      slug: file.replace('.html', '')
    }));
}

function inlineImagesInHtml(html: string, slug: string): string {
  // replace relative ../images/... with data URLs by reading files
  let result = html.replace(/src\s*=\s*"(\.\.\/images\/([^\"']+?)\/([^\"']+?))"/gi, (m, p1, p2, p3) => {
    try {
      const imgPath = path.join(process.cwd(), 'madaravet_export', 'images', p2, p3);
      if (!fs.existsSync(imgPath)) return `src="/madaravet_export/images/${p2}/${p3}"`;
      const buf = fs.readFileSync(imgPath);
      const ext = path.extname(p3).toLowerCase().replace('.', '');
      const mime = ext === 'jpg' ? 'jpeg' : ext;
      const b64 = buf.toString('base64');
      return `src="data:image/${mime};base64,${b64}"`;
    } catch (e) {
      console.error('inlineImagesInHtml error', e);
      return `src="/madaravet_export/images/${p2}/${p3}"`;
    }
  });

  // Fix broken links: replace index.html references with /blog/ root
  result = result.replace(/href\s*=\s*["']index\.html["']/gi, 'href="/blog/"');
  // Also handle relative links that might point to parent directory
  result = result.replace(/href\s*=\s*["'](\.\.\/index\.html)["']/gi, 'href="/blog/"');

  return result;
}

export default async function ArticlePage({ params }: Props) {
  try {
    const resolvedParams = await params;
    let { slug } = resolvedParams;

    // Next.js may pass URL-encoded or decoded params depending on how the route was accessed
    // Try to decode if it looks like it's encoded
    if (slug && slug.includes('%')) {
      try {
        slug = decodeURIComponent(slug);
      } catch (e) {
        // If decoding fails, use as-is
      }
    }

    // Find post file for slug
    function findPostPath(candidate: string) {
      const postPath = path.join(process.cwd(), 'madaravet_export', 'posts', `${candidate}.html`);
      if (fs.existsSync(postPath)) return postPath;
      return null;
    }

    const foundPath = findPostPath(slug);
    if (!foundPath) {
      console.error('Post not found for slug:', slug, 'slug bytes:', Buffer.from(slug, 'utf8').toString('hex'));
      // List available posts for debugging
      const postsDir = path.join(process.cwd(), 'madaravet_export', 'posts');
      const availablePosts = fs.readdirSync(postsDir).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));
      console.error('Available posts:', availablePosts);
      return (
        <section className="max-w-screen-md mx-auto px-4 py-20">
          <h1>Статия не е намерена</h1>
          <p>Статията с този адрес не съществува. Попитайте търсеният slug: {slug}</p>
        </section>
      );
    }

    let raw = fs.readFileSync(foundPath, 'utf8');
    // attempt to extract content inside <body>
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const content = bodyMatch ? bodyMatch[1] : raw;
    const inlined = inlineImagesInHtml(content, slug);

    return (
      <article className="article-page max-w-screen-md mx-auto px-4 py-10">
        <div dangerouslySetInnerHTML={{ __html: inlined }} />
      </article>
    );
  } catch (error) {
    console.error('Error rendering blog article:', error);
    return (
      <section className="max-w-screen-md mx-auto px-4 py-20">
        <h1>Грешка при зареждане на статията</h1>
        <p>Възникна грешка при зареждане на статията. Моля, опитайте отново по-късно.</p>
      </section>
    );
  }
}
