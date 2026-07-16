import { describe, expect, it } from "vitest";
import {
  HEXAGRAM_INDEX_DESCRIPTION,
  HEXAGRAM_INDEX_TITLE,
  hexagramSeo,
} from "./hexagramSeo";

describe("hexagram SEO", () => {
  it("keeps the dictionary index metadata stable", () => {
    expect(HEXAGRAM_INDEX_TITLE).toBe("易経・六十四卦辞典");
    expect(HEXAGRAM_INDEX_DESCRIPTION).toContain("易経の64卦");
  });

  it.each([1, 64])("builds unique metadata for hexagram %i", (number) => {
    const seo = hexagramSeo(number);
    expect(seo.title).toContain(`第${number}卦`);
    expect(seo.description.length).toBeGreaterThan(30);
    expect(seo.keywords).toContain("六十四卦");
    expect(seo.imageAlt).toContain(`第${number}卦`);
  });
});
