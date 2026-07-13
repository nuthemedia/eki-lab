import { hexagramFromLines } from "./hexagrams";
import type { HexagramResult, LineType } from "./types";

export type CoinFace = "heads" | "tails";
export type CoinLineValue = 6 | 7 | 8 | 9;

export type CoinCast = {
  coins: [CoinFace, CoinFace, CoinFace];
  value: CoinLineValue;
  line: LineType;
};

export function coinValue(coins: readonly CoinFace[]): CoinLineValue {
  if (coins.length !== 3) throw new Error("A cast requires exactly three coins");
  return coins.reduce<number>((sum, coin) => sum + (coin === "heads" ? 3 : 2), 0) as CoinLineValue;
}

export function lineFromCoinValue(value: CoinLineValue): LineType {
  if (value === 6) return "old-yin";
  if (value === 7) return "yang";
  if (value === 8) return "yin";
  return "old-yang";
}

export function makeCoinCast(coins: [CoinFace, CoinFace, CoinFace]): CoinCast {
  const value = coinValue(coins);
  return { coins, value, line: lineFromCoinValue(value) };
}

export function buildCoinReading(casts: readonly CoinCast[]): HexagramResult {
  if (casts.length !== 6) throw new Error("A reading requires exactly six casts");
  const primaryLines = casts.map((cast) => cast.line);
  const changingLineIndexes = primaryLines.flatMap((line, index) =>
    line === "old-yin" || line === "old-yang" ? [index] : [],
  );
  const relatingLines = primaryLines.map((line) =>
    line === "old-yin" ? "yang" : line === "old-yang" ? "yin" : line,
  );
  return {
    primaryLines,
    changingLineIndexes,
    relatingLines,
    primaryName: hexagramFromLines(primaryLines)?.name,
    relatingName:
      changingLineIndexes.length > 0 ? hexagramFromLines(relatingLines)?.name : undefined,
  };
}

export function randomCoinCast(random: () => number = Math.random): CoinCast {
  const face = (): CoinFace => (random() < 0.5 ? "tails" : "heads");
  return makeCoinCast([face(), face(), face()]);
}

export const COIN_LINE_LABELS: Record<CoinLineValue, string> = {
  6: "老陰",
  7: "少陽",
  8: "少陰",
  9: "老陽",
};
