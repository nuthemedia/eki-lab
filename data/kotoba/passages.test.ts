import { describe, expect, it } from "vitest";
import { getAdjacentPassages, getKotobaPassage, KOTOBA_PASSAGES } from "./passages";

describe("kotoba passages", () => {
  it("keeps five ordered, unique passages", () => {
    expect(KOTOBA_PASSAGES).toHaveLength(5);
    expect(KOTOBA_PASSAGES.map((passage) => passage.order)).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(KOTOBA_PASSAGES.map((passage) => passage.slug)).size).toBe(5);
  });

  it("preserves the approved originals and sources", () => {
    expect(KOTOBA_PASSAGES.map((passage) => passage.menuTitle)).toEqual([
      "陰陽の道",
      "生生の易",
      "窮すれば変ず",
      "日月の往来",
      "天の象・地の形",
    ]);
    expect(KOTOBA_PASSAGES.map((passage) => passage.original)).toEqual([
      "一陰一陽之謂道",
      "生生之謂易",
      "窮則變、變則通、通則久",
      "日往則月來、月往則日來",
      "在天成象、在地成形、變化見矣",
    ]);
    expect(KOTOBA_PASSAGES.map((passage) => passage.source)).toEqual([
      "『易経』繋辞上伝",
      "『易経』繋辞上伝",
      "『易経』繋辞下伝",
      "『易経』繋辞下伝",
      "『易経』繋辞上伝",
    ]);
  });

  it("looks up and navigates without wrapping", () => {
    expect(getKotobaPassage("sun-moon")?.order).toBe(4);
    expect(getKotobaPassage("unknown")).toBeUndefined();
    expect(getAdjacentPassages("yin-yang").previous).toBeUndefined();
    expect(getAdjacentPassages("yin-yang").next?.slug).toBe("sheng-sheng");
    expect(getAdjacentPassages("sign-and-form").next).toBeUndefined();
  });
});
