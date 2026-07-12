import type { HexagramResult, SequenceStep } from "./types";

/** 本格モードの演出ステップ列を HexagramResult から生成する */
export function buildFormalSteps(reading: HexagramResult): SequenceStep[] {
  const steps: SequenceStep[] = [{ kind: "remove-one", duration: 2600 }];

  reading.primaryLines.forEach((line, lineIndex) => {
    steps.push(
      { kind: "split", duration: 1800, lineIndex },
      { kind: "count", duration: 2200, lineIndex },
      { kind: "line-built", duration: 1800, lineIndex, line },
    );
  });

  steps.push({ kind: "primary-complete", duration: 2600 });

  if (reading.changingLineIndexes.length > 0) {
    for (const lineIndex of reading.changingLineIndexes) {
      steps.push({ kind: "changing-line", duration: 2200, lineIndex });
    }
    steps.push({ kind: "transform", duration: 2400 });
  }

  steps.push({ kind: "result", duration: 0 });
  return steps;
}
