"use client";

import { useMemo, useState } from "react";
import { relationFromKey, type Relation } from "@/data/hakke/trigrams";
import { getReviewQueue } from "@/lib/hakkeProgress";
import PickExercise from "./exercise/PickExercise";

type Props = {
  onDone: () => void;
  onExit: () => void;
};

const RELATION_LABEL: Record<Relation, string> = {
  form: "形",
  kanji: "字",
  reading: "読み",
  mnemonic: "口訣",
  meaning: "意味",
  nature: "自然",
  verb: "はたらき",
  family: "家族",
  direction: "方角",
};

/**
 * ふくしゅう。苦手な対応(assoc)を relation をまたいで再出題する。
 * getReviewQueue の弱い順を relationKey ごとにまとめ、グループ順に PickExercise を回す。
 */
export default function ReviewFlow({ onDone, onExit }: Props) {
  // マウント時のキューでグループを固定
  const groups = useMemo(() => {
    const queue = getReviewQueue(16);
    const map = new Map<string, number[]>();
    for (const item of queue) {
      const arr = map.get(item.relationKey) ?? [];
      if (!arr.includes(item.id)) arr.push(item.id);
      map.set(item.relationKey, arr);
    }
    return [...map.entries()];
  }, []);
  const [gi, setGi] = useState(0);

  if (groups.length === 0) {
    return (
      <main className="hk-build">
        <div className="hk-top-bar">
          <button type="button" className="hk-top-link" onClick={onExit}>
            ← トップへ
          </button>
        </div>
        <div className="hk-review-empty">
          <p className="hk-teach-title">まだ ふくしゅう はありません</p>
          <p className="hk-teach-note">ステージを進めると、ここに苦手が集まります。</p>
          <button type="button" className="hk-cta hk-home-cta" onClick={onExit}>
            もどる
          </button>
        </div>
      </main>
    );
  }

  const [relationKey, ids] = groups[gi];
  const [promptRelation, answerRelation] = relationFromKey(relationKey);

  return (
    <PickExercise
      key={relationKey}
      items={ids}
      promptRelation={promptRelation}
      answerRelation={answerRelation}
      choices={4}
      eyebrow={`ふくしゅう ${gi + 1}/${groups.length} ・ ${RELATION_LABEL[promptRelation]}と${RELATION_LABEL[answerRelation]}`}
      onExit={onExit}
      onComplete={() => {
        if (gi === groups.length - 1) onDone();
        else setGi((g) => g + 1);
      }}
    />
  );
}
