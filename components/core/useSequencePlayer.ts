"use client";

import { useCallback, useEffect, useState } from "react";
import type { SequenceStep } from "@/domain/iching/types";

export type PlaybackSpeed = 1 | 2;

/**
 * 演出ステップ配列を自動進行で再生する。duration(通常速度の ms)を
 * speed で除算して次ステップへ進む。duration 0 のステップで停止する。
 */
export function useSequencePlayer(steps: SequenceStep[]) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const step = steps[index];
  const isLast = index >= steps.length - 1;

  useEffect(() => {
    if (!playing || isLast || !step || step.duration <= 0) return;
    const timer = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    }, step.duration / speed);
    return () => clearTimeout(timer);
  }, [index, playing, speed, isLast, step, steps.length]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);
  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, steps.length - 1)),
    [steps.length],
  );
  const skip = useCallback(() => setIndex(steps.length - 1), [steps.length]);
  const toggleSpeed = useCallback(
    () => setSpeed((s) => (s === 1 ? 2 : 1)),
    [],
  );

  return { index, step, playing, speed, isLast, togglePlay, next, skip, toggleSpeed };
}
