"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Reset scroll position on client navigation (App Router does not scroll to top by default). */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
