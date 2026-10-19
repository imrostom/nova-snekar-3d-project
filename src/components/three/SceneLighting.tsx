"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { SceneState } from "@/lib/sceneState";

/** Procedural studio HDRI (Lightformers) – no network request, PBR reflections. */
export function SceneLighting({ state, shadowY = -1.05 }: { state: SceneState; shadowY?: number }) {
  const rim = useRef<THREE.DirectionalLight>(null!);
  const glow = useRef<THREE.PointLight>(null!);
  const target = useRef(new THREE.Color(state.light));
  const last = useRef(state.light);

  useFrame((_, dt) => {
    if (last.current !== state.light) { last.current = state.light; target.current.set(state.light); }
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 4);
    rim.current.color.lerp(target.current, k);
    glow.current.color.lerp(target.current, k);
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <directionalLight ref={rim} position={[-4, 3, -5]} intensity={3.2} color={state.light} />
      <pointLight ref={glow} position={[1.5, -0.6, -2]} intensity={14} distance={9} color={state.light} />
      <Environment resolution={256} environmentIntensity={0.65}>
        <Lightformer form="rect" intensity={3.5} position={[0, 5, 2]} scale={[10, 4, 1]} rotation-x={Math.PI / 2} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 3]} scale={[4, 6, 1]} rotation-y={Math.PI / 2} color="#fff4ea" />
        <Lightformer form="rect" intensity={5} position={[5, 1, -4]} scale={[3, 8, 1]} rotation-y={-Math.PI / 3} color="#D6FF4D" />
        <Lightformer form="ring" intensity={2} position={[0, -2, -5]} scale={6} color="#6aff3a" />
      </Environment>
      <ContactShadows position={[0, shadowY, 0]} opacity={0.65} scale={12} blur={2.6} far={5} color="#000000" resolution={512} frames={Infinity} />
    </>
  );
}
