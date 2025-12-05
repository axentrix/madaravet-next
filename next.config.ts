import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: 'out',
  // basePath: '/madaravet-next',  // Remove for custom domain
  // assetPrefix: '/madaravet-next',  // Remove for custom domain
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
