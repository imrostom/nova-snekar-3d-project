"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useStore } from "@/store/StoreProvider";
import { useTilt } from "@/hooks/useTilt";
import { ColorPicker } from "./ColorPicker";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, setQuickView } = useStore();
  const [color, setColor] = useState(product.colors[0]);
  const tilt = useTilt<HTMLDivElement>(8);

  return (
    <motion.article
      data-card
      className="group relative flex-1"
      whileHover={{ y: -2 }}
    >
      <div
        {...tilt}
        className="relative h-full rounded-3xl bg-gradient-to-b from-[#1a211c] to-panel p-4 transition-[transform,box-shadow] duration-200 ease-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:opacity-0 before:transition-opacity before:duration-300 before:[background:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),rgba(214,255,77,.22),transparent_60%)] hover:shadow-volt hover:before:opacity-100"
      >
        <button className="relative block w-full overflow-hidden rounded-2xl" onClick={() => setQuickView(product)} aria-label={`Quick view ${product.name}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={`${product.name} sneaker`} width={218} height={140} loading="lazy" className="aspect-[218/140] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <span className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs backdrop-blur"><Eye size={13} /> Quick view</span>
          </span>
        </button>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-white/55">{product.category}</p>
            <p className="mt-2 text-lg font-semibold">${product.price}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.08 }}
            aria-label={`Add ${product.name} to bag`}
            onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, color: color.name })}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-volt text-black"
          >
            <ShoppingCart size={19} />
          </motion.button>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-3">
          <ColorPicker size={18} label={`${product.id}-colour`} options={product.colors} value={color.hex} onChange={setColor} />
          <span className="text-xs text-white/50">{color.name}</span>
        </div>
      </div>
    </motion.article>
  );
}
