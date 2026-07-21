import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("contains the public pages, dictionary, and kotoba routes without duplicates", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(entries).toHaveLength(76);
    expect(new Set(urls).size).toBe(76);
    expect(urls).toContain("https://awaicommons.com/hexagrams");
    expect(urls).toContain("https://awaicommons.com/hexagrams/1");
    expect(urls).toContain("https://awaicommons.com/hexagrams/64");
    expect(urls).toContain("https://awaicommons.com/kotoba");
    expect(urls).toContain("https://awaicommons.com/kotoba/yin-yang");
    expect(urls).toContain("https://awaicommons.com/kotoba/sign-and-form");
  });
});
