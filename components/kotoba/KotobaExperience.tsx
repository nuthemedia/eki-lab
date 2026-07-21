"use client";

import { useEffect, type CSSProperties } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { KotobaPassage } from "@/data/kotoba/passages";
import KotobaCanvas from "./KotobaCanvas";
import SoundToggle from "./SoundToggle";
import { useKotobaAudio } from "./KotobaAudioProvider";
import KotobaSupportFooter from "./KotobaSupportFooter";

function ArrowIcon({ direction = "next" }: { direction?: "previous" | "next" | "down" }) {
  const path =
    direction === "previous"
      ? "m15 5-7 7 7 7"
      : direction === "down"
        ? "M12 4v14m-5-5 5 5 5-5"
        : "m9 5 7 7-7 7";
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d={path} />
    </svg>
  );
}

export default function KotobaExperience({
  passage,
  previous,
  next,
}: {
  passage: KotobaPassage;
  previous?: KotobaPassage;
  next?: KotobaPassage;
}) {
  const { setProfile } = useKotobaAudio();

  useEffect(() => setProfile(passage.soundProfile), [passage.soundProfile, setProfile]);

  return (
    <main
      className={`kt-root kt-detail is-${passage.visual}`}
      style={{
        "--kt-primary": passage.theme.primary,
        "--kt-secondary": passage.theme.secondary,
        "--kt-glow": passage.theme.glow,
      } as CSSProperties}
    >
      <header className="kt-detail-chrome">
        <Link href="/" className="kt-back" aria-label="AWAI Commonsへ戻る">
          <ArrowIcon direction="previous" />
          <span>AWAI Commons</span>
        </Link>
        <SoundToggle />
      </header>

      <section className="kt-experience" aria-labelledby="kt-passage-title">
        <motion.h1
          id="kt-passage-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {passage.original}
        </motion.h1>
        <motion.p
          className="kt-hero-kundoku"
          initial={{ opacity: 0, y: -7 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {passage.kundoku}
        </motion.p>
        <motion.p
          className="kt-hero-translation"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {passage.translation}
        </motion.p>
        <motion.div
          className="kt-artwork"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <KotobaCanvas passage={passage} />
        </motion.div>
        <p className="kt-instruction">{passage.instruction}</p>
        <a href="#kotoba-reading" className="kt-scroll-cue">
          <span>ことばを読む</span>
          <ArrowIcon direction="down" />
        </a>
      </section>

      <article id="kotoba-reading" className="kt-reading">
        <div className="kt-reading-frame">
          <span className="kt-frame-corner is-top-left" aria-hidden />
          <span className="kt-frame-corner is-top-right" aria-hidden />
          <span className="kt-frame-corner is-bottom-left" aria-hidden />
          <span className="kt-frame-corner is-bottom-right" aria-hidden />
          <section>
            <p className="kt-reading-label"><span>01</span>原文</p>
            <h2 lang="zh-Hant">{passage.original}</h2>
          </section>
          <section>
            <p className="kt-reading-label"><span>02</span>読み下し</p>
            <p className="kt-kundoku">{passage.kundoku}</p>
          </section>
          <section>
            <p className="kt-reading-label"><span>03</span>現代語訳</p>
            <p className="kt-translation">{passage.translation}</p>
          </section>
          <section>
            <p className="kt-reading-label"><span>04</span>解説</p>
            <p>{passage.commentary}</p>
          </section>
          <a className="kt-source" href={passage.sourceUrl} target="_blank" rel="noreferrer">
            <span>05</span>出典　{passage.source}
          </a>
        </div>
      </article>

      <nav className="kt-passage-nav" aria-label="ことばを巡る">
        {previous ? (
          <Link href={`/kotoba/${previous.slug}`} className="is-previous">
            <ArrowIcon direction="previous" />
            <span><small>前のことば</small>{previous.original}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/kotoba/${next.slug}`} className="is-next">
            <span><small>次のことば</small>{next.original}</span>
            <ArrowIcon />
          </Link>
        ) : (
          <Link href="/kotoba" className="is-next">
            <span><small>五つのことば</small>一覧へ戻る</span>
            <ArrowIcon />
          </Link>
        )}
      </nav>

      <footer className="kt-detail-footer">
        <Link href="/kotoba" className="kt-series-link">
          <span>易のことばへ戻る</span>
          <ArrowIcon />
        </Link>
      </footer>
      <KotobaSupportFooter />
    </main>
  );
}
