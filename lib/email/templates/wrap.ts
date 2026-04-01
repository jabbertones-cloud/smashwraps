import { getSiteUrl } from "@/lib/email/site";

/** Shared dark HTML shell for transactional email (matches storefront mood). */
export function emailShell(input: {
  title: string;
  preheader?: string;
  bodyHtml: string;
}): string {
  const url = getSiteUrl();
  const pre = input.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(input.preheader)}</div>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;background:#0a0a0a;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#e4e4e7;">
${pre}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" style="max-width:520px;background:#111;border:1px solid #27272a;border-radius:12px;overflow:hidden;">
      <tr><td style="padding:24px 24px 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#facc15;">Smash Wraps</td></tr>
      <tr><td style="padding:8px 24px 4px;font-size:22px;font-weight:700;color:#fafafa;">${escapeHtml(input.title)}</td></tr>
      <tr><td style="padding:16px 24px 28px;font-size:15px;line-height:1.6;color:#a1a1aa;">${input.bodyHtml}</td></tr>
      <tr><td style="padding:16px 24px;border-top:1px solid #27272a;font-size:12px;line-height:1.7;color:#71717a;">
        <a href="${url}" style="color:#facc15;text-decoration:none;">${escapeHtml(url.replace(/^https?:\/\//, ""))}</a><br/>
        <a href="${url}/legal/shipping" style="color:#71717a;">Shipping</a>
        · <a href="${url}/legal/returns" style="color:#71717a;">Returns</a>
        · <a href="${url}/faq" style="color:#71717a;">FAQ</a>
        · <a href="${url}/legal/privacy" style="color:#71717a;">Privacy</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

export function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:16px 0;"><tr><td style="border-radius:9999px;background:#facc15;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 24px;font-weight:600;color:#0a0a0a;text-decoration:none;">${escapeHtml(label)}</a>
</td></tr></table>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
