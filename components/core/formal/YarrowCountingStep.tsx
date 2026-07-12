"use client";

import { motion } from "motion/react";
import { jitter, stickFill } from "./YarrowBundle";

const GROUPS = 6;
const REMAINDER = 3;

/** 四本ずつ数え、余りの策が手元に残る簡略演出 */
export function YarrowCountingStep({ lineIndex }: { lineIndex: number }) {
  return (
    <svg viewBox="0 0 300 210" width="100%" height="100%" aria-hidden>
      {/* 四本組が順に整えられていく */}
      {Array.from({ length: GROUPS }, (_, g) => {
        const col = g % 3;
        const row = Math.floor(g / 3);
        const gx = 58 + col * 66;
        const gy = 34 + row * 74;
        return (
          <motion.g
            key={g}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.25 + g * 0.24,
              ease: "easeOut",
            }}
          >
            {Array.from({ length: 4 }, (_, s) => (
              <rect
                key={s}
                x={gx + s * 9}
                y={gy + (jitter(g * 7 + s + lineIndex) - 0.5) * 5}
                width={3.4}
                height={56}
                rx={1.7}
                fill={stickFill(g * 4 + s)}
                opacity={0.88}
              />
            ))}
          </motion.g>
        );
      })}
      {/* 余りの策 — この余りが爻を告げる */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.35 + GROUPS * 0.24 }}
      >
        {Array.from({ length: REMAINDER }, (_, s) => (
          <rect
            key={s}
            x={252 + s * 9}
            y={78 + (jitter(s + 90 + lineIndex) - 0.5) * 6}
            width={3.4}
            height={56}
            rx={1.7}
            fill="#d4b57c"
          />
        ))}
      </motion.g>
    </svg>
  );
}
