"use client";

import { motion } from "motion/react";

type Props = {
  modeName: string;
  lines: string[];
  onStart: () => void;
};

/** モード開始前の導入。文言が静かに順に浮かび、タップで儀式が始まる */
export function QuestionIntro({ modeName, lines, onStart }: Props) {
  return (
    <div className="ik-intro">
      <motion.div
        className="ik-eyebrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {modeName}
      </motion.div>
      <div className="ik-intro-lines">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            className="ik-intro-line"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5 + i * 0.9, ease: "easeOut" }}
            style={{ margin: 0 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
      <motion.button
        className="ik-btn ik-btn--primary"
        onClick={onStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 + lines.length * 0.9 }}
      >
        はじめる
      </motion.button>
    </div>
  );
}
