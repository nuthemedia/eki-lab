"use client";

import { motion } from "motion/react";
import { TRIGRAMS } from "@/domain/iching/hexagrams";

type Props = {
  position: "lower" | "upper";
  trigramIndex: number;
};

/** 出目から下卦・上卦が定まる表示 */
export function TrigramReveal({ position, trigramIndex }: Props) {
  const trigram = TRIGRAMS[trigramIndex];
  return (
    <div className="ik-trigram">
      <motion.div
        className="ik-eyebrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {position === "lower" ? "下卦" : "上卦"}
      </motion.div>
      <motion.div
        className="ik-trigram-symbol"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.3, 0, 0.2, 1] }}
        aria-hidden
      >
        {trigram.symbol}
      </motion.div>
      <motion.div
        className="ik-trigram-name"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {trigram.name}（{trigram.nature}）
      </motion.div>
    </div>
  );
}
