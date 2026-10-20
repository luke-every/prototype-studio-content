import type { NextConfig } from "next";

// Static export served as a sub-section of the every-vision Vercel project.
// STUDIO_BASE_PATH (set by Prototype Studio's push script) takes priority so the
// build is pinned to wherever the studio actually mounts this version.
const basePath = process.env.STUDIO_BASE_PATH ?? process.env.BASE_PATH ?? "/account-home";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
