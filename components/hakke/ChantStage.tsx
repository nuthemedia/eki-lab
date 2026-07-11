"use client";

import { useEffect, useRef, useState } from "react";
import { PRENATAL_TRIGRAMS } from "@/data/hakke/trigrams";
import { setSoundOn, unlock } from "@/lib/hakkeSound";
import { chantExists, speakReading, stopSpeaking } from "@/lib/hakkeVoice";
import SequenceTap from "./exercise/SequenceTap";

type Props = {
  onComplete: () => void;
  onExit: () => void;
};

/** 先天順(乾兌離震巽坎艮坤)の id 並び */
const PRENATAL_ORDER = PRENATAL_TRIGRAMS.map((t) => t.id);
/** 導入で見せる読みの並び */
const READING_LINE = PRENATAL_TRIGRAMS.map((t) => t.reading).join("・");
/**
 * 通し chant.mp3(約2.6秒、4+4のリズム)に合わせた点灯タイミング(ms)。
 * 前半4つ→中央の息継ぎ→後半4つ。収録に合わせたおおよその割り付け。
 */
const CHANT_SCHEDULE = [40, 260, 480, 700, 1360, 1620, 1900, 2200];

/**
 * Stage2「となえる」。八卦の名前を先天順の"声"で覚える。
 * ① きく:順番に読み上げながら点灯(自動 / 手動タップ)。② ならべる:同じ順にタップして確認。
 */
export default function ChantStage({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<"listen" | "arrange">("listen");
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [playing, setPlaying] = useState(false);
  // 自動再生の世代。停止・再開のたびに進めて古いループを無効化する
  const genRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const chantRef = useRef<HTMLAudioElement | null>(null);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    const gen = genRef;
    const timers = timersRef;
    const chant = chantRef;
    return () => {
      // アンマウント時に走行中の自動再生を無効化して setState を止める
      gen.current++;
      timers.current.forEach((id) => window.clearTimeout(id));
      chant.current?.pause();
      stopSpeaking();
    };
  }, []);

  const markSeen = (i: number) => {
    setActive(i);
    setSeen((prev) => new Set(prev).add(i));
  };

  // 「きく」: 通し chant があればそれを再生して 4+4 で点灯、無ければ1音ずつ読み上げ
  const listen = async () => {
    unlock();
    setSoundOn(true); // となえるは音が主役。再生操作で音をオンにする
    const gen = ++genRef.current;
    const guard = () => gen === genRef.current;
    clearTimers();
    setPlaying(true);

    if (await chantExists()) {
      if (!guard()) return;
      setSeen(new Set());
      setActive(0);
      const audio = new Audio("/audio/hakke/chant.mp3");
      chantRef.current = audio;
      CHANT_SCHEDULE.forEach((ms, i) => {
        timersRef.current.push(
          window.setTimeout(() => {
            if (guard()) markSeen(i);
          }, ms),
        );
      });
      await new Promise<void>((resolve) => {
        const fin = () => resolve();
        audio.addEventListener("ended", fin);
        audio.addEventListener("error", fin);
        audio.play().catch(fin);
        timersRef.current.push(window.setTimeout(fin, 6000));
      });
      if (guard()) {
        setSeen(new Set(PRENATAL_ORDER.map((_, i) => i)));
        setActive(PRENATAL_ORDER.length - 1);
        setPlaying(false);
      }
      return;
    }

    // フォールバック: 1音ずつ点灯しながら読み上げ
    for (const i of PRENATAL_ORDER) {
      if (!guard()) return;
      markSeen(i);
      await speakReading(PRENATAL_TRIGRAMS[i].id);
    }
    if (guard()) setPlaying(false);
  };

  const tapCell = (i: number) => {
    if (playing) return;
    unlock();
    setSoundOn(true);
    markSeen(i);
    void speakReading(PRENATAL_TRIGRAMS[i].id);
  };

  const stop = () => {
    genRef.current++;
    clearTimers();
    chantRef.current?.pause();
    chantRef.current = null;
    stopSpeaking();
    setPlaying(false);
  };

  const active2 = PRENATAL_TRIGRAMS[active];
  const allSeen = seen.size === PRENATAL_ORDER.length;

  const steps = (activeStep: 1 | 2) => (
    <div className="hk-chant-steps" aria-hidden>
      <span className={activeStep === 1 ? "is-on" : ""}>① きく</span>
      <span className="hk-chant-steps-arrow">→</span>
      <span className={activeStep === 2 ? "is-on" : ""}>② ならべる</span>
    </div>
  );

  if (phase === "arrange") {
    return (
      <main className="hk-build">
        <div className="hk-top-bar">
          <button type="button" className="hk-top-link" onClick={onExit}>
            ← トップへ
          </button>
        </div>
        {steps(2)}
        <SequenceTap
          targetOrder={PRENATAL_ORDER}
          hint="おぼえた順に、タップ"
          onComplete={onComplete}
        />
        <div className="hk-chant-controls">
          <button
            type="button"
            className="hk-cta hk-cta--ghost"
            onClick={() => setPhase("listen")}
          >
            ← きく にもどる
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={onExit}>
          ← トップへ
        </button>
      </div>

      {steps(1)}

      <div className="hk-chant-lead">
        <h2 className="hk-chant-lead-title">順番ごと、声で覚えよう</h2>
        <p className="hk-chant-lead-note">
          形の組み合わせで決まる、昔からの基本順（先天順）
        </p>
        <p className="hk-chant-lead-line">{READING_LINE}</p>
      </div>

      <div className="hk-chant-readout" aria-live="polite">
        <span className="hk-chant-symbol" aria-hidden>
          {active2.symbol}
        </span>
        <span className="hk-chant-kanji">{active2.name}</span>
        <span className="hk-chant-reading">{active2.reading}</span>
      </div>

      <ol className="hk-chant-grid" aria-label="先天八卦のならび">
        {PRENATAL_TRIGRAMS.map((t, i) => (
          <li key={t.id}>
            <button
              type="button"
              className={`hk-chant-cell${i === active ? " is-active" : ""}${
                seen.has(i) ? " is-seen" : ""
              }`}
              onClick={() => tapCell(i)}
              aria-label={`${t.name} ${t.reading}`}
            >
              <span className="hk-chant-cell-kanji">{t.name}</span>
              <span className="hk-chant-cell-reading">{t.reading}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="hk-chant-controls">
        {playing ? (
          <button type="button" className="hk-cta hk-cta--ghost" onClick={stop}>
            とめる
          </button>
        ) : (
          <button type="button" className="hk-cta hk-cta--ghost" onClick={listen}>
            {allSeen ? "もういちど きく" : "きく(順番に読み上げ)"}
          </button>
        )}
        <button
          type="button"
          className="hk-cta"
          onClick={() => {
            stop();
            setPhase("arrange");
          }}
          disabled={!allSeen}
        >
          ならべる →
        </button>
      </div>
    </main>
  );
}
