"use client";

import { useState } from "react";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import TeachWalk from "./TeachWalk";
import TrigramFigure from "./TrigramFigure";
import PlaceBoard, { POSTNATAL_LAYOUT, ID_BY_DIR } from "./exercise/PlaceBoard";
import StageMotif from "./StageMotif";

type Props = {
  onComplete: () => void;
  onExit: () => void;
};

type Phase = "intro" | "r1" | "r2" | "r3" | "r4";

// 後天方位の卦 id(方角別)
const NS = [ID_BY_DIR.S, ID_BY_DIR.N]; // 南北:離坎
const EW = [ID_BY_DIR.E, ID_BY_DIR.W]; // 東西:震兌
const CORNERS = [ID_BY_DIR.SE, ID_BY_DIR.SW, ID_BY_DIR.NW, ID_BY_DIR.NE]; // 四隅
const ALL = HAKKE_TRIGRAMS.map((t) => t.id);

const introSlide = (
  <>
    <StageMotif kind="hougaku" />
    <p className="hk-teach-title">方角は、別のならび</p>
    <p className="hk-teach-note">
      最初に覚えた並び(となえる)とは別に、
      <br />
      八卦には方角への配置があります。
    </p>
    <p className="hk-teach-note">
      この方角を中心にした並びを「後天の方位」といいます。
    </p>
  </>
);

/** 全8卦を配置済みにした参照盤 */
const referenceSlide = (
  <>
    <p className="hk-teach-title">後天の方位</p>
    <div className="hk-board hk-board--ref" aria-hidden>
      {POSTNATAL_LAYOUT.map((cell) => {
        const t = HAKKE_TRIGRAMS[ID_BY_DIR[cell.key]];
        return (
          <div
            key={cell.key}
            className="hk-board-cell is-ref"
            style={{ gridRow: cell.row, gridColumn: cell.col }}
          >
            <TrigramFigure lines={t.lines} size="mini" />
            <span className="hk-board-reflabel">
              {cell.label}・{t.name}
            </span>
          </div>
        );
      })}
      <span className="hk-board-center" />
    </div>
  </>
);

/**
 * Stage8「方角にひろげる」。後天(文王)八卦の方位を、方位盤に配置して覚える。
 * 導入(先天と別物 + 参照盤)→ ①南北 →②東西 →③四隅 →④全部。
 */
export default function HougakuStage({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");

  if (phase === "intro") {
    return (
      <TeachWalk
        eyebrow="ほうがく ・ 後天の方位"
        slides={[introSlide, referenceSlide]}
        lastLabel="はじめる →"
        onExit={onExit}
        onDone={() => setPhase("r1")}
      />
    );
  }

  const board = (
    key: string,
    toPlace: number[],
    fixed: number[],
    hint: string,
    next: () => void,
  ) => (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>
      <p className="hk-stage-eyebrow">ほうがく ・ 方位に置く</p>
      <PlaceBoard key={key} toPlace={toPlace} fixed={fixed} hint={hint} onComplete={next} />
    </main>
  );

  if (phase === "r1") {
    return board("r1", NS, [], "南と北に置こう", () => setPhase("r2"));
  }
  if (phase === "r2") {
    return board("r2", EW, NS, "東と西を足そう", () => setPhase("r3"));
  }
  if (phase === "r3") {
    return board("r3", CORNERS, [...NS, ...EW], "四隅も置こう", () => setPhase("r4"));
  }
  return board("r4", ALL, [], "ぜんぶ、方角に置こう", onComplete);
}
