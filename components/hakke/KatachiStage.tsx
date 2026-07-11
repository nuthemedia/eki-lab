"use client";

import { useState } from "react";
import {
  CONTRAST_PAIRS,
  HAKKE_TRIGRAMS,
  SONG_ORDER,
  type ContrastPair,
  type HakkeTrigram,
} from "@/data/hakke/trigrams";
import { unlock } from "@/lib/hakkeSound";
import TrigramFigure from "./TrigramFigure";
import ProgressDots from "./ProgressDots";
import PickExercise from "./exercise/PickExercise";
import FillBlank from "./exercise/FillBlank";

const ALL_IDS = HAKKE_TRIGRAMS.map((t) => t.id);

type Props = {
  onComplete: () => void;
  onExit: () => void;
};

type Phase = "uta" | "pair" | "quiz" | "test";

/** うた:取象歌を1卦ずつ理解する読みカード */
function MnemonicCard({
  trigram,
  index,
  total,
  onNext,
  onExit,
}: {
  trigram: HakkeTrigram;
  index: number;
  total: number;
  onNext: () => void;
  onExit: () => void;
}) {
  const isLast = index === total - 1;
  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>
      <p className="hk-stage-eyebrow">うた ・ 八卦取象歌</p>
      <ProgressDots total={total} current={index} />
      <div className="hk-teach">
        <TrigramFigure lines={trigram.lines} size="stage" />
        <p className="hk-teach-mnemonic">{trigram.mnemonic}</p>
        <p className="hk-teach-reading">{trigram.mnemonicReading}</p>
        <p className="hk-teach-meaning">
          「{trigram.mnemonicModern}」 = {trigram.name}
        </p>
      </div>
      <button type="button" className="hk-cta hk-home-cta" onClick={onNext}>
        {isLast ? "ペアで見る →" : "つぎへ →"}
      </button>
    </main>
  );
}

/** ペア:対比する2卦を並べて特徴をつかむ読みカード */
function PairCard({
  pair,
  index,
  total,
  onNext,
  onExit,
}: {
  pair: ContrastPair;
  index: number;
  total: number;
  onNext: () => void;
  onExit: () => void;
}) {
  const isLast = index === total - 1;
  const [left, right] = pair.ids.map((id) => HAKKE_TRIGRAMS[id]);
  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>
      <p className="hk-stage-eyebrow">ペア ・ 対で見る</p>
      <ProgressDots total={total} current={index} />
      <p className="hk-pair-label">{pair.label}</p>
      <div className="hk-pair">
        {[left, right].map((t) => (
          <div key={t.id} className="hk-pair-cell">
            <TrigramFigure lines={t.lines} size="guide" />
            <span className="hk-pair-kanji">{t.name}</span>
            <span className="hk-pair-feature">{t.mnemonicModern}</span>
          </div>
        ))}
      </div>
      <button type="button" className="hk-cta hk-home-cta" onClick={onNext}>
        {isLast ? "クイズへ →" : "つぎへ →"}
      </button>
    </main>
  );
}

/**
 * Stage4「かたちを言う」。八卦取象歌を理解 → 対比ペア → クイズ(口訣の穴埋め)→
 * テスト(意味に合う形をえらぶ)の順で、形を覚える。
 */
export default function KatachiStage({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("uta");
  const [step, setStep] = useState(0);

  if (phase === "uta") {
    return (
      <MnemonicCard
        trigram={HAKKE_TRIGRAMS[SONG_ORDER[step]]}
        index={step}
        total={SONG_ORDER.length}
        onExit={onExit}
        onNext={() => {
          unlock();
          if (step === SONG_ORDER.length - 1) {
            setStep(0);
            setPhase("pair");
          } else {
            setStep((s) => s + 1);
          }
        }}
      />
    );
  }

  if (phase === "pair") {
    return (
      <PairCard
        pair={CONTRAST_PAIRS[step]}
        index={step}
        total={CONTRAST_PAIRS.length}
        onExit={onExit}
        onNext={() => {
          if (step === CONTRAST_PAIRS.length - 1) {
            setStep(0);
            setPhase("quiz");
          } else {
            setStep((s) => s + 1);
          }
        }}
      />
    );
  }

  if (phase === "quiz") {
    return (
      <FillBlank
        key="quiz"
        items={ALL_IDS}
        onExit={onExit}
        onComplete={() => setPhase("test")}
      />
    );
  }

  // test:意味 → 形をえらぶ
  return (
    <PickExercise
      key="test"
      items={ALL_IDS}
      promptRelation="meaning"
      answerRelation="form"
      choices={4}
      onExit={onExit}
      onComplete={onComplete}
    />
  );
}
