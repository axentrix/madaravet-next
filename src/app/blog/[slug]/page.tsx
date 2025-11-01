import fs from 'fs';
import path from 'path';
import React from 'react';

type Props = {
  params: any; // params may be a Promise in newer Next.js — await below
};

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'madaravet_export', 'posts');
  
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files = fs.readdirSync(postsDir);
  const slugs = files
    .filter(file => file.endsWith('.html'))
    .map(file => ({
      slug: file.replace('.html', '')
    }));

  return slugs;
}

function inlineImagesInHtml(html: string, slug: string): string {
  // replace relative ../images/... with data URLs by reading files
  return html.replace(/src\s*=\s*"(\.\.\/images\/([^\"']+?)\/([^\"']+?))"/gi, (m, p1, p2, p3) => {
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
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  let { slug } = resolvedParams;

  // try several slug variants to match filenames (encoded/decoded)
  function findPostPath(candidate: string) {
    const p1 = path.join(process.cwd(), 'madaravet_export', 'posts', `${candidate}.html`);
    if (fs.existsSync(p1)) return p1;
    // try decoded
    try {
      const dec = decodeURIComponent(candidate);
      const p2 = path.join(process.cwd(), 'madaravet_export', 'posts', `${dec}.html`);
      if (fs.existsSync(p2)) return p2;
    } catch (e) {}
    // try encodeURI
    try {
      const enc = encodeURI(candidate);
      const p3 = path.join(process.cwd(), 'madaravet_export', 'posts', `${enc}.html`);
      if (fs.existsSync(p3)) return p3;
    } catch (e) {}
    // try replacing dashes/plus
    const alt = candidate.replace(/\+/g, '-');
    const p4 = path.join(process.cwd(), 'madaravet_export', 'posts', `${alt}.html`);
    if (fs.existsSync(p4)) return p4;
    return null;
  }

  const foundPath = findPostPath(slug);
  if (!foundPath) {
    return (
      <section className="max-w-screen-md mx-auto px-4 py-20">
        <h1>Статия не е намерена</h1>
        <p>Статията с този адрес не съществува.</p>
      </section>
    );
  }

  let raw = fs.readFileSync(foundPath, 'utf8');
  // attempt to extract content inside <body>
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const content = bodyMatch ? bodyMatch[1] : raw;
  const inlined = inlineImagesInHtml(content, slug);

  return (
    <article className="article-page max-w-screen-md mx-auto px-4 py-20">
      <div dangerouslySetInnerHTML={{ __html: inlined }} />

    </article>
  );
}
