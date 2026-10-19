"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Award, Footprints, Leaf, Shirt } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: Award, title: "Premium Materials", sub: "Built to last" },
  { icon: Footprints, title: "All-Day Comfort", sub: "Move without limits" },
  { icon: Shirt, title: "Street-Ready Style", sub: "Designed for every you" },
  { icon: Leaf, title: "Sustainable Steps", sub: "A cleaner, brighter future" },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-bg", { yPercent: -8, scale: 1.08 }, { yPercent: 8, scale: 1.02, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".about-shoe", { yPercent: 10, scale: 0.94 }, { yPercent: -6, scale: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from(".about-line", { yPercent: 110, duration: 1, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: ref.current, start: "top 70%", once: true } });
      gsap.from(".about-fade", { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 65%", once: true } });
      gsap.from(".about-feature", { x: 50, opacity: 0, duration: 0.8, stagger: 0.14, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 60%", once: true } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 py-24">
      {/* PLACEHOLDER photo: replace /images/lifestyle/street.png with a full-res urban lifestyle shot */}
      <div aria-hidden className="about-bg absolute inset-0 bg-cover bg-center opacity-50 blur-[2px]" style={{ backgroundImage: "url(/images/lifestyle/street.png)" }} />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#070908_5%,rgba(7,9,8,.55)_45%,rgba(7,9,8,.85)_100%)]" />
      <div aria-hidden className="absolute -right-40 top-0 h-full w-1/2 bg-[radial-gradient(circle,rgba(150,210,0,.28),transparent_60%)]" />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr_0.7fr]">
        <div>
          <p className="eyebrow about-fade">About Nova Stride</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            <span className="reveal-line"><span className="about-line block">More Than Sneakers.</span></span>
            <span className="reveal-line"><span className="about-line block">A Movement.</span></span>
          </h2>
          <p className="about-fade mt-5 max-w-sm leading-relaxed text-white/70">We design sneakers for creators, dreamers and go-getters. Combining performance, comfort and street-ready style — Nova Stride keeps you one step ahead.</p>
          <Link href="/info/our-story/" className="btn-volt about-fade mt-7">Our Story <ArrowRight size={18} /></Link>
        </div>
        <div className="about-shoe relative mx-auto aspect-[340/282] w-full max-w-md overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(150,220,0,.35)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/lifestyle/street.png" alt="Red and lime Nova Max sneakers worn on a wet city street" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <ul className="space-y-4">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <li key={title} className="about-feature flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 text-volt"><Icon size={20} /></span>
              <span><span className="block font-bold">{title}</span><span className="text-sm text-white/55">{sub}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
