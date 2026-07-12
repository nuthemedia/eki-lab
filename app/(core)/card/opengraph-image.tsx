import { ImageResponse } from "next/og";
import { OgBrand, OgFooter, OgFrame, ogContentType, ogSize } from "@/lib/og";
import { linesOfHexagram } from "@/domain/iching/hexagrams";
import { CARD_TAGLINE } from "@/lib/ichingCard";
import {
  CARD_INK,
  CARD_PAPER,
  CARD_PAPER_DIM,
  CARD_MUTED,
  OgHexagramFigure,
} from "@/lib/ichingCardOg";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  // 地天泰。入口ページのモチーフとして本体 OG と揃える
  const lines = linesOfHexagram(11) ?? [];
  return new ImageResponse(
    (
      <OgFrame background={CARD_INK} color={CARD_PAPER}>
        <OgBrand color={CARD_PAPER_DIM} label="易のかたち" labelColor={CARD_MUTED} />

        <div style={{ display: "flex", alignItems: "center", gap: 72 }}>
          <OgHexagramFigure lines={lines} barWidth={200} barHeight={22} gap={18} />
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: 8 }}>
              {CARD_TAGLINE}
            </div>
            <div style={{ display: "flex", fontSize: 34, color: CARD_PAPER_DIM }}>
              問いを選ぶと、あなたの卦カードが一枚立ち上がる。
            </div>
          </div>
        </div>

        <OgFooter
          borderColor="rgba(233, 226, 208, 0.2)"
          color={CARD_MUTED}
          left="卦カードをつくって、共有する"
          right="eki-lab.vercel.app/card"
        />
      </OgFrame>
    ),
    size,
  );
}
