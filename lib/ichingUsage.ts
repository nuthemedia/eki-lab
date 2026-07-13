import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

/**
 * 易のかたちの LLM 呼び出しクォータ(端末別・日次)。
 * ohtsukiUsage.ts と同じく一時ファイルの簡易ストア。厳密な永続性より
 * コスト暴走の防止が目的。
 */

export const ICHING_DAILY_LIMIT_PER_KIND = 10;

type UsageKind = "refine" | "interpret";

type StoreState = {
  // key: `${day}:${userId}:${kind}` -> count
  counts: Record<string, number>;
};

const STORE_PATH =
  process.env.ICHING_USAGE_STORE_PATH || path.join(os.tmpdir(), "iching-usage.json");

function currentDayKey(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
async function readStore(): Promise<StoreState> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoreState;
    if (parsed && typeof parsed.counts === "object") return parsed;
  } catch {
    // 初回・破損時は空で開始
  }
  return { counts: {} };
}

async function writeStore(state: StoreState): Promise<void> {
  try {
    // 当日以外のキーを掃除
    const day = currentDayKey();
    for (const key of Object.keys(state.counts)) {
      if (!key.startsWith(`${day}:`)) delete state.counts[key];
    }
    await fs.writeFile(STORE_PATH, JSON.stringify(state));
  } catch {
    // 書き込み失敗は致命ではない(クォータが緩むだけ)
  }
}

export function getIchingUserId(request: Request): string | null {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/iching_user_id=([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

/** 残回数を確認し、許可されるなら1回分を記録する */
export async function checkAndRecordUsage(
  userId: string,
  kind: UsageKind,
): Promise<{ allowed: boolean; remaining: number }> {
  const store = await readStore();
  const key = `${currentDayKey()}:${userId}:${kind}`;
  const used = store.counts[key] ?? 0;
  if (used >= ICHING_DAILY_LIMIT_PER_KIND) {
    return { allowed: false, remaining: 0 };
  }
  store.counts[key] = used + 1;
  await writeStore(store);
  return { allowed: true, remaining: ICHING_DAILY_LIMIT_PER_KIND - used - 1 };
}
