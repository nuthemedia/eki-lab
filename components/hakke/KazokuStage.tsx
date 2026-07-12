"use client";

import { useState } from "react";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import TeachWalk from "./TeachWalk";
import TrigramFigure, { type LineValue } from "./TrigramFigure";
import PickExercise from "./exercise/PickExercise";
import SequenceTap from "./exercise/SequenceTap";
import FamilyPortrait from "./FamilyPortrait";

const ALL_IDS = HAKKE_TRIGRAMS.map((t) => t.id);
/** 長→中→少 の並び */
const MALE_ORDER = [3, 5, 6]; // 震・坎・艮
const FEMALE_ORDER = [4, 2, 1]; // 巽・離・兌

type Props = {
  onComplete: () => void;
  onExit: () => void;
};

type Phase = "intro" | "practice" | "male" | "female" | "test";

/** 「一本だけ異なる爻」の index(0下/1中/2上)。乾坤は null */
function distinctIndex(lines: readonly LineValue[]): number | null {
  const yang = lines.filter((l) => l === "yang").length;
  if (yang === 0 || yang === 3) return null;
  const minority: LineValue = yang === 1 ? "yang" : "yin";
  return lines.findIndex((l) => l === minority);
}

function FamilyCell({ id }: { id: number }) {
  const t = HAKKE_TRIGRAMS[id];
  return (
    <div className="hk-pair-cell">
      <FamilyPortrait trigramId={id} />
      <TrigramFigure lines={t.lines} size="guide" highlight={distinctIndex(t.lines)} />
      <span className="hk-pair-kanji">{t.name}</span>
    </div>
  );
}

const parentsSlide = (
  <>
    <p className="hk-teach-title">父と母</p>
    <div className="hk-pair">
      <FamilyCell id={0} />
      <FamilyCell id={7} />
    </div>
    <p className="hk-teach-note">ぜんぶ陽が父、ぜんぶ陰が母。</p>
  </>
);

const malesSlide = (
  <>
    <p className="hk-teach-title">男の卦(陽が一本)</p>
    <div className="hk-pair">
      {MALE_ORDER.map((id) => (
        <FamilyCell key={id} id={id} />
      ))}
    </div>
    <p className="hk-teach-note">陽の位置が 下・中・上 = 長・中・少。</p>
  </>
);

const femalesSlide = (
  <>
    <p className="hk-teach-title">女の卦(陰が一本)</p>
    <div className="hk-pair">
      {FEMALE_ORDER.map((id) => (
        <FamilyCell key={id} id={id} />
      ))}
    </div>
    <p className="hk-teach-note">陰の位置が 下・中・上 = 長・中・少。</p>
  </>
);

/**
 * Stage7「家族でつなぐ」。家族象と男女を、「一本だけ異なる爻の位置」と結びつける。
 * 導入(父母・男卦・女卦、異爻ハイライト)→ 練習(形→家族)→ 男/女の長中少 並べ → テスト(家族→形)。
 */
export default function KazokuStage({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");

  if (phase === "intro") {
    return (
      <TeachWalk
        eyebrow="かぞく ・ 爻の位置と家族"
        slides={[parentsSlide, malesSlide, femalesSlide]}
        lastLabel="れんしゅうへ →"
        onExit={onExit}
        onDone={() => setPhase("practice")}
      />
    );
  }

  if (phase === "practice") {
    return (
      <PickExercise
        key="k-practice"
        items={ALL_IDS}
        promptRelation="form"
        answerRelation="family"
        choices={4}
        renderSuccess={(id) => <FamilyPortrait trigramId={id} />}
        onExit={onExit}
        onComplete={() => setPhase("male")}
      />
    );
  }

  if (phase === "male") {
    return (
      <main className="hk-build">
        <div className="hk-top-bar">
          <button type="button" className="hk-top-link" onClick={onExit}>
            ← トップへ
          </button>
        </div>
        <p className="hk-stage-eyebrow">かぞく ・ 男の卦</p>
        <SequenceTap
          key="kazoku-male"
          targetOrder={MALE_ORDER}
          render={(id) => HAKKE_TRIGRAMS[id].name}
          hint="長 → 中 → 少 の順にタップ(男)"
          onComplete={() => setPhase("female")}
        />
      </main>
    );
  }

  if (phase === "female") {
    return (
      <main className="hk-build">
        <div className="hk-top-bar">
          <button type="button" className="hk-top-link" onClick={onExit}>
            ← トップへ
          </button>
        </div>
        <p className="hk-stage-eyebrow">かぞく ・ 女の卦</p>
        <SequenceTap
          key="kazoku-female"
          targetOrder={FEMALE_ORDER}
          render={(id) => HAKKE_TRIGRAMS[id].name}
          hint="長 → 中 → 少 の順にタップ(女)"
          onComplete={() => setPhase("test")}
        />
      </main>
    );
  }

  return (
    <PickExercise
      key="k-test"
      items={ALL_IDS}
      promptRelation="family"
      answerRelation="form"
      choices={4}
      renderSuccess={(id) => <FamilyPortrait trigramId={id} />}
      onExit={onExit}
      onComplete={onComplete}
    />
  );
}
