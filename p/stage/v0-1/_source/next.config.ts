import type { NextConfig } from "next";
import { resolve } from "node:path";

// /push builds the prototype for Prototype Studio with STUDIO_BASE_PATH set to the address the studio will serve it
// from, so it runs there exactly as it does in `next dev`. Without it (dev, a normal build) nothing changes.
const studioBase = process.env.STUDIO_BASE_PATH;

const nextConfig: NextConfig = {
  devIndicators: false,
  // Lets a phone on the same wifi open the dev server at <this-mac>.local (Next blocks other hosts by default).
  allowedDevOrigins: ["*.local"],
  ...(studioBase ? { output: "export", basePath: studioBase } : {}),
  turbopack: {
    // Production's files are imported from ~/Claude/every-website-main (see "paths" in tsconfig.json), so the bundler's
    // root has to cover it as well as this folder: ~/Claude/prototypes/<name> -> ~/Claude.
    root: resolve(process.cwd(), "../.."),
    // The CMS package's server entry carries a Server Action, which a static export refuses. This stands in for it.
    resolveAlias: { "@storyblok/react/rsc": "./src/lib/storyblok-rsc.ts" },
  },
  images: {
    unoptimized: Boolean(studioBase),
    remotePatterns: [
      { protocol: "https", hostname: "a.storyblok.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
