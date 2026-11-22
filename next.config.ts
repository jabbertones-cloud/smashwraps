import { existsSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * Local monorepo (e.g. under claw-architect): trace from parent so `next build` resolves deps.
 * When installed in isolation, do not trace outside the app root.
 */
const parentPkg = path.join(process.cwd(), "..", "package.json");
const monorepoTracing =
  existsSync(parentPkg)
    ? { outputFileTracingRoot: path.join(process.cwd(), "..") }
    : {};

const nextConfig: NextConfig = {
  ...monorepoTracing,
  // The zone's legacy /_next/* route belongs to the separate retail Worker.
  // Load this Worker's hashed assets directly from its stable Cloudflare origin
  // so landing/informational pages never request the retail Worker's manifest.
  assetPrefix: "https://smashwraps.smatdesigns.workers.dev",
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
