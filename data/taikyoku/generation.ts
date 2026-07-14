import type { Trigram } from "@/domain/iching/hexagrams";

export type BinaryLine = "yin" | "yang";

export type HexagramPhase = "selecting" | "stacked" | "field";

export type GenerationStage = {
  id: "taikyoku" | "liangyi" | "sixiang" | "bagua" | "hexagrams";
  term: string;
  number: 1 | 2 | 4 | 8 | 64;
  line: string;
  detail?: string;
  equation?: string;
};

export const GENERATION_STAGES: readonly GenerationStage[] = [
  {
    id: "taikyoku",
    term: "太極",
    number: 1,
    line: "すべての変化は、ひとつから。",
  },
  {
    id: "liangyi",
    term: "両儀",
    number: 2,
    line: "ひとつの中に、二つの働き。",
    detail: "陰と陽。変化を生む、二つの爻。",
  },
  {
    id: "sixiang",
    term: "四象",
    number: 4,
    line: "二つの働きが、もう一段ひらく。",
    equation: "2² = 4",
  },
  {
    id: "bagua",
    term: "八卦",
    number: 8,
    line: "三本の爻から、八つの形。",
    detail: "三爻。天・人・地という三つの層。",
    equation: "2³ = 8",
  },
  {
    id: "hexagrams",
    term: "六十四卦",
    number: 64,
    line: "八つと八つが重なり、六十四の変化へ。",
    detail: "複雑さの根にあるのは、陰と陽。",
    equation: "8 × 8 = 64　　2⁶ = 64",
  },
] as const;

/**
 * 爻は index 0 が最下段。各段で新しい爻を上に加える。
 * 陽→陰の順で展開すると既存 TRIGRAMS の並びと一致する。
 */
export function binaryForms(depth: number): BinaryLine[][] {
  if (!Number.isInteger(depth) || depth < 0) {
    throw new RangeError("depth must be a non-negative integer");
  }

  let forms: BinaryLine[][] = [[]];
  for (let level = 0; level < depth; level += 1) {
    forms = forms.flatMap((form) => [
      [...form, "yang"],
      [...form, "yin"],
    ]);
  }
  return forms;
}

export function trigramForms(): BinaryLine[][] {
  return binaryForms(3);
}

export function hexagramField(trigrams: readonly Trigram[]): BinaryLine[][] {
  return trigrams.flatMap((upper) =>
    trigrams.map((lower) => [
      ...(lower.lines as BinaryLine[]),
      ...(upper.lines as BinaryLine[]),
    ]),
  );
}
