"use client";

import { motion, useReducedMotion } from "motion/react";

export type LineValue = "yang" | "yin";

const SIZES = {
  guide: { w: 58, bar: 7, gap: 7 },
  stage: { w: 128, bar: 13, gap: 13 },
  mini: { w: 44, bar: 5, gap: 5 },
} as const;

type Props = {
  /** 下から上(index 0 = 下爻) */
  lines: readonly LineValue[];
  size?: keyof typeof SIZES;
  /** 3スロット分の枠を出す(組み立て中) */
  showEmpty?: boolean;
  /** 次のスロットに一瞬現れて溶ける爻 */
  ghost?: LineValue | null;
  /** 爻を下からスライドインさせる */
  animate?: boolean;
  /** 強調する爻の index(0=下 / 1=中 / 2=上)。家族段で「一本だけ異なる爻」を示す */
  highlight?: number | null;
};

function Bars({ value }: { value: LineValue }) {
  if (value === "yang") {
    return <span className="hk-bar is-yang" />;
  }
  return (
    <>
      <span className="hk-bar is-yin" />
      <span className="hk-bar is-yin" />
    </>
  );
}

export default function TrigramFigure({
  lines,
  size = "stage",
  showEmpty = false,
  ghost = null,
  animate = false,
  highlight = null,
}: Props) {
  const reduced = useReducedMotion();
  const s = SIZES[size];
  const slotCount = showEmpty ? 3 : lines.length;
  const ghostIndex = ghost && lines.length < 3 ? lines.length : -1;

  return (
    <div
      className="hk-fig"
      style={
        {
          "--hk-fig-w": `${s.w}px`,
          "--hk-fig-bar": `${s.bar}px`,
          "--hk-fig-gap": `${s.gap}px`,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: slotCount }, (_, i) => {
        const value = lines[i];
        const hi = highlight === i ? " is-highlight" : "";
        if (value) {
          const content = <Bars value={value} />;
          if (animate && !reduced) {
            return (
              <motion.div
                key={`${i}-${value}`}
                className={`hk-slot${hi}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                {content}
              </motion.div>
            );
          }
          return (
            <div key={`${i}-${value}`} className={`hk-slot${hi}`}>
              {content}
            </div>
          );
        }
        if (i === ghostIndex && ghost) {
          return (
            <div key={`ghost-${i}`} className="hk-slot is-ghost">
              <Bars value={ghost} />
            </div>
          );
        }
        return <div key={`empty-${i}`} className="hk-slot is-empty" />;
      })}
    </div>
  );
}
