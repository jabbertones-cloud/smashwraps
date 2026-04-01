import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping policy",
  description: "Shipping timeframes and carriers — template for operations.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-zinc-400 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white">Shipping policy</h1>
      <p>
        <strong className="text-zinc-200">Template.</strong> Fill in processing time,
        carriers, signature requirements, and restricted destinations after operations
        and counsel sign-off.
      </p>
      <h2 className="font-display text-2xl text-white">Processing</h2>
      <p>Orders typically ship within [X] business days unless noted otherwise.</p>
      <h2 className="font-display text-2xl text-white">Carriers</h2>
      <p>
        We ship via [carriers]. Adult signature or other requirements may apply per
        product classification and destination.
      </p>
    </div>
  );
}
