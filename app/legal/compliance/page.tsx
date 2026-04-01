import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compliance",
  description: "Eligibility and compliance information for Smash Wraps.",
  robots: { index: false, follow: true },
};

export default function CompliancePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white">Compliance</h1>
      <p className="mt-4 text-zinc-400">
        This page summarizes how we approach age verification and product eligibility on
        this site. It is general information, not legal advice.
      </p>
      <p className="mt-6 text-zinc-400">
        You must meet the minimum age and eligibility requirements for this product
        where you live. Orders are subject to verification, carrier rules, and
        applicable law.
      </p>
      <p className="mt-8 text-sm text-zinc-500">
        More questions? See the{" "}
        <Link href="/faq" className="text-smash-yellow underline">
          FAQ
        </Link>
        .
      </p>
    </div>
  );
}
