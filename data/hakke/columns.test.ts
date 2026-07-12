import { describe, expect, it } from "vitest";
import { HAKKE_COLUMNS } from "./columns";
import { STAGES } from "./stages";
import { pickColumnForStage } from "../../lib/hakkeColumns";
import { getServerProgressSnapshot, type HakkeProgress } from "../../lib/hakkeProgress";

describe("Hakke columns", () => {
  it("has the approved category and tag counts", () => {
    expect(HAKKE_COLUMNS).toHaveLength(96);
    expect(HAKKE_COLUMNS.filter((c) => c.category === "learning")).toHaveLength(64);
    expect(HAKKE_COLUMNS.filter((c) => c.category === "history")).toHaveLength(16);
    expect(HAKKE_COLUMNS.filter((c) => c.category === "person")).toHaveLength(16);
    expect(HAKKE_COLUMNS.filter((c) => c.category === "learning" && c.tags?.includes("computer"))).toHaveLength(8);
    expect(HAKKE_COLUMNS.filter((c) => c.category === "learning" && c.tags?.includes("jung"))).toHaveLength(4);
  });

  it("has unique ids, complete copy, sources, and eight learning columns per stage", () => {
    expect(new Set(HAKKE_COLUMNS.map((c) => c.id)).size).toBe(96);
    expect(
      HAKKE_COLUMNS.filter((column) => {
        const length = Array.from(column.body).length;
        return length < 70 || length > 160;
      }).map((column) => [column.id, Array.from(column.body).length]),
    ).toEqual([]);
    for (const column of HAKKE_COLUMNS) {
      expect(column.title.trim().length).toBeGreaterThan(0);
      if (column.category !== "learning" || column.sourceKind !== "hakke") {
        expect(column.source?.trim().length).toBeGreaterThan(0);
      }
      if (column.category !== "learning") expect(column.historicity).toBeDefined();
    }
    for (const stage of STAGES) {
      expect(HAKKE_COLUMNS.filter((c) => c.category === "learning" && c.stage === stage.slug)).toHaveLength(8);
    }
  });

  it("selects learning, learning, then alternating world columns without recent repeats", () => {
    const base = getServerProgressSnapshot();
    const first = pickColumnForStage("tsukuru", base);
    expect(first.category).toBe("learning");

    const secondProgress: HakkeProgress = { ...base, columnCompletionCount: 1, recentColumnIds: [first.id] };
    const second = pickColumnForStage("tsukuru", secondProgress);
    expect(second.category).toBe("learning");
    expect(second.id).not.toBe(first.id);

    const third = pickColumnForStage("tsukuru", { ...base, columnCompletionCount: 2 });
    expect(third.category).toBe("learning");
    const thirdRepeat = pickColumnForStage("tsukuru", {
      ...base,
      stagesCleared: ["tsukuru"],
      columnCompletionCount: 2,
    });
    expect(thirdRepeat.category).toBe("history");
    const sixth = pickColumnForStage("tsukuru", {
      ...base,
      stagesCleared: ["tsukuru"],
      columnCompletionCount: 5,
      nextWorldColumnCategory: "person",
    });
    expect(sixth.category).toBe("person");
  });
});
