import { HEXAGRAMS_BY_NUMBER, LINE_LABELS } from "../domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "../domain/iching/hexagramTexts";
import { HEXAGRAM_DICTIONARY, type GuidanceScene } from "../domain/iching/hexagramDictionary";

export type CoinCategory = "総合" | "仕事" | "恋愛" | "人間関係";
export type CoinInterpretation = {
  situation: string;
  changingPoint: string;
  caution: string;
  action: string;
  reflection: string;
};

export const CATEGORY_LENSES: Record<CoinCategory, string> = {
  総合: "状況全体の均衡、今の選択、守るものと動かすもの",
  仕事: "役割、優先順位、協働、進める時機",
  恋愛: "対話、互いの境界、自分から取れる行動。相手の気持ちは断定しない",
  人間関係: "対話、役割、境界、関係を整え直す余地",
};

export function normalizeCoinCategory(value: unknown): CoinCategory {
  return value === "仕事" || value === "恋愛" || value === "人間関係" ? value : "総合";
}

export function guidanceSceneForCategory(category: CoinCategory): GuidanceScene {
  if (category === "仕事") return "仕事";
  if (category === "恋愛" || category === "人間関係") return "人間関係";
  return "決断";
}

export function guidanceForCategory(primaryNumber: number, category: CoinCategory): string {
  const entry = HEXAGRAM_DICTIONARY[primaryNumber];
  const scene = guidanceSceneForCategory(category);
  return entry.guidance.find(item => item.scene === scene)?.text ?? entry.modern;
}

export function buildFallbackCoinInterpretation(
  question: string,
  category: CoinCategory,
  primaryNumber: number,
  changing: number[],
  relatingNumber: number | null,
): CoinInterpretation {
  const entry = HEXAGRAM_DICTIONARY[primaryNumber];
  const texts = HEXAGRAM_TEXTS[primaryNumber];
  const guidance = guidanceForCategory(primaryNumber, category);
  const categoryLead = category === "恋愛"
    ? "相手の内心を決めつけず、対話と自分の振る舞いに焦点を置くと"
    : `${category}の視点では`;

  return {
    situation: `「${question}」という問いに対して、この卦は「${entry.essence}」を手がかりに、いまの条件と自分の向き合い方を確かめる局面だと読む可能性があります。${categoryLead}、${guidance}`,
    changingPoint: changing.length
      ? changing.map(i => `${LINE_LABELS[i]}：${texts.lines[i].modern}`).join("\n")
      : "今回は変爻がありません。状況を急いで別の形へ変えるより、本卦が示す姿勢を丁寧に続ける読み方ができます。",
    caution: category === "恋愛"
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
): string[] {
  const entry = HEXAGRAM_DICTIONARY[primaryNumber];
  const first = category === "恋愛"
    ? `「${question}」について、相手の内心ではなく、自分の言葉や境界として確かめられることは何でしょうか？`
    : `「${question}」について、「${entry.essence}」の視点から見直すと、何がすでに整っていますか？`;
  const second = relatingNumber
    ? `之卦の${HEXAGRAMS_BY_NUMBER[relatingNumber].name}へ向かうとすれば、今のうちに守るものと手放すものは何でしょうか？`
    : `${category}の視点で、今すぐ変えずに丁寧に続けるべきことは何でしょうか？`;
  return [first, second];
}
