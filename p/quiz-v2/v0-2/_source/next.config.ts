import type { NextConfig } from "next";

// TODO(lift): prototype hosting only — Prototype Studio serves a static export from a sub-path,
// so the production build emits relative asset URLs. The real app keeps the default server build.
const isExport = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isExport ? "export" : undefined,
  assetPrefix: isExport ? "." : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "a.storyblok.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
