import { HEXAGRAM_ENGLISH } from "../domain/iching/hexagramEnglish";

export type CoinLocaleEn = "en";
export type CoinCategoryEn = "general" | "work" | "love" | "relationships";
export type CoinInterpretationEn = {
  situation: string;
  changingPoint: string;
  caution: string;
  action: string;
  reflection: string;
};

export const CATEGORY_LENSES_EN: Record<CoinCategoryEn, string> = {
  general: "the balance of the whole situation, present choices, and what to preserve or change",
  work: "roles, priorities, collaboration, and timing",
  love: "communication, mutual boundaries, and the user's own choices without claiming to know another person's mind",
  relationships: "communication, roles, boundaries, and room to repair or reshape the relationship",
};

export function normalizeCoinCategoryEn(value: unknown): CoinCategoryEn {
  if (value === "work" || value === "love" || value === "relationships") return value;
  return "general";
}

export function guidanceForCategoryEn(primaryNumber: number, category: CoinCategoryEn): string {
  const entry = HEXAGRAM_ENGLISH[primaryNumber];
  if (category === "work") return entry.guidance.work;
  if (category === "love" || category === "relationships") return entry.guidance.relationships;
  return entry.guidance.decision;
}

export function buildFallbackCoinInterpretationEn(
  question: string,
  category: CoinCategoryEn,
  primaryNumber: number,
  changing: number[],
  relatingNumber: number | null,
): CoinInterpretationEn {
  const entry = HEXAGRAM_ENGLISH[primaryNumber];
  const guidance = guidanceForCategoryEn(primaryNumber, category);
  const lineLabels = ["First Line", "Second Line", "Third Line", "Fourth Line", "Fifth Line", "Top Line"];

  return {
    situation: `For your question — “${question}” — Hexagram ${primaryNumber}, ${entry.name}, suggests looking at the situation through this theme: ${entry.essence} ${guidance}`,
    changingPoint: changing.length
      ? changing.map((index) => `${lineLabels[index]}: ${entry.lines[index].modern}`).join("\n")
      : "There are no changing lines in this reading. Rather than rushing to reshape the situation, stay with the Primary Hexagram and practise its central attitude carefully.",
    caution: category === "love"
      ? "A hexagram cannot tell you what another person secretly thinks or feels. Give more weight to what can be discussed, observed, and agreed, while respecting both people's boundaries."
      : "The I Ching does not fix the future. For major medical, legal, financial, or personal decisions, also use reliable evidence and qualified advice.",
    action: `${guidance} Choose one small action you can take today, then notice what actually changes before deciding on the next step.`,
    reflection: relatingNumber
      ? `With this question in mind — “${question}” — what is already working? As the reading moves toward ${HEXAGRAM_ENGLISH[relatingNumber].name}, what do you want to preserve?`
      : `With this question in mind — “${question}” — what is already working, and what is the smallest part you can influence now?`,
  };
}

export function detailReflectionPromptsEn(
  question: string,
  category: CoinCategoryEn,
  primaryNumber: number,
  relatingNumber: number | null,
): string[] {
  const entry = HEXAGRAM_ENGLISH[primaryNumber];
  const first = category === "love"
    ? `With this question in mind — “${question}” — what can you clarify through your own words and boundaries, without guessing at the other person's inner feelings?`
    : `With your question in mind — “${question}” — and through this theme — ${entry.essence.replace(/[.!?]+$/, "")} — what is already in place?`;
  const second = relatingNumber
    ? `If the situation is moving toward ${HEXAGRAM_ENGLISH[relatingNumber].name}, what should you preserve, and what might you release?`
    : `From the ${categoryLabelEn(category)} perspective, what deserves patient continuation rather than immediate change?`;
  return [first, second];
}

export function categoryLabelEn(category: CoinCategoryEn): string {
  return { general: "Overall", work: "Work", love: "Love", relationships: "Relationships" }[category];
}
