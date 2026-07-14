"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { TRIGRAMS } from "@/domain/iching/hexagrams";
import {
  GENERATION_STAGES,
  type HexagramPhase,
} from "@/data/taikyoku/generation";
import { stageIndexAt } from "@/data/taikyoku/camera";
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
  const ambient = useAmbientSound(activeStage);
  const fieldOpen = hexagramPhase === "field";

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
            progress={scrollYProgress}
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
            onClick={() => {
              setHexagramPhase("stacked");
              setSelectedHexagramPanel(null);
            }}
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
        </>
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
              <span>これ両儀を生じ、</span>
              <span>両儀は四象を生じ、</span>
              <span>四象は八卦を生ず。</span>
            </p>
          </header>
          <div className="tk-stage-copy is-bottom">
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
            <h2>両儀</h2>
            <span className="tk-generation-number">生成数　二</span>
            <p>ひとつの中に、二つの働き。</p>
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
            <p>二つの働きが、もう一段ひらく。</p>
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
            <span><i />天</span>
            <span><i />人</span>
            <span><i />地</span>
          </div>
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
        className="tk-section is-hexagrams"
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
