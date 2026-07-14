import type { HexagramPhase } from "./generation";

export const AUTO_DURATION_MS = 50_000;
export const AUTO_PROGRESS_DURATION_MS = 39_000;
export const AUTO_STACK_AT_MS = 39_000;
export const AUTO_FIELD_AT_MS = 44_000;
export const AUTO_DIALOG_AT_MS = 48_000;
export const RESTART_SWIPE_DISTANCE = 72;

export type AutoPlaybackState = "idle" | "playing" | "paused";
export type AutoStopReason = "user" | "visibility" | "complete" | null;

export type AutoTimelineSample = {
  progress: number;
  phase: HexagramPhase;
  dialogOpen: boolean;
  complete: boolean;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

/** Shared, deterministic timeline for the AUTO control and its tests. */
export function sampleAutoTimeline(elapsedMs: number): AutoTimelineSample {
  const elapsed = clamp(elapsedMs, 0, AUTO_DURATION_MS);
  const progress = clamp(elapsed / AUTO_PROGRESS_DURATION_MS, 0, 1);
  const phase: HexagramPhase =
    elapsed >= AUTO_FIELD_AT_MS
      ? "field"
      : elapsed >= AUTO_STACK_AT_MS
        ? "stacked"
        : "selecting";

  return {
    progress,
    phase,
    dialogOpen: elapsed >= AUTO_DIALOG_AT_MS,
    complete: elapsed >= AUTO_DURATION_MS,
  };
}

/** A deliberate downward touch gesture after leaving the hexagram field. */
export function isRestartSwipe(deltaX: number, deltaY: number) {
  return (
    deltaY >= RESTART_SWIPE_DISTANCE &&
    deltaY > Math.abs(deltaX) * 1.25
  );
}
