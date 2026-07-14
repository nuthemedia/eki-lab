import { describe, expect, it } from "vitest";
import {
  buildFallbackCoinInterpretationEn,
  guidanceForCategoryEn,
  normalizeCoinCategoryEn,
} from "./coinInterpretationEnglish";

describe("English coin interpretation", () => {
  it("normalizes language-independent categories", () => {
    expect(normalizeCoinCategoryEn("work")).toBe("work");
    expect(normalizeCoinCategoryEn("unknown")).toBe("general");
  });

  it("uses English category guidance", () => {
    expect(guidanceForCategoryEn(1, "work")).toMatch(/[A-Za-z]/);
  });

  it("builds a complete English fallback", () => {
    const reading = buildFallbackCoinInterpretationEn(
      "How should I approach this conversation?",
      "relationships",
      1,
      [0],
      44,
    );
    expect(reading.situation).toContain("The Creative Heaven");
    expect(reading.changingPoint).toContain("First Line");
    expect(reading.caution).toContain("does not fix the future");
    expect(Object.values(reading).every(Boolean)).toBe(true);
  });
});
