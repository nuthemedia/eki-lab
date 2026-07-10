"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { LEARNING_TRIGRAMS, type HakkeTrigram } from "@/data/hakke/trigrams";
import TrigramFigure from "./TrigramFigure";

/**
 * 1卦分の表示。key={idx} で卦ごとに作り直すので、爻の積み上げは初期 state から
 * タイマーで進む(effect 本体で同期 setState しない)。
 */
function EyecatchTrigram({
  trigram,
  reduced,
  onSettle,
}: {
  trigram: HakkeTrigram;
  reduced: boolean;
  onSettle: () => void;
}) {
  const [lineCount, setLineCount] = useState(reduced ? 3 : 0);
  const [showName, setShowName] = useState(reduced);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    const after = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };
    if (reduced) {
      // 完成形+卦名を即表示。少し眺めてから次へ
      after(3000, onSettle);
    } else {
      // 爻を下→中→上に静かに積み、そろったら卦名。少し保持して次へ
      after(420, () => setLineCount(1));
      after(770, () => setLineCount(2));
      after(1120, () => setLineCount(3));
      after(1420, () => setShowName(true));
      after(3600, onSettle);
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
    // onSettle は毎回新しい参照だが、この effect は key 単位で1度だけ動けばよい
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // palette からごく淡い静止トーンを白い面の上に敷く(アニメなし)
  const stageStyle = {
    backgroundImage: `radial-gradient(120% 90% at 50% 40%, ${trigram.palette.glow}2e, ${trigram.palette.base}24 55%, transparent 100%)`,
  } as React.CSSProperties;

  return (
    <div
      className="hk-eyecatch"
      role="img"
      aria-label="八卦が組み上がるアニメーション"
    >
      <div className="hk-eyecatch-stage" style={stageStyle}>
        <div className="hk-eyecatch-figure" aria-hidden>
          <TrigramFigure
            lines={trigram.lines.slice(0, lineCount)}
            size="stage"
            showEmpty
            animate={!reduced}
          />
        </div>
      </div>
      <div
        className={`hk-eyecatch-name${showName ? " is-on" : ""}`}
        aria-hidden
      >
        <span className="hk-eyecatch-symbol">{trigram.symbol}</span>
        <span className="hk-eyecatch-kanji">{trigram.name}</span>
        <span className="hk-eyecatch-reading">{trigram.reading}</span>
      </div>
    </div>
  );
}

/**
 * トップのアイキャッチ。卦を下→中→上に静かに組み上げ、卦名を出して次の卦へ移る。
 * 自然演出(粒子・発光)は使わず、palette のごく淡い静止トーンだけを背景に敷く。
 * prefers-reduced-motion では逐次演出をやめ、完成形+卦名を即表示して静かに切り替える。
 */
export default function HakkeEyecatch() {
  const reduced = useReducedMotion() ?? false;
  const [idx, setIdx] = useState(0);

  return (
    <EyecatchTrigram
      key={idx}
      trigram={LEARNING_TRIGRAMS[idx]}
      reduced={reduced}
      onSettle={() => setIdx((i) => (i + 1) % LEARNING_TRIGRAMS.length)}
    />
  );
}
