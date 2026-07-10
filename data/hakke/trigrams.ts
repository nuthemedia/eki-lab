import { TRIGRAMS, type Trigram } from "@/data/iching/hexagrams";

export type HakkePalette = {
  /** 淡い背景色 */
  base: string;
  /** 発光・ハイライト */
  glow: string;
  /** 濃い主役色 */
  deep: string;
};

export type HakkeTrigram = Trigram & {
  /** TRIGRAMS の index (0-7) */
  id: number;
  reading: string;
  /** 自然イメージ一文 */
  image: string;
  /** 陰陽構造の一言 */
  story: string;
  palette: HakkePalette;
};

type Extra = Omit<HakkeTrigram, keyof Trigram | "id">;

/** TRIGRAMS index → 学習用の追加情報 */
const EXTRAS: Record<number, Extra> = {
  0: {
    reading: "けん",
    image: "空がひらき、光が上へ広がっていく。",
    story: "三本すべてが陽。いちばん力強いかたち。",
    palette: { base: "#dceaff", glow: "#ffe9a8", deep: "#5b82d6" },
  },
  1: {
    reading: "だ",
    image: "水面がひらいて、光をうつして潤う。",
    story: "いちばん上だけ陰。上がやわらかくひらく。",
    palette: { base: "#dff4f0", glow: "#a8ecdc", deep: "#2f9484" },
  },
  2: {
    reading: "り",
    image: "火が灯り、まわりを明るく照らす。",
    story: "真ん中だけ陰。外側が明るく燃える。",
    palette: { base: "#ffe9d6", glow: "#ffb45e", deep: "#e0602f" },
  },
  3: {
    reading: "しん",
    image: "地の底から、雷がひと息に駆けあがる。",
    story: "いちばん下だけ陽。下から動き出す。",
    palette: { base: "#ece7ff", glow: "#f3edff", deep: "#7059d8" },
  },
  4: {
    reading: "そん",
    image: "風がすき間を、するりと通り抜ける。",
    story: "いちばん下だけ陰。兌の上下さかさま。",
    palette: { base: "#edf5ea", glow: "#cdeada", deep: "#5f9c7c" },
  },
  5: {
    reading: "かん",
    image: "深い水の底へ、波紋が静かに沈んでいく。",
    story: "真ん中だけ陽。離の反転。",
    palette: { base: "#d8e9f5", glow: "#8fc2e4", deep: "#2b5d8c" },
  },
  6: {
    reading: "ごん",
    image: "動きが止まり、山がどっしりと立つ。",
    story: "いちばん上だけ陽。震の上下さかさま。",
    palette: { base: "#e9ede5", glow: "#c2d1b8", deep: "#5c7159" },
  },
  7: {
    reading: "こん",
    image: "大地が広がり、すべてを静かに受けとめる。",
    story: "三本すべてが陰。乾の正反対。",
    palette: { base: "#f4ebdc", glow: "#e5cb9f", deep: "#a3814f" },
  },
};

export const HAKKE_TRIGRAMS: HakkeTrigram[] = TRIGRAMS.map((trigram, id) => ({
  ...trigram,
  id,
  ...EXTRAS[id],
}));

/**
 * 学習順。先天数順ではなく「構造コントラスト対」:
 * 乾(全陽)→坤(全陰)→離(中だけ陰)→坎(中だけ陽)
 * →震(下だけ陽)→艮(上だけ陽)→兌(上だけ陰)→巽(下だけ陰)
 */
export const LEARNING_ORDER: number[] = [0, 7, 2, 5, 3, 6, 1, 4];

export const LEARNING_TRIGRAMS: HakkeTrigram[] = LEARNING_ORDER.map(
  (id) => HAKKE_TRIGRAMS[id],
);
