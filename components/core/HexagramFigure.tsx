"use client";

import { motion } from "motion/react";
import type { LineType } from "@/domain/iching/types";
import { HexagramLine } from "./HexagramLine";

type Props = {
  /** 六爻。下から上 */
  lines: (LineType | "yin" | "yang")[];
  /** 下から何本を表示するか(積み上げ演出用)。省略時は全て */
  visibleCount?: number;
  /** ハイライトする変爻 index */
  changingIndexes?: number[];
  highlightChanging?: boolean;
  /** true で変爻が反転し、relatingLines の値を見せる */
  transformed?: boolean;
  relatingLines?: ("yin" | "yang")[];
  label?: string;
  /** 複数の爻が同時に現れるとき、この本数単位で時間差をつける(既定 1 = 時間差なし) */
  staggerModulo?: number;
};

/**
 * 六爻の卦。内部データは下から上、表示は column-reverse で上爻が上。
 * 新しい爻は上からとん、と落ちて積まれる。変爻は rotateX でフリップして之卦になる。
 */
export function HexagramFigure({
  lines,
  visibleCount,
  changingIndexes = [],
  highlightChanging = false,
  transformed = false,
  relatingLines,
  label,
  staggerModulo = 1,
}: Props) {
  const count = visibleCount ?? lines.length;
  return (
    <div>
      <div className="ik-figure">
        {lines.slice(0, count).map((line, i) => {
          const isChanging = changingIndexes.includes(i);
          const flip = transformed && isChanging && relatingLines;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -14, scale: 1.04 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 210,
                damping: 20,
                delay: (i % staggerModulo) * 0.16,
              }}
              style={{ perspective: 400 }}
            >
              <motion.div
                animate={{ rotateX: flip ? 180 : 0 }}
                transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d", position: "relative" }}
              >
                <div style={{ backfaceVisibility: "hidden" }}>
                  <HexagramLine
                    line={line}
                    changing={highlightChanging && isChanging && !flip}
                  />
                </div>
                {flip && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: "rotateX(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <HexagramLine line={relatingLines[i]} />
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      {label && <div className="ik-figure-label">{label}</div>}
    </div>
  );
}
