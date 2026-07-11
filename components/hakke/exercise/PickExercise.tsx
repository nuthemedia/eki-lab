"use client";

import { useMemo, useState } from "react";
import {
  HAKKE_TRIGRAMS,
  facetOf,
  pairKey,
  type Facet,
  type Relation,
} from "@/data/hakke/trigrams";
import { recordAssoc } from "@/lib/hakkeProgress";
import { playChime, playDissolve } from "@/lib/hakkeSound";
import TrigramFigure from "../TrigramFigure";
import ProgressDots from "../ProgressDots";
import ResultCard from "../ResultCard";

type Props = {
  /** 出題する卦 id の集合。内部でシャッフルして順に出す */
  items: number[];
  /** 手がかりの面 */
  promptRelation: Relation;
  /** 答えの面 */
  answerRelation: Relation;
  /** 選択肢の数(正解を含む) */
  choices: 2 | 4 | 8;
  /** ステージ内の現在パート */
  eyebrow?: string;
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

const FACET_LABEL: Record<Relation, string> = {
  form: "かたち",
  kanji: "字",
  reading: "読み",
  meaning: "意味",
  mnemonic: "口訣",
  nature: "自然",
  verb: "はたらき",
  family: "家族",
  direction: "方角",
};

/** facet を描画。form は三本線、それ以外はテキスト */
function FacetView({ facet, size }: { facet: Facet; size: "prompt" | "choice" }) {
  if (facet.kind === "form") {
    return <TrigramFigure lines={facet.lines} size={size === "prompt" ? "stage" : "mini"} />;
  }
  return <span className={size === "prompt" ? "hk-prompt-text" : "hk-choice-text"}>{facet.text}</span>;
}

export default function PickExercise({
  items,
  promptRelation,
  answerRelation,
  choices,
  eyebrow,
  onComplete,
  onExit,
}: Props) {
  const [order] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [faded, setFaded] = useState<number[]>([]);
  const [missed, setMissed] = useState(false);

  const targetId = order[index];
  const target = HAKKE_TRIGRAMS[targetId];
  const relationKey = pairKey(promptRelation, answerRelation);

  // 選択肢(正解1 + 他の卦から choices-1)。卦が変わるたびに作り直す
  const options = useMemo(() => {
    const others = shuffle(
      HAKKE_TRIGRAMS.filter((t) => t.id !== targetId).map((t) => t.id),
    ).slice(0, choices - 1);
    return shuffle([targetId, ...others]);
  }, [targetId, choices]);

  const handleChoice = (id: number) => {
    if (revealed) return;
    if (id === targetId) {
      recordAssoc(relationKey, targetId, !missed);
      setRevealed(true);
      playChime();
    } else {
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
  };

  const promptFacet = facetOf(target, promptRelation);
  const hint = `${FACET_LABEL[promptRelation]}を見て、${FACET_LABEL[answerRelation]}をえらぶ`;

  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>
      {eyebrow ? <p className="hk-stage-eyebrow">{eyebrow}</p> : null}
      <ProgressDots total={order.length} current={index} />
      <div className="hk-stage hk-pick-stage">
        <div className="hk-stage-figure">
          <FacetView facet={promptFacet} size="prompt" />
        </div>
        {revealed ? (
          <ResultCard
            trigram={target}
            isLast={index === order.length - 1}
            onNext={handleNext}
          />
        ) : null}
      </div>
      <p className="hk-hint">{hint}</p>
      <div className={`hk-choices${choices === 8 ? " is-eight" : ""}`}>
        {options.map((id) => {
          const facet = facetOf(HAKKE_TRIGRAMS[id], answerRelation);
          return (
            <button
              key={`${index}-${id}`}
              type="button"
              className={`hk-choice${faded.includes(id) ? " is-faded" : ""}${
                facet.kind === "form" ? " is-figure" : ""
              }`}
              disabled={revealed || faded.includes(id)}
              onClick={() => handleChoice(id)}
              aria-label={
                facet.kind === "form" ? HAKKE_TRIGRAMS[id].name : facet.text
              }
            >
              <FacetView facet={facet} size="choice" />
            </button>
          );
        })}
      </div>
    </main>
  );
}
