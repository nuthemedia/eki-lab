"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { RefineResult } from "@/domain/iching/types";

type Props = {
  refine: RefineResult;
  source: "llm" | "fallback";
  canRegenerate: boolean;
  onSelect: (inquiry: string) => void;
  onClarify: (answer: string) => void;
  onRegenerate: () => void;
};

/** Step3: 要約と占的候補。確認質問・自分で編集にも対応 */
export function InquiryCandidates({
  refine,
  source,
  canRegenerate,
  onSelect,
  onClarify,
  onRegenerate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(refine.recommendedInquiry);
  const [clarifyAnswer, setClarifyAnswer] = useState("");
  const showClarify = refine.needsClarification && refine.clarifyingQuestion;

  return (
    <motion.div
      className="ik-flow-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="ik-eyebrow">問いを整える</div>

      <p className="ik-flow-summary">{refine.summary}</p>
      {source === "fallback" && (
        <p className="ik-flow-note">※ 現在は簡易整理で表示しています。</p>
      )}

      {showClarify && (
        <div className="ik-text-block">
          <div className="ik-text-label">ひとつだけ確認</div>
          <p className="ik-text-original" style={{ fontSize: 15 }}>
            {refine.clarifyingQuestion}
          </p>
          <textarea
            className="ik-textarea"
            rows={2}
            value={clarifyAnswer}
            onChange={(e) => setClarifyAnswer(e.target.value)}
            placeholder="ひとことで大丈夫です"
            maxLength={200}
          />
          <button
            className="ik-btn"
            style={{ marginTop: 10 }}
            disabled={!clarifyAnswer.trim()}
            onClick={() => onClarify(clarifyAnswer.trim())}
          >
            回答して整え直す
          </button>
        </div>
      )}

      <div className="ik-flow-col" style={{ gap: 10 }}>
        <p className="ik-caption" style={{ textAlign: "left" }}>
          この相談では、次のどれを占うのが近いですか？
        </p>
        {refine.suggestedQuestions.map((q, i) => (
          <motion.button
            key={q.id || i}
            className="ik-candidate-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
            onClick={() => onSelect(q.inquiry)}
          >
            <span className="ik-candidate-label">{q.label}</span>
            <span className="ik-candidate-inquiry">{q.inquiry}</span>
          </motion.button>
        ))}
      </div>

      {editing ? (
        <div className="ik-text-block">
          <div className="ik-text-label">自分で問いを立てる</div>
          <textarea
            className="ik-textarea"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={200}
          />
          <button
            className="ik-btn"
            style={{ marginTop: 10 }}
            disabled={!draft.trim()}
            onClick={() => onSelect(draft.trim())}
          >
            この問いにする
          </button>
        </div>
      ) : (
        <div className="ik-flow-quiet-links" style={{ marginTop: 0 }}>
          <button className="ik-link-quiet ik-linklike" onClick={() => setEditing(true)}>
            自分で問いを編集する
          </button>
          {canRegenerate && (
            <button className="ik-link-quiet ik-linklike" onClick={onRegenerate}>
              もう一度整理してもらう
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
