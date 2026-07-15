import { describe, expect, it } from "vitest";
import {
  AUTO_DIALOG_AT_MS,
  AUTO_DURATION_MS,
  AUTO_FIELD_AT_MS,
  AUTO_STACK_AT_MS,
  sampleAutoTimeline,
} from "./experience";

describe("taikyoku AUTO timeline", () => {
  it("moves continuously from one to sixty-four", () => {
    expect(sampleAutoTimeline(0).progress).toBe(0);
    expect(sampleAutoTimeline(19_500).progress).toBe(0.5);
    expect(sampleAutoTimeline(AUTO_STACK_AT_MS).progress).toBe(1);
  });

  it("stacks, opens the field, then reveals the closing dialog", () => {
    expect(sampleAutoTimeline(AUTO_STACK_AT_MS).phase).toBe("stacked");
    expect(sampleAutoTimeline(AUTO_FIELD_AT_MS).phase).toBe("field");
    expect(sampleAutoTimeline(AUTO_DIALOG_AT_MS).dialogOpen).toBe(true);
    expect(sampleAutoTimeline(AUTO_DURATION_MS).complete).toBe(true);
  });

  it("clamps out-of-range elapsed values", () => {
    expect(sampleAutoTimeline(-1).progress).toBe(0);
    expect(sampleAutoTimeline(AUTO_DURATION_MS + 1).complete).toBe(true);
  });
});
