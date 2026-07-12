"use client";

import { motion } from "motion/react";
import type { CardQuestion } from "@/domain/iching/cardQuestions";

type Props = {
  questions: CardQuestion[];
  onPick: (question: CardQuestion) => void;
  onShuffle: () => void;
};

/** 問い候補5枚。選ぶと即、卦が立つ */
export function QuestionPicker({ questions, onPick, onShuffle }: Props) {
  return (
    <div className="ik-flow-col" style={{ gap: 14 }}>
      <div className="ik-card-qlist">
        {questions.map((q, i) => (
          <motion.button
            key={q.id}
            className="ik-card-qbtn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            onClick={() => onPick(q)}
          >
            <span className="ik-card-qcat">{q.category}</span>
            <span>{q.text}</span>
          </motion.button>
        ))}
      </div>
      <button
        className="ik-link-quiet ik-linklike"
        style={{ alignSelf: "center" }}
        onClick={onShuffle}
      >
        別の問いを見る
      </button>
    </div>
  );
}
