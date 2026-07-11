"use client";

import { useMemo, useState } from "react";
import { HAKKE_TRIGRAMS, pairKey } from "@/data/hakke/trigrams";
import { recordAssoc } from "@/lib/hakkeProgress";
import { playChime, playDissolve } from "@/lib/hakkeSound";
import TrigramFigure from "../TrigramFigure";
import ProgressDots from "../ProgressDots";

type Props = {
  /** 出題する卦 id の集合。内部でシャッフルして順に出す */
  items: number[];
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

/** 口訣の末字 */
const lastChar = (m: string) => m.charAt(m.length - 1);
/** 全卦の口訣末字(重複除去) */
const ALL_LAST = Array.from(new Set(HAKKE_TRIGRAMS.map((t) => lastChar(t.mnemonic))));

const RELATION_KEY = pairKey("form", "mnemonic");

/**
 * 口訣の末字を空欄にして選ばせる(例「離中◯」→ 虚)。
 * 形と口訣を結びつけるため、上に卦の形を出す。
 */
export default function FillBlank({ items, onComplete, onExit }: Props) {
  const [order] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [faded, setFaded] = useState<string[]>([]);
  const [missed, setMissed] = useState(false);

  const target = HAKKE_TRIGRAMS[order[index]];
  const answer = lastChar(target.mnemonic);
  const stem = target.mnemonic.slice(0, -1);

  const choices = useMemo(() => {
    const others = shuffle(ALL_LAST.filter((c) => c !== answer)).slice(0, 3);
    return shuffle([answer, ...others]);
    // 卦が変わるたびに作り直す
  }, [answer]);

  const handleChoice = (c: string) => {
    if (revealed) return;
    if (c === answer) {
      recordAssoc(RELATION_KEY, target.id, !missed);
      setRevealed(true);
      playChime();
    } else {
      setFaded((prev) => [...prev, c]);
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
  };

  const isLast = index === order.length - 1;

  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>
      <ProgressDots total={order.length} current={index} />

      <div className="hk-stage hk-pick-stage">
        <div className="hk-stage-figure">
          <TrigramFigure lines={target.lines} size="guide" />
        </div>
        <p className="hk-fill-prompt" aria-label={`口訣 ${stem}、空欄`}>
          {stem}
          <span className="hk-fill-blank">{revealed ? answer : "◯"}</span>
        </p>
        {revealed ? (
          <div className="hk-fill-reveal">
            <span className="hk-fill-full">{target.mnemonic}</span>
            <span className="hk-fill-modern">{target.mnemonicModern}</span>
            <button type="button" className="hk-cta" onClick={handleNext}>
              {isLast ? "ひらく" : "つぎへ"}
            </button>
          </div>
        ) : null}
      </div>

      <p className="hk-hint">あてはまる字を えらぶ</p>
      <div className="hk-choices">
        {choices.map((c) => (
          <button
            key={`${index}-${c}`}
            type="button"
            className={`hk-choice${faded.includes(c) ? " is-faded" : ""}`}
            disabled={revealed || faded.includes(c)}
            onClick={() => handleChoice(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </main>
  );
}
