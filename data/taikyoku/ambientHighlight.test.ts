import { describe, expect, it } from "vitest";
import {
  FIRST_HIGHLIGHT_DELAY_MS,
  HIGHLIGHT_DURATION_SECONDS,
  HIGHLIGHT_INTERVAL_MS,
  pickAmbientHighlight,
  REDUCED_HIGHLIGHT_INTERVAL_MS,
} from "./ambientHighlight";

describe("pickAmbientHighlight", () => {
  it("does not immediately repeat or replace the selected hexagram", () => {
    expect(pickAmbientHighlight(0, 1, 0)).toBe(2);
    expect(pickAmbientHighlight(62, 63, 1)).toBe(61);
  });

  it("always returns a valid hexagram index", () => {
    expect(pickAmbientHighlight(null, null, 0)).toBe(0);
    expect(pickAmbientHighlight(null, null, 0.999999)).toBe(63);
  });

  it("uses the approved ambient highlight timing", () => {
    expect(FIRST_HIGHLIGHT_DELAY_MS).toBe(600);
    expect(HIGHLIGHT_DURATION_SECONDS).toBe(0.9);
    expect(HIGHLIGHT_INTERVAL_MS).toBe(1_600);
    expect(REDUCED_HIGHLIGHT_INTERVAL_MS).toBe(3_200);
  });
});
