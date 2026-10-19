import type { PartKey, SneakerColors } from "@/types";
import { DEFAULT_COLORS } from "@/data/colors";

/**
 * Mutable state shared between React UI and the Three.js render loop.
 * It is read inside useFrame / requestAnimationFrame, so changing it never
 * triggers a React re-render of the 3D scene.
 */
export interface SceneState {
  /** target explode amount 0 (assembled) .. 1 (fully exploded) */
  explode: number;
  /** part the camera should fly to (null = default view) */
  focus: PartKey | null;
  /** part to glow (hover) */
  highlight: PartKey | null;
  /** target colours – materials lerp towards these */
  colors: SneakerColors;
  /** rim-light colour */
  light: string;
  /** 0 = far, 1 = close (safe-limited zoom) */
  zoom: number;
  /** horizontal model offset target (hero scroll move-to-center) */
  offsetX: number;
  /** 0..1 entrance animation progress */
  intro: number;
  /** slide-change camera swing, animated by GSAP */
  swing: number;
  /** extra yaw (rad) driven by scroll, smoothed in the model */
  orbit: number;
  /** 1 -> 0 impulse fired on colour change (squash + halo ripple) */
  pulse: number;
  dragging: boolean;
}

export function createSceneState(partial: Partial<SceneState> = {}): SceneState {
  return {
    explode: 0,
    focus: null,
    highlight: null,
    colors: { ...DEFAULT_COLORS },
    light: "#D6FF4D",
    zoom: 0.35,
    offsetX: 0,
    intro: 1,
    swing: 0,
    orbit: 0,
    pulse: 0,
    dragging: false,
    ...partial,
  };
}
