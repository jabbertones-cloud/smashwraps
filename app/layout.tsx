import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smash Wraps — The CHOP | Rice paper tubes",
    template: "%s | Smash Wraps",
  },
  description:
    "Smash Wraps The CHOP: flavor in the capsule tip — rice paper tubes, 3 Chops per box, 110mm. Iced Watermelon, Passion Fruit, Pineapple, Vanilla. 1g & 2g. Single retail boxes, not by the case.",
  keywords: [
    "Smash Wraps",
    "The CHOP",
    "rice paper tubes",
    "flavor capsule",
    "rolling papers alternative",
    "110mm tubes",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Smash Wraps",
    title: "Smash Wraps — The CHOP",
    description:
      "Flavor in the tip — Smash Wraps The CHOP. 3 Chops per box · 110mm · four flavors.",
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
      "Smash Wraps The CHOP — rice paper tubes, flavor in the capsule. 3 Chops per box.",
    images: [`${siteUrl}/images/AllCaseBoxesChops.jpg`],
  },
  icons: {
    icon: [{ url: "/images/smash-wraps-logo.png", type: "image/png" }],
    apple: "/images/smash-wraps-logo.png",
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
