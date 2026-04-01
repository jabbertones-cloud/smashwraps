/**
 * GA4: gtag.js from `GoogleAnalytics` in `components/analytics/ga4-root.tsx`.
 * Prefer `sendGAEvent` from `@next/third-parties/google` in client code (`lib/analytics/gtag-client.ts`).
 */
export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
