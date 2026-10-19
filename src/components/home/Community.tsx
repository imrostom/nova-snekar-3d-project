"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useMotionValue } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { COMMUNITY } from "@/data/products";
import { useReveal } from "@/hooks/useReveal";

export function Community() {
  const ref = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [limit, setLimit] = useState(0);
  const [light, setLight] = useState<number | null>(null);
  const moved = useRef(false);
  useReveal(ref, "[data-reveal]", { y: 50, opacity: 0 });

  useEffect(() => {
    const m = () => setLimit(Math.max(0, (inner.current?.scrollWidth ?? 0) - (viewport.current?.clientWidth ?? 0)));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  const step = (d: number) => {
    const w = (viewport.current?.clientWidth ?? 600) * 0.6;
    animate(x, Math.max(-limit, Math.min(0, x.get() - d * w)), { type: "spring", stiffness: 160, damping: 26 });
  };

  useEffect(() => {
    if (light === null) return;
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLight(null);
      if (e.key === "ArrowRight") setLight((i) => (i! + 1) % COMMUNITY.length);
      if (e.key === "ArrowLeft") setLight((i) => (i! + COMMUNITY.length - 1) % COMMUNITY.length);
    };
    window.addEventListener("keydown", f);
    window.__lenis?.stop();
    return () => { window.removeEventListener("keydown", f); window.__lenis?.start(); };
  }, [light]);

  return (
    <section ref={ref} id="community" className="scroll-mt-20 overflow-hidden border-t border-white/10 py-20">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <div data-reveal>
          <p className="eyebrow">Nova Community</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-5xl">YOUR STYLE.<br className="sm:hidden" /> OUR WORLD.</h2>
        </div>
        <div data-reveal className="flex items-center gap-4">
          <p className="hidden text-sm text-white/55 md:block">Real people. Real moments. Tag <b className="text-white">#NovaStride</b> to be featured.</p>
          <button aria-label="Previous photos" onClick={() => step(-1)} className="rounded-full border border-white/25 p-2.5 hover:border-volt"><ArrowLeft size={16} /></button>
          <button aria-label="Next photos" onClick={() => step(1)} className="rounded-full border border-white/25 p-2.5 hover:border-volt"><ArrowRight size={16} /></button>
        </div>
      </div>
      <div ref={viewport} className="mt-8 cursor-grab overflow-hidden pl-5 active:cursor-grabbing sm:pl-8 lg:pl-[max(3.5rem,calc((100vw-1280px)/2+3.5rem))]">
        <motion.div ref={inner} data-reveal style={{ x, touchAction: "pan-y" }} drag="x" dragConstraints={{ left: -limit, right: 0 }} dragElastic={0.12}
          onDragStart={() => { moved.current = true; }} onDragEnd={() => setTimeout(() => (moved.current = false), 50)} className="flex w-max gap-4 pr-8">
          {COMMUNITY.map((c, i) => (
            <button key={i} onClick={() => !moved.current && setLight(i)} aria-label={`Open photo: ${c.alt}`} className="group relative h-48 w-60 shrink-0 overflow-hidden rounded-2xl sm:h-60 sm:w-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={c.alt} draggable={false} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 rounded-2xl ring-0 ring-inset ring-volt/70 transition-all group-hover:ring-2" />
            </button>
          ))}
        </motion.div>
      </div>
      <AnimatePresence>
        {light !== null && (
          <motion.div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/90 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLight(null)} role="dialog" aria-modal="true" aria-label="Photo viewer">
            <button aria-label="Close" className="absolute right-5 top-5 rounded-full bg-white/10 p-3" onClick={() => setLight(null)}><X size={20} /></button>
            <button aria-label="Previous" className="absolute left-3 rounded-full bg-white/10 p-3 sm:left-8" onClick={(e) => { e.stopPropagation(); setLight((i) => (i! + COMMUNITY.length - 1) % COMMUNITY.length); }}><ArrowLeft size={20} /></button>
            <button aria-label="Next" className="absolute right-3 rounded-full bg-white/10 p-3 sm:right-8" onClick={(e) => { e.stopPropagation(); setLight((i) => (i! + 1) % COMMUNITY.length); }}><ArrowRight size={20} /></button>
            <motion.img key={light} src={COMMUNITY[light].src} alt={COMMUNITY[light].alt} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-h-[85vh] max-w-full rounded-2xl object-contain" style={{ imageRendering: "auto", minWidth: "min(80vw, 700px)" }} onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
