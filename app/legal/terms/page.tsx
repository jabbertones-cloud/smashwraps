import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms of sale for Smash Wraps and this website.",
};

export default function TermsPage() {
  return (
    <div className="page-narrow space-y-6 text-zinc-400">
      <h1 className="font-display text-4xl text-white">Terms of service</h1>
      <p>
        These terms govern your use of this site and purchases made here. By ordering,
        you agree to pay the amounts shown at checkout and to follow applicable laws for
        your location.
      </p>
      <h2 className="font-display text-2xl text-white">Orders</h2>
      <p>
        By placing an order, you agree to pay the amounts shown at checkout. Prices and
        availability may change until the order is confirmed.
      </p>
      <h2 className="font-display text-2xl text-white">Prohibited use</h2>
      <p>
        You may not use this site for unlawful purposes. Eligibility to purchase is
        governed by applicable law and our policies.
      </p>
    </div>
  );
}
