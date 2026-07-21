export type KotobaSlug =
  | "yin-yang"
  | "sheng-sheng"
  | "change-opens"
  | "sun-moon"
  | "sign-and-form";

export type KotobaVisual = KotobaSlug;

export type KotobaSoundProfile =
  | "exchange"
  | "generation"
  | "release"
  | "orbit"
  | "formation";

export type KotobaTheme = {
  primary: string;
  secondary: string;
  glow: string;
};

export type KotobaPassage = {
  slug: KotobaSlug;
  order: number;
  menuTitle: string;
  original: string;
  kundoku: string;
  translation: string;
  commentary: string;
  source: "『易経』繋辞上伝" | "『易経』繋辞下伝";
  sourceUrl: string;
  visual: KotobaVisual;
  soundProfile: KotobaSoundProfile;
  theme: KotobaTheme;
  instruction: string;
};

export const KOTOBA_PASSAGES: readonly KotobaPassage[] = [
  {
    slug: "yin-yang",
    order: 1,
    menuTitle: "陰陽の道",
    original: "一陰一陽之謂道",
    kundoku: "一陰一陽、これを道と謂う。",
    translation: "陰と陽が交互に働き続けること、それが世界の道理である。",
    commentary:
      "陰と陽は、どちらか一方だけで成り立つものではありません。互いに退き、現れ、支え合う動きそのものを、易は「道」と捉えます。",
    source: "『易経』繋辞上伝",
    sourceUrl: "https://ctext.org/book-of-changes/xi-ci-shang",
    visual: "yin-yang",
    soundProfile: "exchange",
    theme: { primary: "#a8d8ff", secondary: "#e7af70", glow: "#6d91ad" },
    instruction: "左右に触れて、二つの流れを動かす",
  },
  {
    slug: "sheng-sheng",
    order: 2,
    menuTitle: "生生の易",
    original: "生生之謂易",
    kundoku: "生生、これを易と謂う。",
    translation: "生まれてはまた生まれ、変化し続けることを「易」という。",
    commentary:
      "易は、完成した状態の名前ではありません。一つの生成が次の生成を呼び、世界が絶えず新しくなり続ける、その働きを表します。",
    source: "『易経』繋辞上伝",
    sourceUrl: "https://ctext.org/book-of-changes/xi-ci-shang",
    visual: "sheng-sheng",
    soundProfile: "generation",
    theme: { primary: "#70d8c7", secondary: "#c5f4e8", glow: "#3f9f93" },
    instruction: "触れて、次の生成を生む",
  },
  {
    slug: "change-opens",
    order: 3,
    menuTitle: "窮すれば変ず",
    original: "窮則變、變則通、通則久",
    kundoku: "窮すれば則ち変じ、変ずれば則ち通じ、通ずれば則ち久し。",
    translation: "行き詰まれば変化が起こり、変われば道が開け、通じれば長く続く。",
    commentary:
      "行き止まりは終わりではなく、変化が必要になった徴です。形を変えることで流れが生まれ、その流れが持続を可能にします。",
    source: "『易経』繋辞下伝",
    sourceUrl: "https://ctext.org/book-of-changes/xi-ci-xia",
    visual: "change-opens",
    soundProfile: "release",
    theme: { primary: "#e98267", secondary: "#63cceb", glow: "#96584d" },
    instruction: "押し続けて、流れの変化を見届ける",
  },
  {
    slug: "sun-moon",
    order: 4,
    menuTitle: "日月の往来",
    original: "日往則月來、月往則日來",
    kundoku: "日往けば則ち月来たり、月往けば則ち日来たる。",
    translation: "太陽が去れば月が来て、月が去れば太陽が来る。",
    commentary:
      "明るさは、一方がとどまり続けることでなく、日と月が互いに退き、進むことで生まれます。易はこの交替のリズムに変化の法則を見ます。",
    source: "『易経』繋辞下伝",
    sourceUrl: "https://ctext.org/book-of-changes/xi-ci-xia",
    visual: "sun-moon",
    soundProfile: "orbit",
    theme: { primary: "#e7a45e", secondary: "#cfe7ff", glow: "#6c7890" },
    instruction: "円をなぞって、往き来のリズムを動かす",
  },
  {
    slug: "sign-and-form",
    order: 5,
    menuTitle: "天の象・地の形",
    original: "在天成象、在地成形、變化見矣",
    kundoku: "天に在りては象を成し、地に在りては形を成して、変化見（あら）わる。",
    translation: "天では兆しとして現れ、地ではかたちとなり、その間に変化が見えてくる。",
    commentary:
      "「象」は、まだ形になる前の兆しやパターンです。それが地上で具体的な「形」になる過程に、変化が姿を現します。",
    source: "『易経』繋辞上伝",
    sourceUrl: "https://ctext.org/book-of-changes/xi-ci-shang",
    visual: "sign-and-form",
    soundProfile: "formation",
    theme: { primary: "#b693ff", secondary: "#98a66a", glow: "#765ea9" },
    instruction: "上から下へ、象が形になる過程を動かす",
  },
] as const;

export function getKotobaPassage(slug: string): KotobaPassage | undefined {
  return KOTOBA_PASSAGES.find((passage) => passage.slug === slug);
}

export function getAdjacentPassages(slug: KotobaSlug) {
  const index = KOTOBA_PASSAGES.findIndex((passage) => passage.slug === slug);
  if (index < 0) return { previous: undefined, next: undefined };
  return {
    previous: KOTOBA_PASSAGES[index - 1],
    next: KOTOBA_PASSAGES[index + 1],
  };
}
