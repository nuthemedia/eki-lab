"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { LineType } from "@/domain/iching/types";
import { HexagramFigure } from "@/components/core/HexagramFigure";

type Props = {
  /** 六爻。下から上。変爻は old-* でマーク済み */
  lines: LineType[];
  changingIndex: number;
  onDone: () => void;
};

const LINE_INTERVAL = 340;
const HIGHLIGHT_DELAY = 480;
const DONE_DELAY = 1150;

/**
 * カード用の短い立卦演出。六爻が下から積み上がり、最後に変爻が朱に灯る。
 * formal / dice の長尺シーンは使わない。
 */
export function CardCastingAnimation({ lines, changingIndex, onDone }: Props) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(0);
  const [highlight, setHighlight] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDoneRef.current();
    };

    if (reduce) {
      const revealTimer = window.setTimeout(() => {
        setVisible(6);
        setHighlight(true);
      }, 0);
      const finishTimer = window.setTimeout(finish, 500);
      return () => {
        window.clearTimeout(revealTimer);
        window.clearTimeout(finishTimer);
      };
    }

    const timers: number[] = [];
    for (let i = 1; i <= 6; i++) {
      timers.push(window.setTimeout(() => setVisible(i), i * LINE_INTERVAL));
    }
    timers.push(
      window.setTimeout(
        () => setHighlight(true),
        6 * LINE_INTERVAL + HIGHLIGHT_DELAY,
      ),
    );
    timers.push(window.setTimeout(finish, 6 * LINE_INTERVAL + DONE_DELAY));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduce]);

  return (
    <div className="ik-flow-col ik-flow-center" style={{ minHeight: "50dvh" }}>
      <HexagramFigure
        lines={lines}
        visibleCount={visible}
        changingIndexes={[changingIndex]}
        highlightChanging={highlight}
      />
      <motion.div
        className="ik-serif"
        style={{
          fontSize: 14,
          letterSpacing: "0.26em",
          color: "var(--ik-paper-dim)",
        }}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        卦を立てています
      </motion.div>
    </div>
  );
}
