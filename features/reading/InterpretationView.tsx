"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  hexagramFromLines,
  LINE_LABELS,
} from "@/domain/iching/hexagrams";
import type { HexagramResult, Interpretation } from "@/domain/iching/types";
import { HexagramFigure } from "@/components/core/HexagramFigure";

type Props = {
  inquiry: string;
  reading: HexagramResult;
  interpretation: Interpretation;
  source: "llm" | "fallback";
  saved: boolean;
  onSave: () => void;
  onNewInquiry: () => void;
};

function Section({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className="ik-text-block">
      <div className={`ik-text-label${accent ? " ik-text-label--accent" : ""}`}>
        {label}
      </div>
      <div className="ik-text-modern" style={{ fontSize: 13.5 }}>
        {children}
      </div>
    </section>
  );
}

/** Step8: 解釈結果。未来の断定ではなく「今どう向き合うか」に着地する */
export function InterpretationView({
  inquiry,
  reading,
  interpretation,
  source,
  saved,
  onSave,
  onNewInquiry,
}: Props) {
  const primary = hexagramFromLines(reading.primaryLines);
  const relating = hexagramFromLines(reading.relatingLines);
  const hasChanging = reading.changingLineIndexes.length > 0;
  const changingLabel = reading.changingLineIndexes
    .map((i) => LINE_LABELS[i])
    .join("・");

  return (
    <motion.div
      className="ik-flow-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ paddingBottom: 24 }}
    >
      <div className="ik-eyebrow">今回の問い</div>
      <p className="ik-inquiry-big" style={{ fontSize: "clamp(17px, 5vw, 20px)" }}>
        {inquiry}
      </p>

      <div className="ik-result-pair" style={{ marginTop: 8 }}>
        <div className="ik-result-col">
          <span className="ik-result-role">本卦</span>
          <HexagramFigure
            lines={reading.primaryLines}
            changingIndexes={reading.changingLineIndexes}
            highlightChanging
          />
          <div>
            <h2 className="ik-result-name" style={{ fontSize: "clamp(18px, 5vw, 22px)" }}>
              {primary?.name ?? "─"}
            </h2>
            {primary && <p className="ik-result-reading">{primary.reading}</p>}
            {primary && (
              <Link
                href={`/hexagrams/${primary.number}`}
                className="ik-link-quiet"
              >
                辞典で見る
              </Link>
            )}
          </div>
        </div>
        {hasChanging && (
          <>
            <span className="ik-result-arrow" aria-hidden>
              →
            </span>
            <div className="ik-result-col">
              <span className="ik-result-role">之卦</span>
              <HexagramFigure lines={reading.relatingLines} />
              <div>
                <h2 className="ik-result-name" style={{ fontSize: "clamp(18px, 5vw, 22px)" }}>
                  {relating?.name ?? "─"}
                </h2>
                {relating && <p className="ik-result-reading">{relating.reading}</p>}
                {relating && (
                  <Link
                    href={`/hexagrams/${relating.number}`}
                    className="ik-link-quiet"
                  >
                    辞典で見る
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className={hasChanging ? "ik-result-note" : "ik-result-note ik-result-note--quiet"}
        style={{ textAlign: "center" }}
      >
        {hasChanging ? `${changingLabel} 変` : "変爻なし"}
      </div>

      <motion.p
        className="ik-interp-essence"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
      >
        {interpretation.essence}
      </motion.p>

      {source === "fallback" && (
        <p className="ik-flow-note" style={{ textAlign: "center" }}>
          ※ 簡易解釈で表示しています(固定の現代語訳に基づく表示です)。
        </p>
      )}

      <div className="ik-texts">
        {interpretation.answer && (
          <section className="ik-text-block ik-answer-block">
            <div className="ik-text-label">問いへの答え</div>
            <p className="ik-answer-text">{interpretation.answer}</p>
          </section>
        )}
        <Section label="本卦の読み">{interpretation.primaryReading}</Section>
        {interpretation.changingReading && (
          <Section label="変爻の読み" accent>
            {interpretation.changingReading}
          </Section>
        )}
        {interpretation.relatingReading && (
          <Section label="之卦の読み">{interpretation.relatingReading}</Section>
        )}
        <Section label="今どう向き合うか">{interpretation.advice}</Section>
        <Section label="注意点">
          {interpretation.caution}
          <br />
          <span style={{ color: "var(--ik-muted)" }}>
            易は未来を固定するものではなく、今の状況の見方を与えるものです。大きな決断は、現実の情報や信頼できる人への相談も合わせて判断してください。
          </span>
        </Section>
      </div>

      <div className="ik-result-actions" style={{ marginTop: 8 }}>
        <button className="ik-btn" onClick={onSave} disabled={saved}>
          {saved ? "保存しました" : "この結果を保存"}
        </button>
        <button className="ik-link-quiet ik-linklike" onClick={onNewInquiry}>
          新しい問いを立てる
        </button>
      </div>
    </motion.div>
  );
}
