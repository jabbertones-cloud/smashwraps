/** Canonical site URL for email links and OG. */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://smashwraps.com"
  );
}

/** Resend requires a verified domain; format: "Name <orders@yourdomain.com>". */
export function getResendFrom(): string | null {
  const v = process.env.RESEND_FROM_EMAIL?.trim();
  return v || null;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && getResendFrom());
}
