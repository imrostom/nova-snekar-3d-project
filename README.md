# NOVA STRIDE: interactive 3D sneaker site

Static Next.js 15 (App Router, TypeScript) + Tailwind + React Three Fiber + drei + GSAP/ScrollTrigger + Motion + Lenis.
No backend, database, auth or payments. Everything is local mock data.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export -> ./out  (output: "export")
npm start          # serve ./out
npm run lint       # type-check
```

Deploy `out/` to any static host (Netlify, Vercel static, GitHub Pages, S3/CloudFront).

## What is where

| Area | Files |
| --- | --- |
| Hero, scroll-scrubbed exploded view, slider, labels | `src/components/home/Hero.tsx` |
| Procedural sneaker, 6 animated parts | `src/components/three/SneakerModel.tsx`, `src/lib/sneakerGeometry.ts` |
| Shared render-loop state (no React re-renders) | `src/lib/sceneState.ts` |
| Canvas lazy-mount, pause offscreen, WebGL fallback | `src/components/three/SceneCanvas.tsx` |
| Colour customizer (save to localStorage, cart) | `src/components/home/Customizer.tsx` |
| Technology section (hover highlight, click-to-focus camera) | `src/components/home/Technology.tsx` |
| Cart, quick view, toast | `src/store/StoreProvider.tsx`, `src/components/ui/*` |
| Footer/help routes (demo pages) | `src/app/info/[slug]/page.tsx` |

## Assets: what is placeholder (read this)

1. **3D model.** No licensed multipart GLB is bundled. The six parts (laces, upper, insole, cushion, midsole, outsole) are
   procedurally generated placeholder meshes with PBR materials. To use a real model: export a GLB with nodes named exactly
   `laces upper insole cushion midsole outsole`, save as `public/models/sneaker-parts.glb`, and in `SneakerModel.tsx`
   load it with `useGLTF` and register each node into `parts.current[key]` (instructions in the file header). Explode,
   colours, highlight, camera focus and label projection need no other change. Compress with `gltf-transform optimize` (Draco/meshopt, KTX2).
2. **Photos.** Product, lifestyle and community images in `public/images/` are small crops taken from the reference
   screenshot (`website.png`, 1024 px wide) and are therefore low resolution. Replace them with licensed
   high-res photography using the same filenames (or edit `src/data/products.ts`).
3. **Colour swatches on product cards** record the chosen variant in the cart; they do not swap the photo (only one photo per product exists).
4. **Environment lighting** uses procedural Lightformers (no HDRI download). To use an HDRI, drop a `.hdr` into `public/textures/` and pass `files` to drei `<Environment>`.

## Behaviour notes

- Static demo states are explicit: checkout, account, social links, language switcher and newsletter all say they are demos.
- `prefers-reduced-motion`: Lenis, entrance tweens, reveals and scroll-scrub explode are disabled (use the Explode button instead).
- Performance: canvases mount lazily, stop rendering offscreen, DPR is capped at 1.75, particles are reduced on mobile.
- Zoom is via +/- buttons (wheel zoom is off so the page scroll is never hijacked).
