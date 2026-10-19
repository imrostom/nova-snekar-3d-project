import type { Product, HeroSlide } from "@/types";
import { PALETTE } from "./colors";

const c = (...ids: string[]) => ids.map((id) => PALETTE.find((p) => p.id === id)!);

export const PRODUCTS: Product[] = [
  { id: "nova-max", name: "Nova Max", category: "Men's Lifestyle", gender: "men", price: 129, image: "/images/products/nova-max.png", colors: c("red", "black", "white", "blue"), blurb: "The icon. Full-length CushionCore Air under a breathable engineered mesh." },
  { id: "nova-flow", name: "Nova Flow", category: "Unisex", gender: "unisex", price: 119, image: "/images/products/nova-flow.png", colors: c("white", "sand", "black"), blurb: "A clean, featherweight silhouette that goes with everything." },
  { id: "nova-edge", name: "Nova Edge", category: "Men's Performance", gender: "men", price: 139, image: "/images/products/nova-edge.png", colors: c("black", "volt", "blue"), blurb: "Locked-in dynamic fit and aggressive traction for fast days." },
  { id: "nova-rise", name: "Nova Rise", category: "Women's Lifestyle", gender: "women", price: 129, image: "/images/products/nova-rise.png", colors: c("white", "purple", "sand"), blurb: "Soft-touch upper with a sculpted, street-ready stance." },
];

export const SLIDES: HeroSlide[] = [
  {
    id: "max", name: "NOVA MAX", colorName: "Inferno Red", tagline: "Take it apart. Put it back.",
    body: "Explore every layer. Customize every detail. A sneaker built by you, for your next move.",
    colors: { upper: "#d4161c", laces: "#14171a", midsole: "#D6FF4D", outsole: "#14171a", accent: "#D6FF4D" },
    light: "#D6FF4D", bg: "radial-gradient(60% 70% at 70% 45%, rgba(88,130,10,.55), transparent 70%)",
  },
  {
    id: "edge", name: "NOVA EDGE", colorName: "Volt Green", tagline: "Charged for speed.",
    body: "Neon energy meets an aggressive, locked-in fit. Built to move before everyone else does.",
    colors: { upper: "#D6FF4D", laces: "#14171a", midsole: "#14171a", outsole: "#14171a", accent: "#eef1f0" },
    light: "#c4ff00", bg: "radial-gradient(60% 70% at 70% 45%, rgba(150,200,0,.5), transparent 70%)",
  },
  {
    id: "flow", name: "NOVA FLOW", colorName: "Arctic White", tagline: "Clean. Light. Everywhere.",
    body: "A frosted, featherweight silhouette that pairs with your whole rotation, from dawn to midnight.",
    colors: { upper: "#eef1f0", laces: "#eef1f0", midsole: "#cfd6d4", outsole: "#2a2f2e", accent: "#7fd0ff" },
    light: "#9fd8ff", bg: "radial-gradient(60% 70% at 70% 45%, rgba(40,110,150,.5), transparent 70%)",
  },
];

export const FEATURES = [
  { id: "mesh", title: "Engineered Mesh", sub: "Breathable, zoned knit that flexes where you do.", part: "upper" as const },
  { id: "fit", title: "Dynamic Fit", sub: "Adaptive lacing wraps your midfoot without pressure points.", part: "laces" as const },
  { id: "air", title: "CushionCore Air", sub: "Responsive air-pod cushioning for all-day comfort.", part: "cushion" as const },
  { id: "light", title: "Lightweight Midsole", sub: "Sculpted foam that gives back energy on every stride.", part: "midsole" as const },
  { id: "grip", title: "Traction Grip", sub: "Multi-directional rubber lugs for confident grip.", part: "outsole" as const },
];

export const COMMUNITY = [
  { src: "/images/lifestyle/community-1.png", alt: "Red Nova Max sneakers on feet in the city" },
  { src: "/images/lifestyle/community-2.png", alt: "Person sitting on a ledge wearing white sneakers" },
  { src: "/images/lifestyle/community-3.png", alt: "Black and volt Nova Edge close-up" },
  { src: "/images/lifestyle/community-4.png", alt: "Woman sitting in an urban setting wearing pastel sneakers" },
  { src: "/images/lifestyle/community-5.png", alt: "White Nova Flow close-up" },
  { src: "/images/lifestyle/community-6.png", alt: "Man sitting on steps wearing black and volt sneakers" },
  { src: "/images/products/nova-max.png", alt: "Product detail: Nova Max side profile" },
  { src: "/images/products/nova-edge.png", alt: "Product detail: Nova Edge side profile" },
];

export const INFO_PAGES: Record<string, { title: string; body: string }> = {
  "order-tracking": { title: "Order Tracking", body: "Order tracking would show the live status of your parcel here." },
  shipping: { title: "Shipping", body: "Shipping options, rates and delivery windows would be listed here." },
  returns: { title: "Returns", body: "Our returns policy and return portal would live here." },
  "size-guide": { title: "Size Guide", body: "A full size chart and fit advice would live here." },
  faq: { title: "FAQ", body: "Frequently asked questions would be answered here." },
  accessories: { title: "Accessories", body: "Laces, socks, bags and care kits would be sold here." },
  "about-us": { title: "About Us", body: "The Nova Stride company profile would live here." },
  "our-story": { title: "Our Story", body: "Founded on a simple idea: sneakers you can build yourself. The full brand story would live here." },
  sustainability: { title: "Sustainability", body: "Our materials and sustainability commitments would be detailed here." },
  careers: { title: "Careers", body: "Open roles at Nova Stride would be listed here." },
  contact: { title: "Contact", body: "Contact details and a support form would live here." },
  privacy: { title: "Privacy Policy", body: "The privacy policy would live here." },
  terms: { title: "Terms", body: "The terms of service would live here." },
  cookies: { title: "Cookie Settings", body: "Cookie preferences would be managed here. This demo site sets no tracking cookies." },
};
