"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Grid3X3, LayoutGrid } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { TRIGRAMS } from "@/domain/iching/hexagrams";
import { hexagramFromTrigrams } from "@/domain/iching/hexagramDiscovery";
import HexagramGlyph from "./HexagramGlyph";

export type HexagramCardData = {
  number: number;
  name: string;
  reading: string;
  lower: number;
  upper: number;
  lines: ("yin" | "yang")[];
  keywords: string[];
};

type ViewMode = "list" | "matrix";

export default function HexagramIndex({ cards }: { cards: HexagramCardData[] }) {
  const [upper, setUpper] = useState(0);
  const [lower, setLower] = useState(0);
  const [view, setView] = useState<ViewMode>("list");
  const reducedMotion = useReducedMotion();
  const selected = hexagramFromTrigrams(upper, lower)!;
  const selectedCard = cards.find((card) => card.number === selected.number)!;

  const byPosition = useMemo(
    () => new Map(cards.map((card) => [`${card.upper}-${card.lower}`, card])),
    [cards],
  );

  return (
    <main className="hx-index">
      <header className="hx-index-header">
        <h1>易経・六十四卦辞典</h1>
        <p>上と下、二つの八卦からひらく。</p>
      </header>

      <section className="hx-builder" aria-labelledby="hexagram-builder-title">
        <div className="hx-builder-heading">
          <div>
            <h2 id="hexagram-builder-title">上下卦から探す</h2>
            <p>左右に送って、二つの卦を重ねる。</p>
          </div>
          <span>8 × 8</span>
        </div>

        <TrigramCarousel label="上卦" value={upper} onChange={setUpper} />
        <div className="hx-builder-divider" aria-hidden />
        <TrigramCarousel label="下卦" value={lower} onChange={setLower} />

        <motion.div
          key={selected.number}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <Link href={`/hexagrams/${selected.number}`} className="hx-builder-result">
            <span className="hx-builder-result-number">第{selected.number}卦</span>
            <HexagramGlyph lines={selectedCard.lines} size="md" />
            <span>
              <strong>{selected.name}</strong>
              <small>{selected.reading}</small>
            </span>
            <ChevronRight aria-hidden />
          </Link>
        </motion.div>
      </section>

      <section className="hx-all" aria-labelledby="all-hexagrams-title">
        <div className="hx-all-heading">
          <div>
            <h2 id="all-hexagrams-title">六十四卦一覧</h2>
            <span>64卦</span>
          </div>
          <div className="hx-view-switch" aria-label="表示方法">
            <button
              type="button"
              aria-label="カード一覧"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <LayoutGrid aria-hidden />
            </button>
            <button
              type="button"
              aria-label="八卦表"
              aria-pressed={view === "matrix"}
              onClick={() => setView("matrix")}
            >
              <Grid3X3 aria-hidden />
            </button>
          </div>
        </div>

        {view === "matrix" ? (
          <HexagramMatrix byPosition={byPosition} />
        ) : (
          <div className="hx-grid">
            {cards.map((card) => (
              <Link key={card.number} href={`/hexagrams/${card.number}`} className="hx-card">
                <span className="hx-card-number">第{card.number}卦</span>
                <HexagramGlyph lines={card.lines} size="md" />
                <span className="hx-card-name">{card.name}</span>
                <span className="hx-card-reading">{card.reading}</span>
                <span className="hx-card-keywords">{card.keywords.join("・")}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TrigramCarousel({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  function select(next: number) {
    const normalized = (next + TRIGRAMS.length) % TRIGRAMS.length;
    onChange(normalized);
    buttonRefs.current[normalized]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function selectNearest() {
    const rail = railRef.current;
    if (!rail) return;
    const center = rail.getBoundingClientRect().left + rail.clientWidth / 2;
    let closest = value;
    let distance = Number.POSITIVE_INFINITY;
    buttonRefs.current.forEach((button, index) => {
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
      if (nextDistance < distance) {
        closest = index;
        distance = nextDistance;
      }
    });
    if (closest !== value) onChange(closest);
  }

  return (
    <div className="hx-carousel">
      <div className="hx-carousel-label">
        <span>{label}</span>
        <strong>
          {TRIGRAMS[value].name}・{TRIGRAMS[value].nature}
        </strong>
      </div>
      <div className="hx-carousel-controls">
        <button type="button" aria-label={`前の${label}`} onClick={() => select(value - 1)}>
          <ChevronLeft aria-hidden />
        </button>
        <div
          ref={railRef}
          className="hx-carousel-rail"
          tabIndex={0}
          aria-label={`${label}を選ぶ`}
          onScroll={selectNearest}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") select(value - 1);
            if (event.key === "ArrowRight") select(value + 1);
          }}
        >
          {TRIGRAMS.map((trigram, index) => (
            <button
              key={trigram.name}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              className={value === index ? "is-selected" : ""}
              aria-pressed={value === index}
              onClick={() => select(index)}
            >
              <HexagramGlyph lines={trigram.lines} />
              <strong>{trigram.name}</strong>
              <small>{trigram.nature}</small>
            </button>
          ))}
        </div>
        <button type="button" aria-label={`次の${label}`} onClick={() => select(value + 1)}>
          <ChevronRight aria-hidden />
        </button>
      </div>
    </div>
  );
}

function HexagramMatrix({ byPosition }: { byPosition: Map<string, HexagramCardData> }) {
  return (
    <div className="hx-matrix-wrap">
      <div className="hx-matrix" role="grid" aria-label="八卦の組み合わせ表">
        <span className="hx-matrix-corner">下＼上</span>
        {TRIGRAMS.map((trigram) => (
          <span key={`head-${trigram.name}`} className="hx-matrix-head">
            {trigram.symbol}<small>{trigram.name}</small>
          </span>
        ))}
        {TRIGRAMS.map((rowTrigram, lower) => (
          <MatrixRow key={rowTrigram.name} lower={lower} byPosition={byPosition} />
        ))}
      </div>
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
      <span className="hx-matrix-head">
        {TRIGRAMS[lower].symbol}<small>{TRIGRAMS[lower].name}</small>
      </span>
      {TRIGRAMS.map((_, upper) => {
        const card = byPosition.get(`${upper}-${lower}`)!;
        return (
          <Link
            key={card.number}
            href={`/hexagrams/${card.number}`}
            className="hx-matrix-cell"
            aria-label={`第${card.number}卦 ${card.name}`}
          >
            <HexagramGlyph lines={card.lines} />
            <span>{card.number}</span>
          </Link>
        );
      })}
    </>
  );
}
