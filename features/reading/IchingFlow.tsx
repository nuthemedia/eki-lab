"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { castDice, castYarrow } from "@/domain/iching/cast";
import {
  hexagramFromLines,
  linesOfHexagram,
} from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import type {
  HexagramResult,
  Interpretation,
  LineType,
  RefineResult,
} from "@/domain/iching/types";
import {
  deleteReading,
  getReadingsSnapshot,
  getServerReadingsSnapshot,
  saveReading,
  subscribeReadings,
  type SavedReading,
} from "@/lib/ichingHistory";
import { CastingPlayer, CastModeSelect, type CastMode } from "./CastingStep";
import { HistoryList } from "./HistoryList";
import { InquiryCandidates } from "./InquiryCandidates";
import { InquiryConfirm } from "./InquiryConfirm";
import { InterpretationView } from "./InterpretationView";
import { WorryInput } from "./WorryInput";

type Step =
  | "input"
  | "refining"
  | "candidates"
  | "confirm"
  | "mode"
  | "casting"
  | "interpreting"
  | "result";

const MAX_REFINE_CALLS = 3;

/** ネットワーク断でもフローを止めないための最小フォールバック */
function clientFallbackRefine(rawInput: string): RefineResult {
  const head = rawInput.trim().slice(0, 60);
  return {
    summary: `「${head}${rawInput.trim().length > 60 ? "…" : ""}」という相談。`,
    category: "other",
    ambiguityLevel: "medium",
    needsClarification: false,
    clarifyingQuestion: null,
    suggestedQuestions: [
      { id: "current_flow", label: "この件の現在の流れを知りたい", inquiry: "この件の現在の流れを見る", focus: "situation" },
      { id: "push_or_wait", label: "今は進むべきか、待つべきかを見たい", inquiry: "この件について、今は進むべきか、待つべきか", focus: "timing" },
      { id: "how_to_face", label: "今どう向き合うべきか知りたい", inquiry: "この件に、今どう向き合うべきか", focus: "action" },
    ],
    recommendedInquiry: "この件に、今どう向き合うべきか",
  };
}

function clientFallbackInterpretation(reading: HexagramResult): Interpretation {
  const primary = hexagramFromLines(reading.primaryLines);
  const relating = hexagramFromLines(reading.relatingLines);
  const primaryText = primary ? HEXAGRAM_TEXTS[primary.number] : undefined;
  const relatingText = relating ? HEXAGRAM_TEXTS[relating.number] : undefined;
  const hasChanging = reading.changingLineIndexes.length > 0;
  return {
    answer: primaryText
      ? `${primary?.name}の示すところでは、${primaryText.judgment.modern}この問いについては、卦の言葉が示す姿勢を手がかりに、急がず方向を定めるのが良さそうです。`
      : "",
    essence: primaryText?.judgment.modern ?? "",
    primaryReading: primaryText
      ? `${primary?.name}の卦辞は「${primaryText.judgment.original}」。${primaryText.judgment.modern}`
      : "",
    changingReading: hasChanging
      ? reading.changingLineIndexes
          .map((i) => primaryText?.lines[i].modern ?? "")
          .join("\n")
      : null,
    relatingReading:
      hasChanging && relating && relatingText
        ? `之卦は${relating.name}。${relatingText.judgment.modern}`
        : null,
    advice:
      "卦の言葉を、いまの状況に重ねてゆっくり読み返してみてください。結論を急ぐより、小さく確かめられる一歩から始めるのがよさそうです。",
    caution:
      "易は未来を固定するものではなく、今の状況の見方を与えるものです。",
  };
}

/** 保存レコードから表示用の HexagramResult を復元する */
function readingFromSaved(saved: SavedReading): HexagramResult {
  const base = linesOfHexagram(saved.primaryNumber) ?? [];
  const primaryLines: LineType[] = base.map((line, i) =>
    saved.changingLineIndexes.includes(i)
      ? line === "yang"
        ? "old-yang"
        : "old-yin"
      : line,
  );
  const relatingLines = base.map((line, i) =>
    saved.changingLineIndexes.includes(i)
      ? line === "yang"
        ? ("yin" as const)
        : ("yang" as const)
      : line,
  );
  return {
    primaryLines,
    changingLineIndexes: saved.changingLineIndexes,
    relatingLines,
    primaryName: saved.primaryName,
    relatingName: saved.relatingName ?? undefined,
  };
}

function FlowLoading({ label }: { label: string }) {
  return (
    <div className="ik-flow-col ik-flow-center" style={{ minHeight: "50dvh" }}>
      <motion.div
        className="ik-serif"
        style={{ fontSize: 15, letterSpacing: "0.24em", color: "var(--ik-paper-dim)" }}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {label}
      </motion.div>
    </div>
  );
}

export function IchingFlow() {
  const [step, setStep] = useState<Step>("input");
  const [rawInput, setRawInput] = useState("");
  const [refine, setRefine] = useState<RefineResult | null>(null);
  const [refineSource, setRefineSource] = useState<"llm" | "fallback">("fallback");
  const [refineCalls, setRefineCalls] = useState(0);
  const [inquiry, setInquiry] = useState("");
  const [mode, setMode] = useState<CastMode>("dice");
  const [reading, setReading] = useState<HexagramResult | null>(null);
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [interpSource, setInterpSource] = useState<"llm" | "fallback">("fallback");
  const [saved, setSaved] = useState(false);
  const [viewingSaved, setViewingSaved] = useState<SavedReading | null>(null);
  const interpretStartedRef = useRef(false);
  const history = useSyncExternalStore(
    subscribeReadings,
    getReadingsSnapshot,
    getServerReadingsSnapshot,
  );

  const requestRefine = async (input: string, clarifyingAnswer?: string) => {
    setStep("refining");
    setRefineCalls((n) => n + 1);
    try {
      const res = await fetch("/api/iching/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: input, clarifyingAnswer }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as {
        result: RefineResult;
        source: "llm" | "fallback";
      };
      setRefine(data.result);
      setRefineSource(data.source);
    } catch {
      setRefine(clientFallbackRefine(input));
      setRefineSource("fallback");
    }
    setStep("candidates");
  };

  const startCasting = (selectedMode: CastMode) => {
    const cast = selectedMode === "formal" ? castYarrow() : castDice();
    interpretStartedRef.current = false;
    setMode(selectedMode);
    setReading(cast);
    setStep("casting");
  };

  const requestInterpretation = async () => {
    if (interpretStartedRef.current || !reading) return;
    interpretStartedRef.current = true;
    setStep("interpreting");
    const primary = hexagramFromLines(reading.primaryLines);
    const relating =
      reading.changingLineIndexes.length > 0
        ? hexagramFromLines(reading.relatingLines)
        : null;
    try {
      const res = await fetch("/api/iching/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput,
          finalInquiry: inquiry,
          primaryNumber: primary?.number,
          changingLineIndexes: reading.changingLineIndexes,
          relatingNumber: relating?.number ?? null,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as {
        interpretation: Interpretation;
        source: "llm" | "fallback";
      };
      setInterpretation(data.interpretation);
      setInterpSource(data.source);
    } catch {
      setInterpretation(clientFallbackInterpretation(reading));
      setInterpSource("fallback");
    }
    setStep("result");
  };

  const handleSave = () => {
    if (!reading || !interpretation || saved) return;
    const primary = hexagramFromLines(reading.primaryLines);
    if (!primary) return;
    const relating =
      reading.changingLineIndexes.length > 0
        ? hexagramFromLines(reading.relatingLines)
        : null;
    saveReading({
      rawInput,
      finalInquiry: inquiry,
      mode,
      primaryNumber: primary.number,
      primaryName: primary.name,
      changingLineIndexes: reading.changingLineIndexes,
      relatingNumber: relating?.number ?? null,
      relatingName: relating?.name ?? null,
      interpretation,
      interpretationSource: interpSource,
    });
    setSaved(true);
  };

  const reset = () => {
    setStep("input");
    setRefine(null);
    setRefineCalls(0);
    setInquiry("");
    setReading(null);
    setInterpretation(null);
    setSaved(false);
    setViewingSaved(null);
    interpretStartedRef.current = false;
  };

  // 保存済みの再読表示
  if (viewingSaved) {
    return (
      <div className="ik-flow">
        <div className="ik-flow-head">
          <span className="ik-scene-title">易のかたち</span>
          <button className="ik-link-quiet ik-linklike" onClick={() => setViewingSaved(null)}>
            もどる
          </button>
        </div>
        <InterpretationView
          inquiry={viewingSaved.finalInquiry}
          reading={readingFromSaved(viewingSaved)}
          interpretation={viewingSaved.interpretation}
          source={viewingSaved.interpretationSource}
          saved
          onSave={() => {}}
          onNewInquiry={() => {
            reset();
          }}
        />
      </div>
    );
  }

  return (
    <div className="ik-flow">
      {step !== "input" && (
        <div className="ik-flow-head">
          <span className="ik-scene-title">易のかたち</span>
          <button className="ik-link-quiet ik-linklike" onClick={reset}>
            はじめから
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="ik-flow-body"
        >
          {step === "input" && (
            <WorryInput
              initialValue={rawInput}
              onSubmit={(input) => {
                setRawInput(input);
                requestRefine(input);
              }}
              historySlot={
                <HistoryList
                  readings={history}
                  onOpen={(r) => setViewingSaved(r)}
                  onDelete={(id) => deleteReading(id)}
                />
              }
            />
          )}

          {step === "refining" && <FlowLoading label="問いを整えています" />}

          {step === "candidates" && refine && (
            <InquiryCandidates
              refine={refine}
              source={refineSource}
              canRegenerate={refineCalls < MAX_REFINE_CALLS}
              onSelect={(selected) => {
                setInquiry(selected);
                setStep("confirm");
              }}
              onClarify={(answer) => requestRefine(rawInput, answer)}
              onRegenerate={() => requestRefine(rawInput)}
            />
          )}

          {step === "confirm" && (
            <InquiryConfirm
              inquiry={inquiry}
              onConfirm={() => setStep("mode")}
              onBack={() => setStep("candidates")}
            />
          )}

          {step === "mode" && (
            <CastModeSelect inquiry={inquiry} onSelect={startCasting} />
          )}

          {step === "casting" && reading && (
            <CastingPlayer
              mode={mode}
              reading={reading}
              onResult={requestInterpretation}
            />
          )}

          {step === "interpreting" && <FlowLoading label="卦を読み解いています" />}

          {step === "result" && reading && interpretation && (
            <InterpretationView
              inquiry={inquiry}
              reading={reading}
              interpretation={interpretation}
              source={interpSource}
              saved={saved}
              onSave={handleSave}
              onNewInquiry={reset}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
