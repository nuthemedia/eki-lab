/**
 * /hakke の学習進捗(localStorage、端末内のみ)。
 * useSyncExternalStore で読めるよう、購読可能な小さなストアにしている。
 * perTrigram は間隔反復(まいにちひとつ)の出題選びに使う。
 */
export type HakkeMode = "guided" | "recall" | "choose";

export type TrigramStat = {
  /** 想起で完成させた回数 */
  recallBuilt: number;
  /** そっとお手本が出た回数 */
  hinted: number;
  /** えらぶで選べた回数 */
  chosen: number;
  /** えらぶで一度でも外した回数 */
  chooseMissed: number;
  /** この卦に最後に触れた日時(ISO)。想起・えらぶ・まいにちひとつ全てで更新 */
  lastSeenAt: string | null;
};

export type HakkeProgress = {
  guidedRounds: number;
  recallRounds: number;
  chooseRounds: number;
  perTrigram: Record<number, TrigramStat>;
  lastCompletedAt: string | null;
  /** 「きょうのひとつ」で選ばれている卦(dailyPickDate の間は固定) */
  dailyPickId: number | null;
  /** dailyPickId を選んだ日(YYYY-MM-DD、UTC基準) */
  dailyPickDate: string | null;
  /** 中断中の周回モード(guided/recall のみ。無ければ null) */
  sessionMode: HakkeMode | null;
  /** 中断中の周回で次にやる卦の index(=完了した卦の数、1〜7)。無ければ null */
  sessionStep: number | null;
  /**
   * 対応関係ごとの正誤(SRS のもと)。
   * assoc[relationKey][trigramId] = 実績。relationKey は data/hakke/trigrams の pairKey で作る。
   */
  assoc: Record<string, Record<number, AssocStat>>;
  /** 一度でもクリアした学習ステージの slug */
  stagesCleared: string[];
  /** 「小さな発見」の表示実績。既存データでは空。 */
  columnStats: Record<string, ColumnStat>;
  /** 直近に表示したコラム。連続表示を避けるため最大5件。 */
  recentColumnIds: string[];
  /** 次の「世界を広げる」枠で出す分類。 */
  nextWorldColumnCategory: "history" | "person";
  /** ステージ完了回数。学び・学び・世界の周期に使う。 */
  columnCompletionCount: number;
};

export type ColumnStat = {
  shown: number;
  lastShownAt: string | null;
};

/** 対応関係×卦の学習実績 */
export type AssocStat = {
  /** 出題された回数 */
  seen: number;
  /** 正解した回数 */
  correct: number;
  /** 間違えた回数 */
  wrong: number;
  lastSeenAt: string | null;
};

const STORAGE_KEY = "hakke-progress-v2";
/** v1 → v2 移行元 */
const LEGACY_KEY = "hakke-progress-v1";
const TRIGRAM_COUNT = 8;

const EMPTY: HakkeProgress = {
  guidedRounds: 0,
  recallRounds: 0,
  chooseRounds: 0,
  perTrigram: {},
  lastCompletedAt: null,
  dailyPickId: null,
  dailyPickDate: null,
  sessionMode: null,
  sessionStep: null,
  assoc: {},
  stagesCleared: [],
  columnStats: {},
  recentColumnIds: [],
  nextWorldColumnCategory: "history",
  columnCompletionCount: 0,
};

const EMPTY_ASSOC: AssocStat = {
  seen: 0,
  correct: 0,
  wrong: 0,
  lastSeenAt: null,
};

const EMPTY_STAT: TrigramStat = {
  recallBuilt: 0,
  hinted: 0,
  chosen: 0,
  chooseMissed: 0,
  lastSeenAt: null,
};

let cache: HakkeProgress | null = null;
const listeners = new Set<() => void>();

function normalizeStat(raw: unknown): TrigramStat {
  const stat = (raw ?? {}) as Partial<TrigramStat>;
  return {
    recallBuilt: typeof stat.recallBuilt === "number" ? stat.recallBuilt : 0,
    hinted: typeof stat.hinted === "number" ? stat.hinted : 0,
    chosen: typeof stat.chosen === "number" ? stat.chosen : 0,
    chooseMissed: typeof stat.chooseMissed === "number" ? stat.chooseMissed : 0,
    lastSeenAt: typeof stat.lastSeenAt === "string" ? stat.lastSeenAt : null,
  };
}

function normalizeAssocStat(raw: unknown): AssocStat {
  const stat = (raw ?? {}) as Partial<AssocStat>;
  return {
    seen: typeof stat.seen === "number" ? stat.seen : 0,
    correct: typeof stat.correct === "number" ? stat.correct : 0,
    wrong: typeof stat.wrong === "number" ? stat.wrong : 0,
    lastSeenAt: typeof stat.lastSeenAt === "string" ? stat.lastSeenAt : null,
  };
}

function normalizeColumnStat(raw: unknown): ColumnStat {
  const stat = (raw ?? {}) as Partial<ColumnStat>;
  return {
    shown: typeof stat.shown === "number" ? stat.shown : 0,
    lastShownAt: typeof stat.lastShownAt === "string" ? stat.lastShownAt : null,
  };
}

/** v1 / v2 いずれの JSON も同じ形に正規化する(assoc は v1 には無いので空になる) */
function parseProgress(raw: string): HakkeProgress {
  const parsed = JSON.parse(raw) as Partial<HakkeProgress>;
  const perTrigram: Record<number, TrigramStat> = {};
  if (parsed.perTrigram && typeof parsed.perTrigram === "object") {
    for (const [key, value] of Object.entries(parsed.perTrigram)) {
      perTrigram[Number(key)] = normalizeStat(value);
    }
  }
  const assoc: Record<string, Record<number, AssocStat>> = {};
  if (parsed.assoc && typeof parsed.assoc === "object") {
    for (const [rel, byId] of Object.entries(parsed.assoc)) {
      if (!byId || typeof byId !== "object") continue;
      assoc[rel] = {};
      for (const [id, value] of Object.entries(byId as Record<string, unknown>)) {
        assoc[rel][Number(id)] = normalizeAssocStat(value);
      }
    }
  }
  const columnStats: Record<string, ColumnStat> = {};
  if (parsed.columnStats && typeof parsed.columnStats === "object") {
    for (const [id, value] of Object.entries(parsed.columnStats)) {
      columnStats[id] = normalizeColumnStat(value);
    }
  }
  return {
    guidedRounds: typeof parsed.guidedRounds === "number" ? parsed.guidedRounds : 0,
    recallRounds: typeof parsed.recallRounds === "number" ? parsed.recallRounds : 0,
    chooseRounds: typeof parsed.chooseRounds === "number" ? parsed.chooseRounds : 0,
    perTrigram,
    lastCompletedAt: typeof parsed.lastCompletedAt === "string" ? parsed.lastCompletedAt : null,
    dailyPickId: typeof parsed.dailyPickId === "number" ? parsed.dailyPickId : null,
    dailyPickDate: typeof parsed.dailyPickDate === "string" ? parsed.dailyPickDate : null,
    sessionMode:
      parsed.sessionMode === "guided" || parsed.sessionMode === "recall"
        ? parsed.sessionMode
        : null,
    sessionStep: typeof parsed.sessionStep === "number" ? parsed.sessionStep : null,
    assoc,
    stagesCleared: Array.isArray(parsed.stagesCleared)
      ? parsed.stagesCleared.filter((s): s is string => typeof s === "string")
      : [],
    columnStats,
    recentColumnIds: Array.isArray(parsed.recentColumnIds)
      ? parsed.recentColumnIds.filter((id): id is string => typeof id === "string").slice(-5)
      : [],
    nextWorldColumnCategory: parsed.nextWorldColumnCategory === "person" ? "person" : "history",
    columnCompletionCount:
      typeof parsed.columnCompletionCount === "number" ? parsed.columnCompletionCount : 0,
  };
}

function readStorage(): HakkeProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return parseProgress(raw);
    // v2 が無ければ v1 から移行(周回数・卦ごと実績・きょうのひとつ・中断を引き継ぐ)
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = parseProgress(legacy);
      // 旧 guided 完走者は「つくる」クリア済みとして 8ステージ地図に載せる
      if (migrated.guidedRounds > 0 && !migrated.stagesCleared.includes("tsukuru")) {
        migrated.stagesCleared = [...migrated.stagesCleared, "tsukuru"];
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      } catch {
        // 保存できなくても移行結果はメモリで使う
      }
      return migrated;
    }
    return EMPTY;
  } catch {
    return EMPTY;
  }
}

function commit(progress: HakkeProgress): void {
  cache = progress;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // 保存できないだけ(プライベートモード等)。学習体験は続行する
  }
  listeners.forEach((listener) => listener());
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgressSnapshot(): HakkeProgress {
  if (cache === null) cache = readStorage();
  return cache;
}

export function getServerProgressSnapshot(): HakkeProgress {
  return EMPTY;
}

/** 8卦完走時に呼ぶ */
export function recordRoundComplete(mode: HakkeMode): void {
  const current = getProgressSnapshot();
  commit({
    ...current,
    guidedRounds: current.guidedRounds + (mode === "guided" ? 1 : 0),
    recallRounds: current.recallRounds + (mode === "recall" ? 1 : 0),
    chooseRounds: current.chooseRounds + (mode === "choose" ? 1 : 0),
    lastCompletedAt: new Date().toISOString(),
  });
}

/**
 * 中断中の周回を保存する。build 系(guided/recall)で1卦終えるたびに呼ぶ。
 * step は「次にやる卦の index(=完了した卦の数)」。
 */
export function recordSession(mode: HakkeMode, step: number): void {
  const current = getProgressSnapshot();
  commit({ ...current, sessionMode: mode, sessionStep: step });
}

/** 周回を完了した/新しく始め直したときに、中断状態を消す。 */
export function clearSession(): void {
  const current = getProgressSnapshot();
  if (current.sessionMode === null && current.sessionStep === null) return;
  commit({ ...current, sessionMode: null, sessionStep: null });
}

function updateStat(id: number, update: (stat: TrigramStat) => TrigramStat): void {
  const current = getProgressSnapshot();
  const stat = current.perTrigram[id] ?? EMPTY_STAT;
  commit({
    ...current,
    perTrigram: {
      ...current.perTrigram,
      [id]: { ...update(stat), lastSeenAt: new Date().toISOString() },
    },
  });
}

/** 想起モード・まいにちひとつで卦をひとつ完成させたときに呼ぶ */
export function recordTrigramRecall(id: number, hinted: boolean): void {
  updateStat(id, (stat) => ({
    ...stat,
    recallBuilt: stat.recallBuilt + 1,
    hinted: stat.hinted + (hinted ? 1 : 0),
  }));
}

/** えらぶで卦をひとつ選べたときに呼ぶ */
export function recordTrigramChoice(id: number, missed: boolean): void {
  updateStat(id, (stat) => ({
    ...stat,
    chosen: stat.chosen + 1,
    chooseMissed: stat.chooseMissed + (missed ? 1 : 0),
  }));
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysSince(iso: string | null): number {
  if (!iso) return 99;
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

/**
 * 「いちばん弱い卦」を選ぶ素朴なスコアリング。
 * 未着手・久しぶり・ヒント/ミスが多い卦ほど優先される。正式な間隔反復アルゴリズムではない。
 */
export function pickDailyTrigramId(progress: HakkeProgress = getProgressSnapshot()): number {
  let bestId = 0;
  let bestScore = -Infinity;
  for (let id = 0; id < TRIGRAM_COUNT; id++) {
    const stat = progress.perTrigram[id] ?? EMPTY_STAT;
    const untouchedBonus = stat.recallBuilt === 0 && stat.chosen === 0 ? 5 : 0;
    const score =
      untouchedBonus + daysSince(stat.lastSeenAt) + stat.hinted * 2 + stat.chooseMissed * 2;
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }
  return bestId;
}

/**
 * 「きょうのひとつ」の対象卦。同じ日(UTC基準)は同じ卦を返す — 再訪しても一貫する。
 * 日付が変わると次に呼ばれたタイミングで新しく選び直す。
 */
export function getDailyTrigramId(): number {
  const current = getProgressSnapshot();
  const today = todayKey();
  if (current.dailyPickId !== null && current.dailyPickDate === today) {
    return current.dailyPickId;
  }
  const id = pickDailyTrigramId(current);
  commit({ ...current, dailyPickId: id, dailyPickDate: today });
  return id;
}

// ---------------------------------------------------------------------------
// 対応関係(association)ごとの学習実績 — ステージ横断の復習のもと
// ---------------------------------------------------------------------------

/** 学習ステージを一度クリアしたと記録する */
export function recordStageClear(slug: string): void {
  const current = getProgressSnapshot();
  if (current.stagesCleared.includes(slug)) return;
  commit({ ...current, stagesCleared: [...current.stagesCleared, slug] });
}

/** コラムを既読として記録し、次回選出用の周期と履歴を進める。 */
export function recordColumnShown(id: string, category: "learning" | "history" | "person"): void {
  const current = getProgressSnapshot();
  const prev = current.columnStats[id] ?? { shown: 0, lastShownAt: null };
  commit({
    ...current,
    columnStats: {
      ...current.columnStats,
      [id]: { shown: prev.shown + 1, lastShownAt: new Date().toISOString() },
    },
    recentColumnIds: [...current.recentColumnIds.filter((recentId) => recentId !== id), id].slice(-5),
    nextWorldColumnCategory:
      category === "history"
        ? "person"
        : category === "person"
          ? "history"
          : current.nextWorldColumnCategory,
    columnCompletionCount: current.columnCompletionCount + 1,
  });
}

/** 対応関係×卦の実績を取得(無ければ空) */
export function getAssocStat(relationKey: string, id: number): AssocStat {
  const current = getProgressSnapshot();
  return current.assoc[relationKey]?.[id] ?? EMPTY_ASSOC;
}

/** 対応関係×卦の出題結果を記録する */
export function recordAssoc(relationKey: string, id: number, correct: boolean): void {
  const current = getProgressSnapshot();
  const prev = current.assoc[relationKey]?.[id] ?? EMPTY_ASSOC;
  commit({
    ...current,
    assoc: {
      ...current.assoc,
      [relationKey]: {
        ...(current.assoc[relationKey] ?? {}),
        [id]: {
          seen: prev.seen + 1,
          correct: prev.correct + (correct ? 1 : 0),
          wrong: prev.wrong + (correct ? 0 : 1),
          lastSeenAt: new Date().toISOString(),
        },
      },
    },
  });
}

/** 弱さスコア。大きいほど復習優先(未着手・誤り多・久しぶりを優先) */
function assocWeakness(stat: AssocStat): number {
  if (stat.seen === 0) return 100;
  return stat.wrong * 3 - stat.correct + daysSince(stat.lastSeenAt) * 0.5;
}

/** ある対応関係の中で、弱い順に卦 id を返す(記録済みのみ) */
export function getWeakByRelation(relationKey: string): number[] {
  const current = getProgressSnapshot();
  const byId = current.assoc[relationKey] ?? {};
  return Object.keys(byId)
    .map(Number)
    .sort((a, b) => assocWeakness(byId[b]) - assocWeakness(byId[a]));
}

export type ReviewItem = { relationKey: string; id: number; weakness: number };

const MASTERY_RELATIONS = [
  "form-name",
  "form-reading",
  "form-mnemonic",
  "form-meaning",
  "form-nature",
  "form-verb",
  "family-form",
  "direction-form",
] as const;

/** 形を中心にした8テーマのうち、一度以上正解したテーマ数。 */
export function getTrigramMasteryCount(
  id: number,
  progress: HakkeProgress = getProgressSnapshot(),
): number {
  return MASTERY_RELATIONS.filter((relationKey) => {
    const direct = progress.assoc[relationKey]?.[id]?.correct ?? 0;
    const [a, b] = relationKey.split("-");
    const reverse = progress.assoc[`${b}-${a}`]?.[id]?.correct ?? 0;
    return direct > 0 || reverse > 0;
  }).length;
}

/**
 * 復習キュー。記録済みの全 association を横断し、弱い順に返す。
 * 苦手な対応(卦形↔口訣、卦形↔家族 など)を relation をまたいで再出題するのに使う。
 */
export function getReviewQueue(limit = 12): ReviewItem[] {
  const current = getProgressSnapshot();
  const items: ReviewItem[] = [];
  for (const [relationKey, byId] of Object.entries(current.assoc)) {
    for (const [id, stat] of Object.entries(byId)) {
      items.push({ relationKey, id: Number(id), weakness: assocWeakness(stat) });
    }
  }
  items.sort((a, b) => b.weakness - a.weakness);
  return items.slice(0, limit);
}
