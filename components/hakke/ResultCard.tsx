"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HakkeTrigram } from "@/data/hakke/trigrams";
import TrigramFigure from "./TrigramFigure";

type Props = {
  trigram: HakkeTrigram;
  isLast: boolean;
  onNext: () => void;
  extraVisual?: ReactNode;
};

export default function ResultCard({ trigram, isLast, onNext, extraVisual }: Props) {
  const reduced = useReducedMotion();
  const reveal = (order: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.15 + order * 0.4 },
        };

  return (
    <motion.div
      className="hk-card"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <TrigramFigure lines={trigram.lines} size="guide" />
      {extraVisual ? <div className="hk-card-extra">{extraVisual}</div> : null}
      <motion.p className="hk-card-kanji" {...reveal(0)}>
        {trigram.name}
        <span className="hk-card-reading" style={{ display: "block" }}>
          {trigram.reading}
        </span>
      </motion.p>
      <motion.span className="hk-card-nature" {...reveal(1)}>
        {trigram.nature}
      </motion.span>
      <motion.p className="hk-card-image" {...reveal(2)}>
        {trigram.image}
      </motion.p>
      <motion.p className="hk-card-story" {...reveal(2)}>
        {trigram.story}
      </motion.p>
      <motion.button
        type="button"
        className="hk-cta"
        onClick={onNext}
        {...reveal(3)}
      >
        {isLast ? "ひらく" : "つぎへ"}
      </motion.button>
    </motion.div>
  );
}
