import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: '/madaravet-next',
  assetPrefix: '/madaravet-next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
