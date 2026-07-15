"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { castDice } from "@/domain/iching/cast";
import {
  pickCardQuestions,
  type CardQuestion,
} from "@/domain/iching/cardQuestions";
import { hexagramFromLines } from "@/domain/iching/hexagrams";
import {
  CARD_TAGLINE,
  buildCardContent,
  type CardContent,
} from "@/lib/ichingCard";
import { CardCastingAnimation } from "./CardCastingAnimation";
import { HexagramCard } from "./HexagramCard";
import { QuestionPicker } from "./QuestionPicker";
import { SharePanel } from "./SharePanel";

type Step = "pick" | "casting" | "result";

/** 卦カード(/card)の本体。問いを選ぶ → 立卦 → カード → 共有 */
export function IchingCardApp() {
  const [step, setStep] = useState<Step>("pick");
  // 乱数によるSSR不整合を避けるため、候補はマウント後に選ぶ
  const [questions, setQuestions] = useState<CardQuestion[]>([]);
  const [content, setContent] = useState<CardContent | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuestions(pickCardQuestions(5)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handlePick = (question: CardQuestion) => {
    const cast = castDice();
    const primary = hexagramFromLines(cast.primaryLines);
    if (!primary) return;
    setContent(
      buildCardContent({
        qid: question.id,
        hex: primary.number,
        line: cast.changingLineIndexes[0] ?? 0,
      }),
    );
    setStep("casting");
  };

  const reset = () => {
    setContent(null);
    setQuestions(pickCardQuestions(5));
    setStep("pick");
  };

  return (
    <div className="ik-flow">
      {step !== "pick" && (
        <div className="ik-flow-head">
          <span className="ik-scene-title">{CARD_TAGLINE}</span>
          <button className="ik-link-quiet ik-linklike" onClick={reset}>
            はじめから
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="ik-flow-body"
        >
          {step === "pick" && (
            <div className="ik-flow-col">
              <motion.div
                className="ik-top-head"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.1 }}
              >
                <h1
                  className="ik-top-title"
                  style={{ fontSize: "clamp(24px, 7vw, 32px)" }}
                >
                  {CARD_TAGLINE}
                </h1>
                <p className="ik-top-sub">
                  問いをひとつ選ぶと、卦カードが一枚立ち上がります。
                </p>
              </motion.div>

              <QuestionPicker
                questions={questions}
                onPick={handlePick}
                onShuffle={() => setQuestions(pickCardQuestions(5))}
              />

              <div className="ik-flow-quiet-links">
                <span className="ik-eyebrow" style={{ letterSpacing: "0.24em" }}>
                  自分の悩みから、じっくり占うなら
                </span>
                <Link href="/ask" className="ik-link-quiet">
                  易のかたち 本編へ
                </Link>
              </div>
            </div>
          )}

          {step === "casting" && content && (
            <CardCastingAnimation
              lines={content.lines}
              changingIndex={content.changingLineIndex}
              onDone={() => setStep("result")}
            />
          )}

          {step === "result" && content && (
            <div className="ik-flow-col">
              <HexagramCard content={content} />
              <SharePanel content={content} />
              <div className="ik-card-cta">
                <Link className="ik-btn ik-btn--primary" href="/ask">
                  この問いを、もっと深く占う
                </Link>
                <button className="ik-link-quiet ik-linklike" onClick={reset}>
                  もう一枚引く
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
