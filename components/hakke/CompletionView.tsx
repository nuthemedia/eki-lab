"use client";

import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import type { HakkeMode } from "@/lib/hakkeProgress";
import TrigramFigure from "./TrigramFigure";

type Props = {
  /** いま完走したモード */
  mode: HakkeMode;
  onRestart: (mode: HakkeMode) => void;
  onContinue: () => void;
  /** セルタップでその卦のずかんへ */
  onOpenZukan: (id: number) => void;
  onTop: () => void;
};

const COPY: Record<
  HakkeMode,
  {
    title: string;
    sub: [string, string];
    primary: { label: string; mode: HakkeMode };
    ghost: { label: string; mode: HakkeMode };
  }
> = {
  guided: {
    title: "八つのかたちが、そろった",
    sub: ["乾・兌・離・震・巽・坎・艮・坤。", "こんどは、おもいだしながらつくってみる。"],
    primary: { label: "おもいだしてつくる", mode: "recall" },
    ghost: { label: "もう一度お手本つきで", mode: "guided" },
  },
  recall: {
    title: "手が、覚えてきた",
    sub: ["お手本なしで、八つそろった。", "こんどは、自然から字をえらんでみる。"],
    primary: { label: "えらぶ", mode: "choose" },
    ghost: { label: "もう一度おもいだす", mode: "recall" },
  },
  choose: {
    title: "字と、つながった",
    sub: ["かたち・自然・漢字がひとつになってきた。", "間をあけて、またおもいだすと忘れない。"],
    primary: { label: "おもいだしてつくる", mode: "recall" },
    ghost: { label: "もう一度えらぶ", mode: "choose" },
  },
};

export default function CompletionView({
  mode,
  onRestart,
  onContinue,
  onOpenZukan,
  onTop,
}: Props) {
  const copy = COPY[mode];
  return (
    <div className="hk-complete">
      <h2 className="hk-complete-title">{copy.title}</h2>
      <p className="hk-complete-sub">
        {copy.sub[0]}
        <br />
        {copy.sub[1]}
      </p>
      <div className="hk-grid">
        {HAKKE_TRIGRAMS.map((trigram) => (
          <button
            key={trigram.id}
            type="button"
            className="hk-cell"
            onClick={() => onOpenZukan(trigram.id)}
          >
            <TrigramFigure lines={trigram.lines} size="mini" />
            <span className="hk-cell-kanji">{trigram.name}</span>
            <span className="hk-cell-meta">
              {trigram.nature}・{trigram.reading}
            </span>
          </button>
        ))}
      </div>
      <div className="hk-intro-actions">
        {mode === "guided" ? (
          <>
            <button type="button" className="hk-cta" onClick={onContinue}>
              つぎのステージ：となえる
            </button>
            <button
              type="button"
              className="hk-cta hk-cta--ghost"
              onClick={() => onRestart("recall")}
            >
              おもいだしてつくる
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="hk-cta"
              onClick={() => onRestart(copy.primary.mode)}
            >
              {copy.primary.label}
            </button>
            <button
              type="button"
              className="hk-cta hk-cta--ghost"
              onClick={() => onRestart(copy.ghost.mode)}
            >
              {copy.ghost.label}
            </button>
          </>
        )}
        <button type="button" className="hk-top-link" onClick={onTop}>
          ← トップへ
        </button>
      </div>
    </div>
  );
}
