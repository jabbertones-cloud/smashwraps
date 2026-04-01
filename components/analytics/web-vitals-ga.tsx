"use client";

/**
 * Sends Core Web Vitals to GA4 (recommended for parity with GTM+GA4 stacks that track CWV).
 */
import { sendGAEvent } from "@next/third-parties/google";
import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsToGa() {
  useReportWebVitals((metric) => {
    const value =
      metric.name === "CLS"
        ? Math.round(metric.value * 1000)
        : Math.round(metric.value);
    sendGAEvent("event", "web_vitals", {
      metric_id: metric.id,
      metric_name: metric.name,
      value,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  });

  return null;
}
