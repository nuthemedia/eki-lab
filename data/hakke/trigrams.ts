import { TRIGRAMS, type Trigram } from "@/domain/iching/hexagrams";
import type { LineValue } from "@/components/hakke/TrigramFigure";

export type HakkePalette = {
  /** 淡い背景色 */
  base: string;
  /** 発光・ハイライト */
  glow: string;
  /** 濃い主役色 */
  deep: string;
};

/** 家族内の性別グループ */
export type GenderGroup = "父母" | "男" | "女";
/** 長男・中男・少男…の順序(父母は null) */
export type FamilyOrder = "長" | "中" | "少" | null;

/** 後天八卦(文王)の方位 */
export type DirectionKey = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type Direction = {
  /** 表示名(例: 西北) */
  label: string;
  /** 方位盤スロット */
  key: DirectionKey;
};

export type HakkeTrigram = Trigram & {
  /** TRIGRAMS の index (0-7)。先天八卦順(乾兌離震巽坎艮坤)でもある */
  id: number;
  reading: string;
  /** 自然イメージ一文 */
  image: string;
  /** 陰陽構造の一言 */
  story: string;
  palette: HakkePalette;

  // --- 学習ステージ拡張 ---
  /** 口訣(例: 乾三連) */
  mnemonic: string;
  /** 口訣の読み(例: けんさんれん) */
  mnemonicReading: string;
  /** 口訣の短い現代語補助(主役にはしない) */
  mnemonicModern: string;
  /** 自然象の読み(例: てん)。nature は既存 */
  natureReading: string;
  /** 基本の働きを表す主動詞(例: 創る) */
  verb: string;
  /** 動詞の一文補助 */
  verbDescription: string;
  /** 家族象(例: 父・長男・中女) */
  family: string;
  genderGroup: GenderGroup;
  familyOrder: FamilyOrder;
  /** 先天八卦順の index(= id) */
  prenatalIndex: number;
  /** 後天八卦の方位 */
  direction: Direction;
};

type Extra = Omit<HakkeTrigram, keyof Trigram | "id" | "prenatalIndex">;

/** TRIGRAMS index → 学習用の追加情報(id 昇順 = 先天順) */
const EXTRAS: Record<number, Extra> = {
  0: {
    reading: "けん",
    image: "空がひらき、光が上へ広がっていく。",
    story: "三本すべてが陽。いちばん力強いかたち。",
    palette: { base: "#dceaff", glow: "#ffe9a8", deep: "#5b82d6" },
    mnemonic: "乾三連",
    mnemonicReading: "けんさんれん",
    mnemonicModern: "ぜんぶつながる",
    natureReading: "てん",
    verb: "創る",
    verbDescription: "新しいものを生み出す。",
    family: "父",
    genderGroup: "父母",
    familyOrder: null,
    direction: { label: "西北", key: "NW" },
  },
  1: {
    reading: "だ",
    image: "水面がひらいて、光をうつして潤う。",
    story: "いちばん上だけ陰。上がやわらかくひらく。",
    palette: { base: "#dff4f0", glow: "#a8ecdc", deep: "#2f9484" },
    mnemonic: "兌上缺",
    mnemonicReading: "だじょうけつ",
    mnemonicModern: "上が欠ける",
    natureReading: "たく",
    verb: "よろこぶ",
    verbDescription: "開き、よろこびを生む。",
    family: "少女",
    genderGroup: "女",
    familyOrder: "少",
    direction: { label: "西", key: "W" },
  },
  2: {
    reading: "り",
    image: "火が灯り、まわりを明るく照らす。",
    story: "真ん中だけ陰。外側が明るく燃える。",
    palette: { base: "#ffe9d6", glow: "#ffb45e", deep: "#e0602f" },
    mnemonic: "離中虚",
    mnemonicReading: "りちゅうきょ",
    mnemonicModern: "まんなか空っぽ",
    natureReading: "か",
    verb: "照らす",
    verbDescription: "照らし、明らかにする。",
    family: "中女",
    genderGroup: "女",
    familyOrder: "中",
    direction: { label: "南", key: "S" },
  },
  3: {
    reading: "しん",
    image: "地の底から、雷がひと息に駆けあがる。",
    story: "いちばん下だけ陽。下から動き出す。",
    palette: { base: "#ece7ff", glow: "#f3edff", deep: "#7059d8" },
    mnemonic: "震仰盂",
    mnemonicReading: "しんこうう",
    mnemonicModern: "下が支える",
    natureReading: "らい",
    verb: "動く",
    verbDescription: "ものごとを動かし始める。",
    family: "長男",
    genderGroup: "男",
    familyOrder: "長",
    direction: { label: "東", key: "E" },
  },
  4: {
    reading: "そん",
    image: "風がすき間を、するりと通り抜ける。",
    story: "いちばん下だけ陰。兌の上下さかさま。",
    palette: { base: "#edf5ea", glow: "#cdeada", deep: "#5f9c7c" },
    mnemonic: "巽下断",
    mnemonicReading: "そんかだん",
    mnemonicModern: "下が切れる",
    natureReading: "ふう",
    verb: "入る",
    verbDescription: "内側へ入り、浸透する。",
    family: "長女",
    genderGroup: "女",
    familyOrder: "長",
    direction: { label: "東南", key: "SE" },
  },
  5: {
    reading: "かん",
    image: "深い水の底へ、波紋が静かに沈んでいく。",
    story: "真ん中だけ陽。離の反転。",
    palette: { base: "#d8e9f5", glow: "#8fc2e4", deep: "#2b5d8c" },
    mnemonic: "坎中満",
    mnemonicReading: "かんちゅうまん",
    mnemonicModern: "まんなか一本",
    natureReading: "すい",
    verb: "陥る",
    verbDescription: "深みに入り、困難を通る。",
    family: "中男",
    genderGroup: "男",
    familyOrder: "中",
    direction: { label: "北", key: "N" },
  },
  6: {
    reading: "ごん",
    image: "動きが止まり、山がどっしりと立つ。",
    story: "いちばん上だけ陽。震の上下さかさま。",
    palette: { base: "#e9ede5", glow: "#c2d1b8", deep: "#5c7159" },
    mnemonic: "艮覆碗",
    mnemonicReading: "ごんふくわん",
    mnemonicModern: "上で止める",
    natureReading: "さん",
    verb: "止まる",
    verbDescription: "動きを止め、区切る。",
    family: "少男",
    genderGroup: "男",
    familyOrder: "少",
    direction: { label: "東北", key: "NE" },
  },
  7: {
    reading: "こん",
    image: "大地が広がり、すべてを静かに受けとめる。",
    story: "三本すべてが陰。乾の正反対。",
    palette: { base: "#f4ebdc", glow: "#e5cb9f", deep: "#a3814f" },
    mnemonic: "坤六断",
    mnemonicReading: "こんりくだん",
    mnemonicModern: "ぜんぶ切れる",
    natureReading: "ち",
    verb: "受ける",
    verbDescription: "受け入れ、育てる。",
    family: "母",
    genderGroup: "父母",
    familyOrder: null,
    direction: { label: "西南", key: "SW" },
  },
};

export const HAKKE_TRIGRAMS: HakkeTrigram[] = TRIGRAMS.map((trigram, id) => ({
  ...trigram,
  id,
  prenatalIndex: id,
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

/** 先天八卦順(乾兌離震巽坎艮坤 = index 0-7) */
export const PRENATAL_TRIGRAMS: HakkeTrigram[] = HAKKE_TRIGRAMS;

/**
 * 八卦取象歌の行順(乾坤・震艮・離坎・兌巽)。
 * 「かたちを言う」の理解カードはこの並びで見せる。
 */
export const SONG_ORDER: number[] = [0, 7, 3, 6, 2, 5, 1, 4];

/** 形の対比ペア(かたちを言う のペア段) */
export type ContrastPair = {
  /** 対比の見出し(例: 中が空／中が満) */
  label: string;
  /** 左右の卦 id */
  ids: [number, number];
};

export const CONTRAST_PAIRS: ContrastPair[] = [
  { label: "全部陽／全部陰", ids: [0, 7] },
  { label: "上が欠ける／下が欠ける", ids: [1, 4] },
  { label: "中が空／中が満", ids: [2, 5] },
  { label: "下だけ陽／上だけ陽", ids: [3, 6] },
];

// ---------------------------------------------------------------------------
// Facet(卦の一つの側面)— エクササイズはこれで prompt / answer を差し替える
// ---------------------------------------------------------------------------

/** 卦の側面。form は図形、それ以外はテキスト */
export type Relation =
  | "form"
  | "kanji"
  | "reading"
  | "mnemonic"
  | "meaning"
  | "nature"
  | "verb"
  | "family"
  | "direction";

export type Facet =
  | { kind: "form"; lines: readonly LineValue[] }
  | { kind: "text"; text: string };

/** 卦の指定した側面を、描画可能な形で返す */
export function facetOf(trigram: HakkeTrigram, relation: Relation): Facet {
  switch (relation) {
    case "form":
      return { kind: "form", lines: trigram.lines as LineValue[] };
    case "kanji":
      return { kind: "text", text: trigram.name };
    case "reading":
      return { kind: "text", text: trigram.reading };
    case "mnemonic":
      return { kind: "text", text: trigram.mnemonic };
    case "meaning":
      return { kind: "text", text: trigram.mnemonicModern };
    case "nature":
      return { kind: "text", text: trigram.nature };
    case "verb":
      return { kind: "text", text: trigram.verb };
    case "family":
      return { kind: "text", text: trigram.family };
    case "direction":
      return { kind: "text", text: trigram.direction.label };
  }
}

/**
 * 進捗記録用の relation キー。方向(prompt↔answer)は区別せず、
 * 概念ペアで束ねる(kanji と reading はどちらも「名前」寄りだが別概念として扱う)。
 */
const CONCEPT: Record<Relation, string> = {
  form: "form",
  kanji: "name",
  reading: "reading",
  mnemonic: "mnemonic",
  meaning: "meaning",
  nature: "nature",
  verb: "verb",
  family: "family",
  direction: "direction",
};

/** (prompt, answer) → 正規化した association キー(例: "form-name") */
export function pairKey(a: Relation, b: Relation): string {
  return [CONCEPT[a], CONCEPT[b]].sort().join("-");
}

/** concept → Relation(CONCEPT の逆引き) */
const RELATION_FROM_CONCEPT: Record<string, Relation> = {
  form: "form",
  name: "kanji",
  reading: "reading",
  mnemonic: "mnemonic",
  meaning: "meaning",
  nature: "nature",
  verb: "verb",
  family: "family",
  direction: "direction",
};

/**
 * association キー → [prompt, answer]。復習で使う。
 * 形を含むキーは「答え=形」に統一(形の認識を鍛える)。
 */
export function relationFromKey(key: string): [Relation, Relation] {
  const [c0, c1] = key.split("-");
  const a = RELATION_FROM_CONCEPT[c0] ?? "form";
  const b = RELATION_FROM_CONCEPT[c1] ?? "form";
  if (a === "form") return [b, "form"];
  if (b === "form") return [a, "form"];
  return [a, b];
}

// ---------------------------------------------------------------------------
// 開発時のデータ整合チェック(家族象を lines から導出して突き合わせる)
// ---------------------------------------------------------------------------

/** lines(下→上)の「少数派の爻」から家族象を導出する */
export function deriveFamily(lines: readonly LineValue[]): {
  genderGroup: GenderGroup;
  familyOrder: FamilyOrder;
} {
  const yangCount = lines.filter((l) => l === "yang").length;
  if (yangCount === 3) return { genderGroup: "父母", familyOrder: null }; // 乾=父
  if (yangCount === 0) return { genderGroup: "父母", familyOrder: null }; // 坤=母
  const minority: LineValue = yangCount === 1 ? "yang" : "yin";
  const pos = lines.findIndex((l) => l === minority); // 0=下,1=中,2=上
  const familyOrder: FamilyOrder = pos === 0 ? "長" : pos === 1 ? "中" : "少";
  const genderGroup: GenderGroup = minority === "yang" ? "男" : "女";
  return { genderGroup, familyOrder };
}

if (process.env.NODE_ENV !== "production") {
  for (const t of HAKKE_TRIGRAMS) {
    const d = deriveFamily(t.lines as LineValue[]);
    const pure = t.genderGroup === "父母";
    if (!pure && (d.genderGroup !== t.genderGroup || d.familyOrder !== t.familyOrder)) {
      console.error(
        `[hakke] family mismatch for ${t.name}: data=${t.genderGroup}/${t.familyOrder} derived=${d.genderGroup}/${d.familyOrder}`,
      );
    }
  }
}
