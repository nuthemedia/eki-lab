import { CARD_COPY } from "@/domain/iching/cardCopy";
import { CARD_QUESTIONS_BY_ID } from "@/domain/iching/cardQuestions";
import {
  HEXAGRAMS_BY_NUMBER,
  hexagramFromLines,
  linesOfHexagram,
} from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import type { LineType } from "@/domain/iching/types";
import { siteUrl } from "@/lib/seo";

/**
 * 卦カードの共有コード。"{qid}-{hex}-{line}" 形式で
 * URL(/card/r/{code})とカード画像 API の両方が同じコードを解く。
 * qid: cardQuestions の id / hex: 序卦番号 1-64 / line: 変爻位置 0-5。
 */
export type CardCode = {
  qid: number;
  hex: number;
  line: number;
};

export type CardContent = {
  code: string;
  question: string;
  questionCategory: string;
  hexNumber: number;
  hexName: string;
  hexReading: string;
  /** 六爻。下から上。変爻は old-* でマーク済み */
  lines: LineType[];
  keyword: string;
  message: string;
  /** 変爻の爻辞(現代語訳)。hexagramTexts から引く */
  changingHint: string;
  changingLineIndex: number;
  relatingName?: string;
};

export const CARD_TAGLINE = "いまの自分に、卦を一枚";

export function encodeCardCode({ qid, hex, line }: CardCode): string {
  return `${qid}-${hex}-${line}`;
}

/** 共有コードを検証つきで解く。不正なら null */
export function decodeCardCode(raw: string): CardCode | null {
  const match = /^(\d{1,4})-(\d{1,2})-(\d)$/.exec(raw);
  if (!match) return null;
  const qid = Number(match[1]);
  const hex = Number(match[2]);
  const line = Number(match[3]);
  if (!CARD_QUESTIONS_BY_ID[qid]) return null;
  if (!HEXAGRAMS_BY_NUMBER[hex]) return null;
  if (line < 0 || line > 5) return null;
  return { qid, hex, line };
}

/** カードの表示内容を組み立てる。画面・OG・9:16 画像で共用 */
export function buildCardContent(code: CardCode): CardContent {
  const question = CARD_QUESTIONS_BY_ID[code.qid];
  const hexagram = HEXAGRAMS_BY_NUMBER[code.hex];
  const copy = CARD_COPY[code.hex];
  const text = HEXAGRAM_TEXTS[code.hex];
  const base = linesOfHexagram(code.hex) ?? [];
  const lines: LineType[] = base.map((line, i) =>
    i === code.line ? (line === "yang" ? "old-yang" : "old-yin") : line,
  );
  const relatingLines = base.map((line, i) =>
    i === code.line
      ? line === "yang"
        ? ("yin" as const)
        : ("yang" as const)
      : line,
  );
  return {
    code: encodeCardCode(code),
    question: question.text,
    questionCategory: question.category,
    hexNumber: hexagram.number,
    hexName: hexagram.name,
    hexReading: hexagram.reading,
    lines,
    keyword: copy.keyword,
    message: copy.message,
    changingHint: text.lines[code.line]?.modern ?? "",
    changingLineIndex: code.line,
    relatingName: hexagramFromLines(relatingLines)?.name,
  };
}

/** 共有ランディングの絶対 URL */
export function buildShareUrl(code: string): string {
  return `${siteUrl}/card/r/${code}`;
}

/** X(Twitter) の共有 intent URL */
export function buildXShareUrl(content: CardContent): string {
  const text = `「${content.question}」に、${content.hexName}(${content.hexReading})の一枚。\n#易のかたち #いまの自分に卦を一枚`;
  return `https://twitter.com/intent/tweet?${new URLSearchParams({
    text,
    url: buildShareUrl(content.code),
  })}`;
}

/** 9:16 カード画像 API の URL(相対) */
export function buildCardImageUrl(code: string): string {
  return `/api/iching/card-image?code=${encodeURIComponent(code)}`;
}
