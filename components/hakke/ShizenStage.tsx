"use client";

import { useState } from "react";
import { HAKKE_TRIGRAMS, PRENATAL_TRIGRAMS } from "@/data/hakke/trigrams";
import TeachWalk from "./TeachWalk";
import TrigramFigure from "./TrigramFigure";
import NatureRhythmCard from "./NatureRhythmCard";
import PickExercise from "./exercise/PickExercise";
import SequenceTap from "./exercise/SequenceTap";
import NatureSuccessVisual from "./NatureSuccessVisual";
import StageMotif from "./StageMotif";

const ALL_IDS = HAKKE_TRIGRAMS.map((t) => t.id);
const PRENATAL_ORDER = PRENATAL_TRIGRAMS.map((t) => t.id);

type Props = {
  onComplete: () => void;
  onExit: () => void;
};

type Phase = "intro" | "practice" | "rhythm";

const mapSlide = (
  <>
    <StageMotif kind="shizen" />
    <p className="hk-teach-title">形が、自然になる</p>
    <div className="hk-pair">
      {[0, 5].map((id) => {
        const t = HAKKE_TRIGRAMS[id];
        return (
          <div key={id} className="hk-pair-cell">
            <TrigramFigure lines={t.lines} size="guide" />
            <span className="hk-pair-kanji">{t.name}</span>
            <span className="hk-pair-feature">
              {t.nature}・{t.natureReading}
            </span>
          </div>
        );
      })}
    </div>
    <p className="hk-teach-note">同じ形を、自然のすがたで見る。</p>
  </>
);

/**
 * Stage5「自然を見る」。自然象と形をつなぐ。
 * 導入(自然のリズム)→ 練習(形→自然)→ 仕上げ(自然を先天順に並べる)。
 */
export default function ShizenStage({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");

  if (phase === "intro") {
    return (
      <TeachWalk
        eyebrow="しぜん ・ 八卦と自然"
        slides={[<NatureRhythmCard key="rhythm" />, mapSlide]}
        lastLabel="れんしゅうへ →"
        onExit={onExit}
        onDone={() => setPhase("practice")}
      />
    );
  }

  if (phase === "practice") {
    return (
      <PickExercise
        key="s-practice"
        items={ALL_IDS}
        promptRelation="form"
        answerRelation="nature"
        choices={4}
        renderSuccess={(id) => <NatureSuccessVisual trigramId={id} />}
        onExit={onExit}
        onComplete={() => setPhase("rhythm")}
      />
    );
  }

  if (phase === "rhythm") {
    return (
      <main className="hk-build">
        <div className="hk-top-bar">
          <button type="button" className="hk-top-link" onClick={onExit}>
            ← トップへ
          </button>
        </div>
        <p className="hk-stage-note">
          先天順は、八つの形を組み合わせで並べる昔からの基本順。
        </p>
        <p className="hk-stage-eyebrow">しぜん ・ ならべる</p>
        <SequenceTap
          targetOrder={PRENATAL_ORDER}
          render={(id) => HAKKE_TRIGRAMS[id].nature}
          hint="自然を、先天の順にタップ"
          onComplete={onComplete}
        />
      </main>
    );
  }
}
