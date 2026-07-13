import { describe, expect, it } from "vitest";
import {
  buildFallbackCoinInterpretation, guidanceSceneForCategory, normalizeCoinCategory,
} from "./coinInterpretation";

describe("coin interpretation category context", () => {
  it.each([
    ["general", "決断"],
    ["work", "仕事"],
    ["love", "人間関係"],
    ["relationships", "人間関係"],
  ] as const)("maps %s to %s guidance", (category, scene) => {
    expect(guidanceSceneForCategory(category)).toBe(scene);
  });

  it("keeps the actual question in fallback reading", () => {
    const reading = buildFallbackCoinInterpretation("この関係で今伝えるべきことは？", "love", 1, [], null);
    expect(reading.situation).toContain("この関係で今伝えるべきことは？");
    expect(reading.situation).toContain("相手の内心を決めつけず");
    expect(reading.caution).toContain("相手の気持ちを断定");
  });

  it("falls unknown categories back to general", () => {
    expect(normalizeCoinCategory("健康")).toBe("general");
  });

  it("normalizes legacy Japanese category values", () => {
    expect(normalizeCoinCategory("仕事")).toBe("work");
    expect(normalizeCoinCategory("恋愛")).toBe("love");
  });

  it("builds an English fallback without Japanese UI text", () => {
    const reading = buildFallbackCoinInterpretation("How should I approach this conversation?", "relationships", 1, [0], 44, "en");
    expect(reading.situation).toContain("The Creative Heaven");
    expect(reading.changingPoint).toContain("First Line");
    expect(reading.caution).toContain("does not fix the future");
  });
});
