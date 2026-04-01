import type { NextConfig } from "next";
import path from "node:path";

/** Monorepo: trace files from repo root when multiple lockfiles exist. */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
