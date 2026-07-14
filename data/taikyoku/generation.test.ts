import { describe, expect, it } from "vitest";
import { TRIGRAMS } from "../../domain/iching/hexagrams";
import { binaryForms, hexagramField, trigramForms } from "./generation";
import { CAMERA_KEYFRAMES, sampleCamera, stageIndexAt } from "./camera";

describe("taikyoku generation", () => {
  it.each([
    [0, 1],
    [1, 2],
    [2, 4],
    [3, 8],
    [6, 64],
  ])("builds %i levels into %i unique forms", (depth, count) => {
    const forms = binaryForms(depth);
    expect(forms).toHaveLength(count);
    expect(new Set(forms.map((form) => form.join(""))).size).toBe(count);
  });

  it("matches the existing trigram order from the bottom line upward", () => {
    expect(trigramForms()).toEqual(TRIGRAMS.map((trigram) => trigram.lines));
  });

  it("builds 64 lower-then-upper six-line forms", () => {
    const field = hexagramField(TRIGRAMS);
    expect(field).toHaveLength(64);
    expect(new Set(field.map((form) => form.join(""))).size).toBe(64);
    expect(field[0]).toEqual([...TRIGRAMS[0].lines, ...TRIGRAMS[0].lines]);
    expect(field[1]).toEqual([...TRIGRAMS[1].lines, ...TRIGRAMS[0].lines]);
  });
});

describe("taikyoku camera", () => {
  it("clamps to the first and last keyframes", () => {
    expect(sampleCamera(-1)).toEqual({
      position: CAMERA_KEYFRAMES[0].position,
      target: CAMERA_KEYFRAMES[0].target,
      fov: CAMERA_KEYFRAMES[0].fov,
    });
    const last = CAMERA_KEYFRAMES.at(-1)!;
    expect(sampleCamera(2)).toEqual({
      position: last.position,
      target: last.target,
      fov: last.fov,
    });
  });

  it("is deterministic in both scroll directions", () => {
    expect(sampleCamera(0.47)).toEqual(sampleCamera(0.47));
    expect(stageIndexAt(0.82)).toBe(3);
    expect(stageIndexAt(0.83)).toBe(4);
  });
});
