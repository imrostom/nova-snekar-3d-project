"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Dices, RotateCcw, Save, ShoppingCart } from "lucide-react";
import { PALETTE, DEFAULT_COLORS, ZONES } from "@/data/colors";
import { createSceneState } from "@/lib/sceneState";
import type { SneakerColors } from "@/types";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { useStore } from "@/store/StoreProvider";
import { useReveal } from "@/hooks/useReveal";

const SneakerScene = dynamic(() => import("@/components/three/SneakerScene"), { ssr: false });
const lum = (h: string) => { const n = parseInt(h.slice(1), 16); return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255); };
/** brightest of the vivid zones, so the rim light / halo never goes dark */
const glowOf = (c: SneakerColors) => [c.upper, c.midsole, c.accent].reduce((a, b) => (lum(b) > lum(a) ? b : a));
const KEY = "nova-stride-design";

export function Customizer() {
  const state = useMemo(() => createSceneState({ zoom: 0.5 }), []);
  const { addItem, notify } = useStore();
  const [zone, setZone] = useState<keyof SneakerColors>("upper");
  const [colors, setColors] = useState<SneakerColors>({ ...DEFAULT_COLORS });
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  // restore saved design
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const c = JSON.parse(raw) as SneakerColors; setColors(c); state.colors = c; setSaved(true); }
    } catch {}
  }, [state]);

  const apply = (c: SneakerColors) => { state.colors = { ...c }; state.pulse = 1; state.light = glowOf(c); setColors(c); setSaved(false); };
  const set = (hex: string) => apply({ ...colors, [zone]: hex });
  const pick = () => PALETTE[Math.floor(Math.random() * PALETTE.length)].hex;
  const colorName = (hex: string) => PALETTE.find((p) => p.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex;

  return (
    <section ref={ref} id="customize" className="scroll-mt-20 border-t border-white/10 py-20">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(70%_70%_at_50%_45%,#1b2a14,#0b0f0c)] lg:aspect-auto lg:h-[560px]">
          <div aria-hidden className="absolute inset-0 transition-[background] duration-700" style={{ background: `radial-gradient(55% 55% at 50% 55%, ${colors.upper}38, transparent 70%)` }} />
          <SneakerScene state={state} variant="custom" className="absolute inset-0 h-full w-full" />
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em] text-white/40">Drag to rotate</p>
        </div>
        <div>
          <p data-reveal className="eyebrow">Color Customizer</p>
          <h2 data-reveal className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">DESIGN YOUR NOVA.</h2>
          <p data-reveal className="mt-3 text-white/60">Pick a part, pick a colour. The 3D shoe updates instantly.</p>
          <div data-reveal className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="Sneaker parts">
            {ZONES.map((z) => (
              <button key={z.id} role="tab" aria-selected={zone === z.id} onClick={() => setZone(z.id)} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${zone === z.id ? "border-volt bg-volt/10 text-volt" : "border-white/15 text-white/70 hover:border-white/40"}`}>
                <span className="h-3 w-3 rounded-full ring-1 ring-white/30" style={{ background: colors[z.id] }} />{z.label}
              </button>
            ))}
          </div>
          <div data-reveal className="mt-6 rounded-2xl border border-white/10 bg-panel p-5">
            <p className="mb-4 text-sm text-white/55">{ZONES.find((z) => z.id === zone)!.label}: <span className="text-white">{colorName(colors[zone])}</span></p>
            <ColorPicker label="customizer-colour" size={38} value={colors[zone]} onChange={(c) => set(c.hex)} />
          </div>
          <div data-reveal className="mt-5 grid grid-cols-2 gap-3">
            <button className="btn-ghost !py-3" onClick={() => apply({ ...DEFAULT_COLORS })}><RotateCcw size={15} /> Reset</button>
            <button className="btn-ghost !py-3" onClick={() => apply({ upper: pick(), laces: pick(), midsole: pick(), outsole: pick(), accent: pick() })}><Dices size={15} /> Randomize</button>
            <button className="btn-ghost !py-3" onClick={() => { try { localStorage.setItem(KEY, JSON.stringify(colors)); setSaved(true); notify("Design saved in this browser"); } catch { notify("Could not save: storage unavailable"); } }}><Save size={15} /> {saved ? "Saved" : "Save design"}</button>
            <button className="btn-volt !py-3" onClick={() => addItem({ productId: "custom", name: "Custom Nova Max", price: 149, image: "", color: `${colorName(colors.upper)} / ${colorName(colors.midsole)}`, custom: true })}><ShoppingCart size={15} /> Add · $149</button>
          </div>
        </div>
      </div>
    </section>
  );
}
