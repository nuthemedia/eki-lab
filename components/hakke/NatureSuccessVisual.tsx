"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import { playNature } from "@/lib/hakkeSound";
import NatureStage from "./stage/NatureStage";

export default function NatureSuccessVisual({ trigramId }: { trigramId: number }) {
  const reduced = useReducedMotion() ?? false;
  const trigram = HAKKE_TRIGRAMS[trigramId];

  useEffect(() => {
    playNature(trigramId);
  }, [trigramId]);

  return (
    <div className="hk-success-visual hk-nature-success" aria-label={`${trigram.nature}の動き`}>
      <NatureStage
        trigramId={trigramId}
        playKey={1}
        palette={trigram.palette}
        idle={false}
        reducedMotion={reduced}
        onComplete={() => {}}
      />
      <span>{trigram.nature}</span>
    </div>
  );
}
