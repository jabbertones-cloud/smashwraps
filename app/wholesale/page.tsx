import type { Metadata } from "next";
import { WholesaleSalesSheet } from "@/components/wholesale-sales-sheet";

export const metadata: Metadata = {
  title: "Wholesale sales sheet",
  description:
    "B2B master-case pricing: 8× three-packs per case — not linked from search. Licensed retailers; Stripe checkout.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Wholesale — Smash Wraps",
    description: "Master case (8× three-packs, 24 Chops) — wholesale pricing for retailers.",
  },
};

export default function WholesalePage() {
  return <WholesaleSalesSheet />;
}
