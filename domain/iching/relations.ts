import { HEXAGRAMS, HEXAGRAMS_BY_NUMBER, TRIGRAMS, type Hexagram } from "./hexagrams";

/** 序卦番号 → 6爻パターン文字列(下から上、陽=1 陰=0) */
export function patternOf(number: number): string {
  const hexagram = HEXAGRAMS_BY_NUMBER[number];
  const toKey = (index: number) =>
    TRIGRAMS[index].lines.map((l) => (l === "yang" ? "1" : "0")).join("");
  return toKey(hexagram.lower) + toKey(hexagram.upper);
}

/** 互卦: 2〜4爻を下卦、3〜5爻を上卦とする */
export function nuclearPattern(pattern: string): string {
  return pattern.slice(1, 4) + pattern.slice(2, 5);
}

/** 錯卦: 全爻を反転する */
export function invertedPattern(pattern: string): string {
  return pattern
    .split("")
    .map((c) => (c === "1" ? "0" : "1"))
    .join("");
}

/** 綜卦: 上下を逆さにする(文字列反転) */
export function reversedPattern(pattern: string): string {
  return pattern.split("").reverse().join("");
}

/** 之卦(1爻変): lineIndex(0=初爻 … 5=上爻)の爻だけ反転する */
export function changedPattern(pattern: string, lineIndex: number): string {
  return pattern
    .split("")
    .map((c, i) => (i === lineIndex ? (c === "1" ? "0" : "1") : c))
    .join("");
}

export type HexagramRelations = {
  /** 互卦 */
  nuclear: Hexagram;
  /** 錯卦 */
  inverted: Hexagram;
  /** 綜卦 */
  reversed: Hexagram;
  /** 互卦が自分自身(乾・坤) */
  isSelfNuclear: boolean;
  /** 綜卦が自分自身(1,2,27,28,29,30,61,62) */
  isSelfReversed: boolean;
  /** index 0-5 = その爻が動いたときの之卦 */
  changed: Hexagram[];
};

export function relationsOf(number: number): HexagramRelations {
  const pattern = patternOf(number);
  const nuclear = HEXAGRAMS[nuclearPattern(pattern)];
  const reversed = HEXAGRAMS[reversedPattern(pattern)];
  return {
    nuclear,
    inverted: HEXAGRAMS[invertedPattern(pattern)],
    reversed,
    isSelfNuclear: nuclear.number === number,
    isSelfReversed: reversed.number === number,
    changed: Array.from({ length: 6 }, (_, i) => HEXAGRAMS[changedPattern(pattern, i)]),
  };
}
