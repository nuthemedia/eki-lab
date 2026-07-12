"use client";

import { useState } from "react";
import { castDice } from "@/domain/iching/cast";
import type { HexagramResult } from "@/domain/iching/types";
import { QuestionIntro } from "../QuestionIntro";
import { DiceSequencePlayer } from "./DiceSequencePlayer";

type Session = {
  reading: HexagramResult;
  nonce: number;
};

const INTRO_LINES = [
  "問いを定め、出目に身を委ねます",
  "下卦・上卦・変爻を求めます",
];

/** サイコロモード。導入 → 骰子のシーケンス再生 */
export function DiceModeScene() {
  const [session, setSession] = useState<Session | null>(null);

  const start = () => setSession({ reading: castDice(), nonce: 0 });
  const replay = () =>
    setSession((s) => ({ reading: castDice(), nonce: (s?.nonce ?? 0) + 1 }));

  if (!session) {
    return (
      <QuestionIntro
        modeName="サイコロモード"
        lines={INTRO_LINES}
        onStart={start}
      />
    );
  }

  return (
    <DiceSequencePlayer
      key={session.nonce}
      reading={session.reading}
      onReplay={replay}
    />
  );
}
