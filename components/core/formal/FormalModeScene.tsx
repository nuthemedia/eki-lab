"use client";

import { useState } from "react";
import { castYarrow } from "@/domain/iching/cast";
import type { HexagramResult } from "@/domain/iching/types";
import { QuestionIntro } from "../QuestionIntro";
import { FormalSequencePlayer } from "./FormalSequencePlayer";

type Session = {
  reading: HexagramResult;
  nonce: number;
};

const INTRO_LINES = [
  "問いを心に定めてください",
  "五十策を前に置きます",
  "一本を太極として除きます",
];

/** 本格モード。導入 → 筮竹のシーケンス再生 */
export function FormalModeScene() {
  const [session, setSession] = useState<Session | null>(null);

  const start = () => setSession({ reading: castYarrow(), nonce: 0 });
  const replay = () =>
    setSession((s) => ({ reading: castYarrow(), nonce: (s?.nonce ?? 0) + 1 }));

  if (!session) {
    return (
      <QuestionIntro modeName="本格モード" lines={INTRO_LINES} onStart={start} />
    );
  }

  return (
    <FormalSequencePlayer
      key={session.nonce}
      reading={session.reading}
      onReplay={replay}
    />
  );
}
