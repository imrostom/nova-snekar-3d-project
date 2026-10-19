"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneState } from "@/lib/sceneState";

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,.9)");
  g.addColorStop(0.35, "rgba(255,255,255,.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Floor glow + two counter-rotating rings. Breathes with the scene, ripples outward on colour change. */
export function Halo({ state, y = -1.05 }: { state: SceneState; y?: number }) {
  const root = useRef<THREE.Group>(null!);
  const ringA = useRef<THREE.Mesh>(null!);
  const ringB = useRef<THREE.Mesh>(null!);
  const ripple = useRef<THREE.Mesh>(null!);
  const glow = useRef<THREE.Mesh>(null!);
  const col = useRef(new THREE.Color(state.light));
  const tex = useMemo(glowTexture, []);
  const want = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05), t = clock.elapsedTime;
    want.set(state.light);
    col.current.lerp(want, 1 - Math.exp(-dt * 4));
    const e = state.explode, p = state.pulse;
    // follow the model's horizontal offset so the hero glow stays under the shoe
    root.current.position.x += (state.offsetX - root.current.position.x) * (1 - Math.exp(-dt * 3));
    const breathe = 1 + Math.sin(t * 1.4) * 0.04;
    ringA.current.rotation.z = t * 0.15;
    ringB.current.rotation.z = -t * 0.1;
    ringA.current.scale.setScalar(breathe * (1 + e * 0.25));
    ringB.current.scale.setScalar(breathe * (1.18 + e * 0.35));
    (ringA.current.material as THREE.MeshBasicMaterial).opacity = 0.28 + e * 0.2 + p * 0.3;
    (ringB.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + e * 0.12;
    const rs = 1 + (1 - p) * 1.6;
    ripple.current.scale.setScalar(rs);
    (ripple.current.material as THREE.MeshBasicMaterial).opacity = p * 0.55;
    glow.current.scale.setScalar(1 + e * 0.3 + p * 0.2);
    (glow.current.material as THREE.MeshBasicMaterial).opacity = 0.32 + e * 0.18 + p * 0.25;
    for (const m of [ringA, ringB, ripple, glow]) (m.current.material as THREE.MeshBasicMaterial).color.copy(col.current);
  });

  const mat = (o = 0.3) => ({ transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  return (
    <group ref={root} position={[0, y, 0]} rotation-x={-Math.PI / 2}>
      <mesh ref={glow} position-z={-0.01}><planeGeometry args={[9, 9]} /><meshBasicMaterial map={tex} {...mat()} /></mesh>
      <mesh ref={ringA}><ringGeometry args={[2.55, 2.58, 128]} /><meshBasicMaterial {...mat()} /></mesh>
      <mesh ref={ringB}><ringGeometry args={[2.62, 2.64, 6]} /><meshBasicMaterial {...mat()} /></mesh>
      <mesh ref={ripple}><ringGeometry args={[1.9, 1.96, 96]} /><meshBasicMaterial {...mat(0)} /></mesh>
    </group>
  );
}
