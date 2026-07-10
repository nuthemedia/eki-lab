"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { HAKKE_TRIGRAMS, LEARNING_ORDER, LEARNING_TRIGRAMS } from "@/data/hakke/trigrams";
import {
  clearSession,
  getDailyTrigramId,
  getProgressSnapshot,
  getServerProgressSnapshot,
  recordRoundComplete,
  recordSession,
  recordTrigramRecall,
  subscribeProgress,
  type HakkeMode,
} from "@/lib/hakkeProgress";
import { playChime, playDissolve, playNature, playTap, unlock } from "@/lib/hakkeSound";
import TrigramFigure, { type LineValue } from "./TrigramFigure";
import ProgressDots from "./ProgressDots";
import YinYangButtons from "./YinYangButtons";
import ResultCard from "./ResultCard";
import CompletionView from "./CompletionView";
import ChooseFlow from "./ChooseFlow";
import ZukanView from "./ZukanView";
import DailyOne from "./DailyOne";
import KasaneruFlow from "./KasaneruFlow";
import HakkeEyecatch from "./HakkeEyecatch";
import NatureStage from "./stage/NatureStage";

type Phase =
  | "intro"
  | "build"
  | "nature"
  | "reveal"
  | "complete"
  | "zukan"
  | "daily"
  | "kasaneru";

const HINTS = ["いちばん下から", "つぎは、まんなか", "さいごに、いちばん上"];
/** 同じ爻で溶けた回数がここに達したら、そっとお手本が浮かぶ */
const SOFT_HINT_AFTER = 3;

/** 学習段階ラダーの1段の状態 */
type StageStatus = "done" | "current" | "locked";

function LadderMark({ status }: { status: StageStatus }) {
  if (status === "done") {
    return (
      <svg className="hk-ladder-mark" viewBox="0 0 16 16" width="14" height="14" aria-hidden>
        <path
          d="M3.5 8.5l3 3 6-6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "locked") {
    return (
      <svg className="hk-ladder-mark" viewBox="0 0 16 16" width="12" height="12" aria-hidden>
        <rect x="3.5" y="7" width="9" height="6.5" rx="1.4" fill="currentColor" />
        <path
          d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );
  }
  return null;
}

export default function HakkeApp() {
  const reduced = useReducedMotion() ?? false;
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );
  const [phase, setPhase] = useState<Phase>("intro");
  const [mode, setMode] = useState<HakkeMode>("guided");
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState<LineValue[]>([]);
  const [ghost, setGhost] = useState<LineValue | null>(null);
  const [playKey, setPlayKey] = useState(0);
  const [zukanId, setZukanId] = useState<number | null>(null);
  const [dailyId, setDailyId] = useState<number | null>(null);
  const [softHint, setSoftHint] = useState(false);
  const missCountRef = useRef(0);
  const hintedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const target = LEARNING_TRIGRAMS[step];
  const isRecall = mode === "recall";

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const after = (ms: number, fn: () => void) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  const resetTrigramState = () => {
    setPlaced([]);
    setSoftHint(false);
    missCountRef.current = 0;
    hintedRef.current = false;
  };

  const start = (nextMode: HakkeMode) => {
    unlock();
    clearSession();
    setMode(nextMode);
    setStep(0);
    resetTrigramState();
    setPhase("build");
  };

  const resume = () => {
    if (progress.sessionMode === null || progress.sessionStep === null) return;
    unlock();
    setMode(progress.sessionMode);
    setStep(progress.sessionStep);
    resetTrigramState();
    setPhase("build");
  };

  const handlePick = (value: LineValue) => {
    if (phase !== "build" || ghost || placed.length >= 3) return;
    unlock();
    const expected = target.lines[placed.length];
    if (value === expected) {
      const next = [...placed, value];
      setPlaced(next);
      missCountRef.current = 0;
      setSoftHint(false);
      playTap();
      if (next.length === 3) {
        if (isRecall) {
          recordTrigramRecall(target.id, hintedRef.current);
        }
        // 完成の間(ま)をおいて自然現象へ
        after(reduced ? 250 : 700, () => {
          setPhase("nature");
          setPlayKey((k) => k + 1);
          playNature(target.id);
        });
      }
    } else {
      // お手本と違う爻は一瞬現れて静かに溶ける
      setGhost(value);
      after(600, () => setGhost(null));
      playDissolve();
      missCountRef.current += 1;
      if (isRecall && missCountRef.current >= SOFT_HINT_AFTER) {
        // 思い出せないときは、そっとお手本が浮かぶ
        setSoftHint(true);
        hintedRef.current = true;
      }
    }
  };

  const handleNext = () => {
    if (step === LEARNING_TRIGRAMS.length - 1) {
      recordRoundComplete(mode);
      clearSession();
      setPhase("complete");
      return;
    }
    const next = step + 1;
    setStep(next);
    resetTrigramState();
    setPhase("build");
    // build 系(guided/recall)は中断しても続きから再開できるよう保存
    if (mode !== "choose") recordSession(mode, next);
  };

  const openZukan = (id: number | null) => {
    unlock();
    setZukanId(id);
    setPhase("zukan");
  };

  const openDaily = () => {
    unlock();
    setDailyId(getDailyTrigramId());
    setPhase("daily");
  };

  const openKasaneru = () => {
    unlock();
    setPhase("kasaneru");
  };

  if (phase === "intro") {
    const hasGuided = progress.guidedRounds > 0;
    const hasRecall = progress.recallRounds > 0;
    const hasChoose = progress.chooseRounds > 0;

    // 学習済み(おもいだす/えらぶで触れた卦)
    const learnedIds = new Set<number>();
    for (let id = 0; id < HAKKE_TRIGRAMS.length; id++) {
      const stat = progress.perTrigram[id];
      if (stat && (stat.recallBuilt > 0 || stat.chosen > 0)) learnedIds.add(id);
    }
    const learnedCount = learnedIds.size;

    // 中断中の周回(guided/recall)。1卦でも終えていれば「続きから」。
    const hasSession =
      progress.sessionMode !== null &&
      progress.sessionStep !== null &&
      progress.sessionStep >= 1;

    // メインボタンの起点(未完了の段階を上から)
    const currentMode: HakkeMode = !hasGuided
      ? "guided"
      : !hasRecall
        ? "recall"
        : !hasChoose
          ? "choose"
          : "recall";

    const primaryLabel = hasSession ? `続きから  ${progress.sessionStep}/8` : "はじめる";
    const onPrimary = hasSession ? resume : () => start(currentMode);

    // 学習段階ラダー(番号付き縦ステップ)
    const stages: { label: string; desc: string; status: StageStatus }[] = [
      { label: "つくる", desc: "お手本を見て", status: hasGuided ? "done" : "current" },
      {
        label: "おもいだす",
        desc: "漢字を手がかりに",
        status: hasRecall ? "done" : hasGuided ? "current" : "locked",
      },
      {
        label: "えらぶ",
        desc: "自然から選ぶ",
        status: hasChoose ? "done" : hasRecall ? "current" : "locked",
      },
    ];

    // 八卦の進捗で「現在学習中」にする卦
    let currentTrigramId: number | null = null;
    if (hasSession && progress.sessionStep !== null) {
      currentTrigramId = LEARNING_TRIGRAMS[progress.sessionStep].id;
    } else if (learnedCount > 0 && learnedCount < HAKKE_TRIGRAMS.length) {
      currentTrigramId = LEARNING_ORDER.find((id) => !learnedIds.has(id)) ?? null;
    }

    return (
      <main className="hk-home">
        <header className="hk-hero">
          <h1 className="hk-hero-title">HAKKE</h1>
          <p className="hk-hero-sub">八卦を、手でおぼえる。</p>
        </header>

        <HakkeEyecatch />

        <button type="button" className="hk-cta hk-home-cta" onClick={onPrimary}>
          {primaryLabel}
        </button>

        <ol className="hk-ladder" aria-label="学習の段階">
          {stages.map((stage, i) => (
            <li key={stage.label} className={`hk-ladder-item is-${stage.status}`}>
              <span className="hk-ladder-num" aria-hidden>
                {i + 1}
              </span>
              <span className="hk-ladder-body">
                <span className="hk-ladder-label">{stage.label}</span>
                <span className="hk-ladder-desc">{stage.desc}</span>
              </span>
              {stage.status === "current" ? (
                <span className="hk-ladder-now">今</span>
              ) : (
                <LadderMark status={stage.status} />
              )}
            </li>
          ))}
        </ol>

        <ul className="hk-tprog" aria-label="八卦の進捗">
          {HAKKE_TRIGRAMS.map((t) => {
            const isCurrent = t.id === currentTrigramId;
            const learned = learnedIds.has(t.id);
            const state = isCurrent ? "current" : learned ? "learned" : "todo";
            const stateLabel = isCurrent
              ? "学習中"
              : learned
                ? "学習済み"
                : "未学習";
            return (
              <li
                key={t.id}
                className={`hk-tprog-item is-${state}`}
                aria-label={`${t.name}・${stateLabel}`}
              >
                <span aria-hidden>{t.symbol}</span>
              </li>
            );
          })}
        </ul>

        <div className="hk-home-foot">
          {hasGuided ? (
            <button type="button" className="hk-daily-link" onClick={openDaily}>
              きょうのひとつ
            </button>
          ) : null}
          <nav className="hk-support" aria-label="そのほか">
            <button
              type="button"
              className={`hk-support-link${hasGuided ? "" : " is-locked"}`}
              onClick={hasGuided ? () => openZukan(null) : undefined}
              disabled={!hasGuided}
            >
              ずかん
            </button>
            <button
              type="button"
              className={`hk-support-link${hasRecall ? "" : " is-locked"}`}
              onClick={hasRecall ? openKasaneru : undefined}
              disabled={!hasRecall}
            >
              かさねる
            </button>
          </nav>
        </div>
      </main>
    );
  }

  if (phase === "zukan") {
    return <ZukanView initialId={zukanId} onBack={() => setPhase("intro")} />;
  }

  if (phase === "daily" && dailyId !== null) {
    return <DailyOne trigramId={dailyId} onDone={() => setPhase("intro")} />;
  }

  if (phase === "kasaneru") {
    return <KasaneruFlow onExit={() => setPhase("intro")} />;
  }

  if (mode === "choose" && phase !== "complete") {
    return (
      <ChooseFlow
        onComplete={() => {
          recordRoundComplete("choose");
          setPhase("complete");
        }}
        onExit={() => setPhase("intro")}
      />
    );
  }

  if (phase === "complete") {
    return (
      <main className="hk-build">
        <CompletionView
          mode={mode}
          onRestart={start}
          onOpenZukan={openZukan}
          onTop={() => setPhase("intro")}
        />
      </main>
    );
  }

  const hint =
    phase === "build"
      ? placed.length < 3
        ? HINTS[placed.length]
        : "そろった"
      : "";

  return (
    <main className="hk-build">
      <div className="hk-top-bar">
        <button type="button" className="hk-top-link" onClick={() => setPhase("intro")}>
          ← トップへ
        </button>
      </div>
      <ProgressDots total={LEARNING_TRIGRAMS.length} current={step} />
      <div className="hk-guide">
        {isRecall ? (
          <>
            <div className="hk-cue">
              <span className="hk-cue-kanji">{target.name}</span>
              <span className="hk-cue-reading">
                {target.reading}・{target.nature}
              </span>
            </div>
            {softHint ? (
              <div className="hk-soft-hint">
                <TrigramFigure lines={target.lines} size="guide" />
              </div>
            ) : null}
          </>
        ) : (
          <>
            <span className="hk-guide-label">おてほん</span>
            <TrigramFigure lines={target.lines} size="guide" />
          </>
        )}
      </div>
      <div className="hk-stage">
        <NatureStage
          trigramId={target.id}
          playKey={playKey}
          palette={target.palette}
          idle={phase === "build"}
          reducedMotion={reduced}
          onComplete={() => {
            setPhase("reveal");
            playChime();
          }}
        />
        <div className="hk-stage-figure">
          <TrigramFigure
            lines={placed}
            showEmpty={phase === "build"}
            ghost={ghost}
            animate
          />
        </div>
        {phase === "reveal" ? (
          <ResultCard
            trigram={target}
            isLast={step === LEARNING_TRIGRAMS.length - 1}
            onNext={handleNext}
          />
        ) : null}
      </div>
      <p className="hk-hint">{hint}</p>
      <YinYangButtons
        disabled={phase !== "build" || placed.length >= 3 || ghost !== null}
        onPick={handlePick}
      />
    </main>
  );
}
