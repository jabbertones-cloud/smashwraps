import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping policy",
  description: "Shipping timeframes and carriers for Smash Wraps orders.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-zinc-400 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white">Shipping policy</h1>
      <p>
        Processing times, carriers, and delivery options for your order are shown at
        checkout. Adult signature or other requirements may apply depending on the
        product and destination.
      </p>
      <h2 className="font-display text-2xl text-white">Rates (US)</h2>
      <p>
        <strong className="text-zinc-200">Retail:</strong> $4.99 shipping per order. Orders with a
        merchandise subtotal of $50 or more qualify for free standard shipping (before shipping is
        added).
      </p>
      <p>
        <strong className="text-zinc-200">Wholesale (master cases):</strong> $1.50 shipping per
        master case on the wholesale sales sheet.
      </p>
      <h2 className="font-display text-2xl text-white">Processing</h2>
      <p>Orders typically ship within [X] business days unless noted otherwise.</p>
      <h2 className="font-display text-2xl text-white">Carriers</h2>
      <p>
        We ship via [carriers]. Restrictions may apply to certain destinations based on
        carrier rules and product requirements.
      </p>
    </div>
  );
}
