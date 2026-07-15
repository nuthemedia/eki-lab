"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

type Props = {
  initialValue: string;
  onSubmit: (rawInput: string) => void;
  historySlot?: React.ReactNode;
};

const PLACEHOLDER =
  "例:\n・仕事を辞めるべきか迷っている\n・彼から連絡がなくて不安\n・新しいことを始めたいが、今でいいのかわからない";

/** Step1: 悩みの自由入力。まだ占わない */
export function WorryInput({ initialValue, onSubmit, historySlot }: Props) {
  const [value, setValue] = useState(initialValue);
  const trimmed = value.trim();

  return (
    <div className="ik-flow-col">
      <motion.div
        className="ik-top-head"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1 }}
      >
        <h1 className="ik-top-title" style={{ fontSize: "clamp(28px, 8vw, 36px)" }}>
          易のかたち
        </h1>
        <p className="ik-top-sub">悩みを、ひとつの問いへ。</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="ik-flow-col"
        style={{ gap: 14 }}
      >
        <p className="ik-caption" style={{ textAlign: "left" }}>
          今、気になっていることを書いてください。
          <br />
          まだ問いの形になっていなくても大丈夫です。
        </p>
        <textarea
          className="ik-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={6}
          maxLength={500}
        />
        <div className="ik-textarea-count">{trimmed.length} / 500</div>
        <button
          className="ik-btn ik-btn--primary"
          disabled={!trimmed}
          onClick={() => onSubmit(trimmed)}
          style={{ alignSelf: "center" }}
        >
          問いを整える
        </button>
      </motion.div>

      {historySlot}

      <motion.div
        className="ik-flow-quiet-links"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.8 }}
      >
        <span className="ik-eyebrow" style={{ letterSpacing: "0.24em" }}>
          問いを決めずに、すぐ占う
        </span>
        <span>
          <Link href="/formal" className="ik-link-quiet">
            本格モード
          </Link>
          <span style={{ margin: "0 10px", color: "var(--ik-muted)" }}>/</span>
          <Link href="/dice" className="ik-link-quiet">
            サイコロモード
          </Link>
        </span>
        <Link href="/" className="ik-link-quiet">
          AWAI Commons トップへ
        </Link>
      </motion.div>
    </div>
  );
}
