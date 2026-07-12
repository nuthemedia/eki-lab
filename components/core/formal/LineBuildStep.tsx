"use client";

import { motion } from "motion/react";
import type { LineType } from "@/domain/iching/types";
import { LINE_LABELS } from "@/domain/iching/hexagrams";

const LINE_NAMES: Record<LineType, string> = {
  yang: "陽",
  yin: "陰",
  "old-yang": "老陽",
  "old-yin": "老陰",
};

type Props = {
  lineIndex: number;
  line: LineType;
};

/** 一爻の決定。爻の名がすっと現れ、算木が下の卦に積まれる */
export function LineBuildStep({ lineIndex, line }: Props) {
  const isChanging = line === "old-yang" || line === "old-yin";
  return (
    <div style={{ textAlign: "center" }}>
      <motion.div
        className="ik-eyebrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {LINE_LABELS[lineIndex]}
      </motion.div>
      <motion.div
        className="ik-serif"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.3, 0, 0.2, 1] }}
        style={{
          fontSize: "clamp(44px, 14vw, 60px)",
          letterSpacing: "0.14em",
          marginTop: 10,
          color: isChanging ? "var(--ik-vermilion)" : "var(--ik-paper)",
        }}
      >
        {LINE_NAMES[line]}
      </motion.div>
      {isChanging && (
        <motion.div
          className="ik-caption"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ marginTop: 8 }}
        >
          変爻となる
        </motion.div>
      )}
    </div>
  );
}
