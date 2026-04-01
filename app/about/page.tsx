import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Smash Wraps — The CHOP. Flavor capsule infused rice paper tubes. E-E-A-T placeholder for brand story.",
  openGraph: { title: "About — Smash Wraps" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white md:text-5xl">About Smash Wraps</h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-400">
        This page supports E-E-A-T (experience, expertise, authority, trust) for search and
        AI overviews: who Smash Wraps is, what The CHOP is, and how to reach the
        business. Replace placeholder text with factual brand story, entity legal name,
        and support channels before launch.
      </p>
      <ul className="mt-8 list-inside list-disc space-y-2 text-zinc-500">
        <li>Add founder/team or brand origin (factual).</li>
        <li>
          Add a public contact email for retail support and a separate line for{" "}
          <strong className="text-zinc-400">wholesale / retail buyers</strong> if you
          sell B2B.
        </li>
        <li>Add mailing address or registered agent if required in your markets.</li>
        <li>Link to policies:{" "}
          <Link href="/legal/privacy" className="text-smash-yellow underline">
            Privacy
          </Link>
          ,{" "}
          <Link href="/legal/terms" className="text-smash-yellow underline">
            Terms
          </Link>
          .
        </li>
      </ul>
    </div>
  );
}
