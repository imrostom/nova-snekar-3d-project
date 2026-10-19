"use client";

import { useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/store/StoreProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { useReveal } from "@/hooks/useReveal";

const FILTERS = [["all", "All"], ["men", "Men"], ["women", "Women"]] as const;

export function Collection() {
  const { filter, setFilter } = useStore();
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useReveal(ref);

  const list = useMemo(() => PRODUCTS.filter((p) => filter === "all" || p.gender === filter || p.gender === "unisex"), [filter]);
  const scroll = (d: number) => track.current?.scrollBy({ left: d * (track.current.clientWidth * 0.7), behavior: "smooth" });

  return (
    <section ref={ref} id="collection" className="scroll-mt-20 border-t border-white/10 py-20">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div data-reveal>
            <p className="eyebrow">The Highlights</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl lg:text-[2.6rem]">
              Iconic Styles. <span className="block sm:inline">Endless Possibilities.</span>
            </h2>
            <p className="mt-3 max-w-xl text-white/60">From everyday classics to bold new drops, find the pair that moves with you.</p>
          </div>
          <div data-reveal className="flex items-center gap-3">
            <div className="flex gap-1 rounded-full border border-white/15 p-1" role="group" aria-label="Filter">
              {FILTERS.map(([id, label]) => (
                <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)} className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${filter === id ? "bg-volt text-black" : "text-white/70 hover:text-white"}`}>{label}</button>
              ))}
            </div>
            <button aria-label="Scroll left" onClick={() => scroll(-1)} className="rounded-full border border-white/25 p-2.5 hover:border-volt lg:hidden"><ArrowLeft size={16} /></button>
            <button aria-label="Scroll right" onClick={() => scroll(1)} className="rounded-full border border-white/25 p-2.5 hover:border-volt lg:hidden"><ArrowRight size={16} /></button>
          </div>
        </div>
        <div ref={track} className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-5 sm:scroll-px-8 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0" data-lenis-prevent-wheel>
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} className="flex flex-none basis-[72%] snap-start sm:basis-[46%] lg:flex-1 lg:basis-0">
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
