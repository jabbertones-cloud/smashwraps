import { existsSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * Local monorepo (e.g. under claw-architect): trace from parent so `next build` resolves deps.
 * Standalone deploy (Vercel/GitHub): do not set — parent is outside the deploy root and breaks tracing.
 */
const parentPkg = path.join(process.cwd(), "..", "package.json");
const isVercel = Boolean(process.env.VERCEL);
const monorepoTracing =
  !isVercel && existsSync(parentPkg)
    ? { outputFileTracingRoot: path.join(process.cwd(), "..") }
    : {};

const nextConfig: NextConfig = {
  ...monorepoTracing,
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
