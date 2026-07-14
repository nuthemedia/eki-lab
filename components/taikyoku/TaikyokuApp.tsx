"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { GENERATION_STAGES } from "@/data/taikyoku/generation";
import { stageIndexAt } from "@/data/taikyoku/camera";
import StaticScene from "./StaticScene";

const TaikyokuCanvas = dynamic(() => import("./TaikyokuCanvas"), {
  ssr: false,
  loading: () => <StaticScene />,
});

function LineKey({ value, label }: { value: "yin" | "yang"; label: string }) {
  return (
    <span className="tk-line-key-item">
      <i className={`tk-line-symbol is-${value}`} aria-hidden>
        <b />
        {value === "yin" ? <b /> : null}
      </i>
      <span>{label}</span>
    </span>
  );
}

export default function TaikyokuApp() {
  const rootRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const continueTimerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const [activeStage, setActiveStage] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [dualityBias, setDualityBias] = useState(0);
  const [selectedTrigram, setSelectedTrigram] = useState(0);
  const [stacked, setStacked] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = stageIndexAt(value);
    setActiveStage((current) => (current === next ? current : next));
  });

  useEffect(
    () => () => {
      if (continueTimerRef.current !== null) {
        window.clearTimeout(continueTimerRef.current);
      }
    },
    [],
  );

  const scrollToStage = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
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

  return (
    <main ref={rootRef} className="tk-root">
      <div className="tk-canvas-layer" aria-hidden={webGLFailed || undefined}>
        {webGLFailed ? (
          <StaticScene activeStage={activeStage} />
        ) : (
          <TaikyokuCanvas
            progress={scrollYProgress}
            activeStage={activeStage}
            reducedMotion={reducedMotion}
            pulseKey={pulseKey}
            dualityBias={dualityBias}
            selectedTrigram={selectedTrigram}
            stacked={stacked}
            onPulse={() => setPulseKey((key) => key + 1)}
            onDualityBias={setDualityBias}
            onSelectTrigram={setSelectedTrigram}
            onStack={() => setStacked(true)}
            onWebGLFailure={() => setWebGLFailed(true)}
          />
        )}
      </div>

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
          >
            {stage.number}
          </button>
        ))}
      </nav>

      <p className="tk-sr-live" aria-live="polite">
        {GENERATION_STAGES[activeStage].term}、{GENERATION_STAGES[activeStage].number}
      </p>

      <section
        ref={(node) => { sectionRefs.current[0] = node; }}
        id="taikyoku"
        className="tk-section is-taikyoku"
      >
        <div className="tk-sticky">
          <header className="tk-opening-copy">
            <h1>易有太極</h1>
            <p>易に太極あり。</p>
          </header>
          <div className="tk-stage-copy is-bottom">
            <h2>太極</h2>
            <strong>1</strong>
            <p>すべての変化は、ひとつから。</p>
            <button type="button" className="tk-action" onClick={pulseAndContinue}>
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
            <strong>2</strong>
            <h2>両儀</h2>
            <p>ひとつの中に、二つの働き。</p>
          </div>
          <div className="tk-stage-copy is-bottom">
            <p className="tk-gesture-hint">円の内側を、横になぞる</p>
            <div className="tk-line-key" aria-label="陽爻と陰爻">
              <LineKey value="yang" label="陽" />
              <LineKey value="yin" label="陰" />
            </div>
            <small>爻 — 陰と陽をあらわす線</small>
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
            <strong>4</strong>
            <h2>四象</h2>
            <p>二つの働きが、もう一段ひらく。</p>
            <code>2² = 4</code>
          </div>
          <p className="tk-stage-note">二本目の爻が加わり、四つの相になる。</p>
        </div>
      </section>

      <section
        ref={(node) => { sectionRefs.current[3] = node; }}
        id="bagua"
        className="tk-section is-bagua"
      >
        <div className="tk-sticky">
          <div className="tk-stage-copy is-top">
            <strong>8</strong>
            <h2>八卦</h2>
            <p>三本の爻から、八つの形。</p>
            <code>2³ = 8</code>
          </div>
          <div className="tk-stage-copy is-bottom">
            <div className="tk-talents" aria-label="三才">
              <span>天<small>上</small></span>
              <span>人<small>中</small></span>
              <span>地<small>下</small></span>
            </div>
            <small>三爻、三才。天・人・地という三つの層。</small>
            <button type="button" className="tk-text-action" onClick={cycleTrigram}>
              八つの形をめぐる
            </button>
          </div>
        </div>
      </section>

      <section
        ref={(node) => { sectionRefs.current[4] = node; }}
        id="hexagrams"
        className="tk-section is-hexagrams"
      >
        <div className="tk-sticky">
          <div className="tk-stage-copy is-top">
            <strong>64</strong>
            <h2>六十四卦</h2>
            <p>八つと八つが重なり、六十四の変化へ。</p>
            <code>8 × 8 = 64　　2⁶ = 64</code>
          </div>
          <div className="tk-stage-copy is-bottom is-ending">
            {!stacked ? (
              <button type="button" className="tk-text-action" onClick={() => setStacked(true)}>
                上下を重ねる
              </button>
            ) : null}
            <p>複雑さの根にあるのは、陰と陽。</p>
            <Link href="/hakke" className="tk-primary-link">
              <span>八卦を手でつくる</span>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </Link>
            <button type="button" className="tk-replay" onClick={() => scrollToStage(0)}>
              はじめから
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M19 8a8 8 0 1 0 1 6M19 4v4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
