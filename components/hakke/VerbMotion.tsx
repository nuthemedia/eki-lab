"use client";

import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";

export default function VerbMotion({ trigramId, compact = false }: { trigramId: number; compact?: boolean }) {
  const trigram = HAKKE_TRIGRAMS[trigramId];

  return (
    <div
      className={`hk-verb-motion is-verb-${trigramId}${compact ? " is-compact" : ""}`}
      role="img"
      aria-label={`${trigram.verb}動き`}
    >
      <span className="hk-verb-shape" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      {!compact ? <span className="hk-verb-caption">{trigram.verb}</span> : null}
    </div>
  );
}
