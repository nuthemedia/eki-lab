import type { HakkePalette } from "@/data/hakke/trigrams";

export type EffectFrame = {
  ctx: CanvasRenderingContext2D;
  /** 0→1 正規化時間。0〜0.3 = buildup、0.3〜0.7 = peak、0.7〜1 = settle */
  t: number;
  w: number;
  h: number;
};

export type NatureEffect = {
  /** ms */
  duration: number;
  /** 毎フレーム全描画(クリアは呼び出し側) */
  draw: (frame: EffectFrame) => void;
};

export type EffectFactory = (
  palette: HakkePalette,
  rng: () => number,
) => NatureEffect;
