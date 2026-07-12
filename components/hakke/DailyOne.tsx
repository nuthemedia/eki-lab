"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { HAKKE_TRIGRAMS, pairKey } from "@/data/hakke/trigrams";
import { recordAssoc, recordTrigramRecall } from "@/lib/hakkeProgress";
import { playChime, playDissolve, playNature, playTap } from "@/lib/hakkeSound";
import TrigramFigure, { type LineValue } from "./TrigramFigure";
import YinYangButtons from "./YinYangButtons";
import ResultCard from "./ResultCard";
import NatureStage from "./stage/NatureStage";

type Phase = "build" | "nature" | "reveal";

const HINTS = ["いちばん下から", "つぎは、まんなか", "さいごに、いちばん上"];
const SOFT_HINT_AFTER = 3;

type Props = {
  trigramId: number;
  onDone: () => void;
};

export default function DailyOne({ trigramId, onDone }: Props) {
  const reduced = useReducedMotion() ?? false;
  const target = HAKKE_TRIGRAMS[trigramId];
  const [phase, setPhase] = useState<Phase>("build");
  const [placed, setPlaced] = useState<LineValue[]>([]);
  const [ghost, setGhost] = useState<LineValue | null>(null);
  const [softHint, setSoftHint] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const missCountRef = useRef(0);
  const hintedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const after = (ms: number, fn: () => void) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  const handlePick = (value: LineValue) => {
    if (phase !== "build" || ghost || placed.length >= 3) return;
    const expected = target.lines[placed.length];
    if (value === expected) {
      const next = [...placed, value];
      setPlaced(next);
      missCountRef.current = 0;
      setSoftHint(false);
      playTap();
      if (next.length === 3) {
        recordTrigramRecall(target.id, hintedRef.current);
        recordAssoc(pairKey("form", "kanji"), target.id, !hintedRef.current);
        after(reduced ? 250 : 700, () => {
          setPhase("nature");
          setPlayKey((k) => k + 1);
          playNature(target.id);
        });
      }
    } else {
      setGhost(value);
      after(600, () => setGhost(null));
      playDissolve();
      missCountRef.current += 1;
      if (missCountRef.current >= SOFT_HINT_AFTER) {
        setSoftHint(true);
        hintedRef.current = true;
      }
    }
  };

  const hint =
    phase === "build" ? (placed.length < 3 ? HINTS[placed.length] : "そろった") : "";

  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onDone}>
          ← トップへ
        </button>
      </div>
      <div className="hk-guide">
        <div className="hk-cue">
          <span className="hk-cue-kanji">{target.name}</span>
          <span className="hk-cue-reading">
            {target.reading}・{target.nature}
          </span>
        </div>
        {softHint ? (
          <div className="hk-soft-hint">
            <TrigramFigure lines={target.lines} size="guide" />
          </div>
        ) : null}
      </div>
      <div className="hk-stage">
        <NatureStage
          trigramId={target.id}
          playKey={playKey}
          palette={target.palette}
          idle={phase === "build"}
          reducedMotion={reduced}
          onComplete={() => {
            setPhase("reveal");
            playChime();
          }}
        />
        <div className="hk-stage-figure">
          <TrigramFigure lines={placed} showEmpty={phase === "build"} ghost={ghost} animate />
        </div>
        {phase === "reveal" ? (
          <ResultCard trigram={target} isLast onNext={onDone} />
        ) : null}
      </div>
      <p className="hk-hint">{hint}</p>
      <YinYangButtons
        disabled={phase !== "build" || placed.length >= 3 || ghost !== null}
        onPick={handlePick}
      />
    </main>
  );
}
