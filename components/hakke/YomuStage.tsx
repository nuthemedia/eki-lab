"use client";

import { useState } from "react";
import type { Relation } from "@/data/hakke/trigrams";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import TeachWalk from "./TeachWalk";
import PickExercise from "./exercise/PickExercise";
import StageMotif from "./StageMotif";

type Part = {
  promptRelation: Relation;
  answerRelation: Relation;
  choices: 2 | 4 | 8;
  title: string;
  description: string;
  shortLabel: string;
};

/** よむ:かたち→字 / 字→かたち / かたち→読み を順に */
const PARTS: Part[] = [
  {
    promptRelation: "form",
    answerRelation: "kanji",
    choices: 4,
    title: "形から、字をよむ",
    description: "八卦のかたちを見て、合う漢字をえらぶ。",
    shortLabel: "形から字",
  },
  {
    promptRelation: "kanji",
    answerRelation: "form",
    choices: 4,
    title: "字から、形をおもいだす",
    description: "こんどは漢字を見て、八卦のかたちをえらぶ。",
    shortLabel: "字から形",
  },
  {
    promptRelation: "form",
    answerRelation: "reading",
    choices: 4,
    title: "形と、読みをつなぐ",
    description: "さいごに、かたちを見て名前の読みをえらぶ。",
    shortLabel: "形と読み",
  },
];

const ALL_IDS = HAKKE_TRIGRAMS.map((t) => t.id);

type Props = {
  onComplete: () => void;
  onExit: () => void;
};

/**
 * Stage3「よむ」。形・字・読みの対応を PickExercise で複数パート出題する。
 * 各パートは 8卦を一巡。全パート終了で onComplete。
 */
export default function YomuStage({ onComplete, onExit }: Props) {
  const [part, setPart] = useState(0);
  const [phase, setPhase] = useState<"intro" | "exercise">("intro");
  const config = PARTS[part];

  if (phase === "intro") {
    return (
      <TeachWalk
        key={part}
        eyebrow={`よむ ・ ${part + 1}/${PARTS.length}`}
        slides={[
          <div key={config.shortLabel} className="hk-yomu-intro">
            <StageMotif kind="yomu" />
            <p className="hk-teach-title">{config.title}</p>
            <p className="hk-teach-note">{config.description}</p>
          </div>,
        ]}
        lastLabel={part === 0 ? "はじめる →" : "つぎのパートへ →"}
        onExit={onExit}
        onDone={() => setPhase("exercise")}
      />
    );
  }

  return (
    <PickExercise
      key={part}
      items={ALL_IDS}
      promptRelation={config.promptRelation}
      answerRelation={config.answerRelation}
      choices={config.choices}
      eyebrow={`よむ ${part + 1}/${PARTS.length} ・ ${config.shortLabel}`}
      onExit={onExit}
      onComplete={() => {
        if (part === PARTS.length - 1) onComplete();
        else {
          setPart((p) => p + 1);
          setPhase("intro");
        }
      }}
    />
  );
}
