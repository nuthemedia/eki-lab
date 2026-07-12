import { HAKKE_COLUMNS, type ColumnCategory, type HakkeColumn } from "../data/hakke/columns";
import type { StageSlug } from "../data/hakke/stages";
import type { HakkeProgress } from "./hakkeProgress";

function rank(column: HakkeColumn, progress: HakkeProgress): [number, number] {
  const stat = progress.columnStats[column.id];
  return [stat?.shown ?? 0, stat?.lastShownAt ? new Date(stat.lastShownAt).getTime() : 0];
}

function leastSeen(candidates: HakkeColumn[], progress: HakkeProgress): HakkeColumn {
  const recent = new Set(progress.recentColumnIds);
  const withoutRecent = candidates.filter((column) => !recent.has(column.id));
  const pool = withoutRecent.length > 0 ? withoutRecent : candidates;
  return [...pool].sort((a, b) => {
    const [aShown, aTime] = rank(a, progress);
    const [bShown, bTime] = rank(b, progress);
    return aShown - bShown || aTime - bTime || a.id.localeCompare(b.id);
  })[0];
}

/** 「学び・学び・世界」の周期と未読優先で、次の1本を決める純粋関数。 */
export function pickColumnForStage(stage: StageSlug, progress: HakkeProgress): HakkeColumn {
  const nextCompletion = progress.columnCompletionCount + 1;
  const category: ColumnCategory =
    !progress.stagesCleared.includes(stage) || nextCompletion % 3 !== 0
      ? "learning"
      : progress.nextWorldColumnCategory;
  let candidates = HAKKE_COLUMNS.filter((column) =>
    category === "learning" ? column.category === "learning" && column.stage === stage : column.category === category,
  );

  // データ不整合時も完了導線を止めず、関連する学びへ戻す。
  if (candidates.length === 0) {
    candidates = HAKKE_COLUMNS.filter((column) => column.category === "learning" && column.stage === stage);
  }
  return leastSeen(candidates, progress);
}

export function readColumnIds(progress: HakkeProgress): Set<string> {
  return new Set(
    Object.entries(progress.columnStats)
      .filter(([, stat]) => stat.shown > 0)
      .map(([id]) => id),
  );
}
