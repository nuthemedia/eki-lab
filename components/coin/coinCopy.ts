import type { CoinCategory, CoinLocale } from "@/lib/coinInterpretation";

const CATEGORY_LABELS: Record<CoinLocale, Record<CoinCategory, string>> = {
  ja: { general: "総合", work: "仕事", love: "恋愛", relationships: "人間関係" },
  en: { general: "Overall", work: "Work", love: "Love", relationships: "Relationships" },
};

export const COIN_CATEGORIES: CoinCategory[] = ["general", "work", "love", "relationships"];

export function categoryLabel(category: CoinCategory, locale: CoinLocale): string {
  return CATEGORY_LABELS[locale][category];
}

export const COIN_COPY = {
  ja: {
    title: "コイン易占い", tagline: "問いを立て、コインを投げ、卦を読む。",
    soundOn: "音を出す", soundOff: "音を消す", soundVisibleOn: "音", soundVisibleOff: "音×",
    questionLabel: "いま問いたいことを書いてください", questionPlaceholder: "例：この仕事を進める上で、今注意すべきことは？",
    questionHelp: "問いをより具体的にしてみましょう（占的をしぼる）", questionRequired: "問いを入力すると始められます。",
    categoryAria: "質問カテゴリ", start: "占いをはじめる", returnToCast: "起卦に戻る", discardCast: "途中の起卦を破棄して最初から",
    resume: (count: number) => `途中の起卦があります（${count}投目まで）`, resumeButton: "続きから", fromStart: "最初から",
    throwCount: (count: number) => `${count}投目 / 6`, backQuestion: "問いに戻る", manual: "コインの結果を入力", auto: "コインが手元にない人はこちら", methodAria: "起卦方法",
    positions: ["一番下", "二爻目", "三爻目", "四爻目", "五爻目", "一番上"], makeLine: (position: string) => `${position}の爻を作ります`,
    manualHelp: "手元のコインを三枚投げて、出た表裏を入力してください。", autoHelp: "アプリ内で三枚のコインを投げます。",
    heads: "表", tails: "裏", coinSum: (heads: number, value: number, line: string) => `表${heads}枚 = ${value} = ${line}`,
    direction: "上\n↑\n下から積む\n↓\n下", place: "この結果で置く", undo: "直前の一投を戻す", rolling: "投げています…", roll: "コインを投げる",
    result: "結果", readFromHexagram: "卦から読む", backResult: "結果に戻る", backStart: "はじめに戻る", yourQuestion: "あなたの問い",
    primary: "本卦", relating: "之卦", noChanging: "変爻なし", noRelating: "之卦なし", allChanging: "六爻すべてが変化",
    changingCount: (count: number, labels: string) => `変爻${count}本（${labels}）`, changingLabels: (labels: string) => `変爻　${labels}`,
    aiRead: "AIと読む", aiReading: "読み合わせています…", aiPrivacy: "押したときだけ、問いと卦の結果をAIへ送ります。",
    summaryPrimary: "本卦", summaryChanging: "変爻", summaryRelating: "之卦", contentsAria: "詳細の目次", judgment: "卦辞", changingLines: "変爻", hints: "卦から読む",
    sourceNote: "64卦辞典をもとにした読みです。", overview: "卦の概要", modernJudgment: "卦辞の現代語訳", changingLineText: "変爻の爻辞", modernLineText: "爻辞の現代語訳", relatingMeaning: "之卦の意味", keywords: "キーワード",
    categoryView: (category: string) => `${category}の視点`, askYourself: "自分に問い返す", caution: "注意点",
    cautionText: "易は未来を固定するものではなく、今の状況を見るための手がかりです。大きな決断は、現実の情報や信頼できる人への相談も合わせて考えてください。",
    aiResult: "AIと読んだ結果", fallback: "AIに接続できなかったため、卦のデータから補助読みを表示しています。",
    aiLabels: ["問いへの読み", "変化しているポイント", "注意点", "取れる行動", "自分で考えるための問い"], again: "もう一度占う",
    aiLoading: ["卦と問いを重ねています", "変爻を確かめています", "言葉を整えています"], aiLoadingHelp: "問いと卦を重ねて、短い言葉に整えています。",
    aiError: "AIと読んだ結果を用意できませんでした。時間をおいてお試しください。", support: "易アプリの開発を応援する", supportLink: "Ko-fiで応援する",
    hexAria: "卦。下から上に積みます", changingMark: "変", languageAria: "表示言語", footerAria: "AWAI Commons トップへ",
  },
  en: {
    title: "I Ching Coin Reading", tagline: "Ask a question. Toss three coins six times. Build the hexagram from the bottom up.",
    soundOn: "Turn sound on", soundOff: "Mute sound", soundVisibleOn: "Sound", soundVisibleOff: "Muted",
    questionLabel: "What would you like to understand?", questionPlaceholder: "For example: What should I understand about moving this project forward?",
    questionHelp: "Open questions about a situation or your next step tend to be more useful than yes-or-no questions.", questionRequired: "Enter a question to begin.",
    categoryAria: "Question category", start: "Begin the reading", returnToCast: "Return to casting", discardCast: "Discard this reading and start over",
    resume: (count: number) => `You have an unfinished reading (${count} of 6 tosses)`, resumeButton: "Continue", fromStart: "Start over",
    throwCount: (count: number) => `Toss ${count} of 6`, backQuestion: "Back to question", manual: "Enter your coin toss", auto: "Toss coins in the app", methodAria: "Casting method",
    positions: ["bottom", "second", "third", "fourth", "fifth", "top"], makeLine: (position: string) => `Build the ${position} line`,
    manualHelp: "Toss three coins and enter the heads and tails you see. Heads = 3; tails = 2.", autoHelp: "The app will toss three coins. Values 6 and 9 create Changing Lines.",
    heads: "Heads", tails: "Tails", coinSum: (heads: number, value: number, line: string) => `${heads} heads = ${value} · ${line}`,
    direction: "Top\n↑\nBuild upward\n↑\nBottom", place: "Place this line", undo: "Undo the previous toss", rolling: "Tossing…", roll: "Toss the coins",
    result: "Result", readFromHexagram: "Explore the hexagram", backResult: "Back to result", backStart: "Start over", yourQuestion: "Your question",
    primary: "Primary Hexagram", relating: "Relating Hexagram", noChanging: "No Changing Lines", noRelating: "No Relating Hexagram", allChanging: "All six lines are changing",
    changingCount: (count: number, labels: string) => `${count} Changing Lines (${labels})`, changingLabels: (labels: string) => `Changing Lines: ${labels}`,
    aiRead: "Reflect with AI", aiReading: "Reading…", aiPrivacy: "Your question and hexagram are sent to AI only when you press this button.",
    summaryPrimary: "Primary", summaryChanging: "Changing Lines", summaryRelating: "Relating", contentsAria: "Reading contents", judgment: "The Judgment", changingLines: "Changing Lines", hints: "Reflection",
    sourceNote: "Modern English wording prepared for eki-lab from the Zhouyi source text and checked against James Legge's public-domain translation.", overview: "About this hexagram", modernJudgment: "Modern English", changingLineText: "Changing Line Text", modernLineText: "Modern English", relatingMeaning: "Meaning of the Relating Hexagram", keywords: "Keywords",
    categoryView: (category: string) => `${category} perspective`, askYourself: "Questions for reflection", caution: "A note on using the reading",
    cautionText: "The I Ching does not fix the future. Use it as a prompt for seeing the present situation more clearly, alongside reliable information and trusted advice for major decisions.",
    aiResult: "AI reflection", fallback: "AI was unavailable, so this reflection was assembled from the fixed hexagram data.",
    aiLabels: ["Reading your question", "What is changing", "A caution", "Possible actions", "A question to consider"], again: "Begin another reading",
    aiLoading: ["Bringing the question and hexagram together", "Reviewing the Changing Lines", "Shaping the reflection"], aiLoadingHelp: "The AI is grounding a short reflection in the fixed hexagram text.",
    aiError: "The AI reflection could not be prepared. Please try again later.", support: "Support the I Ching apps", supportLink: "Support on Ko-fi",
    hexAria: "Hexagram built from the bottom line upward", changingMark: "Change", languageAria: "Display language", footerAria: "AWAI Commons home",
  },
} as const;
