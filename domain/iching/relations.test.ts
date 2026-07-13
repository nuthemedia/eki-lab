import { describe, expect, it } from "vitest";

import { HEXAGRAMS, HEXAGRAMS_BY_NUMBER } from "./hexagrams";
import {
  changedPattern,
  invertedPattern,
  patternOf,
  relationsOf,
  reversedPattern,
} from "./relations";

const ALL_NUMBERS = Array.from({ length: 64 }, (_, i) => i + 1);

describe("patternOf", () => {
  it("HEXAGRAMS のキーと往復一致する(全64卦)", () => {
    for (const n of ALL_NUMBERS) {
      const pattern = patternOf(n);
      expect(pattern).toMatch(/^[01]{6}$/);
      expect(HEXAGRAMS[pattern].number).toBe(n);
    }
  });

  it("乾為天は全陽、坤為地は全陰", () => {
    expect(patternOf(1)).toBe("111111");
    expect(patternOf(2)).toBe("000000");
  });
});

describe("之卦(1爻変)", () => {
  it("乾の各爻変は古典の既知値と一致する", () => {
    // 初爻〜上爻の変: 姤・同人・履・小畜・大有・夬
    const expected = [44, 13, 10, 9, 14, 43];
    const { changed } = relationsOf(1);
    expect(changed.map((h) => h.number)).toEqual(expected);
  });

  it("同じ爻をもう一度変えると元に戻る(全64卦×6爻)", () => {
    for (const n of ALL_NUMBERS) {
      const p = patternOf(n);
      for (let i = 0; i < 6; i++) {
        expect(changedPattern(changedPattern(p, i), i)).toBe(p);
      }
    }
  });
});

describe("錯卦", () => {
  it("対合である f(f(x)) = x(全64卦)", () => {
    for (const n of ALL_NUMBERS) {
      const p = patternOf(n);
      expect(invertedPattern(invertedPattern(p))).toBe(p);
    }
  });

  it("乾↔坤、既済↔未済", () => {
    expect(relationsOf(1).inverted.number).toBe(2);
    expect(relationsOf(2).inverted.number).toBe(1);
    expect(relationsOf(63).inverted.number).toBe(64);
    expect(relationsOf(64).inverted.number).toBe(63);
  });
});

describe("綜卦", () => {
  it("対合である f(f(x)) = x(全64卦)", () => {
    for (const n of ALL_NUMBERS) {
      const p = patternOf(n);
      expect(reversedPattern(reversedPattern(p))).toBe(p);
    }
  });

  it("自己一致はちょうど 1,2,27,28,29,30,61,62 の8卦", () => {
    const selfReversed = ALL_NUMBERS.filter((n) => relationsOf(n).isSelfReversed);
    expect(selfReversed).toEqual([1, 2, 27, 28, 29, 30, 61, 62]);
  });

  it("屯(3)↔蒙(4)のような隣接ペア", () => {
    expect(relationsOf(3).reversed.number).toBe(4);
    expect(relationsOf(4).reversed.number).toBe(3);
  });
});

describe("互卦", () => {
  it("像は既知の16卦集合に収まる(全64卦)", () => {
    const nuclearImage = new Set([1, 2, 23, 24, 27, 28, 37, 38, 39, 40, 43, 44, 53, 54, 63, 64]);
    for (const n of ALL_NUMBERS) {
      expect(nuclearImage.has(relationsOf(n).nuclear.number)).toBe(true);
    }
  });

  it("乾・坤は互卦が自分自身", () => {
    expect(relationsOf(1).isSelfNuclear).toBe(true);
    expect(relationsOf(1).nuclear.number).toBe(1);
    expect(relationsOf(2).isSelfNuclear).toBe(true);
    expect(relationsOf(2).nuclear.number).toBe(2);
  });

  it("既済(63)の互卦は未済(64)、未済の互卦は既済", () => {
    expect(relationsOf(63).nuclear.number).toBe(64);
    expect(relationsOf(64).nuclear.number).toBe(63);
  });
});

describe("relationsOf", () => {
  it("全64卦で全フィールドが解決する", () => {
    for (const n of ALL_NUMBERS) {
      const r = relationsOf(n);
      expect(r.nuclear).toBeDefined();
      expect(r.inverted).toBeDefined();
      expect(r.reversed).toBeDefined();
      expect(r.changed).toHaveLength(6);
      for (const h of r.changed) {
        expect(HEXAGRAMS_BY_NUMBER[h.number]).toBe(h);
      }
    }
  });
});
