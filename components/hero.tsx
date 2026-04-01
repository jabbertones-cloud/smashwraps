import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { CHOP_HERO_ALL_CASE_BOXES, CHOP_THREE_PACK_BY_SLUG } from "@/lib/chop-images";
import { Button } from "@/components/ui/button";
import { TrustStrip } from "@/components/trust-strip";

const HERO_RETAIL_BOX_EXAMPLE = CHOP_THREE_PACK_BY_SLUG["iced-watermelon-1g"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="hero-glow absolute inset-0" aria-hidden />
      <div
        className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-zinc-500/15 blur-[100px]"
        aria-hidden
      />

      <div className="section-inner section-y relative grid gap-12 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-8 lg:gap-12">
        <div className="motion-safe:animate-fade-up max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-display text-sm tracking-[0.25em] text-smash-yellow">
            The CHOP by Smash Wraps
          </p>
          <h1 className="font-display text-display tracking-wide">
            <span className="sr-only">Smash Wraps — </span>
            <span className="text-gradient-hero">RICE PAPER</span>
            <br />
            <span className="text-white">TUBES</span>
          </h1>
          <p className="mt-5 max-w-prose text-lead font-medium text-zinc-200">
            Flavor where you want it — in the capsule tip, not sprayed on the sheet. A
            consistent 109mm Cali-style ritual (same length class as Vibes Cali 1g/2g): three
            Chops per box, your blend, your pace.
          </p>
          <p className="mt-4 max-w-prose text-body text-zinc-400">
            Straight tubes, four flavor-forward profiles, 1g or 2g. This shop sells single
            retail boxes only — not by the case.
            <span className="mt-2 block text-legal text-zinc-500">
              Patent pending · Adults 21+ where required
            </span>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild>
              <Link href="/shop">Shop all flavors</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/#how">How the capsule works</Link>
            </Button>
          </div>

          <TrustStrip />

          <div className="mt-12 flex flex-wrap gap-8 border-t border-white/[0.06] pt-8 text-body text-zinc-500">
            <div>
              <span className="font-display text-2xl text-white">4</span> flavors
            </div>
            <div>
              <span className="font-display text-2xl text-white">2</span> sizes
            </div>
            <div>
              <span className="font-display text-2xl text-white">3</span> chops / box
            </div>
          </div>
          <p className="mt-8 text-legal text-zinc-600">
            Follow your local laws. Not for sale to minors.
          </p>
        </div>

        <div className="relative flex flex-col justify-center gap-6 md:justify-end">
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-l"
            aria-hidden
          />
          <div className="relative w-full max-w-md">
            <div
              className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-zinc-600/20 via-transparent to-smash-yellow/10 blur-3xl"
              aria-hidden
            />
            <div className="panel-premium relative z-10 bg-zinc-900/60 p-3 md:p-4">
              <AssetImage
                src={HERO_RETAIL_BOX_EXAMPLE}
                alt="Smash Wraps The CHOP — one retail 3-pack box (example flavor); what we ship from this shop"
                width={800}
                height={800}
                className="h-auto w-full rounded-lg object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
                priority
              />
              <p className="mt-3 text-center text-legal text-zinc-500">
                What you buy here — one 3-pack box (3 Chops), single-flavor retail
              </p>
            </div>
          </div>
          <div className="relative w-full max-w-md">
            <div className="panel-premium relative z-10 bg-zinc-900/40 p-3 opacity-95 md:p-4">
              <AssetImage
                src={CHOP_HERO_ALL_CASE_BOXES}
                alt="Smash Wraps The CHOP — retail master case displays, all flavors (store reference)"
                width={1024}
                height={576}
                className="h-auto w-full rounded-lg object-contain opacity-95"
              />
              <p className="mt-3 text-center text-legal text-zinc-500">
                In stores — master case displays (not sold by the case on this site)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-6 w-full overflow-hidden text-[#080808]" aria-hidden>
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,24 Q180,0 360,24 T720,24 T1080,24 T1440,24 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  );
}
