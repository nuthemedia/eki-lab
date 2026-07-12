"use client";

import { useState } from "react";
import { HAKKE_TRIGRAMS, PRENATAL_TRIGRAMS } from "@/data/hakke/trigrams";
import TeachWalk from "./TeachWalk";
import TrigramFigure from "./TrigramFigure";
import PickExercise from "./exercise/PickExercise";
import VerbMotion from "./VerbMotion";

const ALL_IDS = HAKKE_TRIGRAMS.map((t) => t.id);

type Props = {
  onComplete: () => void;
  onExit: () => void;
};

type Phase = "intro" | "practice" | "test";

const overviewSlide = (title: string, ids: number[]) => (
  <>
    <p className="hk-teach-title">{title}</p>
    <ul className="hk-teach-list">
      {ids.map((id) => {
        const t = HAKKE_TRIGRAMS[id];
        return (
        <li key={t.id} className="hk-teach-list-row">
          <VerbMotion trigramId={t.id} compact />
          <TrigramFigure lines={t.lines} size="mini" />
          <span className="hk-teach-list-kanji">{t.name}</span>
          <span className="hk-teach-list-action">
            <span className="hk-teach-list-verb">{t.verb}</span>
            <span className="hk-teach-list-description">{t.verbDescription}</span>
          </span>
        </li>
        );
      })}
    </ul>
  </>
);

const exampleSlide = (
  <>
    <p className="hk-teach-title">形に、はたらきがある</p>
    <div className="hk-pair">
      {[3, 6].map((id) => {
        const t = HAKKE_TRIGRAMS[id];
        return (
          <div key={id} className="hk-pair-cell">
            <VerbMotion trigramId={id} />
            <TrigramFigure lines={t.lines} size="guide" />
            <span className="hk-pair-kanji">{t.name}</span>
            <span className="hk-pair-feature">{t.verb}</span>
            <span className="hk-pair-description">{t.verbDescription}</span>
          </div>
        );
      })}
    </div>
    <p className="hk-teach-note">震は動く。艮は止まる。</p>
  </>
);

/**
 * Stage6「はたらきを知る」。八卦の意味を、まず一つの動詞で覚える。
 * 導入(はたらき一覧)→ 練習(形→はたらき)→ テスト(はたらき→形)。
 */
export default function HatarakiStage({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");

  if (phase === "intro") {
    return (
      <TeachWalk
        eyebrow="はたらき ・ 八卦の動詞"
        slides={[
          overviewSlide(
            "八卦のはたらき・前半",
            PRENATAL_TRIGRAMS.slice(0, 4).map((t) => t.id),
          ),
          overviewSlide(
            "八卦のはたらき・後半",
            PRENATAL_TRIGRAMS.slice(4).map((t) => t.id),
          ),
          exampleSlide,
        ]}
        lastLabel="れんしゅうへ →"
        onExit={onExit}
        onDone={() => setPhase("practice")}
      />
    );
  }

  if (phase === "practice") {
    return (
      <PickExercise
        key="h-practice"
        items={ALL_IDS}
        promptRelation="form"
        answerRelation="verb"
        choices={4}
        renderSuccess={(id) => <VerbMotion trigramId={id} />}
        onExit={onExit}
        onComplete={() => setPhase("test")}
      />
    );
  }

  return (
    <PickExercise
      key="h-test"
      items={ALL_IDS}
      promptRelation="verb"
      answerRelation="form"
      choices={4}
      renderSuccess={(id) => <VerbMotion trigramId={id} />}
      onExit={onExit}
      onComplete={onComplete}
    />
  );
}
