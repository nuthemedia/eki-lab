import type { LineType } from "./types";

export type Trigram = {
  name: string;
  symbol: string;
  nature: string;
  /** 3爻。下から上 */
  lines: ("yang" | "yin")[];
};

/** 八卦。index 0-7 をサイコロモードの trigramIndex として使う */
export const TRIGRAMS: Trigram[] = [
  { name: "乾", symbol: "☰", nature: "天", lines: ["yang", "yang", "yang"] },
  { name: "兌", symbol: "☱", nature: "沢", lines: ["yang", "yang", "yin"] },
  { name: "離", symbol: "☲", nature: "火", lines: ["yang", "yin", "yang"] },
  { name: "震", symbol: "☳", nature: "雷", lines: ["yang", "yin", "yin"] },
  { name: "巽", symbol: "☴", nature: "風", lines: ["yin", "yang", "yang"] },
  { name: "坎", symbol: "☵", nature: "水", lines: ["yin", "yang", "yin"] },
  { name: "艮", symbol: "☶", nature: "山", lines: ["yin", "yin", "yang"] },
  { name: "坤", symbol: "☷", nature: "地", lines: ["yin", "yin", "yin"] },
];

export type Hexagram = {
  /** 序卦番号 1-64 */
  number: number;
  name: string;
  reading: string;
  /** TRIGRAMS の index */
  lower: number;
  upper: number;
};

/** [number, name, reading, lower, upper] — 下卦・上卦は TRIGRAMS の index */
const TABLE: [number, string, string, number, number][] = [
  [1, "乾為天", "けんいてん", 0, 0],
  [2, "坤為地", "こんいち", 7, 7],
  [3, "水雷屯", "すいらいちゅん", 3, 5],
  [4, "山水蒙", "さんすいもう", 5, 6],
  [5, "水天需", "すいてんじゅ", 0, 5],
  [6, "天水訟", "てんすいしょう", 5, 0],
  [7, "地水師", "ちすいし", 5, 7],
  [8, "水地比", "すいちひ", 7, 5],
  [9, "風天小畜", "ふうてんしょうちく", 0, 4],
  [10, "天沢履", "てんたくり", 1, 0],
  [11, "地天泰", "ちてんたい", 0, 7],
  [12, "天地否", "てんちひ", 7, 0],
  [13, "天火同人", "てんかどうじん", 2, 0],
  [14, "火天大有", "かてんたいゆう", 0, 2],
  [15, "地山謙", "ちざんけん", 6, 7],
  [16, "雷地予", "らいちよ", 7, 3],
  [17, "沢雷随", "たくらいずい", 3, 1],
  [18, "山風蠱", "さんぷうこ", 4, 6],
  [19, "地沢臨", "ちたくりん", 1, 7],
  [20, "風地観", "ふうちかん", 7, 4],
  [21, "火雷噬嗑", "からいぜいごう", 3, 2],
  [22, "山火賁", "さんかひ", 2, 6],
  [23, "山地剝", "さんちはく", 7, 6],
  [24, "地雷復", "ちらいふく", 3, 7],
  [25, "天雷无妄", "てんらいむぼう", 3, 0],
  [26, "山天大畜", "さんてんたいちく", 0, 6],
  [27, "山雷頤", "さんらいい", 3, 6],
  [28, "沢風大過", "たくふうたいか", 4, 1],
  [29, "坎為水", "かんいすい", 5, 5],
  [30, "離為火", "りいか", 2, 2],
  [31, "沢山咸", "たくざんかん", 6, 1],
  [32, "雷風恒", "らいふうこう", 4, 3],
  [33, "天山遯", "てんざんとん", 6, 0],
  [34, "雷天大壮", "らいてんたいそう", 0, 3],
  [35, "火地晋", "かちしん", 7, 2],
  [36, "地火明夷", "ちかめいい", 2, 7],
  [37, "風火家人", "ふうかかじん", 2, 4],
  [38, "火沢睽", "かたくけい", 1, 2],
  [39, "水山蹇", "すいざんけん", 6, 5],
  [40, "雷水解", "らいすいかい", 5, 3],
  [41, "山沢損", "さんたくそん", 1, 6],
  [42, "風雷益", "ふうらいえき", 3, 4],
  [43, "沢天夬", "たくてんかい", 0, 1],
  [44, "天風姤", "てんぷうこう", 4, 0],
  [45, "沢地萃", "たくちすい", 7, 1],
  [46, "地風升", "ちふうしょう", 4, 7],
  [47, "沢水困", "たくすいこん", 5, 1],
  [48, "水風井", "すいふうせい", 4, 5],
  [49, "沢火革", "たくかかく", 2, 1],
  [50, "火風鼎", "かふうてい", 4, 2],
  [51, "震為雷", "しんいらい", 3, 3],
  [52, "艮為山", "ごんいさん", 6, 6],
  [53, "風山漸", "ふうざんぜん", 6, 4],
  [54, "雷沢帰妹", "らいたくきまい", 1, 3],
  [55, "雷火豊", "らいかほう", 2, 3],
  [56, "火山旅", "かざんりょ", 6, 2],
  [57, "巽為風", "そんいふう", 4, 4],
  [58, "兌為沢", "だいたく", 1, 1],
  [59, "風水渙", "ふうすいかん", 5, 4],
  [60, "水沢節", "すいたくせつ", 1, 5],
  [61, "風沢中孚", "ふうたくちゅうふ", 1, 4],
  [62, "雷山小過", "らいざんしょうか", 6, 3],
  [63, "水火既済", "すいかきせい", 2, 5],
  [64, "火水未済", "かすいびせい", 5, 2],
];

function trigramKey(index: number): string {
  return TRIGRAMS[index].lines.map((l) => (l === "yang" ? "1" : "0")).join("");
}

/** 6爻パターン(下から上、陽=1 陰=0)→ 卦。例 "111111" = 乾為天 */
export const HEXAGRAMS: Record<string, Hexagram> = Object.fromEntries(
  TABLE.map(([number, name, reading, lower, upper]) => [
    trigramKey(lower) + trigramKey(upper),
    { number, name, reading, lower, upper },
  ]),
);

/** 序卦番号(1-64)から卦を引く */
export const HEXAGRAMS_BY_NUMBER: Record<number, Hexagram> = Object.fromEntries(
  Object.values(HEXAGRAMS).map((h) => [h.number, h]),
);

/** 序卦番号から6爻(下から上、yin/yang)を得る */
export function linesOfHexagram(number: number): ("yin" | "yang")[] | undefined {
  const hexagram = HEXAGRAMS_BY_NUMBER[number];
  if (!hexagram) return undefined;
  return [...TRIGRAMS[hexagram.lower].lines, ...TRIGRAMS[hexagram.upper].lines];
}

/** 老陽は陽、老陰は陰として6爻から卦を引く */
export function hexagramFromLines(lines: LineType[]): Hexagram | undefined {
  const key = lines
    .map((l) => (l === "yang" || l === "old-yang" ? "1" : "0"))
    .join("");
  return HEXAGRAMS[key];
}

export const LINE_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

/** 爻の正式名。陽爻=九、陰爻=六で「初九」「六二」…「上六」 */
export function lineName(lines: LineType[], index: number): string {
  const line = lines[index];
  const numeral = line === "yang" || line === "old-yang" ? "九" : "六";
  if (index === 0) return `初${numeral}`;
  if (index === 5) return `上${numeral}`;
  return `${numeral}${["", "二", "三", "四", "五"][index]}`;
}
