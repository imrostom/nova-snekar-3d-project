"use client";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "@/store/StoreProvider";

export function Toast() {
  const { toast } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-full border border-volt/40 bg-black/85 px-5 py-3 text-sm text-white shadow-volt backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
