import { describe, expect, it } from "vitest";
import { KOTOBA_PASSAGES } from "./passages";
import {
  getKotobaPassageDescription,
  getKotobaPassageMetadata,
  KOTOBA_SEARCH_DESCRIPTION,
} from "./seo";

describe("kotoba SEO", () => {
  it("keeps the approved search description", () => {
    expect(KOTOBA_SEARCH_DESCRIPTION).toBe(
      "易経の重要な五つの句を、動くビジュアルに触れながら直感的に学べるインタラクティブ作品集。原文・読み下し・現代語訳・解説を掲載。",
    );
  });

  it.each(KOTOBA_PASSAGES)("builds complete metadata for $slug", (passage) => {
    const description = getKotobaPassageDescription(passage);
    const metadata = getKotobaPassageMetadata(passage);

    expect(description).toContain(passage.original);
    expect(description).toContain(passage.kundoku);
    expect(description).toContain(passage.translation);
    expect(metadata.description).toBe(description);
    expect(metadata.alternates?.canonical).toBe(`/kotoba/${passage.slug}`);
    expect(metadata.openGraph).toMatchObject({
      title: `${passage.original} | 易のことば`,
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
          alt: "易のことば — 変化の哲学を、見る。触れる。",
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: `${passage.original} | 易のことば`,
      description,
      images: [
        {
          url: "/kotoba/twitter-image",
          alt: "易のことば — 変化の哲学を、見る。触れる。",
        },
      ],
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});
