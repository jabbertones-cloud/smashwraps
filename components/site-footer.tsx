import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.08] bg-[#030303] py-14">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
        <p className="font-display text-2xl tracking-[0.2em] text-zinc-300">
          SMASH WRAPS
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Patent pending · Flavor capsule infused
        </p>
        <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-zinc-600">
          Retail: shop on this site. Stores / wholesale: add your buyer email on{" "}
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
