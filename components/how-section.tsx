const tiles = [
  { label: "Pineapple pack", tone: "from-lime-500/20 to-transparent" },
  { label: "Passion pack", tone: "from-purple-500/20 to-transparent" },
  { label: "Watermelon pack", tone: "from-pink-500/20 to-transparent" },
  { label: "Vanilla pack", tone: "from-amber-500/20 to-transparent" },
  { label: "Case / shelf", tone: "from-zinc-500/10 to-transparent" },
  { label: "Case / shelf", tone: "from-zinc-500/10 to-transparent" },
  { label: "Case / shelf", tone: "from-zinc-500/10 to-transparent" },
  { label: "Case / shelf", tone: "from-zinc-500/10 to-transparent" },
];

export function HowSection() {
  return (
    <section id="how" className="relative border-t border-white/[0.06] bg-[#050505]">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="font-display text-sm tracking-[0.35em] text-smash-yellow">
              Inside the tip
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-white md:text-5xl">
              FLAVOR IN THE TIP
            </h2>
            <p className="mt-4 text-zinc-500">
              Same story on every PDP: what you are buying is a tube, a capsule, and a
              gram size — no hidden steps.
            </p>
            <ul className="mt-10 space-y-5 text-zinc-400">
              <li className="flex gap-4 border-l-2 border-smash-yellow/50 pl-4">
                <span className="text-zinc-200">Encapsulated flavor capsule</span> — not
                sprayed on the paper (lower cognitive load than “infused paper” claims).
              </li>
              <li className="flex gap-4 border-l-2 border-white/10 pl-4">
                <span className="text-zinc-200">110mm rice paper tubes</span> — straight
                format.
              </li>
              <li className="flex gap-4 border-l-2 border-white/10 pl-4">
                <span className="text-zinc-200">1g or 2g</span> — pick the capacity that
                fits you; both sizes are 3 Chops per pack.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {tiles.map((t, i) => (
              <div
                key={`how-tile-${i}`}
                className={`flex aspect-square items-end justify-center rounded-lg border border-white/[0.07] bg-gradient-to-br ${t.tone} p-3 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-500`}
              >
                {t.label}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-zinc-600">
          Case photography placeholders — swap in pack/case assets from brand library.
        </p>
      </div>
    </section>
  );
}
