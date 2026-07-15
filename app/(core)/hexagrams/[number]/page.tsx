import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteName, siteUrl } from "@/lib/seo";
import {
  HEXAGRAMS_BY_NUMBER,
  lineName,
  linesOfHexagram,
} from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import { relationsOf } from "@/domain/iching/relations";
import HexagramDetail, {
  type HexagramDetailData,
} from "@/components/hexagrams/HexagramDetail";

type HexagramPageProps = { params: Promise<{ number: string }> };

function parseHexagramNumber(raw: string): number | undefined {
  if (!/^\d+$/.test(raw)) return undefined;
  const number = Number.parseInt(raw, 10);
  return number >= 1 && number <= 64 ? number : undefined;
}

export function generateStaticParams() {
  return Array.from({ length: 64 }, (_, index) => ({ number: String(index + 1) }));
}

export async function generateMetadata({ params }: HexagramPageProps): Promise<Metadata> {
  const { number: raw } = await params;
  const number = parseHexagramNumber(raw);
  if (!number) return { title: "卦が見つかりません" };
  const hexagram = HEXAGRAMS_BY_NUMBER[number];
  const entry = HEXAGRAM_DICTIONARY[number];
  const title = `第${number}卦 ${hexagram.name}（${hexagram.reading}）｜易経・六十四卦辞典`;
  const description = `${entry.essence}。${entry.keywords.join("・")}。卦辞・爻辞と現代語の解説、関係する卦を紹介します。`;
  return {
    title,
    description,
    alternates: { canonical: `/hexagrams/${number}` },
    openGraph: { title, description, url: `${siteUrl}/hexagrams/${number}`, siteName, locale: "ja_JP", type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function HexagramPage({ params }: HexagramPageProps) {
  const { number: raw } = await params;
  const number = parseHexagramNumber(raw);
  if (!number) notFound();

  const hexagram = HEXAGRAMS_BY_NUMBER[number];
  const lines = linesOfHexagram(number)!;
  const text = HEXAGRAM_TEXTS[number];
  const entry = HEXAGRAM_DICTIONARY[number];
  const relationData = relationsOf(number);

  const relationSource = [
    { kind: "互卦", hexagram: relationData.nuclear, isSelf: relationData.isSelfNuclear, description: relationData.isSelfNuclear ? "内に畳んでも同じ形" : "六爻の内側に潜む卦" },
    { kind: "錯卦", hexagram: relationData.inverted, isSelf: false, description: "すべての爻を反転した卦" },
    { kind: "綜卦", hexagram: relationData.reversed, isSelf: relationData.isSelfReversed, description: relationData.isSelfReversed ? "上下を返しても同じ形" : "上下を逆さにした卦" },
  ];

  const data: HexagramDetailData = {
    number,
    name: hexagram.name,
    reading: hexagram.reading,
    lines,
    keywords: entry.keywords,
    essence: entry.essence,
    upper: hexagram.upper,
    lower: hexagram.lower,
    judgment: text.judgment,
    explanations: [
      { label: "象", text: entry.trigramSymbolism },
      { label: "古典の意味", text: entry.classical },
      { label: "いまの意味", text: entry.modern },
    ],
    guidance: entry.guidance,
    lineEntries: lines.map((_, index) => {
      const changed = relationData.changed[index];
      return {
        label: lineName(lines, index),
        original: text.lines[index].original,
        modern: text.lines[index].modern,
        changed: { number: changed.number, name: changed.name, lines: linesOfHexagram(changed.number)! },
      };
    }),
    relations: relationSource.map((relation) => ({
      kind: relation.kind,
      isSelf: relation.isSelf,
      name: relation.hexagram.name,
      number: relation.hexagram.number,
      lines: linesOfHexagram(relation.hexagram.number)!,
      description: relation.description,
    })),
    previous: number > 1 ? HEXAGRAMS_BY_NUMBER[number - 1] : undefined,
    next: number < 64 ? HEXAGRAMS_BY_NUMBER[number + 1] : undefined,
  };

  return <HexagramDetail data={data} />;
}
