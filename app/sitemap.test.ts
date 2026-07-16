import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("contains the existing pages and all 65 dictionary pages without duplicates", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(entries).toHaveLength(70);
    expect(new Set(urls).size).toBe(70);
    expect(urls).toContain("https://awaicommons.com/hexagrams");
    expect(urls).toContain("https://awaicommons.com/hexagrams/1");
    expect(urls).toContain("https://awaicommons.com/hexagrams/64");
  });
});
