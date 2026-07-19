"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  buildCoinReading, COIN_LINE_LABELS, makeCoinCast, randomCoinCast,
  type CoinCast, type CoinFace, type CoinLineValue,
} from "@/domain/iching/coinCast";
import { hexagramFromLines, LINE_LABELS } from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import { HEXAGRAM_ENGLISH } from "@/domain/iching/hexagramEnglish";
import type { LineType } from "@/domain/iching/types";
import {
  playAiComplete, playChanging, playCoinFlip, playCoinSpin, playCoinStop, playComplete,
  playLinePlace, playSoundOn, playStart, playUndo, setCoinMuted, unlockCoinSound,
} from "@/lib/coinSound";
import {
  detailReflectionPromptsEn, guidanceForCategoryEn, normalizeCoinCategoryEn,
  type CoinCategoryEn as CoinCategory, type CoinLocaleEn as CoinLocale,
} from "@/lib/coinInterpretationEnglish";
import { categoryLabel, COIN_CATEGORIES, COIN_COPY } from "./coinEnglishCopy";
import CoinHelpDialog from "./CoinHelpDialog";

type Phase = "question" | "casting" | "result" | "detail";
type Mode = "manual" | "auto";
type AiReading = { situation: string; changingPoint: string; caution: string; action: string; reflection: string };
type CoinSessionV1 = {
  version: 1; question: string; category: CoinCategory | "総合" | "仕事" | "恋愛" | "人間関係";
  mode: Mode; coins: [CoinFace, CoinFace, CoinFace]; casts: CoinCast[]; savedAt: string;
};

const SESSION_KEY = "coin-iching-session-en-v1";
const EN_LINE_LABELS = ["First Line", "Second Line", "Third Line", "Fourth Line", "Fifth Line", "Top Line"];
const EN_COIN_LINE_LABELS: Record<CoinLineValue, string> = { 6: "Old Yin", 7: "Young Yang", 8: "Young Yin", 9: "Old Yang" };

function readSession(): (Omit<CoinSessionV1, "category"> & { category: CoinCategory }) | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as CoinSessionV1 | null;
    if (!parsed || parsed.version !== 1 || !parsed.question || !Array.isArray(parsed.casts) || parsed.casts.length === 0 || parsed.casts.length >= 6) return null;
    return { ...parsed, category: normalizeCoinCategoryEn(parsed.category) };
  } catch { return null; }
}

function clearStoredSession() { try { localStorage.removeItem(SESSION_KEY); } catch {} }

function IconButton({ locale, muted, onClick, inToolbar = false }: { locale: CoinLocale; muted: boolean; onClick: () => void; inToolbar?: boolean }) {
  const copy = COIN_COPY[locale];
  return <button className={`coin-icon-btn coin-mute${inToolbar ? " is-toolbar" : ""}`} onClick={onClick} aria-label={muted ? copy.soundOn : copy.soundOff} aria-pressed={muted}>
    {muted ? copy.soundVisibleOff : copy.soundVisibleOn}
  </button>;
}

function HelpButton({ onClick, inToolbar = false, disabled = false }: { onClick: () => void; inToolbar?: boolean; disabled?: boolean }) {
  return <button type="button" className={`coin-help-trigger${inToolbar ? " is-toolbar" : ""}`} onClick={onClick} disabled={disabled} aria-label="How coin readings work">?</button>;
}

function CoinTopbar({ label, backLabel, onBack, muted, onMute, onHelp, disabled = false }: {
  label: string; backLabel: string; onBack: () => void; muted: boolean; onMute: () => void; onHelp: () => void; disabled?: boolean;
}) {
  return <div className="coin-topbar">
    <button className="coin-back" onClick={onBack} disabled={disabled}>← {backLabel}</button>
    <span>{label}</span>
    <div className="coin-topbar-tools">
      <HelpButton onClick={onHelp} inToolbar disabled={disabled} />
      <IconButton locale="en" muted={muted} onClick={onMute} inToolbar />
    </div>
  </div>;
}

function Line({ locale, line, changing = false, empty = false }: { locale: CoinLocale; line?: LineType | "yin" | "yang"; changing?: boolean; empty?: boolean }) {
  const yin = line === "yin" || line === "old-yin";
  return <div className={`coin-line${changing ? " is-changing" : ""}${empty ? " is-empty" : ""}`}>
    {yin || empty ? <><i /><i /></> : <i className="whole" />}
    {changing && <span>{COIN_COPY[locale].changingMark}</span>}
  </div>;
}

function HexStack({ locale, lines, changing = [], showEmpty = false }: { locale: CoinLocale; lines: (LineType | "yin" | "yang")[]; changing?: number[]; showEmpty?: boolean }) {
  const slots = showEmpty ? 6 : lines.length;
  return <div className="coin-hex" aria-label={COIN_COPY[locale].hexAria}>
    {Array.from({ length: slots }, (_, displayIndex) => {
      const index = slots - 1 - displayIndex;
      const line = lines[index];
      return <motion.div key={index} initial={line ? { opacity: 0, y: 18 } : false} animate={{ opacity: 1, y: 0 }}>
        <Line locale={locale} line={line} changing={changing.includes(index)} empty={!line} />
      </motion.div>;
    })}
  </div>;
}

function CoinButton({ locale, index, face, onClick, flipping }: { locale: CoinLocale; index: number; face: CoinFace; onClick?: () => void; flipping?: boolean }) {
  const copy = COIN_COPY[locale];
  const visibleFace = face === "heads" ? copy.heads : copy.tails;
  const nextFace = face === "heads" ? copy.tails : copy.heads;
  const imageBase = locale === "en" ? "victorian-penny" : "ancient-coin";
  const aria = locale === "en" ? `Coin ${index + 1}, ${visibleFace}.${onClick ? ` Press to change to ${nextFace}.` : ""}` : `${index + 1}枚目、${visibleFace}。${onClick ? `タップで${nextFace}に変更` : ""}`;
  return <button className={`coin-disc${face === "tails" ? " is-tails" : ""}${flipping ? " is-flipping" : ""}`} onClick={onClick} disabled={!onClick || flipping} aria-label={aria}>
    <span className="coin-disc-inner" aria-hidden><Image src={`/images/coin/${imageBase}-${face}.png`} width={88} height={88} alt="" priority /></span>
    <span className="coin-face-label">{visibleFace}</span>
  </button>;
}

function ReadingPair({ locale, casts }: { locale: CoinLocale; casts: CoinCast[] }) {
  const copy = COIN_COPY[locale];
  const reading = buildCoinReading(casts);
  const primary = hexagramFromLines(reading.primaryLines)!;
  const relating = reading.changingLineIndexes.length ? hexagramFromLines(reading.relatingLines)! : null;
  const name = (number: number) => locale === "en" ? HEXAGRAM_ENGLISH[number].name : hexagramFromLines(number === primary.number ? reading.primaryLines : reading.relatingLines)!.name;
  return <div className="coin-pair">
    <div className="coin-pair-col"><small>{copy.primary} · {locale === "en" ? `Hexagram ${primary.number}` : `第${primary.number}卦`}</small><h2>{name(primary.number)}</h2><HexStack locale={locale} lines={reading.primaryLines} changing={reading.changingLineIndexes} /></div>
    {relating ? <><span className="coin-arrow">→</span><div className="coin-pair-col"><small>{copy.relating} · {locale === "en" ? `Hexagram ${relating.number}` : `第${relating.number}卦`}</small><h2>{name(relating.number)}</h2><HexStack locale={locale} lines={reading.relatingLines} /></div></> : <div className="coin-no-change"><b>{copy.noRelating}</b></div>}
  </div>;
}

export default function CoinEnglishApp({ initialQuestion = "" }: { initialQuestion?: string }) {
  const locale: CoinLocale = "en";
  const copy = COIN_COPY.en;
  const isEn = true;
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("question");
  const [question, setQuestion] = useState(initialQuestion);
  const [category, setCategory] = useState<CoinCategory>("general");
  const [mode, setMode] = useState<Mode>("manual");
  const [coins, setCoins] = useState<[CoinFace, CoinFace, CoinFace]>(["heads", "heads", "heads"]);
  const [casts, setCasts] = useState<CoinCast[]>([]);
  const [rolling, setRolling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [settledCoinCount, setSettledCoinCount] = useState(3);
  const [muted, setMuted] = useState(false);
  const [ai, setAi] = useState<AiReading | null>(null);
  const [aiSource, setAiSource] = useState<"llm" | "fallback" | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiStage, setAiStage] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const [resumeSession, setResumeSession] = useState<ReturnType<typeof readSession>>(null);
  const [announcement, setAnnouncement] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const screenTitleRef = useRef<HTMLHeadingElement>(null);
  const rollTimersRef = useRef<number[]>([]);
  const completionTimerRef = useRef<number | null>(null);
  const castLockedRef = useRef(false);

  useEffect(() => { const timer = window.setTimeout(() => { setMuted(false); setCoinMuted(false); setResumeSession(readSession()); }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => () => { rollTimersRef.current.forEach(window.clearTimeout); if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current); }, []);
  useEffect(() => {
    if (phase !== "casting" || !question.trim() || casts.length === 0 || casts.length >= 6) return;
    const session: CoinSessionV1 = { version: 1, question, category, mode, coins, casts, savedAt: new Date().toISOString() };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
  }, [phase, question, category, mode, coins, casts]);
  useEffect(() => { const timer = window.setTimeout(() => { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); screenTitleRef.current?.focus({ preventScroll: true }); }, reduced ? 0 : 450); return () => window.clearTimeout(timer); }, [phase, reduced]);
  useEffect(() => { if (!aiBusy) return; const timer = window.setInterval(() => setAiStage((current) => Math.min(current + 1, copy.aiLoading.length - 1)), 1600); return () => window.clearInterval(timer); }, [aiBusy, copy.aiLoading.length]);

  const reading = useMemo(() => casts.length === 6 ? buildCoinReading(casts) : null, [casts]);
  const hasInProgressCast = casts.length > 0 && casts.length < 6;
  const primary = reading ? hexagramFromLines(reading.primaryLines) : null;
  const relating = reading && reading.changingLineIndexes.length ? hexagramFromLines(reading.relatingLines) : null;
  const entry = primary ? (isEn ? HEXAGRAM_ENGLISH[primary.number] : HEXAGRAM_DICTIONARY[primary.number]) : null;
  const text = primary ? (isEn ? HEXAGRAM_ENGLISH[primary.number] : HEXAGRAM_TEXTS[primary.number]) : null;
  const categoryGuidance = primary ? guidanceForCategoryEn(primary.number, category) : "";
  const reflectionPrompts = primary ? detailReflectionPromptsEn(question, category, primary.number, relating?.number ?? null) : [];
  const lineLabels = isEn ? EN_LINE_LABELS : LINE_LABELS;
  const coinLineLabels = isEn ? EN_COIN_LINE_LABELS : COIN_LINE_LABELS;
  const hexName = (number: number) => isEn ? HEXAGRAM_ENGLISH[number].name : (number === primary?.number ? primary.name : relating?.name ?? "");

  const cancelRoll = () => { rollTimersRef.current.forEach(window.clearTimeout); rollTimersRef.current = []; if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current); completionTimerRef.current = null; castLockedRef.current = false; setRolling(false); setCompleting(false); setSettledCoinCount(3); };
  const toggleMute = () => { unlockCoinSound(); const next = !muted; setMuted(next); setCoinMuted(next); if (!next) window.setTimeout(playSoundOn, 35); };
  const reset = () => { cancelRoll(); clearStoredSession(); setResumeSession(null); setQuestion(""); setCategory("general"); setCasts([]); setCoins(["heads", "heads", "heads"]); setAi(null); setAiSource(null); setAiError(null); setPhase("question"); };
  const start = () => { if (!question.trim()) return; unlockCoinSound(); if (hasInProgressCast) { setPhase("casting"); return; } castLockedRef.current = false; setCompleting(false); playStart(); clearStoredSession(); setResumeSession(null); setCasts([]); setAi(null); setAiSource(null); setPhase("casting"); };
  const resume = () => { if (!resumeSession) return; castLockedRef.current = false; setCompleting(false); setQuestion(resumeSession.question); setCategory(resumeSession.category); setMode(resumeSession.mode); setCoins(resumeSession.coins); setCasts(resumeSession.casts); setResumeSession(null); setPhase("casting"); };
  const discardSession = () => { clearStoredSession(); setResumeSession(null); };
  const restartCast = () => { cancelRoll(); clearStoredSession(); setResumeSession(null); setCasts([]); setCoins(["heads", "heads", "heads"]); setAi(null); setAiSource(null); setAnnouncement(isEn ? "The unfinished reading was discarded." : "途中の起卦を破棄しました。"); };
  const place = (cast: CoinCast) => {
    if (castLockedRef.current || completing || casts.length >= 6) return;
    const next = [...casts, cast]; setCasts(next); playLinePlace();
    setAnnouncement(isEn ? `Toss ${next.length}: ${coinLineLabels[cast.value]} was placed.` : `${next.length}投目、${coinLineLabels[cast.value]}の爻を置きました。`);
    if (next.length === 6) {
      castLockedRef.current = true;
      setCompleting(true);
      clearStoredSession();
      completionTimerRef.current = window.setTimeout(() => {
        if (next.some((item) => item.value === 6 || item.value === 9)) playChanging();
        playComplete();
        setAnnouncement(isEn ? "All six lines are complete. Showing the result." : "六本の爻が揃いました。結果を表示します。");
        setCompleting(false);
        completionTimerRef.current = null;
        setPhase("result");
      }, reduced ? 120 : 700);
    }
  };
  const roll = () => {
    if (rolling || completing || castLockedRef.current || casts.length >= 6) return; unlockCoinSound(); setRolling(true); setSettledCoinCount(0); playCoinSpin(); const result = randomCoinCast();
    const stopTimes = reduced ? [60, 90, 120] : [800, 900, 1000];
    rollTimersRef.current = stopTimes.map((delay, index) => window.setTimeout(() => { setCoins((current) => current.map((face, coinIndex) => coinIndex === index ? result.coins[index] : face) as [CoinFace, CoinFace, CoinFace]); setSettledCoinCount(index + 1); playCoinStop(index); }, delay));
    rollTimersRef.current.push(window.setTimeout(() => { setRolling(false); setSettledCoinCount(3); place(result); rollTimersRef.current = []; }, reduced ? 180 : 1400));
  };
  const toggleCoin = (index: number) => { if (rolling || completing || castLockedRef.current || casts.length >= 6) return; unlockCoinSound(); playCoinFlip(); setCoins((current) => current.map((face, coinIndex) => coinIndex === index ? (face === "heads" ? "tails" : "heads") : face) as [CoinFace, CoinFace, CoinFace]); };
  const undoCast = () => { if (mode !== "manual" || rolling || completing || castLockedRef.current || casts.length === 0) return; const removed = casts[casts.length - 1]; setCasts((current) => current.slice(0, -1)); setCoins(removed.coins); playUndo(); setAnnouncement(isEn ? `Toss ${casts.length} was undone.` : `${casts.length}投目を取り消しました。`); };
  const askAi = async () => {
    if (!reading || !primary || aiBusy) return; setAiBusy(true); setAiStage(0); setAi(null); setAiSource(null); setAiError(null); setAnnouncement(isEn ? "AI is reading the question with the hexagram." : "AIが問いと卦を読み合わせています。"); unlockCoinSound();
    try {
      const response = await fetch("/api/iching/coin-interpret/en", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, category, primaryNumber: primary.number, changingLineIndexes: reading.changingLineIndexes, relatingNumber: relating?.number ?? null }) });
      if (!response.ok) throw new Error(); const data = await response.json(); setAi(data.interpretation); setAiSource(data.source); playAiComplete(); setAnnouncement(isEn ? "The AI reflection is ready." : "AIと読んだ結果を表示しました。");
    } catch { setAiError(copy.aiError); setAnnouncement(isEn ? "The AI reflection could not be prepared." : "AIの読みを用意できませんでした。"); }
    finally { setAiBusy(false); }
  };

  const changingSummary = reading ? reading.changingLineIndexes.length === 0 ? copy.noChanging : reading.changingLineIndexes.length === 6 ? copy.allChanging : reading.changingLineIndexes.length >= 3 ? copy.changingCount(reading.changingLineIndexes.length, reading.changingLineIndexes.map((index) => lineLabels[index]).join(isEn ? ", " : "・")) : copy.changingLabels(reading.changingLineIndexes.map((index) => lineLabels[index]).join(isEn ? ", " : "・")) : "";

  return <main className="coin-app coin-en-app" lang={locale}>
    {phase === "question" && <><HelpButton onClick={() => setHelpOpen(true)} /><IconButton locale={locale} muted={muted} onClick={toggleMute} /></>}
    <CoinHelpDialog locale="en" open={helpOpen} onClose={() => setHelpOpen(false)} />
    <div className="coin-sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
    <AnimatePresence mode="wait">
      {phase === "question" && <motion.section key="question" className="coin-screen coin-question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <header className="coin-hero"><h1 ref={screenTitleRef} tabIndex={-1}>{copy.title}</h1><p>{copy.tagline}</p></header>
        {resumeSession && <div className="coin-resume"><p>{copy.resume(resumeSession.casts.length)}</p><div><button className="coin-secondary" onClick={resume}>{copy.resumeButton}</button><button className="coin-link-button" onClick={discardSession}>{copy.fromStart}</button></div></div>}
        <div className="coin-glass coin-question-card"><label htmlFor={`question-${locale}`}>{copy.questionLabel}</label><textarea id={`question-${locale}`} maxLength={200} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={copy.questionPlaceholder} aria-describedby={`question-help-${locale} question-required-${locale}`} /><p id={`question-help-${locale}`}>{copy.questionHelp}</p><span id={`question-required-${locale}`} className="coin-required-hint">{copy.questionRequired}</span></div>
        <div className="coin-categories" aria-label={copy.categoryAria}>{COIN_CATEGORIES.map((item) => <button key={item} className={category === item ? "is-selected" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{categoryLabel(item, locale)}</button>)}</div>
        <div className="coin-ambient" aria-hidden>{[0, 1, 2].map((index) => <span className="coin-ambient-coin" key={index}><span className="coin-ambient-inner"><Image className="coin-ambient-front" src={`/images/coin/${isEn ? "victorian-penny" : "ancient-coin"}-heads.png`} width={56} height={56} alt="" priority /><Image className="coin-ambient-back" src={`/images/coin/${isEn ? "victorian-penny" : "ancient-coin"}-tails.png`} width={56} height={56} alt="" priority /></span></span>)}</div>
        {isEn && <p className="coin-intro-note">The I Ching does not fix the future. It offers a pattern for reflecting on the situation you are in now.</p>}
        <button className="coin-primary" onClick={start} disabled={!question.trim()}>{hasInProgressCast ? copy.returnToCast : copy.start} <span>→</span></button>
        {hasInProgressCast && <button className="coin-link-button coin-restart-cast" onClick={restartCast}>{copy.discardCast}</button>}
      </motion.section>}

      {phase === "casting" && <motion.section key="casting" className="coin-screen coin-casting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <CoinTopbar label={copy.throwCount(Math.min(casts.length + 1, 6))} backLabel={copy.backQuestion} onBack={() => setPhase("question")} muted={muted} onMute={toggleMute} onHelp={() => setHelpOpen(true)} disabled={rolling || completing} /><h1 ref={screenTitleRef} tabIndex={-1}>{copy.title}</h1>
        <div className="coin-tabs" role="tablist" aria-label={copy.methodAria}><button role="tab" aria-selected={mode === "manual"} className={mode === "manual" ? "is-active" : ""} onClick={() => setMode("manual")} disabled={rolling || completing}>{copy.manual}</button><button role="tab" aria-selected={mode === "auto"} className={mode === "auto" ? "is-active" : ""} onClick={() => setMode("auto")} disabled={rolling || completing}>{copy.auto}</button></div>
        <div className="coin-progress">{completing ? <><h2>All six lines are complete</h2><p>Preparing your reading.</p></> : <><h2>{copy.makeLine(copy.positions[Math.min(casts.length, 5)])}</h2><p>{mode === "manual" ? copy.manualHelp : copy.autoHelp}</p></>}</div>
        <div className="coin-cast-stage"><div className="coin-discs">{coins.map((face, index) => <CoinButton key={index} locale={locale} index={index} face={face} flipping={rolling && index >= settledCoinCount} onClick={mode === "manual" && !completing ? () => toggleCoin(index) : undefined} />)}</div><div className="coin-sum">{copy.coinSum(coins.filter((coin) => coin === "heads").length, makeCoinCast(coins).value, coinLineLabels[makeCoinCast(coins).value])}</div></div>
        <div className="coin-build"><div className="coin-direction">{copy.direction}</div><HexStack locale={locale} lines={casts.map((cast) => cast.line)} changing={casts.flatMap((cast, index) => cast.value === 6 || cast.value === 9 ? [index] : [])} showEmpty /></div>
        {!completing && <div className="coin-cast-actions">{mode === "manual" ? <><button className="coin-primary" onClick={() => place(makeCoinCast(coins))} disabled={casts.length >= 6}>{copy.place} <span>→</span></button><button className="coin-undo" onClick={undoCast} disabled={rolling || casts.length === 0}>{copy.undo}</button></> : <button className="coin-primary" onClick={roll} disabled={rolling || casts.length >= 6}>{rolling ? copy.rolling : copy.roll}</button>}</div>}
      </motion.section>}

      {(phase === "result" || phase === "detail") && reading && primary && entry && text && <motion.section key={phase} className={`coin-screen coin-${phase}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <CoinTopbar label={phase === "detail" ? copy.readFromHexagram : copy.result} backLabel={phase === "detail" ? copy.backResult : copy.backStart} onBack={() => phase === "detail" ? setPhase("result") : reset()} muted={muted} onMute={toggleMute} onHelp={() => setHelpOpen(true)} /><h1 ref={screenTitleRef} tabIndex={-1}>{phase === "detail" ? copy.readFromHexagram : copy.title}</h1>
        {phase === "result" ? <>
          <div className="coin-inquiry"><small>{copy.yourQuestion}</small><p>{question}</p><span>{categoryLabel(category, locale)}</span></div>
          <div className="coin-glass coin-result-card"><ReadingPair locale={locale} casts={casts} /><div className="coin-change-label">{changingSummary}</div><div className="coin-keywords">{entry.keywords.map((word, index) => <motion.span key={word} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 * index }}>{word}</motion.span>)}</div><p className="coin-essence">{entry.essence}</p><blockquote>{isEn ? text.judgment.modern : text.judgment.original}<cite>— {isEn ? `The I Ching, Hexagram ${primary.number}` : `『易経』第${primary.number}卦`}</cite></blockquote></div>
          <div className="coin-actions"><button className="coin-primary" onClick={() => setPhase("detail")}>{copy.readFromHexagram} <span>→</span></button><div className="coin-ai-action"><button className="coin-secondary" onClick={askAi} disabled={aiBusy} aria-busy={aiBusy}>{aiBusy ? copy.aiReading : copy.aiRead}</button></div><p className="coin-ai-privacy">{copy.aiPrivacy}</p></div>
        </> : <div className="coin-detail-body">
          <div className="coin-detail-summary">{copy.summaryPrimary} {isEn ? `${primary.number}. ${hexName(primary.number)} (${HEXAGRAM_ENGLISH[primary.number].pinyin}, ${HEXAGRAM_ENGLISH[primary.number].chineseName})` : `第${primary.number}卦 ${primary.name}`}{reading.changingLineIndexes.length ? ` — ${copy.summaryChanging}: ${reading.changingLineIndexes.map((index) => lineLabels[index]).join(isEn ? ", " : "・")} — ${copy.summaryRelating}: ${relating ? hexName(relating.number) : ""}` : ` — ${copy.noChanging}`}</div>
          <nav className="coin-detail-nav" aria-label={copy.contentsAria}><a href="#coin-judgment">{copy.judgment}</a>{reading.changingLineIndexes.length > 0 && <a href="#coin-changing">{copy.changingLines}</a>}{relating && <a href="#coin-relating">{copy.relating}</a>}<a href="#coin-hints">{copy.hints}</a></nav>
          <p className="coin-reading-source">{copy.sourceNote}{isEn && <> <a href="https://ctext.org/book-of-changes/yi-jing" target="_blank" rel="noopener noreferrer">Source text</a> · <a href="https://sacred-texts.com/ich/ictp.htm" target="_blank" rel="noopener noreferrer">Legge edition</a></>}</p>
          <section><h2>{copy.overview}</h2><p>{entry.trigramSymbolism}</p><p>{entry.classical}</p></section>
          <section id="coin-judgment"><h2>{copy.judgment}</h2>{isEn ? <><h3>{copy.modernJudgment}</h3><p>{text.judgment.modern}</p><details className="coin-original"><summary>Classical Chinese</summary><p lang="zh-Hant">{text.judgment.original}</p></details></> : <><p>{text.judgment.original}</p><h3>{copy.modernJudgment}</h3><p>{text.judgment.modern}</p></>}</section>
          <div id="coin-changing">{reading.changingLineIndexes.map((index) => <section key={index}><h2>{copy.changingLineText} ({lineLabels[index]})</h2>{isEn ? <><h3>{copy.modernLineText}</h3><p>{text.lines[index].modern}</p><details className="coin-original"><summary>Classical Chinese</summary><p lang="zh-Hant">{text.lines[index].original}</p></details></> : <><p>{text.lines[index].original}</p><h3>{copy.modernLineText}</h3><p>{text.lines[index].modern}</p></>}</section>)}</div>
          {relating && <section id="coin-relating"><h2>{copy.relatingMeaning}</h2><p>{isEn ? HEXAGRAM_ENGLISH[relating.number].modern : HEXAGRAM_DICTIONARY[relating.number].modern}</p></section>}
          <section><h2>{copy.keywords}</h2><div className="coin-keywords">{entry.keywords.map((word) => <span key={word}>{word}</span>)}</div></section>
          <section id="coin-hints"><h2>{copy.hints}</h2><p>{entry.modern}</p><h3>{copy.categoryView(categoryLabel(category, locale))}</h3><p>{categoryGuidance}</p><h3>{copy.askYourself}</h3><ul>{reflectionPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul></section>
          <section><h2>{copy.caution}</h2><p>{copy.cautionText}</p></section>
          <div className="coin-ai-callout"><p>{copy.aiPrivacy}</p><button className="coin-secondary" onClick={askAi} disabled={aiBusy} aria-busy={aiBusy}>{aiBusy ? copy.aiReading : copy.aiRead}</button></div>
        </div>}
        {aiError && <p className="coin-error">{aiError}</p>}
        {aiBusy && <div className="coin-ai-loading coin-glass" role="status" aria-live="polite" aria-busy="true"><div className="coin-ai-orbit" aria-hidden><i /><i /><i /></div><p>{copy.aiLoading[aiStage]}</p><small>{copy.aiLoadingHelp}</small></div>}
        {ai && <motion.div className="coin-ai coin-glass" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}><h2>{copy.aiResult}</h2>{aiSource === "fallback" && <p className="coin-ai-source">{copy.fallback}</p>}{[[copy.aiLabels[0], ai.situation], [copy.aiLabels[1], ai.changingPoint], [copy.aiLabels[2], ai.caution], [copy.aiLabels[3], ai.action], [copy.aiLabels[4], ai.reflection]].map(([label, value], index) => <motion.section key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : index * .06 }}><h3>{label}</h3><p>{value}</p></motion.section>)}</motion.div>}
        <div className="coin-end-actions coin-glass"><button className="coin-secondary coin-restart-button" onClick={reset}>{copy.again}</button></div>
      </motion.section>}
    </AnimatePresence>
    {phase === "question" && <section className="coin-home-support" aria-labelledby={`coin-kofi-title-${locale}`}><div className="coin-kofi-divider" aria-hidden="true" /><aside className="coin-kofi-card"><h2 id={`coin-kofi-title-${locale}`}>{copy.support}</h2><a href="https://ko-fi.com/awaicommons" target="_blank" rel="noopener noreferrer" className="coin-kofi-link">{copy.supportLink}</a></aside></section>}
  </main>;
}
