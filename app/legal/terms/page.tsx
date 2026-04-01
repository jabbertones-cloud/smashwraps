import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms of sale — template for counsel review.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-zinc-400 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white">Terms of service</h1>
      <p>
        <strong className="text-zinc-200">Template only.</strong> Replace with
        counsel-approved terms covering sale of goods, prohibited use, dispute
        resolution, and age requirements for your product class.
      </p>
      <h2 className="font-display text-2xl text-white">Orders</h2>
      <p>
        By placing an order, you agree to pay the amounts shown at checkout. Prices and
        availability may change until the order is confirmed.
      </p>
      <h2 className="font-display text-2xl text-white">Prohibited use</h2>
      <p>
        You may not use this site for unlawful purposes. Eligibility to purchase is
        governed by applicable law and our compliance policies.
      </p>
    </div>
  );
}
