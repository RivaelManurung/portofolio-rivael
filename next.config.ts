import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback. Screenshots of dense UI benefit
    // most — they're the heaviest thing the page loads.
    formats: ["image/avif", "image/webp"],
  },
  // Long-lived immutable caching is handled by Vercel; nothing to add.
};

export default nextConfig;
