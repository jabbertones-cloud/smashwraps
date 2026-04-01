"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { Button } from "@/components/ui/button";
import {
  computeWholesaleShippingCents,
  sumWholesaleMasterCases,
} from "@/lib/shipping";
import {
  CHOPS_PER_MASTER_CASE,
  RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
  TUBES_PER_RETAIL_BOX,
  WHOLESALE_PRODUCTS,
  type WholesaleProduct,
} from "@/lib/wholesale-products";

function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

type QtyMap = Record<string, number>;

export function WholesaleSalesSheet() {
  const [qty, setQty] = useState<QtyMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [inquiry, setInquiry] = useState({
    businessName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [inquiryStatus, setInquiryStatus] = useState<string | null>(null);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const lineItems = useMemo(() => {
    const out: { slug: string; quantity: number }[] = [];
    for (const p of WHOLESALE_PRODUCTS) {
      const q = qty[p.slug] ?? 0;
      if (q > 0) out.push({ slug: p.slug, quantity: q });
    }
    return out;
  }, [qty]);

  const estimatedCents = useMemo(() => {
    let t = 0;
    for (const p of WHOLESALE_PRODUCTS) {
      const q = qty[p.slug] ?? 0;
      t += p.priceCents * q;
    }
    return t;
  }, [qty]);

  const masterCaseCount = useMemo(
    () => sumWholesaleMasterCases(lineItems),
    [lineItems],
  );
  const shippingCents = useMemo(
    () => computeWholesaleShippingCents(masterCaseCount),
    [masterCaseCount],
  );
  const estimatedTotalCents = estimatedCents + shippingCents;

  async function checkout() {
    setError(null);
    if (!lineItems.length) {
      setError("Add at least one master case with quantity 1 or more.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    setInquiryStatus(null);
    setInquiryLoading(true);
    try {
      const res = await fetch("/api/email/wholesale-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: inquiry.businessName.trim(),
          email: inquiry.email.trim(),
          phone: inquiry.phone.trim() || undefined,
          message: inquiry.message.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setInquiryStatus(data.message ?? "Could not send — try again.");
        return;
      }
      setInquiryStatus(data.message ?? "Sent.");
      setInquiry({
        businessName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      setInquiryStatus("Network error.");
    } finally {
      setInquiryLoading(false);
    }
  }

  function setQtyFor(slug: string, n: number) {
    const v = Math.min(99, Math.max(0, Math.floor(n)));
    setQty((prev) => {
      const next = { ...prev };
      if (v <= 0) delete next[slug];
      else next[slug] = v;
      return next;
    });
  }

  return (
    <div className="section-inner section-y">
      <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
        <span className="text-zinc-200">Buying single retail boxes?</span>{" "}
        <Link href="/shop" className="text-smash-yellow underline hover:text-yellow-300">
          Shop the storefront
        </Link>{" "}
        — 3-packs only, not master cases.
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        B2B · not indexed
      </p>
      <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">
        Wholesale sales sheet
      </h1>
      <p className="mt-4 max-w-3xl text-zinc-400">
        One <strong className="text-zinc-200">master case</strong> ={" "}
        <strong className="text-zinc-200">
          {RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE} retail three-pack boxes
        </strong>{" "}
        ({RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE} × {TUBES_PER_RETAIL_BOX} tubes ={" "}
        {CHOPS_PER_MASTER_CASE} Chops). Wholesale: <strong className="text-zinc-200">$19</strong>{" "}
        per master case (1g) and <strong className="text-zinc-200">$20</strong> (2g), all flavors.
        MOQ: confirm with your rep. Set quantities per line below, then continue to payment. This page
        is not indexed.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/70 p-4 md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Estimated subtotal
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{money(estimatedCents)}</p>
            </div>
            {masterCaseCount > 0 && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Shipping (US)
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {money(shippingCents)}
                    <span className="ml-2 text-xs font-normal text-zinc-500">
                      ({masterCaseCount} master case{masterCaseCount === 1 ? "" : "s"} × $1.50)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Estimated total
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {money(estimatedTotalCents)}
                  </p>
                </div>
              </>
            )}
            {lineItems.length > 0 && (
              <p className="text-xs text-zinc-500">
                {lineItems.length} line{lineItems.length === 1 ? "" : "s"} · tax at payment if
                applicable
              </p>
            )}
          </div>
          <Button
            type="button"
            className="w-full shrink-0 uppercase tracking-wider sm:w-auto sm:min-w-[200px]"
            disabled={loading || !lineItems.length}
            onClick={() => void checkout()}
          >
            {loading ? "Opening checkout…" : "Continue to payment"}
          </Button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950/50">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Flavor / size</th>
              <th className="px-4 py-3">WS / master case</th>
              <th className="px-4 py-3">Suggested retail / master case</th>
              <th className="px-4 py-3 text-right">Qty (master cases)</th>
            </tr>
          </thead>
          <tbody>
            {WHOLESALE_PRODUCTS.map((p: WholesaleProduct) => (
              <tr
                key={p.slug}
                className="border-b border-white/[0.06] transition hover:bg-white/[0.02]"
              >
                <td className="px-4 py-4 align-middle font-mono text-xs text-zinc-500">
                  {p.slug.replace(/^wholesale-/, "")}
                </td>
                <td className="px-4 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950/60">
                      <AssetImage
                        src={p.image}
                        alt=""
                        width={64}
                        height={64}
                        className="h-14 w-14 object-cover"
                        aria-hidden
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">{p.flavorLabel}</div>
                      <div className="text-xs text-zinc-500">
                        {p.grams} · {RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE}× three-packs ·{" "}
                        {CHOPS_PER_MASTER_CASE} Chops
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 align-middle text-white">{money(p.priceCents)}</td>
                <td className="px-4 py-4 align-middle text-zinc-400">
                  {money(p.suggestedRetailCaseCents)}
                </td>
                <td className="px-4 py-4 align-middle text-right">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={qty[p.slug] ?? 0}
                    onChange={(e) => setQtyFor(p.slug, Number(e.target.value))}
                    className="w-16 rounded-lg border border-white/15 bg-black/50 px-2 py-1.5 text-center text-white"
                    aria-label={`Master cases for ${p.name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-20 border-t border-white/10 pt-16">
        <h2 className="font-display text-2xl text-white md:text-3xl">Need terms or a PO?</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Send a note for Net-terms, POs, or questions — we’ll reply by email. You can still place
          cases above anytime.
        </p>
        <form
          onSubmit={(e) => void submitInquiry(e)}
          className="mt-8 grid max-w-xl gap-4"
        >
          <div>
            <label
              htmlFor="wholesale-inquiry-business"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
            >
              Business name
            </label>
            <input
              id="wholesale-inquiry-business"
              required
              name="businessName"
              value={inquiry.businessName}
              onChange={(e) =>
                setInquiry((s) => ({ ...s, businessName: e.target.value }))
              }
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white"
              autoComplete="organization"
            />
          </div>
          <div>
            <label
              htmlFor="wholesale-inquiry-email"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
            >
              Email
            </label>
            <input
              id="wholesale-inquiry-email"
              required
              type="email"
              name="email"
              value={inquiry.email}
              onChange={(e) => setInquiry((s) => ({ ...s, email: e.target.value }))}
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="wholesale-inquiry-phone"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
            >
              Phone (optional)
            </label>
            <input
              id="wholesale-inquiry-phone"
              type="tel"
              name="phone"
              value={inquiry.phone}
              onChange={(e) => setInquiry((s) => ({ ...s, phone: e.target.value }))}
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white"
              autoComplete="tel"
            />
          </div>
          <div>
            <label
              htmlFor="wholesale-inquiry-message"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
            >
              Message (optional)
            </label>
            <textarea
              id="wholesale-inquiry-message"
              name="message"
              rows={4}
              value={inquiry.message}
              onChange={(e) =>
                setInquiry((s) => ({ ...s, message: e.target.value }))
              }
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white"
            />
          </div>
          <Button type="submit" variant="outline" disabled={inquiryLoading}>
            {inquiryLoading ? "Sending…" : "Send inquiry"}
          </Button>
          {inquiryStatus && (
            <p className="text-sm text-zinc-400" role="status">
              {inquiryStatus}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
