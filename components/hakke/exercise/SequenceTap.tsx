"use client";

import { useMemo, useState } from "react";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import { playTap, playDissolve, playChime } from "@/lib/hakkeSound";

type Props = {
  /** 正しい順序(卦 id の並び) */
  targetOrder: number[];
  /** 各セルに何を出すか */
  render?: (id: number) => string;
  /** 見出し */
  hint: string;
  onComplete: () => void;
};

function shuffle<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * 対象を「正しい順」にタップさせる。順番どおりに押せたセルは番号付きで確定。
 * 違うセルは静かに揺れて溶ける(ペナルティなし)。全部そろうと onComplete。
 */
export default function SequenceTap({ targetOrder, render, hint, onComplete }: Props) {
  const [cells] = useState(() => shuffle(targetOrder));
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);

  const label = render ?? ((id: number) => HAKKE_TRIGRAMS[id].name);
  const nextExpected = targetOrder[placed.length];

  const done = placed.length === targetOrder.length;

  const handleTap = (id: number) => {
    if (done || placed.includes(id)) return;
    if (id === nextExpected) {
      const next = [...placed, id];
      setPlaced(next);
      setWrong(null);
      if (next.length === targetOrder.length) {
        playChime();
        window.setTimeout(onComplete, 500);
      } else {
        playTap();
      }
    } else {
      setWrong(id);
      playDissolve();
      window.setTimeout(() => setWrong((w) => (w === id ? null : w)), 400);
    }
  };

  const orderOf = useMemo(() => {
    const map = new Map<number, number>();
    placed.forEach((id, i) => map.set(id, i + 1));
    return map;
  }, [placed]);

  return (
    <div className="hk-seq">
      <p className="hk-hint">{hint}</p>
      <div className="hk-seq-grid">
        {cells.map((id) => {
          const isPlaced = placed.includes(id);
          const isWrong = wrong === id;
          return (
            <button
              key={id}
              type="button"
              className={`hk-seq-cell${isPlaced ? " is-placed" : ""}${isWrong ? " is-wrong" : ""}`}
              disabled={isPlaced || done}
              onClick={() => handleTap(id)}
              aria-label={HAKKE_TRIGRAMS[id].name}
            >
              <span className="hk-seq-kanji">{label(id)}</span>
              {isPlaced ? (
                <span className="hk-seq-num" aria-hidden>
                  {orderOf.get(id)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
