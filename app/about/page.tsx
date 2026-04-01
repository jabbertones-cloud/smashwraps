import type { Metadata } from "next";
import Link from "next/link";

const contactEmail = process.env.NEXT_PUBLIC_ORG_CONTACT_EMAIL;

export const metadata: Metadata = {
  title: "About",
  description:
    "Smash Wraps — The CHOP. Flavor-capsule infused rice paper tubes. Learn about the brand and how to reach us.",
  openGraph: { title: "About — Smash Wraps" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white md:text-5xl">About Smash Wraps</h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-400">
        Smash Wraps makes The CHOP — straight rice paper tubes with flavor in the capsule
        tip, not sprayed on the sheet. We built this format for a consistent taste that
        matches the label.
      </p>
      <p className="mt-6 leading-relaxed text-zinc-500">
        This site is the official place to buy single 3-pack boxes online. For order help
        or business inquiries, use the contact options below.
      </p>
      <h2 className="mt-12 font-display text-2xl text-white">Contact</h2>
      <p className="mt-4 text-zinc-400">
        {contactEmail ? (
          <>
            Email:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-smash-yellow underline hover:text-yellow-300"
            >
              {contactEmail}
            </a>
          </>
        ) : (
          "Contact email coming soon — check back or use your order confirmation for support."
        )}
      </p>
      <p className="mt-6 text-sm text-zinc-500">
        Policies:{" "}
        <Link href="/legal/privacy" className="text-smash-yellow underline">
          Privacy
        </Link>
        ,{" "}
        <Link href="/legal/terms" className="text-smash-yellow underline">
          Terms
        </Link>
        .
      </p>
    </div>
  );
}
