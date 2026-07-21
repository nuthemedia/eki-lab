import type { Metadata } from "next";
import type { KotobaPassage } from "./passages";

export const KOTOBA_SEARCH_DESCRIPTION =
  "易経の重要な五つの句を、動くビジュアルに触れながら直感的に学べるインタラクティブ作品集。原文・読み下し・現代語訳・解説を掲載。";

const socialImageAlt = "易のことば — 変化の哲学を、見る。触れる。";

export function getKotobaPassageDescription(passage: KotobaPassage) {
  return `「${passage.original}」（${passage.kundoku}）${passage.translation} 易経の句を、動くビジュアルと原文・現代語訳・解説で紹介します。`;
}

export function getKotobaPassageMetadata(passage: KotobaPassage): Metadata {
  const description = getKotobaPassageDescription(passage);
  const title = `${passage.original} | 易のことば`;

  return {
    title: passage.original,
    description,
    alternates: { canonical: `/kotoba/${passage.slug}` },
    keywords: [passage.original, passage.menuTitle, "易経", "易", "I Ching"],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `/kotoba/${passage.slug}`,
      siteName: "AWAI Commons",
      locale: "ja_JP",
      type: "article",
      images: [
        {
          url: "/kotoba/opengraph-image",
          width: 1200,
          height: 630,
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "/kotoba/twitter-image",
          alt: socialImageAlt,
        },
      ],
    },
  };
}
