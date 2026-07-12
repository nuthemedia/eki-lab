"use client";

import { motion } from "motion/react";
import { LINE_LABELS } from "@/domain/iching/hexagrams";

/** 出目から変爻の位置が定まる表示 */
export function ChangingLineReveal({ lineIndex }: { lineIndex: number }) {
  return (
    <div className="ik-trigram">
      <motion.div
        className="ik-eyebrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        変爻
      </motion.div>
      <motion.div
        className="ik-serif"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.3, 0, 0.2, 1] }}
        style={{
          fontSize: "clamp(30px, 9vw, 38px)",
          letterSpacing: "0.18em",
          color: "var(--ik-vermilion)",
        }}
      >
        {LINE_LABELS[lineIndex]}
      </motion.div>
    </div>
  );
}
