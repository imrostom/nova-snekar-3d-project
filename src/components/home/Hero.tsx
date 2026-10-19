"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Layers, Minus, Plus } from "lucide-react";
import type * as THREE from "three";
import type { PartKey } from "@/types";
import { SLIDES } from "@/data/products";
import { createSceneState } from "@/lib/sceneState";
import { scrollToId } from "@/lib/scroll";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);
const SneakerScene = dynamic(() => import("@/components/three/SneakerScene"), { ssr: false });

const LABELS: { key: PartKey; label: string }[] = [
  { key: "laces", label: "Laces" },
  { key: "upper", label: "Mesh Upper" },
  { key: "insole", label: "Insole" },
  { key: "cushion", label: "Cushion Layer" },
  { key: "midsole", label: "Midsole" },
  { key: "outsole", label: "Outsole" },
];

export function Hero() {
  const state = useMemo(() => createSceneState({ colors: { ...SLIDES[0].colors }, light: SLIDES[0].light, intro: 0, offsetX: 1.5 }), []);
  const wrap = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const [slide, setSlide] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [upper, setUpper] = useState(SLIDES[0].colors.upper);
  const scrollP = useRef(0);
  const toggled = useRef(false);
  const reduce = usePrefersReducedMotion();
  const s = SLIDES[slide];

  const sync = () => { state.explode = Math.max(scrollP.current, toggled.current ? 1 : 0); };

  // slide -> scene colours / light / camera swing
  useEffect(() => {
    state.colors = { ...s.colors };
    state.light = s.light;
    state.pulse = 1;
    setUpper(s.colors.upper);
    if (!reduce) gsap.fromTo(state, { swing: -1 }, { swing: 0, duration: 1.3, ease: "power3.out" });
  }, [slide]); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-advance slides
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => !toggled.current && scrollP.current < 0.05 && setSlide((i) => (i + 1) % SLIDES.length), 9000);
    return () => clearInterval(id);
  }, [reduce, slide]);

  // GSAP: entrance + scroll scrubbed explode
  useEffect(() => {
    const mobile = () => window.innerWidth < 768;
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.to(state, { intro: 1, duration: 1.8, ease: "power3.out", delay: 0.2 });
        gsap.from(".hero-line", { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12, ease: "power4.out", delay: 0.3 });
        gsap.from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.7 });
      } else state.intro = 1;
      ScrollTrigger.create({
        trigger: wrap.current, start: "top top", end: "bottom bottom", scrub: true,
        onUpdate: (self) => {
          const p = reduce ? 0 : self.progress;
          scrollP.current = Math.min(1, p / 0.7);
          state.offsetX = mobile() ? 0 : 1.5 - 1.5 * Math.min(1, p / 0.45);
          state.orbit = reduce ? 0 : p * 1.1;
          sync();
          if (word.current) word.current.style.transform = `translate3d(${-p * 28}%, ${p * 12}%, 0)`;
          if (copy.current) {
            const f = Math.min(1, Math.max(0, p / 0.3));
            copy.current.style.opacity = String(1 - f);
            copy.current.style.transform = `translateY(${-f * 60}px)`;
            copy.current.style.pointerEvents = f > 0.6 ? "none" : "auto";
          }
        },
      });
    }, wrap);
    state.offsetX = mobile() ? 0 : 1.5;
    const onResize = () => { if (mobile()) state.offsetX = 0; };
    window.addEventListener("resize", onResize);
    return () => { ctx.revert(); window.removeEventListener("resize", onResize); };
  }, [reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => { toggled.current = !toggled.current; setExploded(toggled.current); sync(); };

  // project 3D part positions into the DOM labels (runs inside the r3f loop)
  const onParts = (world: Record<PartKey, THREE.Vector3>, e: number, camera: THREE.Camera) => {
    const el = wrap.current?.querySelector<HTMLElement>("[data-stage]");
    if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;
    LABELS.forEach((l, i) => {
      const node = labelEls.current[i];
      if (!node) return;
      const v = world[l.key].clone().project(camera);
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-v.y * 0.5 + 0.5) * h;
      const vis = Math.min(1, Math.max(0, (e - 0.25 - i * 0.06) / 0.2));
      const labelX = Math.max(x + 40, w - (w < 1100 ? 120 : 190));
      const len = labelX - x;
      node.style.opacity = String(vis);
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const line = node.querySelector<HTMLElement>("[data-line]")!;
      const text = node.querySelector<HTMLElement>("[data-text]")!;
      line.style.width = `${len}px`;
      line.style.transform = `scaleX(${vis})`;
      text.style.left = `${len + 12}px`;
    });
  };

  const fallback = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/images/lifestyle/hero-fallback.png" alt="Red and lime Nova Max sneaker" className="mx-auto h-full max-h-[70vh] object-contain" />
  );

  return (
    <section ref={wrap} id="home" className="relative h-[330vh] md:h-[360vh]">
      <div className="sticky top-0 h-screen min-h-[620px] overflow-hidden" data-stage>
        {/* atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_20%_0%,#101a12_0%,#070908_70%)]" />
        <AnimatePresence>
          <motion.div key={s.id} className="absolute inset-0" style={{ background: s.bg }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} />
        </AnimatePresence>
        <div ref={word} aria-hidden className="pointer-events-none absolute left-[6%] top-[14%] select-none whitespace-nowrap font-display text-[clamp(9rem,28vw,26rem)] font-extrabold leading-none tracking-tighter text-transparent will-change-transform [-webkit-text-stroke:1px_rgba(214,255,77,.1)]">NOVA STRIDE</div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

        {/* 3D */}
        <SneakerScene state={state} variant="hero" className="absolute inset-0" fallback={fallback} onParts={onParts} lazy={false} />

        {/* label connectors (positions written per frame from the 3D parts) */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
          {LABELS.map((l, i) => (
            <div key={l.key} ref={(n) => { labelEls.current[i] = n; }} className="absolute left-0 top-0 opacity-0 will-change-transform">
              <span className="absolute -left-[3px] -top-[3px] h-[7px] w-[7px] rounded-full bg-volt shadow-[0_0_10px_#D6FF4D]" />
              <span data-line className="absolute left-0 top-0 h-px origin-left bg-white/45" />
              <span data-text className="absolute top-0 -translate-y-1/2 whitespace-nowrap text-xs font-medium text-white/90">{l.label}</span>
            </div>
          ))}
        </div>

        {/* copy */}
        <div ref={copy} className="container-x relative z-10 flex h-full flex-col justify-start pb-28 pt-24 will-change-transform md:justify-center">
          <div className="max-w-xl">
            <p className="eyebrow hero-fade tracking-[0.35em]">Engineered for what&apos;s next</p>
            <h1 className="mt-5 font-display text-[clamp(2.3rem,min(11vw,10vh),5.4rem)] md:text-[clamp(2.6rem,min(7vw,10.5vh),5.4rem)] font-extrabold leading-[0.95] tracking-tight">
              <span className="reveal-line"><span className="hero-line block">TAKE IT</span></span>
              <span className="reveal-line"><span className="hero-line block text-volt">APART.</span></span>
              <span className="reveal-line"><span className="hero-line block">PUT IT BACK.</span></span>
            </h1>
            <p className="hero-fade mt-4 max-w-[17rem] text-sm leading-relaxed text-white/70 sm:max-w-sm sm:text-[15px] md:mt-6">
              Explore every layer. Customize every detail. A sneaker built by you, for your next move.
            </p>
            <div className="hero-fade mt-5 flex flex-wrap gap-2.5 md:mt-8 md:gap-3 [&>*]:!px-5 [&>*]:!py-3 md:[&>*]:!px-7 md:[&>*]:!py-3.5">
              <button className="btn-volt" onClick={() => scrollToId("collection")}>Shop the Drop <ArrowRight size={18} /></button>
              <button className="btn-ghost" onClick={() => { toggled.current = true; setExploded(true); sync(); }}><Layers size={16} /> Explore in 3D</button>
            </div>
            <div className="hero-fade mt-6 hidden items-center gap-3 md:flex [@media(max-height:820px)]:!hidden">
              <div className="flex -space-x-2.5">
                {["#c0392b", "#2c3e50", "#7f8c8d", "#8e5a3c"].map((c, i) => (
                  <span key={i} className="h-9 w-9 rounded-full border-2 border-ink" style={{ background: `radial-gradient(circle at 35% 30%, #f5d5b8 0 20%, ${c} 22%)` }} />
                ))}
              </div>
              <p className="text-sm"><span className="font-bold text-volt">10K+</span><br /><span className="text-white/60">Sneaker lovers</span></p>
            </div>
            <div className="hero-fade mt-5 w-fit rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur md:mt-6 md:p-4 max-md:absolute max-md:bottom-[5.5rem] max-md:left-5 max-md:right-5 max-md:mt-0 max-md:w-auto">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider">Customize yours</p>
              <ColorPicker label="hero-swatch" size={26} value={upper} onChange={(c) => { state.colors = { ...state.colors, upper: c.hex }; state.pulse = 1; setUpper(c.hex); }} />
            </div>
          </div>
        </div>

        {/* slide info */}
        <div className="absolute bottom-6 left-0 right-0 z-10">
          <div className="container-x flex flex-col items-stretch gap-1 md:flex-row md:items-end md:justify-between md:gap-4">
            <div className="hidden md:block">
              <AnimatePresence mode="wait">
                <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
                  <p className="font-display text-lg font-bold">{s.name} <span className="text-volt">— {s.colorName}</span></p>
                  <p className="max-w-xs text-sm text-white/55">{s.tagline}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-x-3 md:w-auto md:flex-nowrap md:justify-end">
              <div className="flex gap-2" role="tablist" aria-label="Hero slides">
                {SLIDES.map((sl, i) => (
                  <button key={sl.id} role="tab" aria-selected={i === slide} aria-label={`${sl.name} ${sl.colorName}`} onClick={() => setSlide(i)} className="py-3">
                    <motion.span className="block h-1 rounded-full bg-white" animate={{ width: i === slide ? 40 : 14, opacity: i === slide ? 1 : 0.3, backgroundColor: i === slide ? "#D6FF4D" : "#fff" }} />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Zoom out" onClick={() => (state.zoom = Math.max(0, state.zoom - 0.2))} className="rounded-full border border-white/20 p-2.5 hover:border-volt"><Minus size={14} /></button>
                <button aria-label="Zoom in" onClick={() => (state.zoom = Math.min(1, state.zoom + 0.2))} className="rounded-full border border-white/20 p-2.5 hover:border-volt"><Plus size={14} /></button>
                <button onClick={toggle} aria-pressed={exploded} className="rounded-full border border-volt/60 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-volt hover:bg-volt hover:text-black">{exploded ? "Assemble" : "Explode"}</button>
                <button aria-label="Previous slide" onClick={() => setSlide((i) => (i + SLIDES.length - 1) % SLIDES.length)} className="rounded-full border border-white/20 p-2.5 hover:border-volt"><ArrowLeft size={14} /></button>
                <button aria-label="Next slide" onClick={() => setSlide((i) => (i + 1) % SLIDES.length)} className="rounded-full border border-white/20 p-2.5 hover:border-volt"><ArrowRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-6 top-28 z-10 hidden items-center gap-3 text-xs xl:flex" aria-hidden>
          <span className="text-volt">01</span><span className="h-px w-8 bg-white/30" /><span className="text-white/40">0{SLIDES.length}</span>
        </div>
        <button onClick={() => scrollToId("collection")} className="absolute bottom-24 right-8 z-10 hidden flex-col items-center gap-2 text-[11px] text-white/60 xl:flex" aria-label="Scroll to explore">
          <span className="flex h-12 w-8 justify-center rounded-full border border-white/40 pt-2"><span className="h-2 w-px animate-bounce bg-white" /></span>
          Scroll<br />to explore
        </button>
      </div>
    </section>
  );
}
