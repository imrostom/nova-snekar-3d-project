"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, ShoppingBag, Truck, RotateCcw, X } from "lucide-react";
import { useStore } from "@/store/StoreProvider";
import { ColorPicker } from "./ColorPicker";
import type { ColorOption, Product } from "@/types";

const SIZES = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
const UNAVAILABLE = new Set(["US 12"]);

function Body({ product }: { product: Product }) {
  const { addItem, setQuickView } = useStore();
  const [color, setColor] = useState<ColorOption>(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [warn, setWarn] = useState(false);

  const add = () => {
    if (!size) { setWarn(true); return; }
    for (let i = 0; i < qty; i++) {
      addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, color: `${color.name} · ${size}` });
    }
    setQuickView(null);
  };

  return (
    <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-[1.05fr_1fr]" data-lenis-prevent>
      {/* media */}
      <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[radial-gradient(80%_70%_at_50%_55%,rgba(214,255,77,.22),transparent_70%),linear-gradient(180deg,#141b16,#0b0f0c)] p-6 md:min-h-[520px]">
        <div aria-hidden className="absolute -bottom-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-[50%] bg-volt/10 blur-3xl" />
        <span className="absolute left-5 top-5 rounded-full border border-volt/40 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-volt backdrop-blur">New drop</span>
        <motion.img
          key={color.id}
          src={product.image}
          alt={`${product.name} in ${color.name}`}
          initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="relative w-full max-w-md rounded-2xl object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]"
        />
      </div>

      {/* details */}
      <div className="flex flex-col p-6 sm:p-8">
        <p className="eyebrow">{product.category}</p>
        <h3 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h3>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-bold">${product.price}</span>
          <span className="text-xs text-white/40">incl. taxes · demo pricing</span>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-white/65">{product.blurb}</p>

        <div className="mt-6">
          <p className="mb-3 flex justify-between text-sm"><span className="text-white/50">Colour</span><span className="font-medium">{color.name}</span></p>
          <ColorPicker label="qv-colour" size={30} options={product.colors} value={color.hex} onChange={setColor} />
        </div>

        <div className="mt-6">
          <p className="mb-3 flex justify-between text-sm">
            <span className="text-white/50">Size</span>
            <span className={warn && !size ? "font-medium text-red-400" : "text-white/40"}>{warn && !size ? "Please select a size" : "True to size"}</span>
          </p>
          <div role="radiogroup" aria-label="Size" className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-6">
            {SIZES.map((s) => {
              const off = UNAVAILABLE.has(s);
              const on = size === s;
              return (
                <button
                  key={s} role="radio" aria-checked={on} disabled={off}
                  onClick={() => { setSize(s); setWarn(false); }}
                  className={`relative rounded-xl border py-2.5 text-sm font-medium transition-colors ${on ? "border-volt bg-volt text-black" : off ? "cursor-not-allowed border-white/5 text-white/20 line-through" : "border-white/15 hover:border-volt/70"}`}
                >
                  {s.replace("US ", "")}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <div className="flex items-center rounded-full border border-white/15">
            <button aria-label="Decrease quantity" className="p-3.5 disabled:opacity-30" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}><Minus size={15} /></button>
            <span className="w-6 text-center font-semibold" aria-live="polite">{qty}</span>
            <button aria-label="Increase quantity" className="p-3.5 disabled:opacity-30" disabled={qty >= 9} onClick={() => setQty((q) => q + 1)}><Plus size={15} /></button>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} className="btn-volt flex-1" onClick={add}>
            <ShoppingBag size={17} /> Add to bag · ${product.price * qty}
          </motion.button>
        </div>

        <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-sm text-white/60">
          <li className="flex items-center gap-3"><Truck size={16} className="text-volt" /> Free demo shipping over $100</li>
          <li className="flex items-center gap-3"><RotateCcw size={16} className="text-volt" /> 30-day returns (demo policy)</li>
          <li className="flex items-center gap-3"><Check size={16} className="text-volt" /> CushionCore Air · Engineered mesh</li>
        </ul>
      </div>
    </div>
  );
}

export function QuickView() {
  const { quickView, setQuickView } = useStore();
  useEffect(() => {
    if (!quickView) return;
    const f = (e: KeyboardEvent) => e.key === "Escape" && setQuickView(null);
    window.addEventListener("keydown", f);
    window.__lenis?.stop();
    return () => { window.removeEventListener("keydown", f); window.__lenis?.start(); };
  }, [quickView, setQuickView]);

  return (
    <AnimatePresence>
      {quickView && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setQuickView(null)}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label={`${quickView.name} quick view`}
            className="relative w-full max-w-4xl overflow-hidden rounded-t-3xl border border-white/10 bg-coal shadow-[0_0_80px_-20px_rgba(214,255,77,.35)] sm:rounded-3xl"
            initial={{ y: 60, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button aria-label="Close quick view" onClick={() => setQuickView(null)} className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 p-2 backdrop-blur transition-colors hover:border-volt hover:text-volt"><X size={18} /></button>
            <Body key={quickView.id} product={quickView} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
