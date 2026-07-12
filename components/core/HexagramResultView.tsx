"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  hexagramFromLines,
  LINE_LABELS,
  lineName,
} from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import type { HexagramResult, IChingText } from "@/domain/iching/types";
import { HexagramFigure } from "./HexagramFigure";

type Props = {
  reading: HexagramResult;
  onReplay: () => void;
};

function TextBlock({
  label,
  text,
  accent = false,
}: {
  label: string;
  text: IChingText;
  accent?: boolean;
}) {
  return (
    <section className="ik-text-block">
      <div className={`ik-text-label${accent ? " ik-text-label--accent" : ""}`}>
        {label}
      </div>
      <p className="ik-text-original">{text.original}</p>
      <p className="ik-text-modern">{text.modern}</p>
    </section>
  );
}

/** 最終結果。本卦と之卦を並べ、変爻を朱で示す */
export function HexagramResultView({ reading, onReplay }: Props) {
  const primary = hexagramFromLines(reading.primaryLines);
  const relating = hexagramFromLines(reading.relatingLines);
  const primaryText = primary ? HEXAGRAM_TEXTS[primary.number] : undefined;
  const relatingText = relating ? HEXAGRAM_TEXTS[relating.number] : undefined;
  const hasChanging = reading.changingLineIndexes.length > 0;
  const changingLabel = reading.changingLineIndexes
    .map((i) => LINE_LABELS[i])
    .join("・");

  return (
    <motion.div
      className="ik-result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1 }}
    >
      <div className="ik-result-pair">
        <div className="ik-result-col">
          <span className="ik-result-role">本卦</span>
          <HexagramFigure
            lines={reading.primaryLines}
            changingIndexes={reading.changingLineIndexes}
            highlightChanging
          />
          <div>
            <h2 className="ik-result-name">{primary?.name ?? "─"}</h2>
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
                <h2 className="ik-result-name">{relating?.name ?? "─"}</h2>
                {relating && (
                  <p className="ik-result-reading">{relating.reading}</p>
                )}
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

      <div className={hasChanging ? "ik-result-note" : "ik-result-note ik-result-note--quiet"}>
        {hasChanging ? `${changingLabel} 変` : "変爻なし"}
      </div>

      <div className="ik-texts">
        {primaryText && (
          <TextBlock
            label={`本卦 ${primary?.name ?? ""} ― 卦辞`}
            text={primaryText.judgment}
          />
        )}
        {primaryText &&
          reading.changingLineIndexes.map((i) => (
            <TextBlock
              key={i}
              label={`変爻 ${lineName(reading.primaryLines, i)} ― 爻辞`}
              text={primaryText.lines[i]}
              accent
            />
          ))}
        {hasChanging && relatingText && (
          <TextBlock
            label={`之卦 ${relating?.name ?? ""} ― 卦辞`}
            text={relatingText.judgment}
          />
        )}
      </div>

      <div className="ik-result-actions">
        <button className="ik-btn" onClick={onReplay}>
          もう一度
        </button>
        <Link href="/" className="ik-link-quiet">
          トップへ
        </Link>
      </div>
    </motion.div>
  );
}
