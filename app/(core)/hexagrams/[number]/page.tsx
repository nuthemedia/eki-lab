import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteName, siteUrl } from "@/lib/seo";
import {
  HEXAGRAMS_BY_NUMBER,
  TRIGRAMS,
  lineName,
  linesOfHexagram,
} from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import { relationsOf } from "@/domain/iching/relations";
import HexagramGlyph from "@/components/core/HexagramGlyph";

type HexagramPageProps = {
  params: Promise<{ number: string }>;
};

function parseHexagramNumber(raw: string): number | undefined {
  if (!/^\d+$/.test(raw)) return undefined;
  const n = Number.parseInt(raw, 10);
  return n >= 1 && n <= 64 ? n : undefined;
}

export function generateStaticParams() {
  return Array.from({ length: 64 }, (_, i) => ({ number: String(i + 1) }));
}

export async function generateMetadata({ params }: HexagramPageProps): Promise<Metadata> {
  const { number: raw } = await params;
  const n = parseHexagramNumber(raw);
  if (!n) {
    return { title: "卦が見つかりません | 易のかたち" };
  }
  const hexagram = HEXAGRAMS_BY_NUMBER[n];
  const entry = HEXAGRAM_DICTIONARY[n];
  const title = `第${n}卦 ${hexagram.name}(${hexagram.reading})― 64卦AI辞典 | 易のかたち`;
  const description = `${entry.essence}。${entry.keywords.join("・")}。卦辞・爻辞と現代語の解説、互卦・之卦・錯卦・綜卦のつながり。`;
  return {
    title,
    description,
    alternates: {
      canonical: `/hexagrams/${n}`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/hexagrams/${n}`,
      siteName,
      locale: "ja_JP",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

const RELATION_DESCRIPTIONS = {
  nuclear: "六爻の内側に潜む卦",
  inverted: "全爻を裏返した卦",
  reversed: "上下を逆さにした卦",
} as const;

export default async function HexagramPage({ params }: HexagramPageProps) {
  const { number: raw } = await params;
  const n = parseHexagramNumber(raw);
  if (!n) notFound();

  const hexagram = HEXAGRAMS_BY_NUMBER[n];
  const lines = linesOfHexagram(n)!;
  const text = HEXAGRAM_TEXTS[n];
  const entry = HEXAGRAM_DICTIONARY[n];
  const relations = relationsOf(n);
  const lowerTrigram = TRIGRAMS[hexagram.lower];
  const upperTrigram = TRIGRAMS[hexagram.upper];
  const prev = n > 1 ? HEXAGRAMS_BY_NUMBER[n - 1] : undefined;
  const next = n < 64 ? HEXAGRAMS_BY_NUMBER[n + 1] : undefined;

  const relationCards = [
    { kind: "互卦", hexagram: relations.nuclear, isSelf: relations.isSelfNuclear, desc: RELATION_DESCRIPTIONS.nuclear },
    { kind: "錯卦", hexagram: relations.inverted, isSelf: false, desc: RELATION_DESCRIPTIONS.inverted },
    { kind: "綜卦", hexagram: relations.reversed, isSelf: relations.isSelfReversed, desc: RELATION_DESCRIPTIONS.reversed },
  ];

  return (
    <div className="ik-dict-detail">
      <div className="ik-dict-breadcrumb">
        <Link href="/hexagrams" className="ik-link-quiet">
          ← 64卦一覧
        </Link>
        <span className="ik-eyebrow">HEXAGRAM {n}</span>
      </div>

      <section className="ik-dict-hero">
        <span className="ik-dict-card-number">第{n}卦</span>
        <HexagramGlyph lines={lines} size="lg" />
        <h1 className="ik-dict-hero-name">{hexagram.name}</h1>
        <span className="ik-dict-hero-reading">{hexagram.reading}</span>
        <div className="ik-dict-hero-trigrams">
          <span>
            上卦 {upperTrigram.symbol} {upperTrigram.name}({upperTrigram.nature})
          </span>
          <span>
            下卦 {lowerTrigram.symbol} {lowerTrigram.name}({lowerTrigram.nature})
          </span>
        </div>
        <span className="ik-dict-hero-keywords">{entry.keywords.join("・")}</span>
        <p className="ik-dict-hero-essence">{entry.essence}</p>
      </section>

      <section className="ik-dict-section">
        <h2 className="ik-dict-section-title">卦辞</h2>
        <div className="ik-text-block">
          <p className="ik-text-original">{text.judgment.original}</p>
          <p className="ik-text-modern">{text.judgment.modern}</p>
        </div>
      </section>

      {(entry.trigramSymbolism || entry.classical || entry.modern || entry.guidance) && (
        <section className="ik-dict-section">
          <h2 className="ik-dict-section-title">解説</h2>
          {entry.trigramSymbolism && (
            <div className="ik-text-block">
              <span className="ik-text-label">象</span>
              <p className="ik-dict-prose">{entry.trigramSymbolism}</p>
            </div>
          )}
          {entry.classical && (
            <div className="ik-text-block">
              <span className="ik-text-label">古典の意味</span>
              <p className="ik-dict-prose">{entry.classical}</p>
            </div>
          )}
          {entry.modern && (
            <div className="ik-text-block">
              <span className="ik-text-label">いまの意味</span>
              <p className="ik-dict-prose">{entry.modern}</p>
            </div>
          )}
          {entry.guidance && (
            <div className="ik-dict-guidance">
              {entry.guidance.map((g) => (
                <div key={g.scene} className="ik-dict-guidance-item">
                  <span className="ik-dict-guidance-scene">{g.scene}</span>
                  <p className="ik-dict-guidance-text">{g.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="ik-dict-section">
        <h2 className="ik-dict-section-title">六爻</h2>
        <div className="ik-dict-lines">
          {lines.map((_, i) => {
            const changed = relations.changed[i];
            return (
              <details key={i} className="ik-dict-line">
                <summary>
                  <span className="ik-dict-line-name">{lineName(lines, i)}</span>
                  <span className="ik-dict-line-preview">{text.lines[i].original}</span>
                </summary>
                <div className="ik-dict-line-body">
                  <p className="ik-text-original">{text.lines[i].original}</p>
                  <p className="ik-text-modern">{text.lines[i].modern}</p>
                  <Link
                    href={`/hexagrams/${changed.number}`}
                    className="ik-dict-line-change"
                  >
                    この爻が動くと
                    <span className="ik-dict-line-change-arrow">→</span>
                    <HexagramGlyph lines={linesOfHexagram(changed.number)!} />
                    {changed.name}
                  </Link>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="ik-dict-section">
        <h2 className="ik-dict-section-title">卦のつながり</h2>
        <div className="ik-dict-relations">
          {relationCards.map((r) =>
            r.isSelf ? (
              <div key={r.kind} className="ik-dict-relation-card">
                <span className="ik-dict-relation-kind">{r.kind}</span>
                <HexagramGlyph lines={linesOfHexagram(r.hexagram.number)!} />
                <span className="ik-dict-relation-name">この卦自身</span>
                <span className="ik-dict-relation-desc">
                  {r.kind === "互卦" ? "内に畳んでも同じ形" : "上下を返しても同じ形"}
                </span>
              </div>
            ) : (
              <Link
                key={r.kind}
                href={`/hexagrams/${r.hexagram.number}`}
                className="ik-dict-relation-card"
              >
                <span className="ik-dict-relation-kind">{r.kind}</span>
                <HexagramGlyph lines={linesOfHexagram(r.hexagram.number)!} />
                <span className="ik-dict-relation-name">{r.hexagram.name}</span>
                <span className="ik-dict-relation-desc">{r.desc}</span>
              </Link>
            ),
          )}
        </div>
      </section>

      <nav className="ik-dict-seq-nav" aria-label="序卦の前後">
        {prev && (
          <Link href={`/hexagrams/${prev.number}`} className="ik-dict-seq-link">
            <span className="ik-dict-seq-dir">← 第{prev.number}卦</span>
            <span className="ik-dict-seq-name">{prev.name}</span>
          </Link>
        )}
        {next && (
          <Link
            href={`/hexagrams/${next.number}`}
            className="ik-dict-seq-link ik-dict-seq-link--next"
          >
            <span className="ik-dict-seq-dir">第{next.number}卦 →</span>
            <span className="ik-dict-seq-name">{next.name}</span>
          </Link>
        )}
      </nav>

      <div className="ik-dict-cta">
        <Link href="/ask" className="ik-btn ik-btn--primary">
          問いを立てて占う
        </Link>
        <div className="ik-dict-cta-links">
          <Link href="/formal" className="ik-link-quiet">
            本格モード
          </Link>
          <Link href="/dice" className="ik-link-quiet">
            サイコロモード
          </Link>
        </div>
      </div>
    </div>
  );
}
