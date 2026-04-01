import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { BRAND_LOGO_SRC } from "@/lib/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.08] bg-[#030303] py-14">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
        <div className="flex justify-center">
          <AssetImage
            src={BRAND_LOGO_SRC}
            alt="Smash Wraps"
            width={480}
            height={357}
            className="mx-auto h-20 w-auto object-contain drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] md:h-24"
          />
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          Patent pending · Flavor capsule infused
        </p>
        <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-zinc-600">
          DTC: single 3-pack boxes on this site. Stores / wholesale / case packs: add your buyer email on{" "}
          <Link href="/about" className="text-zinc-500 underline hover:text-zinc-300">
            About
          </Link>{" "}
          when you are ready for inbound leads.
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
          <Link href="/legal/shipping" className="hover:text-zinc-300">
            Shipping
          </Link>
          <Link href="/legal/returns" className="hover:text-zinc-300">
            Returns
          </Link>
          <Link href="/legal/privacy" className="hover:text-zinc-300">
            Privacy
          </Link>
          <Link href="/legal/terms" className="hover:text-zinc-300">
            Terms
          </Link>
          <Link href="/faq" className="hover:text-zinc-300">
            FAQ
          </Link>
          <Link href="/about" className="hover:text-zinc-300">
            About
          </Link>
        </nav>
        <div
          className="mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden
        />
        <p className="mt-10 text-xs text-zinc-600">
          © {year} Smash Wraps. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
