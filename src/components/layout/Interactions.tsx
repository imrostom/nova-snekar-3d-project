"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Page-wide motion layer: a scroll progress bar and magnetic pull on primary buttons.
 * Written straight to the DOM (no React state), and disabled for reduced motion / touch.
 */
export function Interactions() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const paint = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    const onScroll = () => { raf ||= requestAnimationFrame(paint); };
    addEventListener("scroll", onScroll, { passive: true });
    paint();

    if (!matchMedia("(hover: hover)").matches) return () => removeEventListener("scroll", onScroll);
    let cur: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".btn-volt, .btn-ghost");
      if (cur && cur !== el) { gsap.to(cur, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" }); cur = null; }
      if (!el) return;
      cur = el;
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.35, ease: "power3.out" });
    };
    document.addEventListener("pointermove", onMove);
    return () => {
      removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={bar} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[95] h-[2px] origin-left scale-x-0 bg-volt shadow-[0_0_12px_#D6FF4D]" />;
}
