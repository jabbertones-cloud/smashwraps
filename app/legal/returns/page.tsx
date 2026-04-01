import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description: "Returns and refund policy for Smash Wraps orders.",
};

export default function ReturnsPage() {
  return (
    <div className="page-narrow space-y-6 text-zinc-400">
      <h1 className="font-display text-4xl text-white">Returns &amp; refunds</h1>
      <p>
        Eligibility, time windows, and restocking rules depend on your order and
        applicable law. Contact support with your order number to start a return when
        allowed.
      </p>
      <h2 className="font-display text-2xl text-white">How to request a return</h2>
      <p>
        Contact support at [email] with your order number. Unopened items may be
        eligible within [X] days of delivery where allowed by law.
      </p>
    </div>
  );
}
