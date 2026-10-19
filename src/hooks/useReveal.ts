"use client";
import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scroll-triggered stagger reveal for `[data-reveal]` children (skipped with reduced motion). */
export function useReveal(scope: RefObject<HTMLElement | null>, selector = "[data-reveal]", from: gsap.TweenVars = { y: 40, opacity: 0 }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        ...from, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
      });
    }, scope);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
