"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { FEATURES } from "@/data/products";
import { createSceneState } from "@/lib/sceneState";
import { useReveal } from "@/hooks/useReveal";
import type { PartKey } from "@/types";

const SneakerScene = dynamic(() => import("@/components/three/SneakerScene"), { ssr: false });

export function Technology() {
  const state = useMemo(() => createSceneState({ explode: 1, zoom: 0.1, offsetX: 0 }), []);
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState<PartKey | null>(null);
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const hover = (p: PartKey | null) => { state.highlight = p; };
  const click = (p: PartKey) => {
    const next = active === p ? null : p;
    setActive(next);
    state.focus = next;
    if (next) { state.explode = 1; setOpen(true); }
  };

  return (
    <section ref={ref} id="technology" className="scroll-mt-20 border-t border-white/10 py-20">
      <div className="container-x">
        <p data-reveal className="eyebrow">Sneaker Technology</p>
        <h2 data-reveal className="mt-3 font-display text-3xl font-extrabold sm:text-5xl">INSIDE THE INNOVATION</h2>
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div data-reveal className="relative h-[460px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(70%_70%_at_50%_50%,#17241a,#0a0d0b)] sm:h-[600px]">
            <SneakerScene state={state} variant="tech" className="absolute inset-0 h-full w-full" />
            <button
              onClick={() => { const v = !open; setOpen(v); state.explode = v ? 1 : 0; if (!v) { state.focus = null; setActive(null); } }}
              aria-pressed={open}
              className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-volt/60 bg-black/50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-volt backdrop-blur hover:bg-volt hover:text-black"
            ><Layers size={14} /> {open ? "Assemble" : "Disassemble"}</button>
            <p className="pointer-events-none absolute bottom-5 right-5 hidden text-[11px] uppercase tracking-[0.2em] text-white/40 sm:block">Drag · hover · click a feature</p>
          </div>
          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.li key={f.id} data-reveal whileHover={{ x: 6 }}>
                <button
                  onMouseEnter={() => hover(f.part)} onMouseLeave={() => hover(null)} onFocus={() => hover(f.part)} onBlur={() => hover(null)}
                  onClick={() => click(f.part)} aria-pressed={active === f.part}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${active === f.part ? "border-volt bg-volt/10" : "border-white/10 bg-panel hover:border-volt/60"}`}
                >
                  <span className="font-display text-sm text-volt">0{i + 1}</span>
                  <span className="relative h-px w-10 bg-white/30"><span className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-volt transition-transform duration-500 group-hover:scale-x-100" /></span>
                  <span className="flex-1"><span className="block font-bold">{f.title}</span><span className="text-sm text-white/55">{f.sub}</span></span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
