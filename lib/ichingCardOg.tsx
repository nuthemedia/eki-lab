import type { LineType } from "@/domain/iching/types";

/**
 * ImageResponse(satori)用の卦の図。SVG やコンポーネント共有ができない
 * 制約下で、9:16 カードと OG 画像の両方から使う flexbox 版。
 * iching.css のテーマ色と揃えること。
 */

export const CARD_INK = "#17161a";
export const CARD_PAPER = "#e9e2d0";
export const CARD_PAPER_DIM = "#b9b2a1";
export const CARD_MUTED = "#7d786d";
export const CARD_BAMBOO = "#c9a86d";
export const CARD_VERMILION = "#b0492f";

type FigureProps = {
  /** 六爻。下から上(表示は上下反転して上爻を上に描く) */
  lines: LineType[];
  barWidth: number;
  barHeight: number;
  gap: number;
};

function isYang(line: LineType) {
  return line === "yang" || line === "old-yang";
}

function isChanging(line: LineType) {
  return line === "old-yang" || line === "old-yin";
}

export function OgHexagramFigure({ lines, barWidth, barHeight, gap }: FigureProps) {
  const segGap = Math.round(barWidth * 0.16);
  const segWidth = Math.round((barWidth - segGap) / 2);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {[...lines].reverse().map((line, i) => {
        const color = isChanging(line) ? CARD_VERMILION : CARD_BAMBOO;
        return isYang(line) ? (
          <div
            key={i}
            style={{
              width: barWidth,
              height: barHeight,
              borderRadius: Math.round(barHeight / 3),
              background: color,
            }}
          />
        ) : (
          <div key={i} style={{ display: "flex", gap: segGap }}>
            <div
              style={{
                width: segWidth,
                height: barHeight,
                borderRadius: Math.round(barHeight / 3),
                background: color,
              }}
            />
            <div
              style={{
                width: segWidth,
                height: barHeight,
                borderRadius: Math.round(barHeight / 3),
                background: color,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
