import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compliance checklist",
  robots: { index: false, follow: true },
};

export default function CompliancePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white">Compliance checklist</h1>
      <p className="mt-4 text-zinc-400">
        Not legal advice. Use the detailed templates in the repository:
      </p>
      <ul className="mt-8 list-inside list-disc space-y-3 text-zinc-400">
        <li>
          <code className="text-sm text-zinc-300">docs/compliance-age-gating.md</code> —
          age UX, claims, Stripe Support confirmation.
        </li>
        <li>
          <code className="text-sm text-zinc-300">docs/seo-research-brief.md</code> — SERP
          and content inputs.
        </li>
      </ul>
      <p className="mt-8 text-sm text-zinc-500">
        Before launch: written counsel memo + Stripe approval for your exact SKUs and
        MCC. See also{" "}
        <Link href="/faq" className="text-smash-yellow underline">
          FAQ
        </Link>
        .
      </p>
    </div>
  );
}
