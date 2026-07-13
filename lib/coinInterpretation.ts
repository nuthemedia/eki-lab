import { HEXAGRAMS_BY_NUMBER, LINE_LABELS } from "../domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "../domain/iching/hexagramTexts";
import { HEXAGRAM_DICTIONARY, type GuidanceScene } from "../domain/iching/hexagramDictionary";
import { HEXAGRAM_ENGLISH } from "../domain/iching/hexagramEnglish";

export type CoinLocale = "ja" | "en";
export type CoinCategory = "general" | "work" | "love" | "relationships";
export type CoinInterpretation = {
  situation: string;
  changingPoint: string;
  caution: string;
  action: string;
  reflection: string;
};

export const CATEGORY_LENSES: Record<CoinLocale, Record<CoinCategory, string>> = {
  ja: {
    general: "状況全体の均衡、今の選択、守るものと動かすもの",
    work: "役割、優先順位、協働、進める時機",
    love: "対話、互いの境界、自分から取れる行動。相手の気持ちは断定しない",
    relationships: "対話、役割、境界、関係を整え直す余地",
  },
  en: {
    general: "the balance of the whole situation, present choices, and what to preserve or change",
    work: "roles, priorities, collaboration, and timing",
    love: "communication, mutual boundaries, and the user's own choices without claiming to know another person's mind",
    relationships: "communication, roles, boundaries, and room to repair or reshape the relationship",
  },
};

export function normalizeCoinLocale(value: unknown): CoinLocale {
  return value === "en" ? "en" : "ja";
}

export function normalizeCoinCategory(value: unknown): CoinCategory {
  if (value === "work" || value === "仕事") return "work";
  if (value === "love" || value === "恋愛") return "love";
  if (value === "relationships" || value === "人間関係") return "relationships";
  return "general";
}

export function guidanceSceneForCategory(category: CoinCategory): GuidanceScene {
  if (category === "work") return "仕事";
  if (category === "love" || category === "relationships") return "人間関係";
  return "決断";
}

function categoryLabel(category: CoinCategory, locale: CoinLocale): string {
  const labels: Record<CoinLocale, Record<CoinCategory, string>> = {
    ja: { general: "総合", work: "仕事", love: "恋愛", relationships: "人間関係" },
    en: { general: "Overall", work: "Work", love: "Love", relationships: "Relationships" },
  };
  return labels[locale][category];
}

export function guidanceForCategory(primaryNumber: number, category: CoinCategory, locale: CoinLocale = "ja"): string {
  if (locale === "en") {
    const entry = HEXAGRAM_ENGLISH[primaryNumber];
    if (category === "work") return entry.guidance.work;
    if (category === "love" || category === "relationships") return entry.guidance.relationships;
    return entry.guidance.decision;
  }
  const entry = HEXAGRAM_DICTIONARY[primaryNumber];
  const scene = guidanceSceneForCategory(category);
  return entry.guidance.find((item) => item.scene === scene)?.text ?? entry.modern;
}

export function buildFallbackCoinInterpretation(
  question: string,
  category: CoinCategory,
  primaryNumber: number,
  changing: number[],
  relatingNumber: number | null,
  locale: CoinLocale = "ja",
): CoinInterpretation {
  if (locale === "en") {
    const entry = HEXAGRAM_ENGLISH[primaryNumber];
    const guidance = guidanceForCategory(primaryNumber, category, "en");
    return {
      situation: `For “${question},” Hexagram ${primaryNumber}, ${entry.name}, suggests looking at the situation through this theme: ${entry.essence} ${guidance}`,
      changingPoint: changing.length
        ? changing.map((index) => `${["First Line", "Second Line", "Third Line", "Fourth Line", "Fifth Line", "Top Line"][index]}: ${entry.lines[index].modern}`).join("\n")
        : "There are no changing lines in this reading. Rather than rushing to reshape the situation, you can stay with the Primary Hexagram and practice its central attitude carefully.",
      caution: category === "love"
        ? "A hexagram cannot tell you what another person secretly thinks or feels. Give more weight to what can be discussed, observed, and agreed, while respecting both people's boundaries."
        : "The I Ching does not fix the future. For major medical, legal, financial, or personal decisions, also use reliable evidence and qualified advice.",
      action: `${guidance} Choose one small action you can take today, then notice what actually changes before deciding on the next step.`,
      reflection: relatingNumber
        ? `What is already working in “${question}”? As the reading moves toward ${HEXAGRAM_ENGLISH[relatingNumber].name}, what do you want to preserve?`
        : `What is already working in “${question},” and what is the smallest part you can influence now?`,
    };
  }

  const entry = HEXAGRAM_DICTIONARY[primaryNumber];
  const texts = HEXAGRAM_TEXTS[primaryNumber];
  const guidance = guidanceForCategory(primaryNumber, category, "ja");
  const categoryLead = category === "love"
    ? "相手の内心を決めつけず、対話と自分の振る舞いに焦点を置くと"
    : `${categoryLabel(category, "ja")}の視点では`;
  return {
    situation: `「${question}」という問いに対して、この卦は「${entry.essence}」を手がかりに、いまの条件と自分の向き合い方を確かめる局面だと読む可能性があります。${categoryLead}、${guidance}`,
    changingPoint: changing.length
      ? changing.map((index) => `${LINE_LABELS[index]}：${texts.lines[index].modern}`).join("\n")
      : "今回は変爻がありません。状況を急いで別の形へ変えるより、本卦が示す姿勢を丁寧に続ける読み方ができます。",
    caution: category === "love"
      ? "卦から相手の気持ちを断定することはできません。言葉と行動で確かめられる事実、自分と相手それぞれの境界を大切にしてください。"
      : "易は未来を固定するものではありません。大きな判断では、現実の情報や信頼できる人の意見も合わせて確かめてください。",
    action: `${guidance} まず今日できる小さな一歩を一つ決め、その後に状況がどう変わったかを見直してください。`,
    reflection: `「${question}」について、すでに整っていることは何でしょうか？ 今、自分で動かせる最小の部分はどこでしょうか？${relatingNumber ? ` 之卦の${HEXAGRAMS_BY_NUMBER[relatingNumber].name}へ向かう変化の中で、守りたいものは何でしょうか？` : ""}`,
  };
}

export function detailReflectionPrompts(
  question: string,
  category: CoinCategory,
  primaryNumber: number,
  relatingNumber: number | null,
  locale: CoinLocale = "ja",
): string[] {
  if (locale === "en") {
    const entry = HEXAGRAM_ENGLISH[primaryNumber];
    const first = category === "love"
      ? `For “${question},” what can you clarify through your own words and boundaries, without guessing at the other person's inner feelings?`
      : `When you reconsider “${question}” through this theme — ${entry.essence.replace(/[.!?]+$/, "")} — what is already in place?`;
    const second = relatingNumber
      ? `If the situation is moving toward ${HEXAGRAM_ENGLISH[relatingNumber].name}, what should you preserve, and what might you release?`
      : `From the ${categoryLabel(category, "en")} perspective, what deserves patient continuation rather than immediate change?`;
    return [first, second];
  }
  const entry = HEXAGRAM_DICTIONARY[primaryNumber];
  const first = category === "love"
    ? `「${question}」について、相手の内心ではなく、自分の言葉や境界として確かめられることは何でしょうか？`
    : `「${question}」について、「${entry.essence}」の視点から見直すと、何がすでに整っていますか？`;
  const second = relatingNumber
    ? `之卦の${HEXAGRAMS_BY_NUMBER[relatingNumber].name}へ向かうとすれば、今のうちに守るものと手放すものは何でしょうか？`
    : `${categoryLabel(category, "ja")}の視点で、今すぐ変えずに丁寧に続けるべきことは何でしょうか？`;
  return [first, second];
}
