"use client";

import { LINE_LABELS } from "@/domain/iching/hexagrams";
import { CARD_TAGLINE, type CardContent } from "@/lib/ichingCard";
import { HexagramFigure } from "@/components/core/HexagramFigure";

/** 画面上の卦カード。9:16 / OG 画像と同じ CardContent を描く */
export function HexagramCard({ content }: { content: CardContent }) {
  return (
    <div className="ik-card">
      <div className="ik-card-top">
        <span>易のかたち</span>
        <span>eki-lab</span>
      </div>

      <div className="ik-card-question ik-serif">「{content.question}」</div>

      <HexagramFigure
        lines={content.lines}
        changingIndexes={[content.changingLineIndex]}
        highlightChanging
      />

      <div className="ik-card-name-wrap">
        <div className="ik-card-name ik-serif">{content.hexName}</div>
        <div className="ik-card-reading">{content.hexReading}</div>
      </div>

      <div className="ik-card-keyword ik-serif">{content.keyword}</div>
      <p className="ik-card-message">{content.message}</p>

      {content.changingHint && (
        <div className="ik-card-hint">
          <span className="ik-card-hint-label">
            変爻 {LINE_LABELS[content.changingLineIndex]}
          </span>
          <p>{content.changingHint}</p>
        </div>
      )}

      <div className="ik-card-foot">
        <span>{CARD_TAGLINE}</span>
        <span>eki-lab.vercel.app/card</span>
      </div>
    </div>
  );
}
