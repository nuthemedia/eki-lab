"use client";

import { useMemo, useState } from "react";
import { HAKKE_TRIGRAMS, type DirectionKey } from "@/data/hakke/trigrams";
import { recordAssoc } from "@/lib/hakkeProgress";
import { playChime, playDissolve, playTap } from "@/lib/hakkeSound";
import TrigramFigure from "../TrigramFigure";

const RELATION_KEY = "direction-form"; // pairKey("form","direction") のアルファベット順

/** 後天(文王)方位盤の3×3レイアウト。中央(2,2)は不使用 */
export const POSTNATAL_LAYOUT: {
  key: DirectionKey;
  label: string;
  row: number;
  col: number;
}[] = [
  { key: "NW", label: "西北", row: 1, col: 1 },
  { key: "N", label: "北", row: 1, col: 2 },
  { key: "NE", label: "東北", row: 1, col: 3 },
  { key: "W", label: "西", row: 2, col: 1 },
  { key: "E", label: "東", row: 2, col: 3 },
  { key: "SW", label: "西南", row: 3, col: 1 },
  { key: "S", label: "南", row: 3, col: 2 },
  { key: "SE", label: "東南", row: 3, col: 3 },
];

/** 方角 key → 卦 id */
export const ID_BY_DIR: Record<string, number> = Object.fromEntries(
  HAKKE_TRIGRAMS.map((t) => [t.direction.key, t.id]),
);

function shuffle<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type Props = {
  /** 今回トレイから配置する卦 id */
  toPlace: number[];
  /** すでに配置済み(ロック表示)の卦 id */
  fixed?: number[];
  hint: string;
  onComplete: () => void;
};

/**
 * 後天方位盤。卦(形)を選び、正しい方角セルを押して配置する。
 * 正解でセルに定着・記録、不正解はセルが小さく揺れる(✗語彙なし)。
 */
export default function PlaceBoard({ toPlace, fixed = [], hint, onComplete }: Props) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongDir, setWrongDir] = useState<string | null>(null);

  const tray = useMemo(() => shuffle(toPlace), [toPlace]);
  const remaining = tray.filter((id) => !placed.includes(id));
  const done = placed.length === toPlace.length;

  const placedOrFixed = (id: number) => placed.includes(id) || fixed.includes(id);

  const handleCell = (dirKey: DirectionKey) => {
    if (done || selected === null) return;
    const correctId = ID_BY_DIR[dirKey];
    // すでに埋まっているセルは無視
    if (placedOrFixed(correctId)) return;
    if (correctId === selected) {
      recordAssoc(RELATION_KEY, selected, true);
      const next = [...placed, selected];
      setPlaced(next);
      setSelected(null);
      setWrongDir(null);
      if (next.length === toPlace.length) {
        playChime();
        window.setTimeout(onComplete, 500);
      } else {
        playTap();
      }
    } else {
      recordAssoc(RELATION_KEY, selected, false);
      setWrongDir(dirKey);
      playDissolve();
      window.setTimeout(() => setWrongDir((w) => (w === dirKey ? null : w)), 400);
    }
  };

  return (
    <div className="hk-board-wrap">
      <p className="hk-hint">{hint}</p>
      <div className="hk-board">
        {POSTNATAL_LAYOUT.map((cell) => {
          const id = ID_BY_DIR[cell.key];
          const filled = placedOrFixed(id);
          const isWrong = wrongDir === cell.key;
          return (
            <button
              key={cell.key}
              type="button"
              className={`hk-board-cell${filled ? " is-filled" : ""}${isWrong ? " is-wrong" : ""}`}
              style={{ gridRow: cell.row, gridColumn: cell.col }}
              disabled={filled || done}
              onClick={() => handleCell(cell.key)}
            >
              {filled ? (
                <TrigramFigure lines={HAKKE_TRIGRAMS[id].lines} size="mini" />
              ) : (
                <span className="hk-board-dir">{cell.label}</span>
              )}
            </button>
          );
        })}
        <span className="hk-board-center" aria-hidden />
      </div>

      <div className="hk-board-tray" aria-label="配置する卦">
        {remaining.map((id) => (
          <button
            key={id}
            type="button"
            className={`hk-tray-item${selected === id ? " is-selected" : ""}`}
            onClick={() => setSelected(id)}
            aria-label={HAKKE_TRIGRAMS[id].name}
          >
            <TrigramFigure lines={HAKKE_TRIGRAMS[id].lines} size="mini" />
          </button>
        ))}
      </div>
    </div>
  );
}
