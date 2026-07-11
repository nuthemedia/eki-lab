import type { HakkeProgress } from "@/lib/hakkeProgress";

export type StageSlug =
  | "tsukuru"
  | "tonaeru"
  | "yomu"
  | "katachi"
  | "shizen"
  | "hataraki"
  | "kazoku"
  | "hougaku";

export type StageDef = {
  slug: StageSlug;
  num: number;
  title: string;
  subtitle?: string;
  /** Phase 0 で稼働しているか(false = 近日) */
  ready: boolean;
};

/** 8ステージ。ナビには専門用語を出さず短い名前を使う */
export const STAGES: StageDef[] = [
  { slug: "tsukuru", num: 1, title: "つくる", ready: true },
  {
    slug: "tonaeru",
    num: 2,
    title: "となえる",
    subtitle: "八つの名前をリズムで覚える",
    ready: true,
  },
  { slug: "yomu", num: 3, title: "よむ", subtitle: "かたちと字と読みをつなぐ", ready: true },
  {
    slug: "katachi",
    num: 4,
    title: "かたちを言う",
    subtitle: "昔からの言葉で形を覚える",
    ready: true,
  },
  { slug: "shizen", num: 5, title: "自然を見る", subtitle: "形と自然をつなぐ", ready: true },
  { slug: "hataraki", num: 6, title: "はたらきを知る", subtitle: "動詞ひとつで覚える", ready: true },
  {
    slug: "kazoku",
    num: 7,
    title: "家族でつなぐ",
    subtitle: "爻の位置と家族を結びつける",
    ready: true,
  },
  { slug: "hougaku", num: 8, title: "方角にひろげる", subtitle: "後天の方位に置く", ready: true },
];

export type StageStatus = "done" | "open" | "soon";

export type StageView = StageDef & { status: StageStatus };

/**
 * 各ステージの表示状態と、いま取り組むステージ(current)を導出する。
 * - done: クリア済み / open: 選択可能 / soon: 近日(未実装)
 * - current はロックには使わず、トップCTAでおすすめする未完了の先頭。
 */
export function stageViews(progress: HakkeProgress): {
  views: StageView[];
  current: StageDef | null;
} {
  const cleared = new Set(progress.stagesCleared);

  // current = 稼働中・未クリアの最初のステージ(=おすすめの「次」)。
  // 稼働分を全クリアしていれば null(トップの CTA は消え、地図に「今」も出ない)。
  let current: StageDef | null = null;
  for (let i = 0; i < STAGES.length; i++) {
    const s = STAGES[i];
    if (s.ready && !cleared.has(s.slug)) {
      current = s;
      break;
    }
  }

  const views = STAGES.map((s): StageView => {
    let status: StageStatus;
    if (cleared.has(s.slug)) status = "done";
    else if (!s.ready) status = "soon";
    else status = "open";
    return { ...s, status };
  });

  return { views, current };
}
