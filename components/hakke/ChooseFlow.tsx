"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import { recordTrigramChoice } from "@/lib/hakkeProgress";
import { playChime, playDissolve, playNature } from "@/lib/hakkeSound";
import TrigramFigure from "./TrigramFigure";
import ProgressDots from "./ProgressDots";
import ResultCard from "./ResultCard";
import NatureStage from "./stage/NatureStage";

type Props = {
  onComplete: () => void;
  onExit: () => void;
};

function shuffle<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function ChooseFlow({ onComplete, onExit }: Props) {
  const reduced = useReducedMotion() ?? false;
  const [order] = useState(() => shuffle(HAKKE_TRIGRAMS.map((t) => t.id)));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [faded, setFaded] = useState<number[]>([]);
  const [missed, setMissed] = useState(false);
  const [playKey, setPlayKey] = useState(1);

  const target = HAKKE_TRIGRAMS[order[index]];

  // 出題卦が変わるたび、ステージ演出に合わせて自然音を鳴らす
  useEffect(() => {
    playNature(target.id);
  }, [target.id]);

  // 正解1 + 他の卦から3、シャッフル(卦が変わるたびに作り直す)
  const choices = useMemo(() => {
    const others = shuffle(
      HAKKE_TRIGRAMS.filter((t) => t.id !== target.id).map((t) => t.id),
    ).slice(0, 3);
    return shuffle([target.id, ...others]);
  }, [target.id]);

  const handleChoice = (id: number) => {
    if (revealed) return;
    if (id === target.id) {
      recordTrigramChoice(target.id, missed);
      setRevealed(true);
      playChime();
    } else {
      // 違う字は静かに薄れる
      setFaded((prev) => [...prev, id]);
      setMissed(true);
      playDissolve();
    }
  };

  const handleNext = () => {
    if (index === order.length - 1) {
      onComplete();
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setFaded([]);
    setMissed(false);
    setPlayKey((k) => k + 1);
  };

  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>
      <ProgressDots total={order.length} current={index} />
      <div className="hk-guide">
        <span className="hk-guide-label">じをえらぶ</span>
      </div>
      <div className="hk-stage">
        <NatureStage
          trigramId={target.id}
          playKey={playKey}
          palette={target.palette}
          idle={false}
          reducedMotion={reduced}
          onComplete={() => {}}
        />
        <div className="hk-stage-figure">
          <TrigramFigure lines={target.lines} />
        </div>
        {revealed ? (
          <ResultCard
            trigram={target}
            isLast={index === order.length - 1}
            onNext={handleNext}
          />
        ) : null}
      </div>
      <p className="hk-hint">この自然は、どの字か</p>
      <div className="hk-choices">
        {choices.map((id) => (
          <button
            key={`${index}-${id}`}
            type="button"
            className={`hk-choice${faded.includes(id) ? " is-faded" : ""}`}
            disabled={revealed || faded.includes(id)}
            onClick={() => handleChoice(id)}
          >
            {HAKKE_TRIGRAMS[id].name}
          </button>
        ))}
      </div>
    </main>
  );
}
