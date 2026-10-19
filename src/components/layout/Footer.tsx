"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/store/StoreProvider";
import { scrollToId } from "@/lib/scroll";

const TikTok = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M16.6 2h-3.2v13.1a2.9 2.9 0 1 1-2-2.8V9a6.2 6.2 0 1 0 5.2 6.1V8.6a7.4 7.4 0 0 0 4.3 1.4V6.8A4.3 4.3 0 0 1 16.6 2z" /></svg>
);

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export function Footer() {
  const { setFilter, notify } = useStore();
  const shop = (id: string, filter?: "all" | "men" | "women") => () => {
    if (filter) setFilter(filter);
    if (location.pathname !== "/") location.href = `/#${id}`;
    else scrollToId(id);
  };
  const SHOP: { label: string; onClick?: () => void; href?: string }[] = [
    { label: "New Drops", onClick: shop("collection", "all") },
    { label: "Men", onClick: shop("collection", "men") },
    { label: "Women", onClick: shop("collection", "women") },
    { label: "Customize", onClick: shop("customize") },
    { label: "Accessories", href: "/info/accessories/" },
  ];
  const HELP = ["Order Tracking", "Shipping", "Returns", "Size Guide", "FAQ"];
  const COMPANY = ["About Us", "Our Story", "Sustainability", "Careers", "Contact"];
  const socials = [
    { name: "Instagram", icon: <Instagram size={18} /> },
    { name: "TikTok", icon: <TikTok /> },
    { name: "YouTube", icon: <Youtube size={18} /> },
    { name: "X", icon: <Twitter size={18} /> },
    { name: "Facebook", icon: <Facebook size={18} /> },
  ];
  const linkCls = "text-sm text-white/55 transition-colors hover:text-volt";

  return (
    <footer className="border-t border-white/10 bg-ink pt-16">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <Logo className="text-2xl" />
          <p className="mt-4 max-w-xs text-sm text-white/60">Sneakers for a bolder tomorrow. Designed in layers, built around you.</p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <button key={s.name} aria-label={s.name} onClick={() => notify(`Demo: ${s.name} link is a placeholder`)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-volt hover:text-volt">{s.icon}</button>
            ))}
          </div>
        </div>
        <nav aria-label="Shop">
          <h3 className="mb-5 font-display font-bold">Shop</h3>
          <ul className="space-y-3">
            {SHOP.map((l) => <li key={l.label}>{l.href ? <Link className={linkCls} href={l.href}>{l.label}</Link> : <button className={linkCls} onClick={l.onClick}>{l.label}</button>}</li>)}
          </ul>
        </nav>
        <nav aria-label="Help">
          <h3 className="mb-5 font-display font-bold">Help</h3>
          <ul className="space-y-3">{HELP.map((l) => <li key={l}><Link className={linkCls} href={`/info/${slug(l)}/`}>{l}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Company">
          <h3 className="mb-5 font-display font-bold">Company</h3>
          <ul className="space-y-3">{COMPANY.map((l) => <li key={l}><Link className={linkCls} href={`/info/${slug(l)}/`}>{l}</Link></li>)}</ul>
        </nav>
      </div>
      <div className="container-x mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/45 md:flex-row md:items-center">
        <p>© 2026 Nova Stride. All rights reserved. Demo website.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/info/privacy/" className="hover:text-volt">Privacy Policy</Link>
          <Link href="/info/terms/" className="hover:text-volt">Terms</Link>
          <Link href="/info/cookies/" className="hover:text-volt">Cookie Settings</Link>
          <label className="flex items-center gap-2">
            <span className="sr-only">Language</span>
            <select defaultValue="en" onChange={() => { notify("Demo: only English is available"); }} className="rounded-md border border-white/15 bg-black px-2 py-1 text-white/80">
              <option value="en">English</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="es">Español</option>
            </select>
          </label>
        </div>
      </div>
    </footer>
  );
}
