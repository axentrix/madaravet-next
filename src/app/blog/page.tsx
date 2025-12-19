import fs from 'fs';
import path from 'path';
import React from 'react';
import '../../app/globals.css';
import ClientBlogSwiper from '../../components/BlogSwiper';

type Post = {
  slug: string;
  title: string;
  date_iso?: string;
  date_text?: string;
  featured_local?: string | null;
};

async function getPosts(): Promise<Post[]> {
  const postsPath = path.join(process.cwd(), 'madaravet_export', 'posts.json');
  let posts: Post[] = [];

  // try posts.json first
  try {
    if (fs.existsSync(postsPath)) {
      const raw = fs.readFileSync(postsPath, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) posts = data;
    }
  } catch (e) {
    console.error('Failed to read posts.json', e);
  }

  // also scan posts directory for any additional HTML files and include them
  try {
    const postsDir = path.join(process.cwd(), 'madaravet_export', 'posts');
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir).filter(f => f.toLowerCase().endsWith('.html'));
      files.forEach(file => {
        const slug = file.replace(/\.html?$/i, '');
        const exists = posts.find(p => p.slug === slug);
        if (!exists) {
          try {
            const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
            // extract title
            let title = slug;
            const titleTag = content.match(/<title>([^<]+)<\/title>/i);
            const h1Tag = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
            if (titleTag && titleTag[1]) title = titleTag[1].trim();
            else if (h1Tag && h1Tag[1]) title = h1Tag[1].trim();

            // extract simple date by searching for class="date" or class='date'
            let dateText: string | undefined = undefined;
            let idx = content.indexOf('class="date"');
            if (idx === -1) idx = content.indexOf("class='date'");
            if (idx !== -1) {
              const start = content.indexOf('>', idx);
              if (start !== -1) {
                const end = content.indexOf('<', start + 1);
                if (end !== -1) dateText = content.substring(start + 1, end).trim();
              }
            }

            posts.push({ slug, title, date_text: dateText });
          } catch (e) {
            posts.push({ slug, title: slug });
          }
        }
      });
    }
  } catch (e) {
    console.error('Failed to scan posts directory', e);
  }

  // sort by date_iso or date_text if available
  posts.sort((a, b) => {
    const da = (a.date_iso || a.date_text || '').toString();
    const db = (b.date_iso || b.date_text || '').toString();
    return db.localeCompare(da);
  });

  return posts;
}

function getImageDataURL(slug: string, filename?: string): string | null {
  try {
    const imgDir = path.join(process.cwd(), 'madaravet_export', 'images', slug);
    if (!fs.existsSync(imgDir)) return null;
    
    let targetFile: string;
    if (filename) {
      // Use specific filename if provided
      targetFile = filename;
    } else {
      // Otherwise get first file alphabetically
      const files = fs.readdirSync(imgDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f));
      if (!files || files.length === 0) return null;
      targetFile = files[0];
    }
    
    const imgPath = path.join(imgDir, targetFile);
    if (!fs.existsSync(imgPath)) return null;
    
    const buf = fs.readFileSync(imgPath);
    const ext = path.extname(targetFile).toLowerCase().replace('.', '');
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    const b64 = buf.toString('base64');
    return `data:image/${mime};base64,${b64}`;
  } catch (e) {
    console.error('getImageDataURL error', e);
    return null;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  // attach image data URLs synchronously on the server so client swiper receives them
  const postsWithImages = posts.map(p => ({
    ...p,
    // Prioritize custom image from posts.json, then try directory scan with optional filename
    image: (p as any).image || getImageDataURL(p.slug, (p as any).image_filename) || null
  }));

  return (
    <section id="blog-page" className="blog-page page-blog max-w-screen-xl mx-auto px-4 ">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Блог</h1>

      <p className="mb-6">Последни статии</p>

      {/* Client-side Swiper component */}
      <React.Suspense fallback={<div>Loading articles...</div>}>
        {/* Dynamically import client component to avoid SSR issues */}
        <ClientBlogSwiper posts={postsWithImages} />
      </React.Suspense>

    </section>
  );
}
