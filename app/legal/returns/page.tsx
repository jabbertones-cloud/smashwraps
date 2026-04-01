import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description: "Returns and refund policy — template for counsel and operations.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-zinc-400 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white">Returns &amp; refunds</h1>
      <p>
        <strong className="text-zinc-200">Template.</strong> Define eligibility, time
        windows, restocking fees, and health/safety exceptions for your product category.
      </p>
      <h2 className="font-display text-2xl text-white">How to request a return</h2>
      <p>
        Contact support at [email] with your order number. Unopened items may be
        eligible within [X] days of delivery where allowed by law.
      </p>
    </div>
  );
}
