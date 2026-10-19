const WORDS = ["Take it apart", "Put it back", "Built by you", "Nova Max", "Engineered for what's next", "Move different"];

/** Infinite ticker between hero and collection. Speeds up on hover-free devices only via CSS. */
export function Marquee() {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
      {WORDS.map((w) => (
        <li key={w} className="flex items-center gap-10 font-display text-3xl font-extrabold uppercase tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.35)] sm:text-5xl">
          {w}<span className="h-3 w-3 rotate-45 bg-volt" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-ink py-6" role="presentation">
      <div className="flex w-max animate-marquee">{row}{row}</div>
    </div>
  );
}
