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
  recordStageClear,
  recordTrigramRecall,
  subscribeProgress,
  type HakkeMode,
} from "@/lib/hakkeProgress";
import { stageViews, type StageSlug } from "@/data/hakke/stages";
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
import AboutHakkeDialog from "./AboutHakkeDialog";
import ChantStage from "./ChantStage";
import YomuStage from "./YomuStage";
import KatachiStage from "./KatachiStage";
import ShizenStage from "./ShizenStage";
import HatarakiStage from "./HatarakiStage";
import KazokuStage from "./KazokuStage";
import HougakuStage from "./HougakuStage";
import ReviewFlow from "./ReviewFlow";
import NatureStage from "./stage/NatureStage";

type Phase =
  | "intro"
  | "build"
  | "nature"
  | "reveal"
  | "complete"
  | "zukan"
  | "daily"
  | "kasaneru"
  | "stage"
  | "review";

const HINTS = ["いちばん下から", "つぎは、まんなか", "さいごに、いちばん上"];
/** 同じ爻で溶けた回数がここに達したら、そっとお手本が浮かぶ */
const SOFT_HINT_AFTER = 3;

function LadderCheck() {
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
  const [activeStage, setActiveStage] = useState<StageSlug | null>(null);
  const [softHint, setSoftHint] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
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

  const backToIntro = () => {
    setActiveStage(null);
    setPhase("intro");
  };

  /** 8ステージ地図からステージを開く */
  const openStage = (slug: StageSlug) => {
    unlock();
    if (slug === "tsukuru") {
      start("guided");
      return;
    }
    setActiveStage(slug);
    setPhase("stage");
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
      // つくる(guided)を1周したらステージクリア扱い
      if (mode === "guided") recordStageClear("tsukuru");
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

  const openReview = () => {
    unlock();
    setPhase("review");
  };

  const openKasaneru = () => {
    unlock();
    setPhase("kasaneru");
  };

  if (phase === "intro") {
    const { views, current } = stageViews(progress);
    const hasTsukuru = progress.stagesCleared.includes("tsukuru") || progress.guidedRounds > 0;
    const hasReview = Object.keys(progress.assoc).length > 0;

    // 学習済み(旧 recall/choose の実績、または よむ で正解した卦)
    const learnedIds = new Set<number>();
    for (let id = 0; id < HAKKE_TRIGRAMS.length; id++) {
      const legacy = progress.perTrigram[id];
      const legacyLearned = !!legacy && (legacy.recallBuilt > 0 || legacy.chosen > 0);
      const assocLearned = Object.values(progress.assoc).some(
        (byId) => (byId[id]?.correct ?? 0) > 0,
      );
      if (legacyLearned || assocLearned) learnedIds.add(id);
    }
    const learnedCount = learnedIds.size;

    // 中断中の周回(つくる)。1卦でも終えていれば「続きから」。
    const hasSession =
      progress.sessionMode !== null &&
      progress.sessionStep !== null &&
      progress.sessionStep >= 1;
    const showResume = hasSession && current?.slug === "tsukuru";

    // CTA は「次にやること」があるときだけ出す。稼働分を全クリアすると current=null で消える。
    const primaryLabel = showResume
      ? `続きから  ${progress.sessionStep}/8`
      : current
        ? progress.stagesCleared.length === 0
          ? "はじめる"
          : `つづける：${current.title}`
        : null;
    const onPrimary = showResume
      ? resume
      : () => {
          if (current) openStage(current.slug);
        };

    // 八卦の進捗で「現在学習中」にする卦
    let currentTrigramId: number | null = null;
    if (hasSession && progress.sessionStep !== null) {
      currentTrigramId = LEARNING_TRIGRAMS[progress.sessionStep].id;
    } else if (learnedCount > 0 && learnedCount < HAKKE_TRIGRAMS.length) {
      currentTrigramId = LEARNING_ORDER.find((id) => !learnedIds.has(id)) ?? null;
    }

    return (
      <main className="hk-home">
        <button
          type="button"
          className="hk-about-trigger"
          aria-label="Hakkeについて"
          onClick={() => setAboutOpen(true)}
        >
          ?
        </button>
        <AboutHakkeDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />

        <header className="hk-hero">
          <h1 className="hk-hero-title">HAKKE</h1>
          <p className="hk-hero-sub">八卦を、手でおぼえる。</p>
        </header>

        <HakkeEyecatch />

        {primaryLabel ? (
          <button type="button" className="hk-cta hk-home-cta" onClick={onPrimary}>
            {primaryLabel}
          </button>
        ) : null}

        <ol className="hk-ladder" aria-label="学習ステージ">
          {views.map((v) => {
            const openable = v.status !== "soon";
            const isResumeRow = v.slug === "tsukuru" && showResume;
            return (
              <li key={v.slug}>
                <button
                  type="button"
                  className={`hk-ladder-item is-${v.status}`}
                  disabled={!openable}
                  onClick={
                    isResumeRow ? resume : openable ? () => openStage(v.slug) : undefined
                  }
                >
                  <span className="hk-ladder-num" aria-hidden>
                    {v.num}
                  </span>
                  <span className="hk-ladder-body">
                    <span className="hk-ladder-label">{v.title}</span>
                    {isResumeRow ? (
                      <span className="hk-ladder-desc">続きから {progress.sessionStep}/8</span>
                    ) : v.subtitle ? (
                      <span className="hk-ladder-desc">{v.subtitle}</span>
                    ) : null}
                  </span>
                  {v.status === "done" ? (
                    <LadderCheck />
                  ) : v.status === "soon" ? (
                    <span className="hk-ladder-soon">近日</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="hk-tprog-wrap">
          <p className="hk-tprog-label">八卦とのつながり</p>
          <ul className="hk-tprog" aria-label="八卦とのつながり">
          {HAKKE_TRIGRAMS.map((t) => {
            const isCurrent = t.id === currentTrigramId;
            const learned = learnedIds.has(t.id);
            const state = isCurrent ? "current" : learned ? "learned" : "todo";
            const stateLabel = isCurrent
              ? "学習中"
              : learned
                ? "つながり学習済み"
                : "これから";
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
        </div>

        <div className="hk-home-foot">
          <div className="hk-home-actions">
            {hasTsukuru ? (
              <button type="button" className="hk-daily-link" onClick={openDaily}>
                きょうのひとつ
              </button>
            ) : null}
            {hasReview ? (
              <button type="button" className="hk-daily-link" onClick={openReview}>
                ふくしゅう
              </button>
            ) : null}
          </div>
          <section className="hk-support-section" aria-labelledby="hk-support-title">
            <h2 id="hk-support-title">もっと知る</h2>
            <nav className="hk-support" aria-label="もっと知る">
            <button
              type="button"
              className="hk-support-link"
              onClick={() => openZukan(null)}
            >
              ずかん
            </button>
            <button
              type="button"
              className="hk-support-link"
              onClick={openKasaneru}
            >
              かさねる
            </button>
            </nav>
          </section>
          <p className="hk-rights">© 2026 HAKKE</p>
        </div>
      </main>
    );
  }

  if (phase === "stage") {
    if (activeStage === "tonaeru") {
      return (
        <ChantStage
          onComplete={() => {
            recordStageClear("tonaeru");
            backToIntro();
          }}
          onExit={backToIntro}
        />
      );
    }
    if (activeStage === "yomu") {
      return (
        <YomuStage
          onComplete={() => {
            recordStageClear("yomu");
            backToIntro();
          }}
          onExit={backToIntro}
        />
      );
    }
    if (activeStage === "katachi") {
      return (
        <KatachiStage
          onComplete={() => {
            recordStageClear("katachi");
            backToIntro();
          }}
          onExit={backToIntro}
        />
      );
    }
    if (activeStage === "shizen") {
      return (
        <ShizenStage
          onComplete={() => {
            recordStageClear("shizen");
            backToIntro();
          }}
          onExit={backToIntro}
        />
      );
    }
    if (activeStage === "hataraki") {
      return (
        <HatarakiStage
          onComplete={() => {
            recordStageClear("hataraki");
            backToIntro();
          }}
          onExit={backToIntro}
        />
      );
    }
    if (activeStage === "kazoku") {
      return (
        <KazokuStage
          onComplete={() => {
            recordStageClear("kazoku");
            backToIntro();
          }}
          onExit={backToIntro}
        />
      );
    }
    if (activeStage === "hougaku") {
      return (
        <HougakuStage
          onComplete={() => {
            recordStageClear("hougaku");
            backToIntro();
          }}
          onExit={backToIntro}
        />
      );
    }
    // 未対応 slug(通常は到達しない)
    return null;
  }

  if (phase === "review") {
    return <ReviewFlow onDone={backToIntro} onExit={backToIntro} />;
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
          onContinue={() => openStage("tonaeru")}
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
