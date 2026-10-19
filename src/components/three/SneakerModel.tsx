"use client";

/**
 * SneakerModel – six independently animated part groups.
 *
 * ASSET NOTE: no licensed multipart GLB ships with this repo, so each part is a
 * procedurally generated placeholder mesh (see lib/sneakerGeometry.ts).
 * To use a real model, export a GLB whose nodes are named exactly like
 * PART_KEYS (laces, upper, insole, cushion, midsole, outsole), drop it in
 * /public/models/sneaker-parts.glb, and replace <PartMeshes/> with
 * `const { scene } = useGLTF("/models/sneaker-parts.glb")` + registering
 * `scene.getObjectByName(key)` into `parts.current[key]`. Everything else
 * (explode, colours, highlight, camera focus) keeps working unchanged.
 */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PartKey, SneakerColors } from "@/types";
import type { SceneState } from "@/lib/sceneState";
import { canvasTexture, collarArc, collarRim, halfWidth, laceBar, loftGeometry, patchGeometry, soleGeometry, springY, upperPoint, LENGTH } from "@/lib/sneakerGeometry";

export const PART_KEYS: PartKey[] = ["outsole", "midsole", "cushion", "insole", "upper", "laces"];
const EXPLODE_DY: Record<PartKey, number> = { outsole: 0, midsole: 0.42, cushion: 0.84, insole: 1.2, upper: 1.7, laces: 2.4 };
const STAGGER: Record<PartKey, number> = { outsole: 0, midsole: 0.08, cushion: 0.16, insole: 0.24, upper: 0.32, laces: 0.4 };
const ANCHOR_Y: Record<PartKey, number> = { outsole: 0.04, midsole: 0.2, cushion: 0.37, insole: 0.44, upper: 1.2, laces: 1.7 };
const SOLE_Y = { outsole: 0, midsole: 0.08, cushion: 0.32, insole: 0.42, upper: 0.46 };

interface Props {
  state: SceneState;
  /** world→screen label projection callback, called every frame (hero only) */
  onParts?: (world: Record<PartKey, THREE.Vector3>, e: number, camera: THREE.Camera) => void;
  mobile?: boolean;
  /** hero uses the stacked mobile layout (shoe pushed to the lower half) */
  hero?: boolean;
  tilt?: boolean;
}

const swC = (t: number) => 0.3 + 0.55 * Math.sin((Math.PI * (t - 0.22)) / 0.48) ** 1.2;
const swW = (t: number) => 0.2 * Math.sin((Math.PI * (t - 0.22)) / 0.48) ** 0.6 + 0.01;
const ease = (k: number) => k * k * (3 - 2 * k);

export function SneakerModel({ state, onParts, mobile, hero, tilt = true }: Props) {
  const root = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const parts = useRef<Record<PartKey, THREE.Group>>({} as Record<PartKey, THREE.Group>);
  const camera = useThree((s) => s.camera);
  const pointer = useThree((s) => s.pointer);

  const g = useMemo(() => {
    const meshTex = canvasTexture((ctx, s) => {
      ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = "#000";
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
        ctx.beginPath(); ctx.arc((x + (y % 2 ? 0.5 : 0)) * s / 8 + s / 16, y * s / 8 + s / 16, s / 40, 0, 7); ctx.fill();
      }
    }, 128, [1, 1]);
    const treadTex = canvasTexture((ctx, s) => {
      ctx.fillStyle = "#777"; ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = "#000"; ctx.lineWidth = s / 10;
      for (let i = -2; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, i * s / 4); ctx.lineTo(s, i * s / 4 + s / 2); ctx.stroke(); }
    }, 64, [5, 5]);

    const mk = (color: string, extra: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, metalness: 0.02, ...extra });

    const mats = {
      upper: mk("#d4161c", { roughness: 0.78, bumpMap: meshTex, bumpScale: 1.2, sheen: 0.2, sheenRoughness: 0.6, sheenColor: new THREE.Color("#ffffff"), side: THREE.DoubleSide }),
      trim: mk("#14171a", { roughness: 0.55, clearcoat: 0.25, side: THREE.DoubleSide }),
      tongue: mk("#1b1f1d", { roughness: 0.85, bumpMap: meshTex, bumpScale: 0.8, side: THREE.DoubleSide }),
      laces: mk("#14171a", { roughness: 0.6 }),
      midsole: mk("#D6FF4D", { roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.25 }),
      cushion: mk("#D6FF4D", { roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
      insole: mk("#2a2e2c", { roughness: 0.9 }),
      outsole: mk("#14171a", { roughness: 0.85, bumpMap: treadTex, bumpScale: 1.5 }),
      accent: mk("#D6FF4D", { roughness: 0.3, clearcoat: 0.6 }),
    };
    const geos = {
      outsole: soleGeometry(0.08, 1, 0.025),
      midsole: soleGeometry(0.24, 0.995, 0.05, 1.012),
      cushion: soleGeometry(0.1, 0.96, 0.03),
      insole: soleGeometry(0.04, 0.92, 0.012),
      upper: loftGeometry(),
      tongue: loftGeometry({ t0: 0.28, t1: 0.52, rows: 20, widthScale: 0.5, heightOffset: 0.09, range: [0.9, Math.PI - 0.9] }),
      rim: collarRim(0.065),
      toeCap: patchGeometry(0.87, 1, () => 0, () => Math.PI, 0.02),
      heelL: patchGeometry(0, 0.24, () => 0, (t) => Math.min(0.05 + 0.45 * Math.sqrt(Math.max(0, 1 - (t / 0.26) ** 2)), Math.PI / 2 - collarArc(t) - 0.05), 0.02),
      heelR: patchGeometry(0, 0.24, () => 0, (t) => Math.min(0.05 + 0.45 * Math.sqrt(Math.max(0, 1 - (t / 0.26) ** 2)), Math.PI / 2 - collarArc(t) - 0.05), 0.02, true),
      swooshL: patchGeometry(0.22, 0.7, (t) => swC(t) - swW(t), (t) => swC(t) + swW(t), 0.022, false, 60, 8),
      swooshR: patchGeometry(0.22, 0.7, (t) => swC(t) - swW(t), (t) => swC(t) + swW(t), 0.022, true, 60, 8),
      eyelet: new THREE.SphereGeometry(0.04, 10, 8),
      pod: new THREE.CapsuleGeometry(0.1, 0.62, 6, 14),
      disc: new THREE.SphereGeometry(0.12, 18, 12),
      lace: [0.44, 0.5, 0.56, 0.62, 0.68, 0.74].flatMap((t, i) => [laceBar(t, 0.05), laceBar(t, -0.05)].map((geo) => ({ geo, i }))),
    };
    const tmp = {
      cols: Object.fromEntries(Object.keys(state.colors).map((k) => [k, new THREE.Color(state.colors[k as keyof SneakerColors])])) as Record<keyof SneakerColors, THREE.Color>,
      emissive: new THREE.Color("#D6FF4D"),
      last: JSON.stringify(state.colors),
      angle: 0,
      e: 0,
      hl: Object.fromEntries(PART_KEYS.map((k) => [k, 0])) as Record<PartKey, number>,
      px: 0, py: 0, ox: 0, orbit: 0, pulse: 0,
      y: Object.fromEntries(PART_KEYS.map((k) => [k, 0])) as Record<PartKey, number>,
      vy: Object.fromEntries(PART_KEYS.map((k) => [k, 0])) as Record<PartKey, number>,
      world: Object.fromEntries(PART_KEYS.map((k) => [k, new THREE.Vector3()])) as Record<PartKey, THREE.Vector3>,
      v: new THREE.Vector3(),
    };
    Object.entries(mats).forEach(([k, m]) => {
      const key = k as keyof typeof mats;
      if (key === "upper") m.color.copy(tmp.cols.upper);
    });
    return { mats, geos, tmp };
  }, [state]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = g.tmp;
    const kc = 1 - Math.exp(-dt * 6);
    const ke = 1 - Math.exp(-dt * 3.2);

    // --- colour transitions (no React state) ---
    const sig = JSON.stringify(state.colors);
    if (sig !== t.last) { t.last = sig; (Object.keys(state.colors) as (keyof SneakerColors)[]).forEach((k) => t.cols[k].set(state.colors[k])); }
    const { mats } = g;
    mats.upper.color.lerp(t.cols.upper, kc);
    mats.laces.color.lerp(t.cols.laces, kc);
    mats.midsole.color.lerp(t.cols.midsole, kc);
    mats.cushion.color.lerp(t.cols.midsole, kc);
    mats.outsole.color.lerp(t.cols.outsole, kc);
    mats.trim.color.lerp(t.cols.outsole, kc);
    mats.accent.color.lerp(t.cols.accent, kc);
    mats.accent.emissive.copy(mats.accent.color); mats.accent.emissiveIntensity = 0.22;

    // --- explode ---
    t.e += (state.explode - t.e) * ke;
    const e = t.e;
    for (const k of PART_KEYS) {
      const grp = parts.current[k];
      if (!grp) continue;
      // damped spring per part: upper layers are lighter/looser, so they overshoot and settle later
      const goal = EXPLODE_DY[k] * ease(THREE.MathUtils.clamp((state.explode - STAGGER[k] * 0.5) / (1 - STAGGER[k] * 0.5), 0, 1));
      const stiff = 55 - STAGGER[k] * 40, damp = 2 * 0.42 * Math.sqrt(stiff);
      t.vy[k] += ((goal - t.y[k]) * stiff - t.vy[k] * damp) * dt;
      t.y[k] += t.vy[k] * dt;
      const p = EXPLODE_DY[k] ? t.y[k] / EXPLODE_DY[k] : 0;
      grp.position.y = t.y[k] + Math.sin(performance.now() / 900 + EXPLODE_DY[k] * 3) * 0.035 * Math.max(0, p);
      grp.rotation.z = Math.sin(performance.now() / 1300 + EXPLODE_DY[k]) * 0.012 * Math.max(0, p) + t.vy[k] * 0.02 * STAGGER[k];
      // highlight glow
      t.hl[k] += ((state.highlight === k ? 1 : 0) - t.hl[k]) * kc;
      const m = k === "laces" ? mats.laces : (mats[k] as THREE.MeshPhysicalMaterial);
      m.emissive.copy(t.emissive);
      m.emissiveIntensity = Math.min(1, t.hl[k] * 0.5 + t.pulse * 0.35);
    }

    // --- idle spin, drag-aware ---
    if (!state.dragging) {
      if (e < 0.06) t.angle += dt * 0.28;
      else {
        const nearest = Math.round(t.angle / (Math.PI * 2)) * Math.PI * 2;
        t.angle += (nearest - t.angle) * (1 - Math.exp(-dt * 2));
      }
    }
    const grp = spin.current;
    t.orbit += (state.orbit - t.orbit) * ke;
    grp.rotation.y = -0.5 + t.angle + t.orbit + state.swing * 0.9;

    // --- mouse tilt + intro + offset ---
    const tp = tilt ? 1 : 0;
    t.px += (pointer.x * 0.12 * tp - t.px) * kc;
    t.py += (pointer.y * 0.08 * tp - t.py) * kc;
    const r = root.current;
    r.rotation.x = -t.py;
    r.rotation.z = t.px * 0.4;
    t.ox += (state.offsetX - t.ox) * ke;
    const intro = ease(THREE.MathUtils.clamp(state.intro, 0, 1));
    state.pulse *= Math.exp(-dt * 2.6); // model owns the decay; Halo reads the same value
    t.pulse = state.pulse;
    const s = (1 + 0.05 * Math.sin(t.pulse * Math.PI)) * (mobile ? (hero ? 0.78 : 0.8) : 0.82) * (0.7 + 0.3 * intro) * (1 - 0.2 * e);
    r.scale.setScalar(s);
    r.position.set(t.ox, (mobile && hero ? -2.2 + 1.2 * e : -0.9 - 0.7 * e) + (1 - intro) * -1.2, 0);

    if (onParts) {
      r.updateWorldMatrix(true, true);
      for (const k of PART_KEYS) {
        const grp2 = parts.current[k];
        if (!grp2) continue;
        t.world[k].set(0, ANCHOR_Y[k], 0);
        grp2.localToWorld(t.world[k]);
      }
      onParts(t.world, e, camera);
    }
  });

  const reg = (k: PartKey) => (o: THREE.Group | null) => { if (o) parts.current[k] = o; };
  const podZ = (t: number) => halfWidth(t) * 0.99;

  return (
    <group ref={root}>
      <group ref={spin}>
        <group ref={reg("outsole")}><mesh geometry={g.geos.outsole} material={g.mats.outsole} position-y={SOLE_Y.outsole} castShadow /></group>
        <group ref={reg("midsole")}>
          <mesh geometry={g.geos.midsole} material={g.mats.midsole} position-y={SOLE_Y.midsole} />
          {[0.22, 0.7].map((t) => [1, -1].map((side) => (
            <mesh key={`${t}${side}`} geometry={g.geos.pod} material={g.mats.accent}
              position={[-LENGTH / 2 + LENGTH * t, SOLE_Y.midsole + 0.12 + springY(t), side * podZ(t) * 0.99]}
              rotation={[0, 0, Math.PI / 2]} scale={[0.5, 0.9, 0.3]} />
          )))}
        </group>
        <group ref={reg("cushion")}><mesh geometry={g.geos.cushion} material={g.mats.cushion} position-y={SOLE_Y.cushion} /></group>
        <group ref={reg("insole")}><mesh geometry={g.geos.insole} material={g.mats.insole} position-y={SOLE_Y.insole} /></group>
        <group ref={reg("upper")}>
          <mesh geometry={g.geos.upper} material={g.mats.upper} position-y={SOLE_Y.upper} />
          <group position-y={SOLE_Y.upper}>
            <mesh geometry={g.geos.toeCap} material={g.mats.trim} />
            <mesh geometry={g.geos.heelL} material={g.mats.trim} />
            <mesh geometry={g.geos.heelR} material={g.mats.trim} />
            <mesh geometry={g.geos.swooshL} material={g.mats.trim} />
            <mesh geometry={g.geos.swooshR} material={g.mats.trim} />
            <mesh geometry={g.geos.rim} material={g.mats.trim} />
            {[1, -1].map((side) => {
              const v = upperPoint(0.2, side === 1 ? 0.55 : Math.PI - 0.55, 0.03);
              return <mesh key={side} geometry={g.geos.disc} material={g.mats.accent} position={v} scale={[1.2, 0.8, 0.25]} rotation={[0, side === 1 ? 0 : Math.PI, 0]} />;
            })}
          </group>
        </group>
        <group ref={reg("laces")}>
          <mesh geometry={g.geos.tongue} material={g.mats.tongue} position-y={SOLE_Y.upper} />
          {g.geos.lace.map(({ geo }, n) => <mesh key={n} geometry={geo} material={g.mats.laces} position-y={SOLE_Y.upper} />)}
        </group>
      </group>
    </group>
  );
}
