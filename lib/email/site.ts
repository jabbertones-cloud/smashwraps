import { getCanonicalSiteUrl } from "@/lib/site-url";

/** Canonical site URL for email links and OG. */
export function getSiteUrl(): string {
  return getCanonicalSiteUrl();
}

/** Resend requires a verified domain; format: "Name <orders@yourdomain.com>". */
export function getResendFrom(): string | null {
  const v = process.env.RESEND_FROM_EMAIL?.trim();
  return v || null;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && getResendFrom());
}
