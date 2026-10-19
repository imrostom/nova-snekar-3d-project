"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    setErr(""); setDone(true);
  };

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 py-24">
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(214,255,77,.2),transparent)]" />
      <div className="container-x relative text-center">
        <p data-reveal className="eyebrow">Newsletter</p>
        <h2 data-reveal className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">STEP INTO <span className="text-volt">WHAT&apos;S NEXT.</span></h2>
        <p data-reveal className="mx-auto mt-4 max-w-md text-white/60">Get the latest drops and exclusive offers.</p>
        <form data-reveal onSubmit={submit} noValidate className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Email address</span>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setDone(false); }} placeholder="Your email address" aria-invalid={!!err} aria-describedby="nl-msg"
              className="w-full rounded-full border border-white/20 bg-white/[0.05] px-6 py-3.5 outline-none placeholder:text-white/40 focus:border-volt" />
          </label>
          <button className="btn-volt">Subscribe <ArrowRight size={17} /></button>
        </form>
        <div id="nl-msg" aria-live="polite" className="mt-4 min-h-6 text-sm">
          <AnimatePresence mode="wait">
            {err && <motion.p key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400">{err}</motion.p>}
            {done && <motion.p key="d" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2 text-volt"><Check size={16} /> Demo only: your email looks valid, but nothing was sent or stored.</motion.p>}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
