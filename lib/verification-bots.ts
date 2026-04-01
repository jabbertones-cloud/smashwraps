/**
 * User-agents that should see the public storefront without the age attestation overlay.
 * Used so automated website checks (link previews, search, and some verification fetches)
 * see the same HTML users get after confirming — not a blank modal state.
 *
 * Stripe does not publish a fixed User-Agent; this list is conservative (known crawlers +
 * common HTTP clients). If verification still fails, fix DNS/SSL first (see VERCEL-SETUP.md).
 */
export function shouldSkipAgeGateForUserAgent(
  userAgent: string | null | undefined,
): boolean {
  if (!userAgent || userAgent.length < 4) return false;

  const ua = userAgent;

  // Common search / social / assistant crawlers
  if (
    /Googlebot|Google-InspectionTool|GoogleOther|AdsBot-Google|Mediapartners-Google/i.test(
      ua,
    )
  ) {
    return true;
  }
  if (/bingbot|BingPreview|msnbot/i.test(ua)) return true;
  if (/Applebot|DuckDuckBot|YandexBot|Slurp|Baiduspider/i.test(ua)) return true;
  if (
    /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Pinterest|Slackbot|Discordbot|TelegramBot|WhatsApp|SkypeUriPreview/i.test(
      ua,
    )
  ) {
    return true;
  }
  if (/Bytespider|GPTBot|ChatGPT-User|ClaudeBot|PerplexityBot|anthropic-ai|Amazonbot/i.test(ua)) {
    return true;
  }

  // Payment / infrastructure (when present)
  if (/Stripe|Stripe\/|Braintree/i.test(ua)) return true;

  // Generic signals (headless checks, monitors)
  if (/HeadlessChrome|Puppeteer|Playwright|lighthouse|PTST|StatusCake|Pingdom|UptimeRobot/i.test(ua)) {
    return true;
  }

  return false;
}
