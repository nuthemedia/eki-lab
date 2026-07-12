import { hexagramFromLines, TRIGRAMS } from "./hexagrams";
import type { HexagramResult, LineType } from "./types";

/**
 * 本物の立卦ロジック。乱数を使うため、SSR とのハイドレーション不整合を
 * 避けるにはイベントハンドラ内で呼ぶこと(描画中に呼ばない)。
 */

function toRelating(lines: LineType[]): ("yin" | "yang")[] {
  return lines.map((line) =>
    line === "old-yang" ? "yin" : line === "old-yin" ? "yang" : line,
  );
}

function buildResult(primaryLines: LineType[]): HexagramResult {
  const changingLineIndexes = primaryLines
    .map((line, i) => (line === "old-yang" || line === "old-yin" ? i : -1))
    .filter((i) => i >= 0);
  const relatingLines = toRelating(primaryLines);
  return {
    primaryLines,
    changingLineIndexes,
    relatingLines,
    primaryName: hexagramFromLines(primaryLines)?.name,
    relatingName:
      changingLineIndexes.length > 0
        ? hexagramFromLines(relatingLines)?.name
        : undefined,
  };
}

/**
 * 本格モード: 本筮(五十策)の確率で一爻ずつ決める。
 * 老陰 1/16、少陽 5/16、少陰 7/16、老陽 3/16。変爻は 0〜6 本。
 */
export function castYarrow(): HexagramResult {
  const lines: LineType[] = Array.from({ length: 6 }, () => {
    const r = Math.floor(Math.random() * 16);
    if (r < 1) return "old-yin";
    if (r < 6) return "yang";
    if (r < 13) return "yin";
    return "old-yang";
  });
  return buildResult(lines);
}

/**
 * サイコロモード: 下卦 1/8・上卦 1/8・変爻 1/6 の一様乱数。
 * 変爻は常に1本(該当爻を老陽/老陰にする)。
 */
export function castDice(): HexagramResult {
  const lower = TRIGRAMS[Math.floor(Math.random() * 8)];
  const upper = TRIGRAMS[Math.floor(Math.random() * 8)];
  const changing = Math.floor(Math.random() * 6);
  const lines: LineType[] = [...lower.lines, ...upper.lines].map((line, i) =>
    i === changing ? (line === "yang" ? "old-yang" : "old-yin") : line,
  );
  return buildResult(lines);
}
