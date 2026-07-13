"use client";

import type { SavedReading } from "@/lib/ichingHistory";

type Props = {
  readings: SavedReading[];
  onOpen: (reading: SavedReading) => void;
  onDelete: (id: string) => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** トップ下部の履歴一覧。タップで保存済み解釈を再読 */
export function HistoryList({ readings, onOpen, onDelete }: Props) {
  if (readings.length === 0) return null;
  return (
    <div className="ik-flow-col" style={{ gap: 10 }}>
      <div className="ik-eyebrow">これまでの問い</div>
      {readings.map((r) => (
        <div key={r.id} className="ik-history-item">
          <button className="ik-history-open" onClick={() => onOpen(r)}>
            <span className="ik-history-name ik-serif">
              {r.primaryName}
              {r.relatingName ? ` → ${r.relatingName}` : ""}
            </span>
            <span className="ik-history-inquiry">{r.finalInquiry}</span>
            <span className="ik-history-date">{formatDate(r.savedAt)}</span>
          </button>
          <button
            className="ik-history-delete"
            aria-label="削除"
            onClick={() => onDelete(r.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
