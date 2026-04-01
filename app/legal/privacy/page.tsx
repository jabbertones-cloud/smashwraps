import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Smash Wraps handles personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="page-narrow space-y-6 text-zinc-400">
      <h1 className="font-display text-4xl text-white">Privacy policy</h1>
      <p>
        We respect your privacy. This page describes what we collect and how we use it
        when you use this site or complete a purchase.
      </p>
      <h2 className="font-display text-2xl text-white">What we collect</h2>
      <p>
        Checkout is processed by Stripe. We may receive name, email, shipping address,
        and payment status as provided by Stripe and your order.
      </p>
      <h2 className="font-display text-2xl text-white">Cookies and analytics</h2>
      <p>
        We may use analytics to understand how the site is used. If non-essential
        trackers are added, we will follow consent requirements for your region.
      </p>
      <h2 className="font-display text-2xl text-white">Contact</h2>
      <p>
        For privacy-related requests, use the contact information on the About page.
      </p>
    </div>
  );
}
