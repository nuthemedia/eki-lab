"use client";

import { useState, type ReactNode } from "react";
import ProgressDots from "./ProgressDots";

type Props = {
  /** 段の見出し(例「うた ・ 八卦取象歌」) */
  eyebrow: string;
  /** 1枚ずつ見せるスライド */
  slides: ReactNode[];
  /** 最後のスライドでのボタン文言(例「れんしゅうへ →」) */
  lastLabel: string;
  /** 途中のボタン文言 */
  nextLabel?: string;
  onDone: () => void;
  onExit: () => void;
};

/**
 * 導入カードの汎用ステッパー。スライドを1枚ずつ「つぎへ」で進め、最後で onDone。
 * 各ステージの「理解」パートで使う(Stage4 のうた/ペアと同じ手触り)。
 */
export default function TeachWalk({
  eyebrow,
  slides,
  lastLabel,
  nextLabel = "つぎへ →",
  onDone,
  onExit,
}: Props) {
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>
      <p className="hk-stage-eyebrow">{eyebrow}</p>
      {slides.length > 1 ? <ProgressDots total={slides.length} current={index} /> : null}
      <div className="hk-teach">{slides[index]}</div>
      <button
        type="button"
        className="hk-cta hk-home-cta"
        onClick={() => {
          if (isLast) onDone();
          else setIndex((i) => i + 1);
        }}
      >
        {isLast ? lastLabel : nextLabel}
      </button>
    </main>
  );
}
