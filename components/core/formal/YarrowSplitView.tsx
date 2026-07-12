"use client";

import { motion } from "motion/react";
import { jitter, stickFill } from "./YarrowBundle";

const HALF = 16;

function Fan({ offset }: { offset: number }) {
  return (
    <>
      {Array.from({ length: HALF }, (_, i) => {
        const t = i / (HALF - 1);
        const angle = -15 + t * 30 + (jitter(i + offset) - 0.5) * 2;
        const length = 140 + jitter(i + offset + 50) * 14;
        return (
          <g key={i} transform={`rotate(${angle})`}>
            <rect
              x={-1.7}
              y={-length - 62}
              width={3.4}
              height={length}
              rx={1.7}
              fill={stickFill(i + offset)}
              opacity={0.92}
            />
          </g>
        );
      })}
    </>
  );
}

/** 束が天地の二つへ静かに分かれる */
export function YarrowSplitView() {
  return (
    <svg viewBox="0 0 300 210" width="100%" height="100%" aria-hidden>
      <motion.g
        initial={{ x: 150, y: 245 }}
        animate={{ x: 92, y: 245 }}
        transition={{ duration: 1.4, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <Fan offset={0} />
      </motion.g>
      <motion.g
        initial={{ x: 150, y: 245 }}
        animate={{ x: 208, y: 245 }}
        transition={{ duration: 1.4, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <Fan offset={40} />
      </motion.g>
    </svg>
  );
}
