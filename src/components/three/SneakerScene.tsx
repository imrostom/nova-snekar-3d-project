"use client";

import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import type { SceneState } from "@/lib/sceneState";
import type { PartKey } from "@/types";
import { SceneCanvas } from "./SceneCanvas";
import { SceneLighting } from "./SceneLighting";
import { CameraController } from "./CameraController";
import { Environment3D } from "./Environment3D";
import { Halo } from "./Halo";
import { SneakerModel } from "./SneakerModel";

interface Props {
  state: SceneState;
  variant: "hero" | "custom" | "tech";
  className?: string;
  fallback?: React.ReactNode;
  onParts?: (world: Record<PartKey, THREE.Vector3>, e: number, camera: THREE.Camera) => void;
  lazy?: boolean;
}

/** Composition root of one sneaker canvas (hero / customizer / technology). */
export default function SneakerScene({ state, variant, className, fallback, onParts, lazy = variant !== "hero" }: Props) {
  const [mobile, setMobile] = useState(false);
  const partWorld = useRef<Partial<Record<PartKey, THREE.Vector3>>>({});

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const f = () => setMobile(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  const handleParts = (w: Record<PartKey, THREE.Vector3>, e: number, cam: THREE.Camera) => {
    partWorld.current = w;
    onParts?.(w, e, cam);
  };

  return (
    <SceneCanvas
      className={className}
      fallback={fallback}
      lazy={lazy}
      camera={{ position: variant === "hero" ? [0.5, 3.2, 10.5] : [0.3, 3, 9.5], fov: mobile && variant === "hero" ? 40 : 30 }}
    >
      <SceneLighting state={state} shadowY={variant === "hero" ? -1.1 : -0.95} />
      <Halo state={state} y={variant === "hero" ? -1.08 : -0.93} />
      <SneakerModel state={state} mobile={mobile} hero={variant === "hero"} onParts={handleParts} tilt={!mobile} />
      {variant === "hero" && <Environment3D particles={mobile ? 30 : 90} mobile={mobile} />}
      <CameraController state={state} distance={mobile ? (variant === "hero" ? [14, 9] : [10.5, 6.5]) : variant === "hero" ? [9.6, 6] : [9.5, 5.5]} partWorld={partWorld} polar={variant === "tech" ? [0.6, 1.9] : [0.9, 1.75]} />
    </SceneCanvas>
  );
}
