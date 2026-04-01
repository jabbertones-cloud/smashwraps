import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Noise } from "@/components/noise";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AgeGate } from "@/components/age-gate";
import { SkipLink } from "@/components/skip-link";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smashwraps.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smash Wraps — The CHOP | Rice paper tubes",
    template: "%s | Smash Wraps",
  },
  description:
    "Smash Wraps The CHOP: flavor in the capsule tip — rice paper tubes, 3 Chops per pack, 110mm. Iced Watermelon, Passion Fruit, Pineapple, Vanilla. 1g & 2g.",
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
      "Flavor in the tip — Smash Wraps The CHOP. 3 Chops per pack · 110mm · four flavors.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smash Wraps — The CHOP",
    description:
      "Smash Wraps The CHOP — rice paper tubes, flavor in the capsule. 3 Chops per pack.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bebas.variable} ${dm.variable} relative bg-[#050505] font-sans antialiased text-zinc-100 selection:bg-smash-yellow selection:text-black`}
      >
        <Providers>
          <SkipLink />
          <Noise />
          <AgeGate />
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
