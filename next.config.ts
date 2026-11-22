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
  // Fallback pages must use their own Worker assets; the retail Worker's
  // /_next/* route is hosted on smashcones.com and serves its own manifest.
  assetPrefix: process.env.SMASHCONES_WORKER_ROLE === "retail"
    ? undefined
    : "https://smashwraps.smatdesigns.workers.dev",
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
