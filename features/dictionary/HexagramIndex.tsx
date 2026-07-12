"use client";

import { useState } from "react";
import Link from "next/link";
import { TRIGRAMS } from "@/domain/iching/hexagrams";
import HexagramGlyph from "@/components/core/HexagramGlyph";

export type HexagramCardData = {
  number: number;
  name: string;
  reading: string;
  lower: number;
  upper: number;
  lines: ("yin" | "yang")[];
  keywords: string[];
};

type HexagramIndexProps = {
  cards: HexagramCardData[];
};

export default function HexagramIndex({ cards }: HexagramIndexProps) {
  const [query, setQuery] = useState("");
  const [upperFilter, setUpperFilter] = useState<number | null>(null);
  const [lowerFilter, setLowerFilter] = useState<number | null>(null);
  const [matrixView, setMatrixView] = useState(false);

  const trimmed = query.trim();
  const filtered = cards.filter((card) => {
    if (upperFilter !== null && card.upper !== upperFilter) return false;
    if (lowerFilter !== null && card.lower !== lowerFilter) return false;
    if (trimmed === "") return true;
    return (
      card.name.includes(trimmed) ||
      card.reading.includes(trimmed) ||
      card.keywords.some((k) => k.includes(trimmed)) ||
      String(card.number) === trimmed
    );
  });

  const byPosition = new Map(cards.map((c) => [`${c.upper}-${c.lower}`, c]));

  return (
    <div>
      <header className="ik-dict-header">
        <div className="ik-dict-breadcrumb">
          <h1 className="ik-dict-title">64卦AI辞典</h1>
          <Link href="/" className="ik-link-quiet">
            易のかたちへ
          </Link>
        </div>
        <div className="ik-dict-toolbar">
          <input
            type="search"
            className="ik-dict-search"
            placeholder="卦名・読み・キーワード"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="卦を検索"
          />
          <button
            type="button"
            className="ik-dict-view-toggle"
            onClick={() => setMatrixView((v) => !v)}
          >
            {matrixView ? "一覧" : "八卦表"}
          </button>
        </div>
        {!matrixView && (
          <div className="ik-dict-filters">
            <div className="ik-dict-filter-row">
              <span className="ik-dict-filter-label">上卦</span>
              {TRIGRAMS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={`ik-dict-chip${upperFilter === i ? " ik-dict-chip--active" : ""}`}
                  onClick={() => setUpperFilter(upperFilter === i ? null : i)}
                >
                  {t.symbol} {t.nature}
                </button>
              ))}
            </div>
            <div className="ik-dict-filter-row">
              <span className="ik-dict-filter-label">下卦</span>
              {TRIGRAMS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={`ik-dict-chip${lowerFilter === i ? " ik-dict-chip--active" : ""}`}
                  onClick={() => setLowerFilter(lowerFilter === i ? null : i)}
                >
                  {t.symbol} {t.nature}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {matrixView ? (
        <div className="ik-dict-matrix" role="grid" aria-label="八卦の組み合わせ表(上=上卦、左=下卦)">
          <span className="ik-dict-matrix-corner">
            上卦→
            <br />
            下卦↓
          </span>
          {TRIGRAMS.map((t) => (
            <span key={`head-${t.name}`} className="ik-dict-matrix-head">
              {t.symbol}
              <small>{t.nature}</small>
            </span>
          ))}
          {TRIGRAMS.map((rowT, lower) => (
            <MatrixRow key={`row-${rowT.name}`} lower={lower} byPosition={byPosition} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="ik-dict-empty">該当する卦がありません</p>
      ) : (
        <div className="ik-dict-grid">
          {filtered.map((card) => (
            <Link key={card.number} href={`/hexagrams/${card.number}`} className="ik-dict-card">
              <span className="ik-dict-card-number">第{card.number}卦</span>
              <HexagramGlyph lines={card.lines} />
              <span className="ik-dict-card-name">{card.name}</span>
              <span className="ik-dict-card-reading">{card.reading}</span>
              <span className="ik-dict-card-keywords">{card.keywords.join("・")}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MatrixRow({
  lower,
  byPosition,
}: {
  lower: number;
  byPosition: Map<string, HexagramCardData>;
}) {
  return (
    <>
      <span className="ik-dict-matrix-head">
        {TRIGRAMS[lower].symbol}
        <small>{TRIGRAMS[lower].nature}</small>
      </span>
      {TRIGRAMS.map((_, upper) => {
        const card = byPosition.get(`${upper}-${lower}`)!;
        return (
          <Link
            key={`${upper}-${lower}`}
            href={`/hexagrams/${card.number}`}
            className="ik-dict-matrix-cell"
            aria-label={`第${card.number}卦 ${card.name}`}
            title={card.name}
          >
            <HexagramGlyph lines={card.lines} />
          </Link>
        );
      })}
    </>
  );
}
