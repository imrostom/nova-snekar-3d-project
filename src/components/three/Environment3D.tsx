"use client";

import { useMemo } from "react";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function rockGeometry(seed: number) {
  const g = new THREE.IcosahedronGeometry(1, 2);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * 3.1 + seed) * Math.cos(v.y * 2.7 + seed * 2) * Math.sin(v.z * 3.7 + seed * 3);
    v.multiplyScalar(1 + n * 0.28);
    p.setXYZ(i, v.x, v.y * 0.7, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/** Floating rocks, a rocky pedestal and lime sparkles. `count` is reduced on mobile. */
export function Environment3D({ particles = 80, mobile = false }: { particles?: number; mobile?: boolean }) {
  const geos = useMemo(() => [1, 2, 3, 4, 5].map(rockGeometry), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0d140f", roughness: 0.95, flatShading: true }), []);
  const rocks: { p: [number, number, number]; s: number; g: number; f: number }[] = [
    { p: [-3.6, -1.3, -1.4], s: 0.7, g: 0, f: 0 },
    { p: [4.2, -1.35, -1.2], s: 0.8, g: 1, f: 0 },
    { p: [0.4, -1.5, -2.6], s: 1.3, g: 2, f: 0 },
    { p: [-4.4, 1.7, -3.2], s: 0.28, g: 3, f: 1 },
    { p: [4.6, 2.5, -2.6], s: 0.22, g: 4, f: 1.4 },
    { p: [-2.2, 3.1, -2], s: 0.15, g: 3, f: 1.1 },
  ];
  const list = mobile ? rocks.filter((_, i) => i !== 2).map((r) => ({ ...r, p: [r.p[0] * 0.7, r.p[1] - 1.1, r.p[2]] as [number, number, number] })) : rocks;
  return (
    <>
      {list.map((r, i) => r.f ? (
        <Float key={i} speed={r.f} rotationIntensity={1.8} floatIntensity={2.2} floatingRange={[-0.3, 0.3]}>
          <mesh geometry={geos[r.g]} material={mat} position={r.p} scale={r.s} />
        </Float>
      ) : (
        <mesh key={i} geometry={geos[r.g]} material={mat} position={r.p} scale={r.s} rotation-y={i} />
      ))}
      <Sparkles count={particles} scale={[12, 7, 6]} size={3} speed={0.35} opacity={0.8} color="#D6FF4D" />
      <Sparkles count={Math.round(particles / 3)} scale={[7, 4, 4]} size={7} speed={0.15} opacity={0.35} color="#ffffff" noise={0.6} />
    </>
  );
}
