import { hexagramFromLines } from "./hexagrams";
import type { HexagramResult, SequenceStep } from "./types";

/**
 * サイコロモードの演出ステップ列を HexagramResult から生成する。
 * 出目は本物の対応: 骰子1・2(八面体)の face は八卦 index(0-7)、
 * 骰子3(六面体)の face は変爻の位置(0-5)。
 * ※ 結果自体はモック。三骰子方式は必ず変爻が1つ出るため、
 *   サイコロモードには変爻なしの reading を渡さないこと。
 */
export function buildDiceSteps(reading: HexagramResult): SequenceStep[] {
  const hexagram = hexagramFromLines(reading.primaryLines);
  const lower = hexagram?.lower ?? 0;
  const upper = hexagram?.upper ?? 0;
  const changing = reading.changingLineIndexes[0] ?? 0;

  return [
    { kind: "roll-die", duration: 2200, dieIndex: 0, face: lower },
    { kind: "trigram", duration: 2200, position: "lower", trigramIndex: lower },
    { kind: "roll-die", duration: 2200, dieIndex: 1, face: upper },
    { kind: "trigram", duration: 2200, position: "upper", trigramIndex: upper },
    { kind: "roll-die", duration: 2200, dieIndex: 2, face: changing },
    { kind: "changing-line", duration: 2000, lineIndex: changing },
    { kind: "primary-complete", duration: 3200 },
    { kind: "transform", duration: 2400 },
    { kind: "result", duration: 0 },
  ];
}
