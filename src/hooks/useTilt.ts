"use client";
import { useCallback, useRef } from "react";

/** Mouse-following 3D tilt written straight to the DOM (no React re-render). */
export function useTilt<T extends HTMLElement>(max = 9) {
  const ref = useRef<T>(null);
  const onMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateY(-6px)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }, [max]);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}
