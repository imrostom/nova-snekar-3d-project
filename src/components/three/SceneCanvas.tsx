"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

function Loading() {
  return (
    <Html center>
      <div role="status" className="flex flex-col items-center gap-3 text-xs uppercase tracking-[0.25em] text-volt">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-volt/20 border-t-volt" />
        Loading 3D
      </div>
    </Html>
  );
}

interface Props {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov: number };
  fallback?: ReactNode;
  className?: string;
  /** mount the canvas only after it nears the viewport */
  lazy?: boolean;
}

/**
 * Canvas wrapper: lazy-mounts when near the viewport, pauses rendering (frameloop
 * "never") when scrolled away, caps DPR, and shows a fallback without WebGL.
 */
export function SceneCanvas({ children, camera = { position: [0, 1.2, 9], fov: 32 }, fallback, className, lazy = true }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(!lazy);
  const [visible, setVisible] = useState(!lazy);
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => { setGl(hasWebGL()); }, []);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      setVisible(en.isIntersecting);
      if (en.isIntersecting) setMounted(true);
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className={className}>
      {gl === false ? fallback : mounted && gl ? (
        <Canvas
          dpr={[1, 1.75]}
          frameloop={visible ? "always" : "never"}
          camera={camera}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
          onCreated={({ gl }) => { gl.toneMappingExposure = 1.0; }}
          style={{ touchAction: "pan-y" }}
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}
