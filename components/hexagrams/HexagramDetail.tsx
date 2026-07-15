"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import HexagramGlyph from "./HexagramGlyph";

type Lines = ("yin" | "yang")[];
type DetailTab = "overview" | "judgment" | "lines" | "relations";

export type HexagramDetailData = {
  number: number;
  name: string;
  reading: string;
  lines: Lines;
  keywords: string[];
  essence: string;
  upper: number;
  lower: number;
  judgment: { original: string; modern: string };
  explanations: { label: string; text: string }[];
  guidance?: { scene: string; text: string }[];
  lineEntries: {
    label: string;
    original: string;
    modern: string;
    changed: { number: number; name: string; lines: Lines };
  }[];
  relations: {
    kind: string;
    isSelf: boolean;
    name: string;
    number: number;
    lines: Lines;
    description: string;
  }[];
  previous?: { number: number; name: string };
  next?: { number: number; name: string };
};

const TABS: { id: DetailTab; label: string }[] = [
  { id: "overview", label: "概要" },
  { id: "judgment", label: "卦辞" },
  { id: "lines", label: "六爻" },
  { id: "relations", label: "つながり" },
];

export default function HexagramDetail({ data }: { data: HexagramDetailData }) {
  const [tab, setTab] = useState<DetailTab>("overview");
  const [openTrigram, setOpenTrigram] = useState<number | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const closeTrigram = useCallback(() => setOpenTrigram(null), []);

  function changeTab(next: DetailTab) {
    setTab(next);
    const top = tabListRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 76) {
      window.scrollTo({
        top: window.scrollY + top - 76,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }

  return (
    <main className="hx-detail">
      <Link href="/hexagrams" className="hx-back-link">
        <ChevronLeft aria-hidden /> 六十四卦一覧
      </Link>

      <header className="hx-detail-hero">
        <div className="hx-detail-symbol">
          <span>第{data.number}卦</span>
          <HexagramGlyph lines={data.lines} size="lg" />
        </div>
        <div className="hx-detail-title">
          <h1>{data.name}</h1>
          <p className="hx-detail-reading">{data.reading}</p>
          <p className="hx-detail-keywords">{data.keywords.join("・")}</p>
          <p className="hx-detail-essence">{data.essence}</p>
        </div>
        <div className="hx-detail-trigrams">
          <TrigramButton label="上卦" trigramId={data.upper} onClick={() => setOpenTrigram(data.upper)} />
          <TrigramButton label="下卦" trigramId={data.lower} onClick={() => setOpenTrigram(data.lower)} />
        </div>
      </header>

      <div ref={tabListRef} className="hx-detail-tabs" role="tablist" aria-label="卦の内容">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            aria-controls={`hx-panel-${item.id}`}
            onClick={() => changeTab(item.id)}
          >
            {item.label}
            {tab === item.id && <motion.span layoutId="hx-active-tab" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={tab}
          id={`hx-panel-${tab}`}
          role="tabpanel"
          className="hx-tab-panel"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        >
          {tab === "overview" && <OverviewPanel data={data} />}
          {tab === "judgment" && <JudgmentPanel data={data} />}
          {tab === "lines" && <LinesPanel data={data} />}
          {tab === "relations" && <RelationsPanel data={data} />}
        </motion.section>
      </AnimatePresence>

      <SequenceNav previous={data.previous} next={data.next} />

      <AnimatePresence>
        {openTrigram !== null && (
          <TrigramSheet trigramId={openTrigram} onClose={closeTrigram} />
        )}
      </AnimatePresence>
    </main>
  );
}

function TrigramButton({
  label,
  trigramId,
  onClick,
}: {
  label: string;
  trigramId: number;
  onClick: () => void;
}) {
  const trigram = HAKKE_TRIGRAMS[trigramId];
  return (
    <button type="button" onClick={onClick} aria-label={`${label} ${trigram.name}の説明を開く`}>
      <span>{label}</span>
      <HexagramGlyph lines={trigram.lines} />
      <strong>{trigram.name}</strong>
      <small>{trigram.nature}</small>
      <ChevronRight aria-hidden />
    </button>
  );
}

function OverviewPanel({ data }: { data: HexagramDetailData }) {
  return (
    <div className="hx-overview">
      {data.explanations.map((item) => (
        <article key={item.label} className="hx-reading-block">
          <h2>{item.label}</h2>
          <p>{item.text}</p>
        </article>
      ))}
      {data.guidance && (
        <section className="hx-guidance-section">
          <h2>暮らしの場面</h2>
          <div className="hx-guidance">
            {data.guidance.map((item) => (
              <article key={item.scene}>
                <h3>{item.scene}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function JudgmentPanel({ data }: { data: HexagramDetailData }) {
  return (
    <article className="hx-judgment-card">
      <span>『易経』第{data.number}卦</span>
      <p className="hx-original">{data.judgment.original}</p>
      <div aria-hidden />
      <h2>現代語</h2>
      <p>{data.judgment.modern}</p>
    </article>
  );
}

function LinesPanel({ data }: { data: HexagramDetailData }) {
  return (
    <div className="hx-lines">
      {data.lineEntries.map((line) => (
        <details key={line.label} className="hx-line">
          <summary>
            <span>{line.label}</span>
            <span>{line.original}</span>
          </summary>
          <div className="hx-line-body">
            <p className="hx-original">{line.original}</p>
            <p>{line.modern}</p>
            <Link href={`/hexagrams/${line.changed.number}`}>
              この爻が動くと
              <HexagramGlyph lines={line.changed.lines} />
              {line.changed.name}<ChevronRight aria-hidden />
            </Link>
          </div>
        </details>
      ))}
    </div>
  );
}

function RelationsPanel({ data }: { data: HexagramDetailData }) {
  return (
    <div className="hx-relations">
      {data.relations.map((relation) => {
        const content = (
          <>
            <span>{relation.kind}</span>
            <HexagramGlyph lines={relation.lines} size="md" />
            <strong>{relation.isSelf ? "この卦自身" : relation.name}</strong>
            <small>{relation.description}</small>
            {!relation.isSelf && <ChevronRight aria-hidden />}
          </>
        );
        return relation.isSelf ? (
          <div key={relation.kind} className="hx-relation-card is-self">{content}</div>
        ) : (
          <Link key={relation.kind} href={`/hexagrams/${relation.number}`} className="hx-relation-card">
            {content}
          </Link>
        );
      })}
    </div>
  );
}

function SequenceNav({
  previous,
  next,
}: {
  previous?: { number: number; name: string };
  next?: { number: number; name: string };
}) {
  return (
    <nav className="hx-sequence hx-detail-sequence" aria-label="前後の卦">
      {previous && (
        <Link href={`/hexagrams/${previous.number}`}>
          <span><ChevronLeft aria-hidden /> 第{previous.number}卦</span>
          <strong>{previous.name}</strong>
        </Link>
      )}
      {next && (
        <Link href={`/hexagrams/${next.number}`} className="is-next">
          <span>第{next.number}卦 <ChevronRight aria-hidden /></span>
          <strong>{next.name}</strong>
        </Link>
      )}
    </nav>
  );
}

function TrigramSheet({ trigramId, onClose }: { trigramId: number; onClose: () => void }) {
  const trigram = HAKKE_TRIGRAMS[trigramId];
  const closeRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="hx-sheet-layer">
      <motion.button
        type="button"
        className="hx-sheet-backdrop"
        aria-label="八卦の説明を閉じる"
        onClick={onClose}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.2 }}
      />
      <motion.section
        className="hx-trigram-sheet hx-glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hx-trigram-title"
        initial={reducedMotion ? false : { y: "100%" }}
        animate={{ y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { y: "100%" }}
        transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hx-sheet-handle" aria-hidden />
        <button ref={closeRef} type="button" className="hx-sheet-close" aria-label="閉じる" onClick={onClose}>
          <X aria-hidden />
        </button>
        <div className="hx-trigram-sheet-hero">
          <HexagramGlyph lines={trigram.lines} size="lg" />
          <div>
            <h2 id="hx-trigram-title">{trigram.name}</h2>
            <p>{trigram.reading}・{trigram.nature}</p>
          </div>
        </div>
        <p className="hx-trigram-image">{trigram.image}</p>
        <dl className="hx-trigram-facts">
          <div><dt>はたらき</dt><dd><strong>{trigram.verb}</strong>{trigram.verbDescription}</dd></div>
          <div><dt>口訣</dt><dd><strong>{trigram.mnemonic}</strong>{trigram.mnemonicModern}</dd></div>
          <div><dt>家族象</dt><dd>{trigram.family}</dd></div>
          <div><dt>方角</dt><dd>{trigram.direction.label}</dd></div>
        </dl>
      </motion.section>
    </div>
  );
}
