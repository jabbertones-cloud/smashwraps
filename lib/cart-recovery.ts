import { PRODUCT_SLUG_SET } from "@/lib/products";

export type RecoveryLine = { slug: string; quantity: number };

/** Encodes cart for email recovery links (URL-safe, bounded size). */
export function encodeCartRecovery(lines: RecoveryLine[]): string {
  const safe = lines.filter(
    (l) =>
      l &&
      typeof l.slug === "string" &&
      PRODUCT_SLUG_SET.has(l.slug) &&
      typeof l.quantity === "number" &&
      l.quantity >= 1 &&
      l.quantity <= 99,
  );
  return Buffer.from(JSON.stringify(safe), "utf8").toString("base64url");
}

export function decodeCartRecovery(token: string): RecoveryLine[] | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const out: RecoveryLine[] = [];
    for (const row of parsed) {
      if (
        row &&
        typeof row === "object" &&
        "slug" in row &&
        "quantity" in row &&
        typeof (row as RecoveryLine).slug === "string" &&
        PRODUCT_SLUG_SET.has((row as RecoveryLine).slug) &&
        typeof (row as RecoveryLine).quantity === "number"
      ) {
        const q = Math.min(99, Math.max(1, Math.floor((row as RecoveryLine).quantity)));
        out.push({ slug: (row as RecoveryLine).slug, quantity: q });
      }
    }
    return out.length ? out : null;
  } catch {
    return null;
  }
}
