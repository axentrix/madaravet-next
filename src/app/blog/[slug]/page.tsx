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

    // Load posts.json to get post metadata including image
    const postsJsonPath = path.join(process.cwd(), 'madaravet_export', 'posts.json');
    let posts: any[] = [];
    let currentPost: any = null;
    let postIndex = -1;
    
    if (fs.existsSync(postsJsonPath)) {
      try {
        const postsJson = fs.readFileSync(postsJsonPath, 'utf8');
        posts = JSON.parse(postsJson);
        postIndex = posts.findIndex(p => p.slug === slug);
        if (postIndex >= 0) {
          currentPost = posts[postIndex];
        }
      } catch (e) {
        console.error('Error loading posts.json:', e);
      }
    }

    // Determine the featured image
    let featuredImage = null;
    if (currentPost?.image) {
      featuredImage = currentPost.image;
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

    // Extract header and main content sections to insert featured image in the right place
    let headerContent = '';
    let mainContent = inlined;
    let extractedImage = '';
    
    // Try to extract the header section (title, date, link back)
    const headerMatch = inlined.match(/(<header>[\s\S]*?<\/header>)/i);
    if (headerMatch) {
      headerContent = headerMatch[1];
      // Remove header from main content
      mainContent = inlined.replace(headerMatch[1], '');
    }

    // Extract the first image from content if it exists
    const imgMatch = mainContent.match(/(<a[^>]*>)?(<img[^>]+>)((?:<\/a>)?)/i);
    if (imgMatch) {
      // Extract only the <img> tag (group 2), without <a> tags
      extractedImage = imgMatch[2];
      // Remove the entire match (including <a> tags) from main content
      mainContent = mainContent.replace(imgMatch[0], '');
    }

    // Determine which image to show: prioritize featured image from posts.json
    let imageToDisplay = '';
    if (featuredImage) {
      // Use featured image from posts.json (same as blog listing)
      imageToDisplay = `<img src="${featuredImage}" alt="${currentPost?.title || 'Blog post image'}" class="w-full h-auto rounded-lg" />`;
    } else if (extractedImage) {
      // Use the extracted image from content
      imageToDisplay = extractedImage;
    } else {
      // Try scanning directory with optional filename as last resort
      const imageSrc = getImageDataURL(slug, currentPost?.image_filename);
      if (imageSrc) {
        imageToDisplay = `<img src="${imageSrc}" alt="${currentPost?.title || 'Blog post image'}" class="w-full h-auto rounded-lg" />`;
      }
    }

    return (
      <article className="article-page max-w-screen-md mx-auto px-4 py-10">
        {/* Title, Date, Link Back */}
        {headerContent && <div dangerouslySetInnerHTML={{ __html: headerContent }} />}
        
        {/* Featured Image */}
        {imageToDisplay && (
          <div className="featured-image mb-8" dangerouslySetInnerHTML={{ __html: imageToDisplay }} />
        )}
        
        {/* Main Content */}
        <div dangerouslySetInnerHTML={{ __html: mainContent }} />
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
