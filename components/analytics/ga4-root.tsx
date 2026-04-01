"use client";

/**
 * GA4: loads gtag + sends page_view on every App Router navigation (client-side transitions
 * do not reload the page, so the default snippet alone misses route changes).
 */
import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const GA_ID_RE = /^G-[A-Z0-9]+$/i;

type Props = {
  gaId: string;
  /** Set NEXT_PUBLIC_GA_DEBUG=1 — shows hits in GA4 DebugView + browser console. */
  debugMode?: boolean;
};

function Ga4SpaPageView({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipFirst = useRef(true);

  const search = searchParams.toString();

  useEffect(() => {
    const pagePath = search ? `${pathname}?${search}` : pathname;

    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }

    if (typeof window.gtag !== "function") return;
    window.gtag("config", gaId, {
      page_path: pagePath,
    });
  }, [pathname, search, gaId]);

  return null;
}

export function Ga4Root({ gaId, debugMode }: Props) {
  const trimmed = gaId.trim();

  if (!trimmed || !GA_ID_RE.test(trimmed)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ga4] NEXT_PUBLIC_GA_MEASUREMENT_ID must look like G-XXXXXXXX (set in .env, rebuild).",
      );
    }
    return null;
  }

  return (
    <>
      <GoogleAnalytics gaId={trimmed} debugMode={debugMode} />
      <Suspense fallback={null}>
        <Ga4SpaPageView gaId={trimmed} />
      </Suspense>
    </>
  );
}
