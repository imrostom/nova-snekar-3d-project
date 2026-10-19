"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { PALETTE } from "@/data/colors";
import type { ColorOption } from "@/types";

interface Props {
  value?: string;
  onChange: (c: ColorOption) => void;
  options?: ColorOption[];
  size?: number;
  label?: string;
}

/** Swatch row with animated active ring. `value` is a hex string. */
export function ColorPicker({ value, onChange, options = PALETTE, size = 30, label = "Colour" }: Props) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2.5">
      {options.map((c) => {
        const active = value?.toLowerCase() === c.hex.toLowerCase();
        return (
          <motion.button
            key={c.id}
            role="radio"
            aria-checked={active}
            aria-label={c.name}
            title={c.name}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(c)}
            className="relative rounded-full ring-offset-2 ring-offset-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt"
            style={{ width: size, height: size, background: c.hex, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.25)" }}
          >
            {active && (
              <motion.span layoutId={`ring-${label}`} className="absolute -inset-1.5 rounded-full border-2 border-volt" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            {active && <Check size={size * 0.5} className="absolute inset-0 m-auto" style={{ color: ["#eef1f0", "#D6FF4D", "#cdb892"].includes(c.hex) ? "#000" : "#fff" }} />}
          </motion.button>
        );
      })}
    </div>
  );
}
