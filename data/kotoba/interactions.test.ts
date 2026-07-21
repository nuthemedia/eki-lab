import { describe, expect, it } from "vitest";
import {
  advanceExchangePhase,
  clampBias,
  clampUnit,
  getPhenomenonCue,
  interpolateFormationPoint,
  nextFlowStage,
  pointerToBias,
  pointerToFormation,
  pointerToPhase,
} from "./interactions";

describe("phenomenon cues", () => {
  it("maps yin and yang consistently from left to right", () => {
    expect(getPhenomenonCue("yin-yang", 0.2)).toMatchObject({
      primary: "陰、現る",
      secondary: "陽、退く",
    });
    expect(getPhenomenonCue("yin-yang", 0.5).primary).toBe("交わり、替わる");
    expect(getPhenomenonCue("yin-yang", 0.8)).toMatchObject({
      primary: "陰、退く",
      secondary: "陽、現る",
    });
  });

  it("maps generation, flow, orbit, and formation boundaries", () => {
    expect(getPhenomenonCue("sheng-sheng", 0.49).primary).toBe("種がひらく");
    expect(getPhenomenonCue("sheng-sheng", 0.5).primary).toBe("枝が次を生む");
    expect(getPhenomenonCue("sheng-sheng", 0.8).primary).toBe("生生");
    expect([0, 1, 2, 3].map((stage) => getPhenomenonCue("change-opens", stage).primary))
      .toEqual(["窮まる", "変ず", "通ず", "久し"]);
    expect(getPhenomenonCue("sun-moon", 0.49).announcement).toBe("日が往き、月が来る");
    expect(getPhenomenonCue("sun-moon", 0.5).announcement).toBe("月が往き、日が来る");
    expect(getPhenomenonCue("sign-and-form", 0.29).primary).toBe("兆し");
    expect(getPhenomenonCue("sign-and-form", 0.3).primary).toBe("凝る");
    expect(getPhenomenonCue("sign-and-form", 0.7).primary).toBe("形、現る");
  });
});

describe("kotoba interactions", () => {
  it("clamps normalized values", () => {
    expect(clampUnit(-1)).toBe(0);
    expect(clampUnit(2)).toBe(1);
    expect(clampBias(-2)).toBe(-1);
    expect(clampBias(2)).toBe(1);
  });

  it("maps pointer positions", () => {
    expect(pointerToBias(150, 100, 100)).toBe(0);
    expect(pointerToPhase(175, 100, 100)).toBe(0.75);
    expect(pointerToFormation(125, 100, 100)).toBe(0.25);
  });

  it("advances flow stages and stops at 久", () => {
    expect(nextFlowStage(0)).toBe(1);
    expect(nextFlowStage(2)).toBe(3);
    expect(nextFlowStage(3)).toBe(3);
  });

  it("continues and reverses the yin-yang exchange phase", () => {
    expect(advanceExchangePhase(0.25, 1, 0.1).phase).toBeCloseTo(0.35);
    expect(advanceExchangePhase(0.25, 1, 0.1).direction).toBe(1);
    expect(advanceExchangePhase(0.96, 1, 0.08).phase).toBeCloseTo(0.96);
    expect(advanceExchangePhase(0.96, 1, 0.08).direction).toBe(-1);
    expect(advanceExchangePhase(0.04, -1, 0.08).phase).toBeCloseTo(0.04);
    expect(advanceExchangePhase(0.04, -1, 0.08).direction).toBe(1);
  });

  it("keeps one formation node continuous from sign to form", () => {
    const sign = [0.2, 0.15] as const;
    const form = [0.3, 0.8] as const;
    expect(interpolateFormationPoint(sign, form, 0)).toEqual([0.2, 0.15]);
    const middle = interpolateFormationPoint(sign, form, 0.5);
    expect(middle[0]).toBeCloseTo(0.25);
    expect(middle[1]).toBeCloseTo(0.475);
    expect(interpolateFormationPoint(sign, form, 1)).toEqual([0.3, 0.8]);
  });
});
