import { AssetImage } from "@/components/asset-image";
import { FLAVOR_LOGO, HOW_SMASH_CAPSULE } from "@/lib/chop-images";
import type { FlavorId } from "@/lib/products";

const flavorOrder: { id: FlavorId; label: string }[] = [
  { id: "iced-watermelon", label: "Iced Watermelon" },
  { id: "passion-fruit", label: "Passion Fruit" },
  { id: "pineapple", label: "Pineapple" },
  { id: "vanilla", label: "Vanilla" },
];

export function HowSection() {
  return (
    <section id="how" className="relative border-t border-white/[0.06] bg-[#050505]">
      <div className="section-inner section-y">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <p className="font-display text-sm tracking-[0.35em] text-smash-yellow">
              Inside the tip
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-white md:text-5xl">
              FLAVOR IN THE TIP
            </h2>
            <p className="mt-4 max-w-prose text-body text-zinc-500">
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
            <div className="panel-premium bg-[#0a0a0a] shadow-2xl">
              <AssetImage
                src={HOW_SMASH_CAPSULE}
                alt="Illustration: hand squeezing the filter to smash the flavor capsule — Smash 4 Flavor, capsule in filter"
                width={1200}
                height={900}
                className="h-auto w-full object-contain"
              />
            </div>
            <p className="text-center text-legal leading-relaxed text-zinc-500">
              Crush the tip to release flavor — the capsule lives in the filter, not as a
              coating on the paper.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-4 text-center font-display text-xs tracking-[0.35em] text-zinc-500">
            Flavors
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {flavorOrder.map(({ id, label }) => (
              <div
                key={id}
                className="flex flex-col items-center overflow-hidden rounded-xl border border-white/10 bg-zinc-950/80 p-3 shadow-lg ring-1 ring-white/5"
              >
                <AssetImage
                  src={FLAVOR_LOGO[id]}
                  alt={`${label} flavor`}
                  width={280}
                  height={280}
                  className="h-auto w-full max-h-28 object-contain sm:max-h-32"
                />
                <span className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
