import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/seo";
import { HEXAGRAMS_BY_NUMBER, linesOfHexagram } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import HexagramIndex, {
  type HexagramCardData,
} from "@/components/hexagrams/HexagramIndex";

const title = "易経・六十四卦辞典";
const description =
  "易経の64卦を、形とことばからひらく辞典。卦辞・爻辞と現代語の解説、互卦・之卦・錯卦・綜卦のつながりをたどれます。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/hexagrams" },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/hexagrams`,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary", title, description },
};

export default function HexagramIndexPage() {
  const cards: HexagramCardData[] = Array.from({ length: 64 }, (_, index) => {
    const number = index + 1;
    const hexagram = HEXAGRAMS_BY_NUMBER[number];
    return {
      number,
      name: hexagram.name,
      reading: hexagram.reading,
      lower: hexagram.lower,
      upper: hexagram.upper,
      lines: linesOfHexagram(number)!,
      keywords: HEXAGRAM_DICTIONARY[number].keywords,
    };
  });

  return <HexagramIndex cards={cards} />;
}
