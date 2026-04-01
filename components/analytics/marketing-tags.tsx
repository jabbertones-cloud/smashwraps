"use client";

/**
 * Single entry for measurement: **either** GTM **or** direct GA4 (same pattern as many SkynPatch /
 * Shopify / headless setups — GTM loads GA4 + Ads inside the container; direct GA4 skips GTM).
 * Do not set both IDs unless you know how to dedupe (usually one or the other).
 */
import { GoogleTagManager } from "@next/third-parties/google";
import { Suspense } from "react";
import { Ga4Root } from "@/components/analytics/ga4-root";
import { GtmSpaPageView } from "@/components/analytics/gtm-spa-page-view";
import { WebVitalsToGa } from "@/components/analytics/web-vitals-ga";
import { WebVitalsToGtm } from "@/components/analytics/web-vitals-gtm";

const GTM_ID_RE = /^GTM-[A-Z0-9]+$/i;

export function MarketingTags() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const debugMode = process.env.NEXT_PUBLIC_GA_DEBUG === "1";

  if (gtmId) {
    if (!GTM_ID_RE.test(gtmId)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[marketing-tags] NEXT_PUBLIC_GTM_ID should look like GTM-XXXXXXX (ignored).",
        );
      }
      return null;
    }

    return (
      <>
        <GoogleTagManager gtmId={gtmId} />
        <Suspense fallback={null}>
          <GtmSpaPageView />
        </Suspense>
        <WebVitalsToGtm />
      </>
    );
  }

  if (gaId) {
    return (
      <>
        <Ga4Root gaId={gaId} debugMode={debugMode} />
        <WebVitalsToGa />
      </>
    );
  }

  return null;
}
