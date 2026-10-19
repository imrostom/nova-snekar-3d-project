"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "@/store/StoreProvider";

export function CartDrawer() {
  const { cartOpen, setCartOpen, items, setQty, removeItem, total, notify } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const f = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", f);
    window.__lenis?.stop();
    return () => { window.removeEventListener("keydown", f); window.__lenis?.start(); };
  }, [cartOpen, setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Shopping bag"
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-coal"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="font-display text-xl font-bold">Your Bag</h2>
              <button aria-label="Close bag" onClick={() => setCartOpen(false)} className="rounded-full p-2 hover:bg-white/10"><X size={20} /></button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-6" data-lenis-prevent>
              {items.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/60">
                  <ShoppingBag size={40} className="text-volt" />
                  <p>Your bag is empty.</p>
                  <button className="btn-ghost !py-2.5" onClick={() => setCartOpen(false)}>Keep browsing</button>
                </div>
              )}
              {items.map((i) => (
                <motion.div layout key={i.key} className="flex gap-4 rounded-2xl bg-panel p-3">
                  <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-black/40">
                    {i.custom ? <span className="font-display text-[10px] uppercase tracking-widest text-volt">Custom</span>
                      // eslint-disable-next-line @next/next/no-img-element
                      : <img src={i.image} alt={i.name} className="h-full w-full object-contain" />}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <div><p className="font-semibold">{i.name}</p><p className="text-xs text-white/50">{i.color}</p></div>
                      <p className="font-semibold">${i.price * i.qty}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full bg-black/40">
                        <button aria-label="Decrease quantity" className="p-2" onClick={() => setQty(i.key, i.qty - 1)}><Minus size={14} /></button>
                        <span className="w-5 text-center text-sm">{i.qty}</span>
                        <button aria-label="Increase quantity" className="p-2" onClick={() => setQty(i.key, i.qty + 1)}><Plus size={14} /></button>
                      </div>
                      <button aria-label={`Remove ${i.name}`} className="p-2 text-white/50 hover:text-red-400" onClick={() => removeItem(i.key)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="space-y-4 border-t border-white/10 p-6">
              <div className="flex justify-between text-lg"><span>Subtotal</span><span className="font-bold">${total}</span></div>
              <button className="btn-volt w-full" disabled={!items.length} onClick={() => notify("Demo store: checkout is not connected")}>Checkout (demo)</button>
              <p className="text-center text-xs text-white/40">Static demo. No payment is taken.</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
