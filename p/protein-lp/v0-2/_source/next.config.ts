import type { NextConfig } from "next";

// TODO(lift): prototype hosting only — Prototype Studio serves a static export from a sub-path, so the production
// build emits relative asset URLs, and the API route (which a static export can't run) is left out; see
// StaticProductApi. The real app keeps the default server build.
const isExport = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isExport ? "export" : undefined,
  assetPrefix: isExport ? "." : undefined,
  // route.ts is a ".ts" file; the pages and layouts are ".tsx", so this drops only the route handlers from the export.
  pageExtensions: isExport ? ["tsx"] : undefined,
  images: {
    // Local images are referenced as "img/x.png" (relative, no leading slash) so they resolve under the studio's sub-path.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "a.storyblok.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
