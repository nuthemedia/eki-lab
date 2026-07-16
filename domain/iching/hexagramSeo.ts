import { HEXAGRAM_DICTIONARY } from "./hexagramDictionary";
import { HEXAGRAMS_BY_NUMBER } from "./hexagrams";

export const HEXAGRAM_INDEX_TITLE = "易経・六十四卦辞典";
export const HEXAGRAM_INDEX_DESCRIPTION =
  "易経の64卦を、形とことばからひらく辞典。卦辞・爻辞と現代語の解説、互卦・之卦・錯卦・綜卦のつながりをたどれます。";

export function hexagramSeo(number: number) {
  const hexagram = HEXAGRAMS_BY_NUMBER[number];
  const entry = HEXAGRAM_DICTIONARY[number];
  return {
    title: `第${number}卦 ${hexagram.name}（${hexagram.reading}）｜易経・六十四卦辞典`,
    description: `${entry.essence}。${entry.keywords.join("・")}。卦辞・爻辞と現代語の解説、関係する卦を紹介します。`,
    keywords: [
      `第${number}卦`,
      hexagram.name,
      hexagram.reading,
      "易経",
      "六十四卦",
      ...entry.keywords,
    ],
    imageAlt: `第${number}卦 ${hexagram.name}（${hexagram.reading}）— ${entry.essence}`,
  };
}
