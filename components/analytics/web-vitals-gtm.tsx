"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { useReportWebVitals } from "next/web-vitals";

/** Pushes web vitals into the GTM dataLayer (map in GTM to GA4 or other tags). */
export function WebVitalsToGtm() {
  useReportWebVitals((metric) => {
    const value =
      metric.name === "CLS"
        ? Math.round(metric.value * 1000)
        : Math.round(metric.value);
    sendGTMEvent({
      event: "web_vitals",
      metric_id: metric.id,
      metric_name: metric.name,
      value,
      metric_rating: metric.rating,
    });
  });

  return null;
}
