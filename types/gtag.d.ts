/** GA4 / gtag.js loaded by @next/third-parties/google */
export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
