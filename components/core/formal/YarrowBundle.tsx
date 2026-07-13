"use client";

import { motion } from "motion/react";

/** 決定的な擬似乱数(SSR とクライアントで一致させる) */
export function jitter(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function stickFill(i: number): string {
  const tones = ["#c9a86d", "#bc9a60", "#b28f57", "#c2a066", "#a98753"];
  return tones[i % tones.length];
}

type Props = {
  /** true で一本が太極として静かに外れる */
  removing?: boolean;
};

const COUNT = 33;

/** 机上に立てて扇状に持った筮竹の束 */
export function YarrowBundle({ removing = false }: Props) {
  const sticks = Array.from({ length: COUNT }, (_, i) => {
    const t = i / (COUNT - 1);
    return {
      angle: -24 + t * 48 + (jitter(i) - 0.5) * 2.4,
      length: 148 + jitter(i + 100) * 14,
    };
  });

  return (
    <svg viewBox="0 0 300 210" width="100%" height="100%" aria-hidden>
      <g transform="translate(150 235)">
        {sticks.map((stick, i) => (
          <motion.g
            key={i}
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: stick.angle, opacity: 1 }}
            transition={{
              duration: 1.4,
              delay: i * 0.018,
              ease: [0.3, 0, 0.2, 1],
            }}
          >
            <rect
              x={-1.7}
              y={-stick.length - 58}
              width={3.4}
              height={stick.length}
              rx={1.7}
              fill={stickFill(i)}
              opacity={0.92}
            />
          </motion.g>
        ))}
        {/* 太極として除かれる一策 */}
        <motion.g
          initial={{ rotate: 27, opacity: 1, x: 0 }}
          animate={
            removing
              ? { rotate: 44, x: 74, y: 10, opacity: 0.28 }
              : { rotate: 27, x: 0, opacity: 1 }
          }
          transition={{ duration: 1.6, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <rect
            x={-1.7}
            y={-212}
            width={3.4}
            height={154}
            rx={1.7}
            fill="#d4b57c"
          />
        </motion.g>
      </g>
    </svg>
  );
}
