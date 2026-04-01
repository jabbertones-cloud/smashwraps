import type { Metadata } from "next";
import { WholesaleSalesSheet } from "@/components/wholesale-sales-sheet";

export const metadata: Metadata = {
  title: "Wholesale sales sheet",
  description:
    "B2B case pricing for The CHOP — not linked from search. Licensed retailers; Stripe checkout.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Wholesale — Smash Wraps",
    description: "Case quantities and wholesale pricing for retailers.",
  },
};

export default function WholesalePage() {
  return <WholesaleSalesSheet />;
}
