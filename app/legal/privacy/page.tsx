import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Smash Wraps handles personal data — template for counsel review.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-zinc-400 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white">Privacy policy</h1>
      <p>
        <strong className="text-zinc-200">Template only.</strong> Have qualified counsel
        review and replace this document before collecting personal data in production.
      </p>
      <h2 className="font-display text-2xl text-white">What we collect</h2>
      <p>
        Checkout is processed by Stripe. We may receive name, email, shipping address,
        and payment status as provided by Stripe and your store configuration.
      </p>
      <h2 className="font-display text-2xl text-white">Cookies and analytics</h2>
      <p>
        Vercel Analytics may collect usage metrics. If you add non-essential trackers,
        implement consent appropriate to your jurisdictions.
      </p>
      <h2 className="font-display text-2xl text-white">Contact</h2>
      <p>Add a business contact email and physical address for data requests.</p>
    </div>
  );
}
