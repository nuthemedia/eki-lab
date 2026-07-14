import { describe, expect, it } from "vitest";
import { HEXAGRAM_ENGLISH } from "./hexagramEnglish";

describe("English hexagram data", () => {
  it("contains complete entries for all 64 King Wen hexagrams", () => {
    expect(Object.keys(HEXAGRAM_ENGLISH)).toHaveLength(64);
    for (let number = 1; number <= 64; number += 1) {
      const entry = HEXAGRAM_ENGLISH[number];
      expect(entry.name).toBeTruthy();
      expect(entry.chineseName).toBeTruthy();
      expect(entry.pinyin).toBeTruthy();
      expect(entry.keywords.length).toBeGreaterThanOrEqual(3);
      expect(entry.judgment.modern).toBeTruthy();
      expect(entry.lines).toHaveLength(6);
      expect(entry.lines.every((line) => line.original && line.modern)).toBe(true);
      expect(entry.guidance.work).toBeTruthy();
      expect(entry.guidance.relationships).toBeTruthy();
      expect(entry.guidance.decision).toBeTruthy();
    }
  });

  it("uses the selected official Unicode English names at the sequence boundaries", () => {
    expect(HEXAGRAM_ENGLISH[1].name).toBe("The Creative Heaven");
    expect(HEXAGRAM_ENGLISH[64].name).toBe("Before Completion");
  });
});
