"use client";

/**
 * Virtual page views for GTM on App Router client navigations (same problem as GA4 direct).
 */
import { sendGTMEvent } from "@next/third-parties/google";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function GtmSpaPageView() {
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

    sendGTMEvent({
      event: "page_view",
      page_path: pagePath,
      page_title: typeof document !== "undefined" ? document.title : "",
      page_location:
        typeof window !== "undefined" ? window.location.href : "",
    });
  }, [pathname, search]);

  return null;
}
