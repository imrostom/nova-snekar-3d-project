"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/store/StoreProvider";
import { scrollToId } from "@/lib/scroll";

const NAV = [
  { label: "New Drops", id: "collection", filter: "all" as const, dropdown: true },
  { label: "Men", id: "collection", filter: "men" as const },
  { label: "Women", id: "collection", filter: "women" as const },
  { label: "Customize", id: "customize" },
  { label: "About", id: "about" },
];

export function Header() {
  const { count, setCartOpen, setFilter, setQuickView, notify } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const f = (e: MouseEvent) => { if (!searchRef.current?.contains(e.target as Node)) setFocus(false); };
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? PRODUCTS.filter((p) => `${p.name} ${p.category} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase().includes(s)) : [];
  }, [q]);

  const go = (id: string, filter?: "all" | "men" | "women") => {
    if (filter) setFilter(filter);
    setMenu(false);
    setDrop(false);
    if (location.pathname !== "/") { location.href = `/#${id}`; return; }
    setTimeout(() => scrollToId(id), menu ? 250 : 0);
  };

  const searchBox = (
    <div ref={searchRef} className="relative w-full">
      <label className="relative block">
        <span className="sr-only">Search sneakers</span>
        <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)}
          placeholder="Search sneakers…"
          className="w-full rounded-full border border-white/15 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-white/45 focus:border-volt"
        />
      </label>
      <AnimatePresence>
        {focus && q.trim() && (
          <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 bg-coal/95 p-1.5 backdrop-blur-xl">
            {results.length === 0 && <li className="px-3 py-3 text-sm text-white/50">No sneakers match “{q}”.</li>}
            {results.map((p) => (
              <li key={p.id}>
                <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/10" onClick={() => { setQuickView(p); setFocus(false); setQ(""); setMenu(false); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="h-10 w-14 rounded-lg object-cover" />
                  <span className="flex-1 text-sm font-medium">{p.name}<span className="block text-xs font-normal text-white/50">{p.category}</span></span>
                  <span className="text-sm">${p.price}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-white/10 bg-black/60 py-3 backdrop-blur-xl" : "bg-transparent py-5"}`}>
        <div className="container-x flex items-center justify-between gap-6">
          <Logo className="text-xl sm:text-2xl" />
          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <div key={n.label} className="relative" onMouseEnter={() => n.dropdown && setDrop(true)} onMouseLeave={() => n.dropdown && setDrop(false)}>
                <button onClick={() => go(n.id, n.filter)} className="group relative py-2 text-[13px] font-medium text-white/90 hover:text-white">
                  {n.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-volt transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                </button>
                {n.dropdown && (
                  <AnimatePresence>
                    {drop && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                        <ul className="rounded-2xl border border-white/10 bg-coal/95 p-2 backdrop-blur-xl">
                          {PRODUCTS.map((p) => (
                            <li key={p.id}>
                              <button onClick={() => { setQuickView(p); setDrop(false); }} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.image} alt="" className="h-10 w-14 rounded-lg object-cover" />
                                <span className="flex-1 text-sm font-medium">{p.name}</span>
                                <span className="text-xs text-volt">${p.price}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden w-52 xl:block">{searchBox}</div>
            <button aria-label="Account" onClick={() => notify("Demo store: accounts are not available")} className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-volt sm:flex"><User size={18} /></button>
            <button aria-label={`Open bag, ${count} items`} onClick={() => setCartOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-volt">
              <ShoppingBag size={18} />
              <AnimatePresence>
                {count > 0 && <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-volt px-1 text-[10px] font-bold text-black">{count}</motion.span>}
              </AnimatePresence>
            </button>
            <button aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} onClick={() => setMenu((m) => !m)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden">
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-40 overflow-y-auto bg-ink/95 px-6 pb-10 pt-24 backdrop-blur-xl lg:hidden" data-lenis-prevent>
            <div className="mb-6">{searchBox}</div>
            <ul className="space-y-1">
              {NAV.map((n, i) => (
                <motion.li key={n.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <button onClick={() => go(n.id, n.filter)} className="w-full border-b border-white/10 py-4 text-left font-display text-3xl font-bold">{n.label}</button>
                </motion.li>
              ))}
            </ul>
            <Link href="/info/contact/" className="mt-8 inline-block text-sm text-white/50" onClick={() => setMenu(false)}>Contact</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
