"use client";

import { useEffect, type CSSProperties } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { KOTOBA_PASSAGES } from "@/data/kotoba/passages";
import KotobaCanvas from "./KotobaCanvas";
import SoundToggle from "./SoundToggle";
import { useKotobaAudio } from "./KotobaAudioProvider";
import KotobaSupportFooter from "./KotobaSupportFooter";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="m15 5-7 7 7 7" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden>
      <path d="M5 13 13 5m-6 0h6v6" />
    </svg>
  );
}

export default function KotobaGallery() {
  const { setProfile } = useKotobaAudio();

  useEffect(() => setProfile("exchange"), [setProfile]);

  return (
    <main className="kt-root kt-gallery">
      <Link href="/" className="kt-back kt-gallery-back" aria-label="AWAI Commonsへ戻る">
        <BackIcon />
        <span>AWAI Commons</span>
      </Link>
      <SoundToggle />
      <div className="kt-gallery-inner">
        <header className="kt-gallery-heading">
          <h1>易のことば</h1>
          <p>変化の哲学を、見る。触れる。</p>
        </header>

        <ol className="kt-portal-list">
          {KOTOBA_PASSAGES.map((passage, index) => (
            <motion.li
              key={passage.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/kotoba/${passage.slug}`}
                className="kt-portal"
                style={{
                  "--kt-primary": passage.theme.primary,
                  "--kt-secondary": passage.theme.secondary,
                  "--kt-glow": passage.theme.glow,
                } as CSSProperties}
              >
                <KotobaCanvas passage={passage} preview />
                <span className="kt-portal-shade" aria-hidden />
                <span className="kt-portal-copy">
                  <span className="kt-portal-titles">
                    <strong>{passage.menuTitle}</strong>
                    <small lang="zh-Hant">{passage.original}</small>
                  </span>
                  <span className="kt-portal-number">{String(passage.order).padStart(2, "0")}</span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ol>

        <aside className="kt-reading-promo" aria-labelledby="kt-reading-promo-title">
          <div className="kt-reading-promo-rule" aria-hidden>
            <span className="kt-reading-promo-light" />
            <span>READING</span>
            <i />
          </div>
          <div className="kt-reading-promo-body">
            <div>
              <h2 id="kt-reading-promo-title">この五つの言葉は、なぜ選ばれた？</h2>
              <p>『繋辞伝』から、易の変化観をたどる。</p>
            </div>
            <a
              href="https://note.com/awaicommons/n/nf0c28565d243"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="noteで読む（新しいタブで開く）"
            >
              <span>noteで読む</span>
              <ExternalArrowIcon />
            </a>
          </div>
        </aside>

        <motion.div
          className="kt-taikyoku-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/taikyoku" className="kt-portal kt-taikyoku-portal">
            <span className="kt-taikyoku-art" aria-hidden>
              <i />
              <i />
              <i />
              <b />
            </span>
            <span className="kt-portal-shade" aria-hidden />
            <span className="kt-portal-copy">
              <span className="kt-portal-titles">
                <strong lang="zh-Hant">易有太極</strong>
                <small>ひとつから、六十四の変化へ</small>
              </span>
              <ArrowIcon />
            </span>
          </Link>
        </motion.div>

        <KotobaSupportFooter />
      </div>
    </main>
  );
}
