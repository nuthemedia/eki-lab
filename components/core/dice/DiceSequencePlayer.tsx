"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { buildDiceSteps } from "@/domain/iching/diceModeSteps";
import { hexagramFromLines } from "@/domain/iching/hexagrams";
import type { HexagramResult, SequenceStep } from "@/domain/iching/types";
import { HexagramFigure } from "../HexagramFigure";
import { HexagramResultView } from "../HexagramResultView";
import { PlaybackControls } from "../PlaybackControls";
import { useSequencePlayer } from "../useSequencePlayer";
import { ChangingLineReveal } from "./ChangingLineReveal";
import { DieView } from "./DieView";
import { TrigramDie } from "./TrigramDie";
import { TrigramReveal } from "./TrigramReveal";

type Props = {
  reading: HexagramResult;
  onReplay?: () => void;
  /** フロー埋め込み用。指定時は結果画面を出さず、演出終了時に呼ぶ */
  onResult?: () => void;
};

const DIE_LABELS = ["下卦", "上卦", "変爻"];

function stepPosition(steps: SequenceStep[], predicate: (s: SequenceStep) => boolean) {
  return steps.findIndex(predicate);
}

/** サイコロモードのステップ再生。上=骰子の舞台、下=本卦の構成 */
export function DiceSequencePlayer({ reading, onReplay, onResult }: Props) {
  const steps = useMemo(() => buildDiceSteps(reading), [reading]);
  const player = useSequencePlayer(steps);
  const { step, index } = player;

  const reachedResult = !step || step.kind === "result";
  useEffect(() => {
    if (onResult && reachedResult) onResult();
  }, [onResult, reachedResult]);

  const primary = hexagramFromLines(reading.primaryLines);

  // 各骰子の出目と状態(振られたか / いま振られているか)
  const dice = useMemo(
    () =>
      ([0, 1, 2] as const).map((dieIndex) => {
        const pos = stepPosition(
          steps,
          (s) => s.kind === "roll-die" && s.dieIndex === dieIndex,
        );
        const rollStep = steps[pos];
        return {
          face: rollStep?.kind === "roll-die" ? rollStep.face : 0,
          rolling: pos === index,
          rolled: pos >= 0 && pos <= index,
        };
      }),
    [steps, index],
  );

  // 卦の積み上がり: 下卦の後に3本、上卦の後に6本
  const lowerPos = stepPosition(steps, (s) => s.kind === "trigram" && s.position === "lower");
  const upperPos = stepPosition(steps, (s) => s.kind === "trigram" && s.position === "upper");
  const builtCount = index >= upperPos ? 6 : index >= lowerPos ? 3 : 0;

  if (reachedResult) {
    if (onResult) return null;
    return <HexagramResultView reading={reading} onReplay={onReplay ?? (() => {})} />;
  }

  const caption =
    step.kind === "roll-die"
      ? `${DIE_LABELS[step.dieIndex]}を求める`
      : step.kind === "trigram"
        ? `${step.position === "lower" ? "下卦" : "上卦"}が定まる`
        : step.kind === "changing-line"
          ? "変爻が定まる"
          : step.kind === "primary-complete"
            ? "本卦が立つ"
            : step.kind === "transform"
              ? "変爻が反転し、之卦へ"
              : "";

  const revealKey =
    "lineIndex" in step ? `${step.kind}-${step.lineIndex}` : step.kind;

  return (
    <div className="ik-scene">
      {!onResult && (
        <div className="ik-scene-head">
          <h1 className="ik-scene-title">サイコロモード</h1>
          <Link href="/" className="ik-link-quiet">
            戻る
          </Link>
        </div>
      )}

      <div className="ik-stage" style={{ flexDirection: "column", gap: 22 }}>
        <div className="ik-dice-row" style={{ marginTop: 26 }}>
          {dice.map((die, i) => {
            const active =
              (step.kind === "roll-die" && step.dieIndex === i) ||
              (step.kind === "trigram" &&
                ((step.position === "lower" && i === 0) ||
                  (step.position === "upper" && i === 1))) ||
              (step.kind === "changing-line" && i === 2);
            return (
              <div key={i} className="ik-die-slot">
                {i === 2 ? (
                  <DieView
                    face={die.face}
                    rolling={die.rolling}
                    dimmed={!die.rolled}
                  />
                ) : (
                  <TrigramDie
                    face={die.face}
                    rolling={die.rolling}
                    dimmed={!die.rolled}
                  />
                )}
                <span
                  className={`ik-die-label${active ? " ik-die-label--active" : ""}`}
                >
                  {DIE_LABELS[i]}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ minHeight: 110, display: "flex", alignItems: "center" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={revealKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {step.kind === "trigram" && (
                <TrigramReveal
                  position={step.position}
                  trigramIndex={step.trigramIndex}
                />
              )}
              {step.kind === "changing-line" && (
                <ChangingLineReveal lineIndex={step.lineIndex} />
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
      </div>

      <div className="ik-stage-caption ik-caption">{caption}</div>

      <HexagramFigure
        lines={reading.primaryLines}
        visibleCount={builtCount}
        changingIndexes={reading.changingLineIndexes}
        highlightChanging={
          step.kind === "changing-line" || step.kind === "primary-complete"
        }
        transformed={step.kind === "transform"}
        relatingLines={reading.relatingLines}
        staggerModulo={3}
      />

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
