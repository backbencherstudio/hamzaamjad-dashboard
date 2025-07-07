import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  images: {
    unoptimized: true,
    domains: ['i.ibb.co', 'images.unsplash.com', 'war-receives-location-grace.trycloudflare.com'],
  },
};

export default nextConfig;
