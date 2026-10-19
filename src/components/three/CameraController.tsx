"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { SceneState } from "@/lib/sceneState";
import type { PartKey } from "@/types";

interface Props {
  state: SceneState;
  /** default camera distance range [far, near] – safe zoom limits */
  distance?: [number, number];
  /** world position of each part, for click-to-focus (tech section) */
  partWorld?: React.RefObject<Partial<Record<PartKey, THREE.Vector3>>>;
  polar?: [number, number];
}

/** Drag-to-rotate with damping, zoom via state.zoom (never page-scroll hijacking) and focus fly-to. */
export function CameraController({ state, distance = [11, 6], partWorld, polar = [0.9, 1.75] }: Props) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const goal = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());
  const dist = useRef((distance[0] + distance[1]) / 2);

  useFrame((_, dtRaw) => {
    const c = controls.current;
    if (!c) return;
    const dt = Math.min(dtRaw, 0.05);
    const k = 1 - Math.exp(-dt * 3.5);
    let wantDist = THREE.MathUtils.lerp(distance[0], distance[1], state.zoom);
    goal.current.set(0, 0, 0);
    if (state.focus && partWorld?.current?.[state.focus]) {
      goal.current.copy(partWorld.current[state.focus]!);
      wantDist = distance[1] * 0.55;
    }
    c.target.lerp(goal.current, k);
    dist.current += (wantDist - dist.current) * k;
    tmp.current.copy(camera.position).sub(c.target);
    const cur = tmp.current.length();
    tmp.current.setLength(cur + (dist.current - cur) * k);
    camera.position.copy(c.target).add(tmp.current);
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.7}
      minPolarAngle={polar[0]}
      maxPolarAngle={polar[1]}
      onStart={() => { state.dragging = true; }}
      onEnd={() => { state.dragging = false; }}
    />
  );
}
