export type Vec3 = readonly [number, number, number];

export type CameraKeyframe = {
  progress: number;
  position: Vec3;
  target: Vec3;
  fov: number;
};

export type CameraPose = {
  position: Vec3;
  target: Vec3;
  fov: number;
};

export const CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  { progress: 0, position: [0, 0.2, 8], target: [0, 0.5, 0], fov: 38 },
  { progress: 0.14, position: [0, 0.1, 7.6], target: [0, 0.2, 0], fov: 40 },
  { progress: 0.27, position: [0, 0, 7.2], target: [0, 0, 0], fov: 42 },
  { progress: 0.38, position: [0, 1.1, -4], target: [0, 0, -10], fov: 48 },
  { progress: 0.5, position: [0, 1.6, -5.5], target: [0, 0, -10], fov: 52 },
  { progress: 0.62, position: [0, 0.8, -11], target: [0, 0, -18], fov: 44 },
  { progress: 0.74, position: [-1.4, 0.8, -13.5], target: [0, 0, -18], fov: 46 },
  { progress: 0.82, position: [1.4, 1, -14.5], target: [0, 0, -19], fov: 50 },
  { progress: 0.9, position: [0, 0, -21], target: [0, 0, -27], fov: 45 },
  { progress: 1, position: [0, 0, -21], target: [0, 0, -27], fov: 45 },
] as const;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function interpolate(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

function interpolateVec(a: Vec3, b: Vec3, amount: number): Vec3 {
  return [
    interpolate(a[0], b[0], amount),
    interpolate(a[1], b[1], amount),
    interpolate(a[2], b[2], amount),
  ];
}

/** A deterministic pose for scroll-driven, reversible camera motion. */
export function sampleCamera(progress: number): CameraPose {
  const value = clamp01(progress);
  const last = CAMERA_KEYFRAMES.at(-1)!;

  if (value <= CAMERA_KEYFRAMES[0].progress) {
    const first = CAMERA_KEYFRAMES[0];
    return { position: first.position, target: first.target, fov: first.fov };
  }
  if (value >= last.progress) {
    return { position: last.position, target: last.target, fov: last.fov };
  }

  const nextIndex = CAMERA_KEYFRAMES.findIndex((frame) => frame.progress >= value);
  const from = CAMERA_KEYFRAMES[nextIndex - 1];
  const to = CAMERA_KEYFRAMES[nextIndex];
  const local = smoothstep((value - from.progress) / (to.progress - from.progress));

  return {
    position: interpolateVec(from.position, to.position, local),
    target: interpolateVec(from.target, to.target, local),
    fov: interpolate(from.fov, to.fov, local),
  };
}

export const STAGE_THRESHOLDS = [0, 0.19, 0.39, 0.61, 0.83] as const;

export function stageIndexAt(progress: number): number {
  const value = clamp01(progress);
  for (let index = STAGE_THRESHOLDS.length - 1; index >= 0; index -= 1) {
    if (value >= STAGE_THRESHOLDS[index]) return index;
  }
  return 0;
}
