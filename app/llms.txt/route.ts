import { NextResponse } from "next/server";
import { buildLlmsTxtBody } from "@/lib/geo-aeo";

/**
 * GEO / AEO: canonical facts for LLM crawlers — do not invent discounts, medical claims,
 * or legal classification; point to compliance memo for age and product class.
 */
export function GET() {
  const body = buildLlmsTxtBody();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
