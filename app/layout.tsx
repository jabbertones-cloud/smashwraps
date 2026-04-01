import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Noise } from "@/components/noise";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AgeGate } from "@/components/age-gate";
import { SkipLink } from "@/components/skip-link";
import { ScrollToTop } from "@/components/scroll-to-top";
import { MarketingTags } from "@/components/analytics/marketing-tags";
import { shouldSkipAgeGateForUserAgent } from "@/lib/verification-bots";
import { CHOP_SPECS_GLOBAL_SUMMARY } from "@/lib/products";
import { getCanonicalSiteUrl } from "@/lib/site-url";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dm = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

const siteUrl = getCanonicalSiteUrl();

/** Explicit viewport + notch/home-indicator support (smashcones.com mobile). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

/** Favicons: `app/icon.png` + `app/apple-icon.png` (brand logo; see `lib/brand.ts`). */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Smash Wraps — The CHOP",
  title: {
    default: "Smash Wraps — The CHOP | Rice paper tubes",
    template: "%s | Smash Wraps",
  },
  description: `Smash Wraps The CHOP — flavor in the capsule tip, not sprayed on the sheet. Three 109mm Cali-style tubes per box (${CHOP_SPECS_GLOBAL_SUMMARY}), four flavors, 1g & 2g. Single retail boxes. Adults 21+ where required.`,
  keywords: [
    "Smash Wraps The CHOP",
    "The CHOP rice paper tubes",
    "smashcones",
    "Smash Wraps",
    "The CHOP",
    "rice paper tubes",
    "flavor capsule",
    "rolling papers alternative",
    "109mm Cali tubes",
    "109x11",
    "109x14",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Smash Wraps — The CHOP",
    title: "Smash Wraps — The CHOP",
    description: `Flavor in the capsule tip — Smash Wraps The CHOP. 3 Chops per box · ${CHOP_SPECS_GLOBAL_SUMMARY} · four flavors. Single retail boxes.`,
    images: [
      {
        url: `${siteUrl}/images/AllCaseBoxesChops.jpg`,
        width: 1200,
        height: 630,
        alt: "Smash Wraps The CHOP — retail master cases, all flavors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smash Wraps — The CHOP",
    description:
      "Smash Wraps The CHOP — rice paper tubes, flavor in the capsule tip. 3 Chops per box. Adults 21+ where required.",
    images: [`${siteUrl}/images/AllCaseBoxesChops.jpg`],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const suppressAgeGate = shouldSkipAgeGateForUserAgent(h.get("user-agent"));

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bebas.variable} ${dm.variable} relative bg-[#050505] font-sans antialiased text-zinc-100 selection:bg-smash-yellow selection:text-black`}
      >
        <Providers>
          <MarketingTags />
          <ScrollToTop />
          <SkipLink />
          <Noise />
          <AgeGate suppress={suppressAgeGate} />
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
