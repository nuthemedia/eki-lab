"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { buildFormalSteps } from "@/domain/iching/formalModeSteps";
import { hexagramFromLines, LINE_LABELS } from "@/domain/iching/hexagrams";
import type { HexagramResult } from "@/domain/iching/types";
import { HexagramFigure } from "../HexagramFigure";
import { HexagramResultView } from "../HexagramResultView";
import { PlaybackControls } from "../PlaybackControls";
import { useSequencePlayer } from "../useSequencePlayer";
import { LineBuildStep } from "./LineBuildStep";
import { YarrowBundle } from "./YarrowBundle";
import { YarrowCountingStep } from "./YarrowCountingStep";
import { YarrowSplitView } from "./YarrowSplitView";

type Props = {
  reading: HexagramResult;
  onReplay?: () => void;
  /** フロー埋め込み用。指定時は結果画面を出さず、演出終了時に呼ぶ */
  onResult?: () => void;
};

const CAPTIONS: Partial<Record<string, string>> = {
  "remove-one": "太極として一策を除く",
  split: "策を二つに分かつ",
  count: "四本ずつ数える",
  "primary-complete": "本卦が立つ",
  transform: "変爻が反転し、之卦へ",
};

/** 本格モードのステップ再生。上=筮竹の舞台、下=算木の積み上がり */
export function FormalSequencePlayer({ reading, onReplay, onResult }: Props) {
  const steps = useMemo(() => buildFormalSteps(reading), [reading]);
  const player = useSequencePlayer(steps);
  const { step, index } = player;

  const reachedResult = !step || step.kind === "result";
  useEffect(() => {
    if (onResult && reachedResult) onResult();
  }, [onResult, reachedResult]);

  const primary = hexagramFromLines(reading.primaryLines);
  const builtCount = useMemo(
    () =>
      steps
        .slice(0, index + 1)
        .filter((s) => s.kind === "line-built").length,
    [steps, index],
  );
  const activeLineIndex =
    step && "lineIndex" in step && step.kind !== "changing-line"
      ? step.lineIndex
      : undefined;

  if (reachedResult) {
    if (onResult) return null;
    return <HexagramResultView reading={reading} onReplay={onReplay ?? (() => {})} />;
  }

  const stageKey =
    "lineIndex" in step ? `${step.kind}-${step.lineIndex}` : step.kind;

  return (
    <div className="ik-scene">
      {!onResult && (
        <div className="ik-scene-head">
          <h1 className="ik-scene-title">本格モード</h1>
          <Link href="/" className="ik-link-quiet">
            戻る
          </Link>
        </div>
      )}

      <div className="ik-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {step.kind === "remove-one" && <YarrowBundle removing />}
            {step.kind === "split" && <YarrowSplitView />}
            {step.kind === "count" && (
              <YarrowCountingStep lineIndex={step.lineIndex} />
            )}
            {step.kind === "line-built" && (
              <LineBuildStep lineIndex={step.lineIndex} line={step.line} />
            )}
            {step.kind === "primary-complete" && (
              <div>
                <motion.h2
                  className="ik-reveal-name"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.3, 0, 0.2, 1] }}
                >
                  {primary?.name ?? "─"}
                </motion.h2>
                {primary && (
                  <motion.p
                    className="ik-reveal-reading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    {primary.reading}
                  </motion.p>
                )}
              </div>
            )}
            {step.kind === "changing-line" && (
              <div
                className="ik-serif"
                style={{
                  fontSize: "clamp(24px, 7vw, 30px)",
                  letterSpacing: "0.2em",
                  color: "var(--ik-vermilion)",
                }}
              >
                {LINE_LABELS[step.lineIndex]}、変ず
              </div>
            )}
            {step.kind === "transform" && (
              <div
                className="ik-serif"
                style={{
                  fontSize: "clamp(20px, 6vw, 26px)",
                  letterSpacing: "0.24em",
                  color: "var(--ik-paper-dim)",
                }}
              >
                之卦 {reading.relatingName ?? ""}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="ik-stage-caption ik-caption">
        {CAPTIONS[step.kind] ?? ""}
      </div>

      <HexagramFigure
        lines={reading.primaryLines}
        visibleCount={builtCount}
        changingIndexes={reading.changingLineIndexes}
        highlightChanging={step.kind === "changing-line"}
        transformed={step.kind === "transform"}
        relatingLines={reading.relatingLines}
      />

      <div className="ik-progress">
        {LINE_LABELS.map((label, i) => {
          const state =
            i === activeLineIndex
              ? " ik-progress-item--active"
              : i < builtCount
                ? " ik-progress-item--done"
                : "";
          return (
            <span key={label} className={`ik-progress-item${state}`}>
              {label}
            </span>
          );
        })}
      </div>

      <PlaybackControls
        playing={player.playing}
        speed={player.speed}
        isLast={player.isLast}
        onTogglePlay={player.togglePlay}
        onNext={player.next}
        onSkip={player.skip}
        onReplay={onResult ? undefined : onReplay}
        onToggleSpeed={player.toggleSpeed}
      />
    </div>
  );
}
