import type { Metadata } from "next";
import Script from "next/script";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { faqPageJsonLd } from "@/lib/json-ld";
import { getCanonicalSiteUrl } from "@/lib/site-url";

const faqUrl = `${getCanonicalSiteUrl()}/faq`;

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about The CHOP, checkout, shipping, returns, and eligibility — Smash Wraps.",
  alternates: { canonical: faqUrl },
  openGraph: { title: "FAQ — Smash Wraps", url: faqUrl },
};

export default function FaqPage() {
  const jsonLd = faqPageJsonLd(FAQ_ITEMS);
  return (
    <>
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page-narrow">
        <h1 className="font-display text-4xl text-white md:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 max-w-prose text-body text-zinc-400">
          Quick answers about products, checkout, and policies.
        </p>
        <dl className="mt-12 space-y-10">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <dt className="font-display text-xl text-smash-yellow">{item.question}</dt>
              <dd className="mt-2 text-zinc-400">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
