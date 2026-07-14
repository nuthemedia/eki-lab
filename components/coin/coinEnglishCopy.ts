import { categoryLabelEn, type CoinCategoryEn, type CoinLocaleEn } from "@/lib/coinInterpretationEnglish";

export const COIN_CATEGORIES: CoinCategoryEn[] = ["general", "work", "love", "relationships"];

export function categoryLabel(category: CoinCategoryEn, locale: CoinLocaleEn): string {
  void locale;
  return categoryLabelEn(category);
}

export const COIN_COPY = {
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
    hexAria: "Hexagram built from the bottom line upward", changingMark: "Change", footerAria: "AWAI Commons home",
  },
} as const;
