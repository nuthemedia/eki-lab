import { describe, expect, it } from "vitest";
import {
  hexagramFromTrigrams,
  normalizeHexagramQuery,
  searchHexagrams,
  type HexagramSearchItem,
} from "./hexagramDiscovery";

const items: HexagramSearchItem[] = [
  { number: 1, name: "乾為天", reading: "けんいてん", keywords: ["創造", "始動"] },
  { number: 2, name: "坤為地", reading: "こんいち", keywords: ["受容", "大地"] },
  { number: 10, name: "天沢履", reading: "てんたくり", keywords: ["礼", "慎重"] },
];

describe("hexagram discovery", () => {
  it.each(["乾", "けん", "創造", "1", "１", " 乾 "])(
    "finds a hexagram with %s",
    (query) => expect(searchHexagrams(items, query)).toHaveLength(1),
  );

  it("returns no suggestions for an empty or unmatched query", () => {
    expect(searchHexagrams(items, "")).toEqual([]);
    expect(searchHexagrams(items, "不存在")).toEqual([]);
  });

  it("normalizes full-width characters and whitespace", () => {
    expect(normalizeHexagramQuery(" １ ")).toBe("1");
  });

  it("matches numbers exactly", () => {
    expect(searchHexagrams(items, "1").map((item) => item.number)).toEqual([1]);
  });

  it("resolves all upper and lower trigram combinations", () => {
    const numbers = new Set<number>();
    for (let upper = 0; upper < 8; upper += 1) {
      for (let lower = 0; lower < 8; lower += 1) {
        const hexagram = hexagramFromTrigrams(upper, lower);
        expect(hexagram).toBeDefined();
        numbers.add(hexagram!.number);
      }
    }
    expect(numbers.size).toBe(64);
  });
});
