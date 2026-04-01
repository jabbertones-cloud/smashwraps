import { AssetImage } from "@/components/asset-image";
import { HOW_SMASH_CAPSULE } from "@/lib/chop-images";

const flavorTiles = [
  { label: "Pineapple", tone: "from-lime-500/20 to-transparent" },
  { label: "Passion", tone: "from-purple-500/20 to-transparent" },
  { label: "Watermelon", tone: "from-pink-500/20 to-transparent" },
  { label: "Vanilla", tone: "from-amber-500/20 to-transparent" },
];

export function HowSection() {
  return (
    <section id="how" className="relative border-t border-white/[0.06] bg-[#050505]">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <p className="font-display text-sm tracking-[0.35em] text-smash-yellow">
              Inside the tip
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-white md:text-5xl">
              FLAVOR IN THE TIP
            </h2>
            <p className="mt-4 text-zinc-500">
              What you buy here is one retail box — tubes, a capsule, and a gram size. No
              case packs on this storefront.
            </p>
            <ul className="mt-10 space-y-5 text-zinc-400">
              <li className="flex gap-4 border-l-2 border-smash-yellow/50 pl-4">
                <span className="text-zinc-200">Encapsulated flavor capsule</span> — not
                sprayed on the paper.
              </li>
              <li className="flex gap-4 border-l-2 border-white/10 pl-4">
                <span className="text-zinc-200">110mm rice paper tubes</span> — straight
                format.
              </li>
              <li className="flex gap-4 border-l-2 border-white/10 pl-4">
                <span className="text-zinc-200">1g or 2g</span> — pick the capacity that
                fits you; both sizes are 3 Chops per box.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a0a] shadow-2xl ring-1 ring-white/5">
              <AssetImage
                src={HOW_SMASH_CAPSULE}
                alt="Illustration: hand squeezing the filter to smash the flavor capsule — Smash 4 Flavor, capsule in filter"
                width={1200}
                height={900}
                className="h-auto w-full object-contain"
              />
            </div>
            <p className="text-center text-xs leading-relaxed text-zinc-500">
              Crush the tip to release flavor — the capsule lives in the filter, not as a
              coating on the paper.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {flavorTiles.map((t, i) => (
            <div
              key={`how-flavor-${i}`}
              className={`flex aspect-square items-end justify-center rounded-lg border border-white/[0.07] bg-gradient-to-br ${t.tone} p-3 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-500`}
            >
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
