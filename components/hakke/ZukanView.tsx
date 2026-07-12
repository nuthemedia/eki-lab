"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import { HAKKE_COLUMNS, type ColumnCategory } from "@/data/hakke/columns";
import { playNature } from "@/lib/hakkeSound";
import { getProgressSnapshot, getServerProgressSnapshot, subscribeProgress } from "@/lib/hakkeProgress";
import { readColumnIds } from "@/lib/hakkeColumns";
import TrigramFigure from "./TrigramFigure";
import NatureStage from "./stage/NatureStage";
import ColumnCard from "./ColumnCard";

type Props = {
  /** 完成画面のセルから来たときに最初に再生する卦 */
  initialId: number | null;
  onBack: () => void;
};

export default function ZukanView({ initialId, onBack }: Props) {
  const reduced = useReducedMotion() ?? false;
  const [selected, setSelected] = useState(initialId ?? 0);
  const [playKey, setPlayKey] = useState(initialId !== null ? 1 : 0);
  const [view, setView] = useState<"trigrams" | "columns">("trigrams");
  const [columnCategory, setColumnCategory] = useState<ColumnCategory>("learning");
  const progress = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getServerProgressSnapshot);
  const readIds = readColumnIds(progress);

  const trigram = HAKKE_TRIGRAMS[selected];
  const categoryColumns = HAKKE_COLUMNS.filter((column) => column.category === columnCategory);
  const readCategoryColumns = categoryColumns.filter((column) => readIds.has(column.id));

  // 現象が再生されるたび(初期表示 initialId 経由も含む)自然音を鳴らす
  useEffect(() => {
    if (playKey > 0) playNature(HAKKE_TRIGRAMS[selected].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  const play = (id: number) => {
    setSelected(id);
    setPlayKey((k) => k + 1);
  };

  return (
    <main className="hk-zukan">
      <div className="hk-zukan-head">
        <button type="button" className="hk-zukan-back" onClick={onBack}>
          ← もどる
        </button>
        <span className="hk-zukan-title">ずかん</span>
      </div>
      <div className="hk-zukan-tabs" role="tablist" aria-label="ずかんの種類">
        <button type="button" role="tab" aria-selected={view === "trigrams"} onClick={() => setView("trigrams")}>八卦</button>
        <button type="button" role="tab" aria-selected={view === "columns"} onClick={() => setView("columns")}>小さな発見</button>
      </div>
      {view === "trigrams" ? (
        <>
      <div className="hk-stage hk-zukan-stage">
        <NatureStage
          trigramId={trigram.id}
          playKey={playKey}
          palette={trigram.palette}
          idle={false}
          reducedMotion={reduced}
          onComplete={() => {}}
        />
        <div className="hk-stage-figure">
          <TrigramFigure lines={trigram.lines} />
        </div>
      </div>
      <div className="hk-zukan-caption">
        <span className="hk-zukan-kanji">
          {trigram.name}
          <span className="hk-zukan-reading">
            {trigram.reading}・{trigram.nature}
          </span>
        </span>
        <p className="hk-zukan-image">{trigram.image}</p>
      </div>
      <div className="hk-grid">
        {HAKKE_TRIGRAMS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`hk-cell${t.id === selected ? " is-selected" : ""}`}
            onClick={() => play(t.id)}
          >
            <TrigramFigure lines={t.lines} size="mini" />
            <span className="hk-cell-kanji">{t.name}</span>
            <span className="hk-cell-meta">
              {t.nature}・{t.reading}
            </span>
          </button>
        ))}
      </div>
        </>
      ) : (
        <section className="hk-column-library" aria-label="小さな発見">
          <p className="hk-column-progress">読んだ発見 {readIds.size}/96</p>
          <div className="hk-column-filters" aria-label="発見の分類">
            {(["learning", "history", "person"] as ColumnCategory[]).map((category) => {
              const label = category === "learning" ? "学び" : category === "history" ? "歴史" : "人物";
              const total = HAKKE_COLUMNS.filter((column) => column.category === category).length;
              const read = HAKKE_COLUMNS.filter((column) => column.category === category && readIds.has(column.id)).length;
              return (
                <button key={category} type="button" aria-pressed={columnCategory === category} onClick={() => setColumnCategory(category)}>
                  {label} {read}/{total}
                </button>
              );
            })}
          </div>
          <div className="hk-column-collection" aria-label={`${categoryColumns.length}件中${readCategoryColumns.length}件発見済み`}>
            {categoryColumns.map((column) => (
              <span
                key={column.id}
                className={readIds.has(column.id) ? "is-read" : undefined}
                aria-hidden
              />
            ))}
          </div>
          <ol className="hk-column-list">
            {readCategoryColumns.map((column) => (
              <li key={column.id}>
                <details className="hk-column-entry">
                  <summary>
                    <span>{column.title}</span>
                    <span className="hk-column-read">✓ 既読</span>
                  </summary>
                  <ColumnCard column={column} compact />
                </details>
              </li>
            ))}
          </ol>
          {readCategoryColumns.length === 0 ? (
            <p className="hk-column-empty">ステージを終えると、ここに発見が集まります。</p>
          ) : null}
        </section>
      )}
    </main>
  );
}
