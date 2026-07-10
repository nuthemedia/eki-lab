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
};

const STORAGE_KEY = "hakke-progress-v1";
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

function readStorage(): HakkeProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<HakkeProgress>;
    const perTrigram: Record<number, TrigramStat> = {};
    if (parsed.perTrigram && typeof parsed.perTrigram === "object") {
      for (const [key, value] of Object.entries(parsed.perTrigram)) {
        perTrigram[Number(key)] = normalizeStat(value);
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
    };
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
