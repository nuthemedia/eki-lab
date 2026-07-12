"use client";

import { motion } from "motion/react";
import type { HexagramResult } from "@/domain/iching/types";
import { FormalSequencePlayer } from "@/components/core/formal/FormalSequencePlayer";
import { DiceSequencePlayer } from "@/components/core/dice/DiceSequencePlayer";

export type CastMode = "formal" | "dice";

const MODES: { mode: CastMode; title: string; desc: string }[] = [
  {
    mode: "formal",
    title: "本格モード",
    desc: "五十本の筮竹を操り、六爻を立てる",
  },
  {
    mode: "dice",
    title: "サイコロモード",
    desc: "三つの骰子に、下卦・上卦・変爻を委ねる",
  },
];

type SelectProps = {
  inquiry: string;
  onSelect: (mode: CastMode) => void;
};

/** Step5: 立卦モード選択(選択と同時に立卦し、演出へ) */
export function CastModeSelect({ inquiry, onSelect }: SelectProps) {
  return (
    <motion.div
      className="ik-flow-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="ik-eyebrow">立卦</div>
      <p className="ik-flow-summary" style={{ fontFamily: "var(--ik-font-serif)" }}>
        {inquiry}
      </p>
      <p className="ik-caption" style={{ textAlign: "left" }}>
        卦の立て方を選んでください。
      </p>
      <div className="ik-mode-list">
        {MODES.map((m, i) => (
          <motion.button
            key={m.mode}
            className="ik-mode-card"
            style={{ width: "100%", textAlign: "left", cursor: "pointer" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
            onClick={() => onSelect(m.mode)}
          >
            <div>
              <h2 className="ik-mode-card-title">{m.title}</h2>
              <p className="ik-mode-card-desc">{m.desc}</p>
            </div>
            <span className="ik-mode-card-arrow" aria-hidden>
              →
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

type PlayerProps = {
  mode: CastMode;
  reading: HexagramResult;
  onResult: () => void;
};

/** Step6: 立卦演出(既存プレイヤーの埋め込み) */
export function CastingPlayer({ mode, reading, onResult }: PlayerProps) {
  if (mode === "formal") {
    return <FormalSequencePlayer reading={reading} onResult={onResult} />;
  }
  return <DiceSequencePlayer reading={reading} onResult={onResult} />;
}
