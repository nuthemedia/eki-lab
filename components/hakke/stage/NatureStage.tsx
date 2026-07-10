"use client";

import { useEffect, useRef } from "react";
import type { HakkePalette } from "@/data/hakke/trigrams";
import type { NatureEffect } from "./effectTypes";
import { createNatureEffect } from "./effects";

type Props = {
  trigramId: number | null;
  /** 増えるたびに再生開始 */
  playKey: number;
  palette: HakkePalette;
  /** true の間はループを止めてキャンバスを空にする(build フェーズ) */
  idle: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
};

export default function NatureStage({
  trigramId,
  playKey,
  palette,
  idle,
  reducedMotion,
  onComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const playingRef = useRef(false);
  const effectRef = useRef<NatureEffect | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // サイズ追従(dpr 上限2)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    playingRef.current = false;
  };

  const drawAt = (t: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const effect = effectRef.current;
    if (!canvas || !ctx || !effect) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    effect.draw({ ctx, t, w, h });
  };

  const finish = () => {
    stop();
    drawAt(1);
    onCompleteRef.current();
  };

  // 再生
  useEffect(() => {
    if (playKey === 0 || trigramId === null) return;
    const effect = createNatureEffect(trigramId, palette);
    effectRef.current = effect;

    if (reducedMotion) {
      drawAt(0.92);
      const timer = window.setTimeout(() => onCompleteRef.current(), 700);
      return () => window.clearTimeout(timer);
    }

    playingRef.current = true;
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / effect.duration;
      if (t >= 1) {
        finish();
        return;
      }
      drawAt(t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    // タブが非表示になると rAF が止まるため、時間切れで必ず完了させる保険
    const backup = window.setTimeout(() => {
      if (playingRef.current) finish();
    }, effect.duration + 400);
    return () => {
      stop();
      window.clearTimeout(backup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  // build フェーズに戻ったらクリアして完全アイドル
  useEffect(() => {
    if (!idle) return;
    stop();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [idle]);

  return (
    <canvas
      ref={canvasRef}
      className="hk-stage-canvas"
      style={{ pointerEvents: idle ? "none" : "auto" }}
      onPointerDown={() => {
        // 再生中のタップでスキップ
        if (playingRef.current) finish();
      }}
      aria-hidden
    />
  );
}
