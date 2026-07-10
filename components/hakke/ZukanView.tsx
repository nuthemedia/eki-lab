"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import { playNature } from "@/lib/hakkeSound";
import TrigramFigure from "./TrigramFigure";
import NatureStage from "./stage/NatureStage";

type Props = {
  /** 完成画面のセルから来たときに最初に再生する卦 */
  initialId: number | null;
  onBack: () => void;
};

export default function ZukanView({ initialId, onBack }: Props) {
  const reduced = useReducedMotion() ?? false;
  const [selected, setSelected] = useState(initialId ?? 0);
  const [playKey, setPlayKey] = useState(initialId !== null ? 1 : 0);

  const trigram = HAKKE_TRIGRAMS[selected];

  // 現象が再生されるたび(初期表示 initialId 経由も含む)自然音を鳴らす
  useEffect(() => {
    if (playKey > 0) playNature(HAKKE_TRIGRAMS[selected].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  const play = (id: number) => {
    setSelected(id);
    setPlayKey((k) => k + 1);
  };

  return (
    <main className="hk-zukan">
      <div className="hk-zukan-head">
        <button type="button" className="hk-zukan-back" onClick={onBack}>
          ← もどる
        </button>
        <span className="hk-zukan-title">ずかん</span>
      </div>
      <div className="hk-stage hk-zukan-stage">
        <NatureStage
          trigramId={trigram.id}
          playKey={playKey}
          palette={trigram.palette}
          idle={false}
          reducedMotion={reduced}
          onComplete={() => {}}
        />
        <div className="hk-stage-figure">
          <TrigramFigure lines={trigram.lines} />
        </div>
      </div>
      <div className="hk-zukan-caption">
        <span className="hk-zukan-kanji">
          {trigram.name}
          <span className="hk-zukan-reading">
            {trigram.reading}・{trigram.nature}
          </span>
        </span>
        <p className="hk-zukan-image">{trigram.image}</p>
      </div>
      <div className="hk-grid">
        {HAKKE_TRIGRAMS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`hk-cell${t.id === selected ? " is-selected" : ""}`}
            onClick={() => play(t.id)}
          >
            <TrigramFigure lines={t.lines} size="mini" />
            <span className="hk-cell-kanji">{t.name}</span>
            <span className="hk-cell-meta">
              {t.nature}・{t.reading}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
