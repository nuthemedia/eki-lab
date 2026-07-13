import { describe, expect, it } from "vitest";
import { buildCoinReading, makeCoinCast } from "./coinCast";

describe("coin casting", () => {
  it.each([
    [["tails", "tails", "tails"], 6, "old-yin"],
    [["heads", "tails", "tails"], 7, "yang"],
    [["heads", "heads", "tails"], 8, "yin"],
    [["heads", "heads", "heads"], 9, "old-yang"],
  ] as const)("maps %j to %i", (coins, value, line) => {
    expect(makeCoinCast([...coins])).toMatchObject({ value, line });
  });

  it("keeps the first cast at the bottom and transforms only old lines", () => {
    const reading = buildCoinReading([
      makeCoinCast(["tails", "tails", "tails"]),
      makeCoinCast(["heads", "tails", "tails"]),
      makeCoinCast(["heads", "heads", "tails"]),
      makeCoinCast(["heads", "heads", "heads"]),
      makeCoinCast(["heads", "tails", "tails"]),
      makeCoinCast(["heads", "heads", "tails"]),
    ]);
    expect(reading.primaryLines).toEqual([
      "old-yin", "yang", "yin", "old-yang", "yang", "yin",
    ]);
    expect(reading.changingLineIndexes).toEqual([0, 3]);
    expect(reading.relatingLines).toEqual([
      "yang", "yang", "yin", "yin", "yang", "yin",
    ]);
  });
});
