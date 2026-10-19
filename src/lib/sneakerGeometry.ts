import * as THREE from "three";

/** Sneaker is ~4 units long, toe at +x. All parts are procedural placeholders. */
export const LENGTH = 4;

/** half-width of the foot outline at normalised length t (0 heel .. 1 toe) */
export function halfWidth(t: number) {
  const s = Math.sin(Math.PI * Math.pow(THREE.MathUtils.clamp(t, 0, 1), 0.85));
  return 0.64 * Math.pow(Math.max(s, 0), 0.5) * (0.78 + 0.32 * t) * (1 - 0.1 * Math.exp(-Math.pow((t - 0.38) / 0.12, 2)));
}

const sstep = (x: number, a: number, b: number) => THREE.MathUtils.smoothstep(x, a, b);
/** toe spring + slight heel kick, applied to every part so they stay aligned */
export function springY(t: number) {
  return 0.22 * Math.pow(sstep(t, 0.68, 1), 1.7) + 0.05 * (1 - sstep(t, 0, 0.14));
}

/** extruded foot outline, extrusion along +Y (a sole layer) */
export function soleGeometry(thickness: number, inset = 1, bevel = 0.04, flare = 1) {
  const shape = new THREE.Shape();
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = (-LENGTH / 2 + LENGTH * t) * inset;
    const y = halfWidth(t) * inset * flare;
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
  }
  for (let i = N; i >= 0; i--) {
    const t = i / N;
    shape.lineTo((-LENGTH / 2 + LENGTH * t) * inset, -halfWidth(t) * inset * flare);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(thickness - bevel * 2, 0.001),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 1,
  });
  geo.rotateX(-Math.PI / 2); // extrusion Z -> up Y
  geo.translate(0, bevel, 0);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = (p.getX(i) / inset + LENGTH / 2) / LENGTH;
    p.setY(i, p.getY(i) + springY(t));
  }
  geo.computeVertexNormals();
  return geo;
}

const H_KNOTS: [number, number][] = [
  [0, 0.8], [0.05, 1.15], [0.14, 1.36], [0.3, 1.08], [0.4, 1.2], [0.55, 1.0], [0.75, 0.72], [0.9, 0.48], [1, 0.28],
];
export function upperHeight(t: number) {
  for (let i = 0; i < H_KNOTS.length - 1; i++) {
    const [t0, h0] = H_KNOTS[i];
    const [t1, h1] = H_KNOTS[i + 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return h0 + (h1 - h0) * k * k * (3 - 2 * k);
    }
  }
  return H_KNOTS[H_KNOTS.length - 1][1];
}

const P = 0.42; // cross-section squareness: lower = boxier sides
const WS = 0.93;

/** half-angle of the ankle slot around the top of the shell (0 = closed) */
export function collarArc(t: number) {
  if (t <= 0.1 || t >= 0.38) return 0;
  return Math.pow(Math.sin((Math.PI * (t - 0.1)) / 0.28), 0.8) * 0.5;
}

/** surface point on the upper at normalised length t, arc angle a (0 = left foot edge, PI = right), pushed out by `lift` */
export function upperPoint(t: number, a: number, lift = 0) {
  const x = (-LENGTH / 2 + LENGTH * t) * 0.97;
  const hw = halfWidth(t) * WS;
  const sa = Math.sin(a);
  return new THREE.Vector3(
    x,
    upperHeight(t) * Math.pow(sa, P) + springY(t) + lift * sa,
    -hw * Math.cos(a) - lift * Math.cos(a),
  );
}

interface LoftOpts {
  t0?: number; t1?: number;
  rows?: number; cols?: number;
  widthScale?: number;
  heightOffset?: number;
  /** restrict the arc to [lo, hi] radians (tongue); disables the collar slot */
  range?: [number, number];
}

/** Lofted shell following the foot outline – upper & tongue. Closed at heel and toe; ankle slot opens on top only. */
export function loftGeometry(o: LoftOpts = {}) {
  const { t0 = 0, t1 = 1, rows = 96, cols = 36, widthScale = WS, heightOffset = 0, range } = o;
  const half = cols / 2;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const gap: boolean[] = [];
  for (let i = 0; i <= rows; i++) {
    const t = t0 + ((t1 - t0) * i) / rows;
    const x = (-LENGTH / 2 + LENGTH * t) * 0.97;
    const hw = halfWidth(t) * widthScale;
    const H = upperHeight(t) + heightOffset;
    const w = range ? 0 : collarArc(t);
    gap.push(w > 0.002);
    for (let j = 0; j <= cols; j++) {
      let a: number;
      if (range) a = range[0] + ((range[1] - range[0]) * j) / cols;
      else if (j <= half) a = ((Math.PI / 2 - w) * j) / half;
      else a = Math.PI / 2 + w + ((Math.PI / 2 - w) * (j - half - 1)) / (cols - half - 1);
      pos.push(x, H * Math.pow(Math.sin(a), P) + springY(t), -hw * Math.cos(a));
      uv.push(t * 16, (j / cols) * 4);
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!range && j === half && (gap[i] || gap[i + 1])) continue; // slot
      const a = i * (cols + 1) + j;
      const b = a + cols + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** thin overlay panel hugging the upper (toe cap, heel counter, side swoosh). Use with DoubleSide. */
export function patchGeometry(
  t0: number, t1: number,
  aLo: (t: number) => number, aHi: (t: number) => number,
  lift = 0.02, mirror = false, rows = 40, cols = 10,
) {
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= rows; i++) {
    const t = t0 + ((t1 - t0) * i) / rows;
    const lo = aLo(t), hi = aHi(t);
    for (let j = 0; j <= cols; j++) {
      let a = lo + ((hi - lo) * j) / cols;
      if (mirror) a = Math.PI - a;
      const v = upperPoint(t, a, lift);
      pos.push(v.x, v.y, v.z);
    }
  }
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const a = i * (cols + 1) + j, b = a + cols + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** padded collar: a closed tube around the ankle opening */
export function collarRim(radius = 0.07) {
  const pts: THREE.Vector3[] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) pts.push(upperPoint(0.1 + (0.28 * i) / N, Math.PI / 2 - Math.max(collarArc(0.1 + (0.28 * i) / N), 0.001), 0.015));
  for (let i = N - 1; i >= 1; i--) pts.push(upperPoint(0.1 + (0.28 * i) / N, Math.PI / 2 + Math.max(collarArc(0.1 + (0.28 * i) / N), 0.001), 0.015));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 120, radius, 10, true);
}

/** tube along the upper surface across the foot – one lace bar */
export function laceBar(t: number, skew: number, radius = 0.03) {
  const pts: THREE.Vector3[] = [];
  for (let k = 0; k <= 12; k++) {
    const a = 0.9 + ((Math.PI - 1.8) * k) / 12;
    pts.push(upperPoint(t + skew * (k / 12 - 0.5), a, 0.035));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, radius, 6, false);
}

export function canvasTexture(draw: (ctx: CanvasRenderingContext2D, s: number) => void, size = 128, repeat: [number, number] = [1, 1]) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(...repeat);
  tex.anisotropy = 4;
  return tex;
}
