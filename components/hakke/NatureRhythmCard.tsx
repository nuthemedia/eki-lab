"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { PRENATAL_TRIGRAMS } from "@/data/hakke/trigrams";
import { setSoundOn, unlock } from "@/lib/hakkeSound";
import { clipExists } from "@/lib/hakkeVoice";
import TrigramFigure from "./TrigramFigure";

const SRC = "/audio/hakke/nature-chant.mp3";
/** 通し nature-chant(約2s、8音の連続)に合わせた点灯タイミング(ms、8等分) */
const SCHEDULE = [150, 380, 610, 840, 1070, 1300, 1530, 1760];

/**
 * 「自然のリズム」導入カード。天沢火雷・風水山地を、通し音声(nature-chant.mp3)で聞く。
 * きくで自動サウンドON→再生+先天順に点灯。TeachWalk のスライドとして使う。
 */
export default function NatureRhythmCard() {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const timersRef = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const genRef = useRef(0);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    const timers = timersRef;
    const audio = audioRef;
    const gen = genRef;
    return () => {
      gen.current++;
      timers.current.forEach((id) => window.clearTimeout(id));
      audio.current?.pause();
    };
  }, []);

  const play = async () => {
    unlock();
    setSoundOn(true); // 自然を見るでも、再生操作で音をオンにする
    const gen = ++genRef.current;
    const alive = () => gen === genRef.current;
    clearTimers();
    setPlaying(true);
    setActive(reduced ? null : 0);

    const ok = await clipExists(SRC);
    if (!alive()) return;
    if (ok) {
      const audio = new Audio(SRC);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }

    if (!reduced) {
      SCHEDULE.forEach((ms, i) => {
        timersRef.current.push(
          window.setTimeout(() => {
            if (alive()) setActive(i);
          }, ms),
        );
      });
    }
    timersRef.current.push(
      window.setTimeout(
        () => {
          if (alive()) {
            setPlaying(false);
            setActive(null);
          }
        },
        reduced ? 2200 : SCHEDULE[SCHEDULE.length - 1] + 500,
      ),
    );
  };

  return (
    <>
      <p className="hk-teach-title">自然のリズム</p>
      <ol className="hk-teach-grid" aria-label="八卦と自然のならび">
        {PRENATAL_TRIGRAMS.map((t, i) => (
          <li
            key={t.id}
            className={`hk-teach-item${i === active ? " is-active" : ""}`}
          >
            <TrigramFigure lines={t.lines} size="mini" />
            <span className="hk-teach-item-main">{t.nature}</span>
            <span className="hk-teach-item-sub">{t.natureReading}</span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="hk-cta hk-cta--ghost hk-rhythm-play"
        onClick={play}
        disabled={playing}
      >
        {playing ? "きいている…" : "きく(順番に読み上げ)"}
      </button>
    </>
  );
}
