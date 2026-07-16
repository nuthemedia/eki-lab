import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/seo";
import { HEXAGRAMS_BY_NUMBER, linesOfHexagram } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import {
  HEXAGRAM_INDEX_DESCRIPTION,
  HEXAGRAM_INDEX_TITLE,
} from "@/domain/iching/hexagramSeo";
import HexagramIndex, {
  type HexagramCardData,
} from "@/components/hexagrams/HexagramIndex";

export const metadata: Metadata = {
  title: HEXAGRAM_INDEX_TITLE,
  description: HEXAGRAM_INDEX_DESCRIPTION,
  alternates: { canonical: "/hexagrams" },
  applicationName: HEXAGRAM_INDEX_TITLE,
  keywords: [
    "易経",
    "六十四卦",
    "64卦",
    "卦辞",
    "爻辞",
    "八卦",
    "I Ching",
    "AWAI Commons",
  ],
  category: "education",
  authors: [{ name: "AWAI Commons", url: siteUrl }],
  creator: "AWAI Commons",
  publisher: "AWAI Commons",
  robots: { index: true, follow: true },
  openGraph: {
    title: HEXAGRAM_INDEX_TITLE,
    description: HEXAGRAM_INDEX_DESCRIPTION,
    url: `${siteUrl}/hexagrams`,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HEXAGRAM_INDEX_TITLE,
    description: HEXAGRAM_INDEX_DESCRIPTION,
    creator: "@AWAIcommons",
  },
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: HEXAGRAM_INDEX_TITLE,
    description: HEXAGRAM_INDEX_DESCRIPTION,
    url: `${siteUrl}/hexagrams`,
    inLanguage: "ja",
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: 64,
      itemListElement: cards.map((card) => ({
        "@type": "ListItem",
        position: card.number,
        url: `${siteUrl}/hexagrams/${card.number}`,
        name: `第${card.number}卦 ${card.name}（${card.reading}）`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HexagramIndex cards={cards} />
    </>
  );
}
