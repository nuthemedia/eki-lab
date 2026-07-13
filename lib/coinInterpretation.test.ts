import { describe, expect, it } from "vitest";
import {
  buildFallbackCoinInterpretation, guidanceSceneForCategory, normalizeCoinCategory,
} from "./coinInterpretation";

describe("coin interpretation category context", () => {
  it.each([
    ["総合", "決断"],
    ["仕事", "仕事"],
    ["恋愛", "人間関係"],
    ["人間関係", "人間関係"],
  ] as const)("maps %s to %s guidance", (category, scene) => {
    expect(guidanceSceneForCategory(category)).toBe(scene);
  });

  it("keeps the actual question in fallback reading", () => {
    const reading = buildFallbackCoinInterpretation("この関係で今伝えるべきことは？", "恋愛", 1, [], null);
    expect(reading.situation).toContain("この関係で今伝えるべきことは？");
    expect(reading.situation).toContain("相手の内心を決めつけず");
    expect(reading.caution).toContain("相手の気持ちを断定");
  });

  it("falls unknown categories back to general", () => {
    expect(normalizeCoinCategory("健康")).toBe("総合");
  });
});
