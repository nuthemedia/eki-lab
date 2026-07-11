"use client";

import { useState } from "react";
import { hexagramFromLines } from "@/domain/iching/hexagrams";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import { playChime, playTap } from "@/lib/hakkeSound";
import TrigramFigure from "./TrigramFigure";

type Step = "lower" | "upper" | "result";

type Props = {
  onExit: () => void;
};

export default function KasaneruFlow({ onExit }: Props) {
  const [step, setStep] = useState<Step>("lower");
  const [lowerId, setLowerId] = useState<number | null>(null);
  const [upperId, setUpperId] = useState<number | null>(null);

  const lower = lowerId !== null ? HAKKE_TRIGRAMS[lowerId] : null;
  const upper = upperId !== null ? HAKKE_TRIGRAMS[upperId] : null;
  const combined = lower && upper ? [...lower.lines, ...upper.lines] : null;
  const hexagram = combined ? hexagramFromLines(combined) : null;

  const pick = (id: number) => {
    if (step === "lower") {
      setLowerId(id);
      setStep("upper");
      playTap();
    } else if (step === "upper") {
      setUpperId(id);
      setStep("result");
      playChime();
    }
  };

  const restart = () => {
    setLowerId(null);
    setUpperId(null);
    setStep("lower");
  };

  const label = step === "lower" ? "した(下卦)をえらぶ" : step === "upper" ? "うえ(上卦)をえらぶ" : "";

  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>
      <div className="hk-guide">
        <span className="hk-guide-label">かさねる</span>
      </div>
      {step === "result" && combined && hexagram ? (
        <>
          <div className="hk-stage hk-kasaneru-stage">
            <TrigramFigure lines={combined} size="guide" />
          </div>
          <div className="hk-zukan-caption">
            <span className="hk-zukan-kanji">
              {hexagram.name}
              <span className="hk-zukan-reading">{hexagram.reading}</span>
            </span>
            <p className="hk-zukan-image">
              {lower!.nature}の上に、{upper!.nature}。
            </p>
          </div>
          <div className="hk-intro-actions">
            <button type="button" className="hk-cta" onClick={restart}>
              もう一度かさねる
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="hk-hint">{label}</p>
          <div className="hk-grid">
            {HAKKE_TRIGRAMS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="hk-cell"
                onClick={() => pick(t.id)}
              >
                <TrigramFigure lines={t.lines} size="mini" />
                <span className="hk-cell-kanji">{t.name}</span>
                <span className="hk-cell-meta">
                  {t.nature}・{t.reading}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
