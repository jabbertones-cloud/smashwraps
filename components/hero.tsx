import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { CHOP_HERO_ALL_CASE_BOXES } from "@/lib/chop-images";
import { Button } from "@/components/ui/button";
import { OptionalMediaNote } from "@/components/optional-media-note";
import { TrustStrip } from "@/components/trust-strip";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="hero-glow absolute inset-0" aria-hidden />
      <div
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[100px] motion-safe:animate-pulse-slow"
        aria-hidden
      />
      <div
        className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-[90px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-8 md:py-24 md:px-6 lg:gap-12">
        <div className="motion-safe:animate-fade-up max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-display text-sm tracking-[0.25em] text-smash-yellow">
            The CHOP by Smash Wraps
          </p>
          <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] tracking-wide">
            <span className="sr-only">Smash Wraps — </span>
            <span className="text-gradient-hero">RICE PAPER</span>
            <br />
            <span className="text-white">TUBES</span>
          </h1>
          <p className="mt-4 text-base font-medium leading-relaxed text-zinc-300 md:text-lg">
            Flavor lives in the capsule tip — not sprayed on the sheet — so every chop
            tastes like the label says.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400 md:text-xl">
            Straight 110mm rice paper tubes.{" "}
            <span className="font-medium text-zinc-200">3 Chops per box</span>
            <span className="mt-2 block text-sm text-zinc-500">
              Patent pending · Four flavors · 1g or 2g
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

          <div className="mt-12 flex flex-wrap gap-8 border-t border-white/[0.06] pt-8 text-sm text-zinc-500">
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
          <p className="mt-8 text-xs text-zinc-600">
            For adults 21+. Follow your local laws. Final age UX per compliance memo.
          </p>
          <OptionalMediaNote />
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-l"
            aria-hidden
          />
          <div className="relative w-full max-w-md motion-safe:md:animate-float">
            <div
              className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-fuchsia-500/30 via-transparent to-yellow-400/10 blur-3xl"
              aria-hidden
            />
            <AssetImage
              src={CHOP_HERO_ALL_CASE_BOXES}
              alt="Smash Wraps The CHOP — four flavors, single 3-pack boxes"
              width={640}
              height={640}
              className="relative z-10 h-auto w-full drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
              priority
            />
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
