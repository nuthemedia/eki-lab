"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useMotionValueEvent,
  useMotionValue,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { TRIGRAMS } from "@/domain/iching/hexagrams";
import {
  GENERATION_STAGES,
  type HexagramPhase,
} from "@/data/taikyoku/generation";
import { stageIndexAt } from "@/data/taikyoku/camera";
import {
  AUTO_DURATION_MS,
  sampleAutoTimeline,
  type AutoPlaybackState,
  type AutoStopReason,
} from "@/data/taikyoku/experience";
import StaticScene from "./StaticScene";
import { useAmbientSound } from "./useAmbientSound";

const TaikyokuCanvas = dynamic(() => import("./TaikyokuCanvas"), {
  ssr: false,
  loading: () => <StaticScene />,
});

const FOUR_FORM_LABELS = ["陽陽", "陽陰", "陰陽", "陰陰"] as const;

function FourFormButton({
  index,
  selected,
  onSelect,
}: {
  index: number;
  selected: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <button
      type="button"
      className={selected ? "is-selected" : undefined}
      aria-pressed={selected}
      aria-label={`${FOUR_FORM_LABELS[index]}をひらく`}
      onClick={() => onSelect(index)}
    >
      <span aria-hidden>{FOUR_FORM_LABELS[index]}</span>
    </button>
  );
}

function SelectorArrow({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d={direction === "previous" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );
}

export default function TaikyokuApp() {
  const rootRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const continueTimerRef = useRef<number | null>(null);
  const autoFrameRef = useRef<number | null>(null);
  const autoStartedAtRef = useRef(0);
  const autoElapsedRef = useRef(0);
  const autoStateRef = useRef<AutoPlaybackState>("idle");
  const autoStopReasonRef = useRef<AutoStopReason>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);
  const openingActionRef = useRef<HTMLButtonElement>(null);
  const dialogReturnFocusOverrideRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const [activeStage, setActiveStage] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [dualityBias, setDualityBias] = useState(0);
  const [selectedFour, setSelectedFour] = useState(0);
  const [selectedTrigram, setSelectedTrigram] = useState(0);
  const [upperTrigram, setUpperTrigram] = useState(0);
  const [lowerTrigram, setLowerTrigram] = useState(1);
  const [hexagramPhase, setHexagramPhase] = useState<HexagramPhase>("selecting");
  const [selectedHexagramPanel, setSelectedHexagramPanel] = useState<number | null>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const [autoState, setAutoState] = useState<AutoPlaybackState>("idle");
  const [closingOpen, setClosingOpen] = useState(false);
  const ambient = useAmbientSound(activeStage);
  const activateAmbient = ambient.activate;
  const enableAmbient = ambient.enable;
  const suspendAmbient = ambient.suspend;
  const resumeAmbient = ambient.resume;
  const fieldOpen = hexagramPhase === "field";
  const yinPercentage = Math.round(50 - dualityBias * 30);
  const yangPercentage = 100 - yinPercentage;

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const experienceProgress = useMotionValue(scrollYProgress.get());

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (autoStateRef.current === "playing") return;
    experienceProgress.set(value);
    const next = stageIndexAt(value);
    setActiveStage((current) => (current === next ? current : next));
  });

  const pauseAuto = useCallback((reason: Exclude<AutoStopReason, null>) => {
    if (autoStateRef.current !== "playing") return;
    autoElapsedRef.current = Math.min(
      AUTO_DURATION_MS,
      performance.now() - autoStartedAtRef.current,
    );
    if (autoFrameRef.current !== null) {
      window.cancelAnimationFrame(autoFrameRef.current);
      autoFrameRef.current = null;
    }
    autoStateRef.current = reason === "complete" ? "idle" : "paused";
    autoStopReasonRef.current = reason;
    setAutoState(autoStateRef.current);
    if (reason === "visibility") suspendAmbient();
  }, [suspendAmbient]);

  const playAuto = useCallback(() => {
    if (autoStateRef.current === "playing") {
      pauseAuto("user");
      return;
    }

    if (autoStopReasonRef.current === "complete" || autoElapsedRef.current >= AUTO_DURATION_MS) {
      autoElapsedRef.current = 0;
      setHexagramPhase("selecting");
      setClosingOpen(false);
      setSelectedHexagramPanel(null);
    }

    autoStateRef.current = "playing";
    autoStopReasonRef.current = null;
    setAutoState("playing");
    enableAmbient();
    autoStartedAtRef.current = performance.now() - autoElapsedRef.current;

    const tick = (now: number) => {
      if (autoStateRef.current !== "playing") return;
      const elapsed = Math.min(AUTO_DURATION_MS, now - autoStartedAtRef.current);
      autoElapsedRef.current = elapsed;
      const sample = sampleAutoTimeline(elapsed);
      experienceProgress.set(sample.progress);
      setActiveStage(stageIndexAt(sample.progress));
      setHexagramPhase(sample.phase);
      if (sample.dialogOpen) setClosingOpen(true);

      const root = rootRef.current;
      if (root) {
        const scrollRange = Math.max(0, root.scrollHeight - window.innerHeight);
        window.scrollTo({ top: root.offsetTop + sample.progress * scrollRange });
      }

      if (sample.complete) {
        pauseAuto("complete");
        return;
      }
      autoFrameRef.current = window.requestAnimationFrame(tick);
    };

    autoFrameRef.current = window.requestAnimationFrame(tick);
  }, [enableAmbient, experienceProgress, pauseAuto]);

  useEffect(() => {
    const activateOnFirstInteraction = () => {
      activateAmbient();
      window.removeEventListener("pointerdown", activateOnFirstInteraction);
      window.removeEventListener("keydown", activateOnFirstInteraction);
    };
    window.addEventListener("pointerdown", activateOnFirstInteraction, { passive: true });
    window.addEventListener("keydown", activateOnFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", activateOnFirstInteraction);
      window.removeEventListener("keydown", activateOnFirstInteraction);
    };
  }, [activateAmbient]);

  useEffect(() => {
    const interrupt = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".tk-auto-toggle")) return;
      pauseAuto("user");
    };
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("pointerdown", interrupt, { passive: true });
    window.addEventListener("keydown", interrupt);
    return () => {
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", interrupt);
    };
  }, [pauseAuto]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pauseAuto("visibility");
        suspendAmbient();
      } else if (
        autoStateRef.current === "paused" &&
        autoStopReasonRef.current === "visibility"
      ) {
        playAuto();
      } else {
        resumeAmbient();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [pauseAuto, playAuto, resumeAmbient, suspendAmbient]);

  useEffect(
    () => () => {
      if (continueTimerRef.current !== null) {
        window.clearTimeout(continueTimerRef.current);
      }
      if (autoFrameRef.current !== null) {
        window.cancelAnimationFrame(autoFrameRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!fieldOpen) return;
    const { style } = document.body;
    const previous = {
      overflow: style.overflow,
      overscrollBehavior: style.overscrollBehavior,
      touchAction: style.touchAction,
    };
    style.overflow = "hidden";
    style.overscrollBehavior = "none";
    style.touchAction = "none";
    return () => {
      style.overflow = previous.overflow;
      style.overscrollBehavior = previous.overscrollBehavior;
      style.touchAction = previous.touchAction;
    };
  }, [fieldOpen]);

  useEffect(() => {
    if (!closingOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const returnFocus = previousFocusRef.current ?? dialogTriggerRef.current;
    const dialog = dialogRef.current;
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusable()[0]?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setClosingOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => {
        const focusTarget = dialogReturnFocusOverrideRef.current ?? returnFocus;
        dialogReturnFocusOverrideRef.current = null;
        focusTarget?.focus({ preventScroll: true });
      });
    };
  }, [closingOpen]);

  const scrollToStage = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const restartExperience = () => {
    if (autoFrameRef.current !== null) {
      window.cancelAnimationFrame(autoFrameRef.current);
      autoFrameRef.current = null;
    }
    autoElapsedRef.current = 0;
    autoStartedAtRef.current = 0;
    autoStateRef.current = "idle";
    autoStopReasonRef.current = null;
    if (closingOpen) {
      dialogReturnFocusOverrideRef.current = openingActionRef.current;
    }
    setAutoState("idle");
    setClosingOpen(false);
    setHexagramPhase("selecting");
    setSelectedHexagramPanel(null);
    setDualityBias(0);
    setSelectedFour(0);
    setSelectedTrigram(0);
    setUpperTrigram(0);
    setLowerTrigram(1);
    setPulseKey(0);
    setActiveStage(0);
    experienceProgress.set(0);
    window.requestAnimationFrame(() => {
      scrollToStage(0);
      if (!closingOpen) openingActionRef.current?.focus({ preventScroll: true });
    });
  };

  const pulseAndContinue = () => {
    setPulseKey((key) => key + 1);
    if (continueTimerRef.current !== null) {
      window.clearTimeout(continueTimerRef.current);
    }
    continueTimerRef.current = window.setTimeout(
      () => scrollToStage(1),
      reducedMotion ? 80 : 520,
    );
  };

  const cycleTrigram = () => {
    setSelectedTrigram((index) => (index + 1) % 8);
  };

  const changeHexagramPart = (
    part: "upper" | "lower",
    direction: -1 | 1,
  ) => {
    const update = (index: number) => (index + direction + 8) % 8;
    if (part === "upper") setUpperTrigram(update);
    else setLowerTrigram(update);
    setHexagramPhase("selecting");
    setSelectedHexagramPanel(null);
  };

  const revealHexagramField = () => {
    setSelectedHexagramPanel(null);
    setHexagramPhase("field");
  };

  const returnFromHexagramField = () => {
    setHexagramPhase("stacked");
    setSelectedHexagramPanel(null);
  };

  const moveSelectedPanel = (horizontal: number, vertical: number) => {
    setSelectedHexagramPanel((current) => {
      const index = current ?? 0;
      const column = index % 8;
      const row = Math.floor(index / 8);
      const nextColumn = Math.max(0, Math.min(7, column + horizontal));
      const nextRow = Math.max(0, Math.min(7, row + vertical));
      return nextRow * 8 + nextColumn;
    });
  };

  const handleFieldKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const movement: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const direction = movement[event.key];
    if (!direction) return;
    event.preventDefault();
    moveSelectedPanel(...direction);
  };

  return (
    <main ref={rootRef} className={`tk-root${fieldOpen ? " is-field-open" : ""}`}>
      <div className="tk-canvas-layer" aria-hidden={webGLFailed || undefined}>
        {webGLFailed ? (
          <StaticScene activeStage={activeStage} />
        ) : (
          <TaikyokuCanvas
            progress={experienceProgress}
            activeStage={activeStage}
            reducedMotion={reducedMotion}
            pulseKey={pulseKey}
            dualityBias={dualityBias}
            selectedFour={selectedFour}
            selectedTrigram={selectedTrigram}
            upperTrigram={upperTrigram}
            lowerTrigram={lowerTrigram}
            hexagramPhase={hexagramPhase}
            selectedHexagramPanel={selectedHexagramPanel}
            onPulse={() => setPulseKey((key) => key + 1)}
            onDualityBias={setDualityBias}
            onSelectFour={setSelectedFour}
            onSelectTrigram={setSelectedTrigram}
            onRevealHexagramField={revealHexagramField}
            onSelectHexagramPanel={setSelectedHexagramPanel}
            onWebGLFailure={() => setWebGLFailed(true)}
          />
        )}
      </div>

      <Link href="/" className="tk-home-link" aria-label="AWAI Commonsトップへ戻る">
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="m15 5-7 7 7 7" />
        </svg>
        <span>AWAI Commons</span>
      </Link>

      <button
        type="button"
        className={`tk-sound-toggle${ambient.enabled ? " is-on" : ""}`}
        aria-label={ambient.enabled ? "アンビエント音を止める" : "アンビエント音を流す"}
        aria-pressed={ambient.enabled}
        onClick={ambient.toggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M4 13v-2m4 5V8m4 11V5m4 11V8m4 5v-2" />
        </svg>
      </button>

      <button
        type="button"
        className={`tk-auto-toggle${autoState === "playing" ? " is-playing" : ""}`}
        aria-label={autoState === "playing" ? "自動再生を一時停止" : "自動再生を開始"}
        aria-pressed={autoState === "playing"}
        onClick={playAuto}
      >
        <span aria-hidden>{autoState === "playing" ? "Ⅱ" : "▶"}</span>
        AUTO
      </button>

      <nav className="tk-progress" aria-label="生成の段階">
        <span className="tk-progress-line" aria-hidden />
        {GENERATION_STAGES.map((stage, index) => (
          <button
            key={stage.id}
            type="button"
            className={index === activeStage ? "is-active" : undefined}
            aria-current={index === activeStage ? "step" : undefined}
            aria-label={`${stage.term}へ移動`}
            onClick={() => scrollToStage(index)}
          />
        ))}
      </nav>

      <p className="tk-sr-live" aria-live="polite">
        {fieldOpen
          ? `六十四卦の場。${selectedHexagramPanel === null ? "八掛ける八の形" : `${selectedHexagramPanel + 1}番目のパネルを選択`}`
          : `${GENERATION_STAGES[activeStage].term}、${GENERATION_STAGES[activeStage].number}`}
      </p>

      {fieldOpen ? (
        <>
          <button
            type="button"
            className="tk-field-back"
            onClick={returnFromHexagramField}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="m15 5-7 7 7 7" />
            </svg>
            戻る
          </button>
          <button
            type="button"
            className="tk-field-keyboard"
            aria-label="六十四卦の場。矢印キーでパネルを選ぶ"
            onKeyDown={handleFieldKeyDown}
          />
          <footer className="tk-field-footer">
            <button
              ref={dialogTriggerRef}
              type="button"
              className="tk-closing-trigger"
              onClick={() => setClosingOpen(true)}
            >
              結びを見る
            </button>
            <Link href="/">© 2026 AWAI Commons</Link>
          </footer>
        </>
      ) : null}

      {closingOpen ? (
        <div
          className="tk-closing-overlay"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setClosingOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            className="tk-closing-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tk-closing-title"
          >
            <button
              type="button"
              className="tk-closing-close"
              aria-label="結びを閉じる"
              onClick={() => setClosingOpen(false)}
            >
              ×
            </button>
            <p className="tk-closing-kicker">易の生成</p>
            <h2 id="tk-closing-title">易有太極</h2>
            <p className="tk-closing-classical" lang="zh-Hant">
              易有太極、是生兩儀、兩儀生四象、四象生八卦。
            </p>
            <p className="tk-closing-translation">
              <span>易に太極あり。</span>
              <span>これ両儀を生じ、</span>
              <span>両儀は四象を生じ、</span>
              <span>四象は八卦を生ず。</span>
            </p>
            <a
              className="tk-kofi-link"
              href="https://ko-fi.com/awaicommons"
              target="_blank"
              rel="noreferrer"
            >
              Ko-fiで応援する
            </a>
            <button
              type="button"
              className="tk-closing-replay"
              onClick={restartExperience}
            >
              はじめから
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M20 7v5h-5M4 17v-5h5m10.2 0A7 7 0 0 0 7.1 7.1L4 10m16 4-3.1 2.9A7 7 0 0 1 4.8 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      <section
        ref={(node) => { sectionRefs.current[0] = node; }}
        id="taikyoku"
        className="tk-section is-taikyoku"
      >
        <div className="tk-sticky">
          <header className="tk-opening-copy">
            <h1>易有太極</h1>
            <p className="tk-opening-passage">
              <span>易に太極あり。</span>
            </p>
            <span className="tk-generation-number">生成数　1</span>
            <p className="tk-opening-meaning">全ての変化のはじまり</p>
          </header>
          <div className="tk-stage-copy is-bottom">
            <button
              ref={openingActionRef}
              type="button"
              className="tk-action"
              onClick={pulseAndContinue}
            >
              <span>触れて、はじめる</span>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M12 5v13m-5-5 5 5 5-5" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section
        ref={(node) => { sectionRefs.current[1] = node; }}
        id="liangyi"
        className="tk-section is-liangyi"
      >
        <div className="tk-sticky">
          <div className="tk-stage-copy is-top">
            <h2>両儀</h2>
            <span className="tk-generation-number">生成数　二</span>
            <p>陰と陽、ひとつの中に二つの働き。</p>
          </div>
          <div className="tk-stage-copy is-bottom">
            <p className="tk-gesture-hint">左右に触れて、陰陽を動かす</p>
            <div className="tk-duality-control">
              <span>陰</span>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={dualityBias}
                aria-label="陰陽の動きを変える"
                onChange={(event) => setDualityBias(Number(event.target.value))}
              />
              <span>陽</span>
            </div>
            <output className="tk-duality-ratio" aria-live="polite">
              陰 {yinPercentage}%　／　陽 {yangPercentage}%
            </output>
          </div>
        </div>
      </section>

      <section
        ref={(node) => { sectionRefs.current[2] = node; }}
        id="sixiang"
        className="tk-section is-sixiang"
      >
        <div className="tk-sticky">
          <div className="tk-stage-copy is-top">
            <h2>四象</h2>
            <span className="tk-generation-number">生成数　四　／　2²</span>
            <p>二つの働きが、四つの象をつくる</p>
          </div>
          <div className="tk-stage-copy is-bottom">
            <p className="tk-gesture-hint">触れて、四つの相をひらく</p>
            <div className="tk-four-controls" aria-label="四象を選ぶ">
              {FOUR_FORM_LABELS.map((_, index) => (
                <FourFormButton
                  key={index}
                  index={index}
                  selected={selectedFour === index}
                  onSelect={setSelectedFour}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={(node) => { sectionRefs.current[3] = node; }}
        id="bagua"
        className="tk-section is-bagua"
      >
        <div className="tk-sticky">
          <div className="tk-stage-copy is-top">
            <h2>八卦</h2>
            <span className="tk-generation-number">生成数　八　／　2³</span>
            <p>三本の爻から、八つの形。</p>
          </div>
          <div className="tk-three-layers" aria-label="三爻は天・人・地の三つの層">
            <span><i />天<small>上爻</small></span>
            <span><i />人<small>中爻</small></span>
            <span><i />地<small>下爻</small></span>
          </div>
          <p className="tk-three-meaning">三本の爻を、三つの層として見る。</p>
          <div className="tk-stage-copy is-bottom">
            <p className="tk-gesture-hint">触れて、八つの形をめぐる</p>
            <div className="tk-trigram-selector">
              <button
                type="button"
                aria-label="前の卦"
                onClick={() => setSelectedTrigram((selectedTrigram + 7) % 8)}
              >
                <SelectorArrow direction="previous" />
              </button>
              <span>{TRIGRAMS[selectedTrigram].name}</span>
              <button type="button" aria-label="次の卦" onClick={cycleTrigram}>
                <SelectorArrow direction="next" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={(node) => { sectionRefs.current[4] = node; }}
        id="hexagrams"
        className={`tk-section is-hexagrams${hexagramPhase === "stacked" ? " is-stacked" : ""}`}
      >
        <div className="tk-sticky">
          <div className="tk-stage-copy is-top">
            <h2>六十四卦</h2>
            <span className="tk-generation-number">生成数　六十四　／　8 × 8</span>
            <p>八つと八つが重なり、六十四の変化へ。</p>
          </div>
          {hexagramPhase === "selecting" ? (
            <div className="tk-hexagram-builder" aria-label="上下の八卦を選んで重ねる">
              <div className="tk-hexagram-part">
                <span>上卦</span>
                <button type="button" aria-label="前の上卦" onClick={() => changeHexagramPart("upper", -1)}>
                  <SelectorArrow direction="previous" />
                </button>
                <strong>{TRIGRAMS[upperTrigram].name}</strong>
                <button type="button" aria-label="次の上卦" onClick={() => changeHexagramPart("upper", 1)}>
                  <SelectorArrow direction="next" />
                </button>
              </div>
              <button type="button" className="tk-stack-action" onClick={() => setHexagramPhase("stacked")}>
                上下を重ねる
              </button>
              <div className="tk-hexagram-part">
                <span>下卦</span>
                <button type="button" aria-label="前の下卦" onClick={() => changeHexagramPart("lower", -1)}>
                  <SelectorArrow direction="previous" />
                </button>
                <strong>{TRIGRAMS[lowerTrigram].name}</strong>
                <button type="button" aria-label="次の下卦" onClick={() => changeHexagramPart("lower", 1)}>
                  <SelectorArrow direction="next" />
                </button>
              </div>
            </div>
          ) : hexagramPhase === "stacked" ? (
            <div className="tk-stack-complete">
              <button
                type="button"
                className="tk-hexagram-open"
                aria-label="完成した卦を開く"
                onClick={revealHexagramField}
              >
                <span>卦に触れて、六十四へひらく</span>
              </button>
              <button type="button" onClick={() => setHexagramPhase("selecting")}>
                二つの卦に戻す
              </button>
            </div>
          ) : null}
          <div className="tk-stage-copy is-bottom is-ending">
            <p>複雑さの根にあるのは、陰と陽。</p>
            <Link href="/hakke" className="tk-primary-link">
              <span>八卦を手でつくる</span>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </Link>
          </div>
          <button
            type="button"
            className="tk-replay tk-hexagram-replay"
            onClick={restartExperience}
          >
            はじめから
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M19 8a8 8 0 1 0 1 6M19 4v4h-4" />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
}
