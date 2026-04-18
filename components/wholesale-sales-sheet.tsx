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

const STAT_CARDS = [
  {
    num: "$19",
    label: "per case — 1g",
    sub: "Wholesale price",
    accent: "text-smash-yellow",
  },
  {
    num: "$20",
    label: "per case — 2g",
    sub: "Wholesale price",
    accent: "text-smash-yellow",
  },
  {
    num: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    label: "retail boxes",
    sub: "Per master case",
    accent: "text-zinc-200",
  },
  {
    num: CHOPS_PER_MASTER_CASE,
    label: "total Chops",
    sub: "Per master case",
    accent: "text-zinc-200",
  },
];

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
    <div className="relative">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
        aria-hidden
      />

      {/* Gradient mesh header */}
      <div
        className="relative overflow-hidden border-b border-white/[0.06] pb-16 pt-8"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 10% 40%, rgba(245,193,24,0.05), transparent 65%), radial-gradient(ellipse 50% 50% at 90% 20%, rgba(196,132,252,0.04), transparent 60%), #080808",
        }}
      >
        {/* grid lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            WebkitMask:
              "radial-gradient(ellipse 90% 100% at 10% 40%, black 10%, transparent 70%)",
            mask: "radial-gradient(ellipse 90% 100% at 10% 40%, black 10%, transparent 70%)",
          }}
          aria-hidden
        />

        <div className="section-inner relative">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-smash-yellow" />
            <span className="font-display text-xs tracking-[0.25em] text-smash-yellow">
              B2B · NOT INDEXED
            </span>
          </div>

          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-smash-yellow" />
            <span className="font-display text-xs tracking-[0.3em] text-zinc-500">
              WHOLESALE
            </span>
          </div>
          <h1 className="font-display text-5xl text-white md:text-7xl lg:text-8xl">
            SALES SHEET
          </h1>
          <p className="mt-5 max-w-2xl text-zinc-400">
            One{" "}
            <strong className="text-zinc-200">master case</strong> ={" "}
            <strong className="text-zinc-200">
              {RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE} retail three-pack boxes
            </strong>{" "}
            ({RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE} × {TUBES_PER_RETAIL_BOX} tubes ={" "}
            {CHOPS_PER_MASTER_CASE} Chops). Set quantities per SKU below, then
            continue to payment. MOQ: confirm with your rep.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
            <span className="text-zinc-300">Buying single retail boxes?</span>{" "}
            <Link
              href="/shop"
              className="text-smash-yellow underline hover:text-yellow-300"
            >
              Shop the storefront
            </Link>
          </div>
        </div>
      </div>

      <div className="section-inner section-y">
        {/* Stat bento grid */}
        <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STAT_CARDS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/[0.07] bg-zinc-950/70 p-5 transition-colors hover:border-white/[0.12]"
            >
              <p
                className={`font-display text-4xl leading-none tracking-tight ${s.accent}`}
              >
                {s.num}
              </p>
              <p className="mt-1 text-sm font-medium text-white">{s.label}</p>
              <p className="mt-0.5 text-xs text-zinc-600">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Order summary + checkout */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-5 md:p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,193,24,0.03) 0%, transparent 50%), rgba(9,9,11,0.7)",
          }}
        >
          <p className="mb-4 font-display text-xs tracking-[0.3em] text-zinc-500">
            ORDER SUMMARY
          </p>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Subtotal
                </p>
                <p className="mt-1 font-display text-3xl text-white">
                  {money(estimatedCents)}
                </p>
              </div>
              {masterCaseCount > 0 && (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Shipping (US)
                    </p>
                    <p className="mt-1 font-display text-3xl text-white">
                      {money(shippingCents)}
                      <span className="ml-2 font-sans text-xs font-normal text-zinc-500">
                        {masterCaseCount} case{masterCaseCount === 1 ? "" : "s"} × $1.50
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Est. total
                    </p>
                    <p className="mt-1 font-display text-4xl text-smash-yellow">
                      {money(estimatedTotalCents)}
                    </p>
                  </div>
                </>
              )}
            </div>
            <Button
              type="button"
              className="w-full shrink-0 text-xs uppercase tracking-widest sm:w-auto sm:min-w-[200px]"
              disabled={loading || !lineItems.length}
              onClick={() => void checkout()}
            >
              {loading ? "Opening checkout…" : "Continue to payment"}
            </Button>
          </div>
          {lineItems.length > 0 && (
            <p className="mt-3 text-xs text-zinc-600">
              {lineItems.length} line{lineItems.length === 1 ? "" : "s"} selected · tax calculated at payment if applicable
            </p>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Products table */}
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-zinc-950/50">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-5 py-4 font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-600">
                  SKU
                </th>
                <th className="px-5 py-4 font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-600">
                  Flavor / size
                </th>
                <th className="px-5 py-4 font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-600">
                  WS / master case
                </th>
                <th className="px-5 py-4 font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-600">
                  Suggested retail / case
                </th>
                <th className="px-5 py-4 text-right font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-600">
                  Qty (cases)
                </th>
              </tr>
            </thead>
            <tbody>
              {WHOLESALE_PRODUCTS.map((p: WholesaleProduct) => {
                const hasQty = (qty[p.slug] ?? 0) > 0;
                return (
                  <tr
                    key={p.slug}
                    className={`border-b border-white/[0.05] transition-colors ${hasQty ? "bg-smash-yellow/[0.03]" : "hover:bg-white/[0.015]"}`}
                  >
                    <td className="px-5 py-4 align-middle font-mono text-xs text-zinc-600">
                      {p.slug.replace(/^wholesale-/, "")}
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60">
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
                          <div className="mt-0.5 text-xs text-zinc-600">
                            {p.grams} · {RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE}× three-packs ·{" "}
                            {CHOPS_PER_MASTER_CASE} Chops
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <span className="font-display text-xl text-white">
                        {money(p.priceCents)}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle text-zinc-400">
                      {money(p.suggestedRetailCaseCents)}
                    </td>
                    <td className="px-5 py-4 align-middle text-right">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={qty[p.slug] ?? 0}
                        onChange={(e) => setQtyFor(p.slug, Number(e.target.value))}
                        className={`w-16 rounded-xl border px-2 py-2 text-center text-white transition-colors ${hasQty ? "border-smash-yellow/30 bg-smash-yellow/5" : "border-white/15 bg-black/50"}`}
                        aria-label={`Master cases for ${p.name}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Inquiry form */}
        <section className="mt-20 border-t border-white/[0.06] pt-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-smash-yellow" />
            <span className="font-display text-xs tracking-[0.3em] text-zinc-500">NET TERMS · PO · QUESTIONS</span>
          </div>
          <h2 className="font-display text-3xl text-white md:text-4xl">
            Need terms or a PO?
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Send a note for Net-terms, POs, or questions — we'll reply by email.
            You can still place cases above anytime.
          </p>
          <form
            onSubmit={(e) => void submitInquiry(e)}
            className="mt-8 grid max-w-xl gap-4"
          >
            <div>
              <label
                htmlFor="wholesale-inquiry-business"
                className="mb-1.5 block font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-500"
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
                className="w-full rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white placeholder:text-zinc-700 focus:border-smash-yellow/30 focus:outline-none transition-colors"
                autoComplete="organization"
              />
            </div>
            <div>
              <label
                htmlFor="wholesale-inquiry-email"
                className="mb-1.5 block font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-500"
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
                className="w-full rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white placeholder:text-zinc-700 focus:border-smash-yellow/30 focus:outline-none transition-colors"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="wholesale-inquiry-phone"
                className="mb-1.5 block font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-500"
              >
                Phone <span className="text-zinc-700">(optional)</span>
              </label>
              <input
                id="wholesale-inquiry-phone"
                type="tel"
                name="phone"
                value={inquiry.phone}
                onChange={(e) => setInquiry((s) => ({ ...s, phone: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white placeholder:text-zinc-700 focus:border-smash-yellow/30 focus:outline-none transition-colors"
                autoComplete="tel"
              />
            </div>
            <div>
              <label
                htmlFor="wholesale-inquiry-message"
                className="mb-1.5 block font-display text-[0.6rem] uppercase tracking-[0.25em] text-zinc-500"
              >
                Message <span className="text-zinc-700">(optional)</span>
              </label>
              <textarea
                id="wholesale-inquiry-message"
                name="message"
                rows={4}
                value={inquiry.message}
                onChange={(e) =>
                  setInquiry((s) => ({ ...s, message: e.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white placeholder:text-zinc-700 focus:border-smash-yellow/30 focus:outline-none transition-colors resize-none"
              />
            </div>
            <Button type="submit" variant="outline" disabled={inquiryLoading} className="text-xs uppercase tracking-widest">
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
    </div>
  );
}
