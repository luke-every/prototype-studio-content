import type { NextConfig } from "next";

// /push builds the prototype for Prototype Studio with STUDIO_BASE_PATH set to the address the studio will serve it
// from, so it runs there exactly as it does in `next dev`. Without it (dev, a normal build) nothing changes.
const studioBase = process.env.STUDIO_BASE_PATH;

const nextConfig: NextConfig = {
  ...(studioBase ? { output: "export", basePath: studioBase } : {}),
  images: {
    unoptimized: Boolean(studioBase),
    remotePatterns: [
      { protocol: "https", hostname: "a.storyblok.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
