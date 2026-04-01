/**
 * GA4 / GTM: see `components/analytics/marketing-tags.tsx` and `lib/analytics/gtag-client.ts`.
 * Direct GA uses `sendGAEvent`; with `NEXT_PUBLIC_GTM_ID`, events use `sendGTMEvent` (dataLayer).
 */
export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
