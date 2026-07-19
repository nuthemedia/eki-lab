"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  buildCoinReading, COIN_LINE_LABELS, makeCoinCast, randomCoinCast,
  type CoinCast, type CoinFace,
} from "@/domain/iching/coinCast";
import { hexagramFromLines, LINE_LABELS } from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import type { LineType } from "@/domain/iching/types";
import {
  playAiComplete, playChanging, playCoinFlip, playCoinSpin, playCoinStop, playComplete,
  playLinePlace, playSoundOn, playStart, playUndo, setCoinMuted, unlockCoinSound,
} from "@/lib/coinSound";
import {
  detailReflectionPrompts, guidanceForCategory, type CoinCategory,
} from "@/lib/coinInterpretation";
import CoinHelpDialog from "./CoinHelpDialog";

type Phase = "question" | "casting" | "result" | "detail";
type Category = CoinCategory;
type Mode = "manual" | "auto";
type AiReading = {
  situation: string; changingPoint: string; caution: string; action: string; reflection: string;
};

type CoinSessionV1 = {
  version: 1;
  question: string;
  category: Category;
  mode: Mode;
  coins: [CoinFace, CoinFace, CoinFace];
  casts: CoinCast[];
  savedAt: string;
};

const CATEGORIES: Category[] = ["総合", "仕事", "恋愛", "人間関係"];
const POSITION_NAMES = ["一番下", "二爻目", "三爻目", "四爻目", "五爻目", "一番上"];
const AI_LOADING_STEPS = ["卦と問いを重ねています", "変爻を確かめています", "言葉を整えています"];
const SESSION_KEY = "coin-iching-session-v1";

function readSession(): CoinSessionV1 | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as CoinSessionV1 | null;
    if (!parsed || parsed.version !== 1 || !parsed.question || !Array.isArray(parsed.casts) || parsed.casts.length === 0 || parsed.casts.length >= 6) return null;
    return parsed;
  } catch { return null; }
}

function clearStoredSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

function IconButton({ muted, onClick, inToolbar = false }: { muted: boolean; onClick: () => void; inToolbar?: boolean }) {
  return <button className={`coin-icon-btn coin-mute${inToolbar ? " is-toolbar" : ""}`} onClick={onClick} aria-label={muted ? "音を出す" : "音を消す"} aria-pressed={muted}>
    {muted ? "音×" : "音"}
  </button>;
}

function HelpButton({ onClick, inToolbar = false, disabled = false }: { onClick: () => void; inToolbar?: boolean; disabled?: boolean }) {
  return <button type="button" className={`coin-help-trigger${inToolbar ? " is-toolbar" : ""}`} onClick={onClick} disabled={disabled} aria-label="コイン易占いのやり方">?</button>;
}

function CoinTopbar({ label, backLabel, onBack, muted, onMute, onHelp, disabled = false }: { label: string; backLabel: string; onBack: () => void; muted: boolean; onMute: () => void; onHelp: () => void; disabled?: boolean }) {
  return <div className="coin-topbar">
    <button className="coin-back" onClick={onBack} disabled={disabled}>← {backLabel}</button>
    <span>{label}</span>
    <div className="coin-topbar-tools">
      <HelpButton onClick={onHelp} inToolbar disabled={disabled} />
      <IconButton muted={muted} onClick={onMute} inToolbar />
    </div>
  </div>;
}

function Line({ line, changing = false, empty = false }: { line?: LineType | "yin" | "yang"; changing?: boolean; empty?: boolean }) {
  const yin = line === "yin" || line === "old-yin";
  return <div className={`coin-line${changing ? " is-changing" : ""}${empty ? " is-empty" : ""}`}>
    {yin || empty ? <><i /><i /></> : <i className="whole" />}
    {changing && <span>変</span>}
  </div>;
}

function HexStack({ lines, changing = [], showEmpty = false }: { lines: (LineType | "yin" | "yang")[]; changing?: number[]; showEmpty?: boolean }) {
  const slots = showEmpty ? 6 : lines.length;
  return <div className="coin-hex" aria-label="卦。下から上に積みます">
    {Array.from({ length: slots }, (_, displayIndex) => {
      const index = slots - 1 - displayIndex;
      const line = lines[index];
      return <motion.div key={index} initial={line ? { opacity: 0, y: 18 } : false} animate={{ opacity: 1, y: 0 }}>
        <Line line={line} changing={changing.includes(index)} empty={!line} />
      </motion.div>;
    })}
  </div>;
}

function CoinButton({ index, face, onClick, flipping }: { index: number; face: CoinFace; onClick?: () => void; flipping?: boolean }) {
  const visibleFace = face === "heads" ? "表" : "裏";
  const nextFace = face === "heads" ? "裏" : "表";
  return <button className={`coin-disc${face === "tails" ? " is-tails" : ""}${flipping ? " is-flipping" : ""}`} onClick={onClick} disabled={!onClick || flipping} aria-label={`${index + 1}枚目、${visibleFace}。${onClick ? `タップで${nextFace}に変更` : ""}`}>
    <span className="coin-disc-inner" aria-hidden>
      <Image src={face === "heads" ? "/images/coin/ancient-coin-heads.png" : "/images/coin/ancient-coin-tails.png"} width={88} height={88} alt="" priority />
    </span>
    <span className="coin-face-label">{visibleFace}</span>
  </button>;
}

function ReadingPair({ casts }: { casts: CoinCast[] }) {
  const reading = buildCoinReading(casts);
  const primary = hexagramFromLines(reading.primaryLines)!;
  const relating = reading.changingLineIndexes.length ? hexagramFromLines(reading.relatingLines)! : null;
  return <div className="coin-pair">
    <div className="coin-pair-col"><small>本卦　第{primary.number}卦</small><h2>{primary.name}</h2><HexStack lines={reading.primaryLines} changing={reading.changingLineIndexes} /></div>
    {relating ? <><span className="coin-arrow">→</span><div className="coin-pair-col"><small>之卦　第{relating.number}卦</small><h2>{relating.name}</h2><HexStack lines={reading.relatingLines} /></div></> : <div className="coin-no-change"><b>之卦なし</b></div>}
  </div>;
}

export default function CoinApp() {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("question");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<Category>("総合");
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
  const [resumeSession, setResumeSession] = useState<CoinSessionV1 | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const screenTitleRef = useRef<HTMLHeadingElement>(null);
  const rollTimersRef = useRef<number[]>([]);
  const completionTimerRef = useRef<number | null>(null);
  const castLockedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMuted(false);
      setCoinMuted(false);
      setResumeSession(readSession());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => () => {
    rollTimersRef.current.forEach(window.clearTimeout);
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
  }, []);
  useEffect(() => {
    if (phase !== "casting" || !question.trim() || casts.length === 0 || casts.length >= 6) return;
    const session: CoinSessionV1 = { version: 1, question, category, mode, coins, casts, savedAt: new Date().toISOString() };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
  }, [phase, question, category, mode, coins, casts]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      screenTitleRef.current?.focus({ preventScroll: true });
    }, reduced ? 0 : 450);
    return () => window.clearTimeout(timer);
  }, [phase, reduced]);
  useEffect(() => {
    if (!aiBusy) return;
    const timer = window.setInterval(() => setAiStage(current => Math.min(current + 1, AI_LOADING_STEPS.length - 1)), 1600);
    return () => window.clearInterval(timer);
  }, [aiBusy]);
  const reading = useMemo(() => casts.length === 6 ? buildCoinReading(casts) : null, [casts]);
  const hasInProgressCast = casts.length > 0 && casts.length < 6;
  const primary = reading ? hexagramFromLines(reading.primaryLines) : null;
  const relating = reading && reading.changingLineIndexes.length ? hexagramFromLines(reading.relatingLines) : null;
  const dictionary = primary ? HEXAGRAM_DICTIONARY[primary.number] : null;
  const text = primary ? HEXAGRAM_TEXTS[primary.number] : null;
  const categoryGuidance = primary ? guidanceForCategory(primary.number, category) : "";
  const reflectionPrompts = primary ? detailReflectionPrompts(question, category, primary.number, relating?.number ?? null) : [];

  const cancelRoll = () => {
    rollTimersRef.current.forEach(window.clearTimeout);
    rollTimersRef.current = [];
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    completionTimerRef.current = null;
    castLockedRef.current = false;
    setRolling(false);
    setCompleting(false);
    setSettledCoinCount(3);
  };

  const toggleMute = () => {
    unlockCoinSound();
    const next = !muted;
    setMuted(next);
    setCoinMuted(next);
    if (!next) window.setTimeout(playSoundOn, 35);
  };
  const start = () => {
    if (!question.trim()) return;
    unlockCoinSound();
    if (hasInProgressCast) { setPhase("casting"); return; }
    castLockedRef.current = false; setCompleting(false); playStart(); clearStoredSession(); setResumeSession(null); setCasts([]); setAi(null); setAiSource(null); setPhase("casting");
  };
  const resume = () => {
    if (!resumeSession) return;
    castLockedRef.current = false; setCompleting(false); setQuestion(resumeSession.question); setCategory(resumeSession.category); setMode(resumeSession.mode);
    setCoins(resumeSession.coins); setCasts(resumeSession.casts); setResumeSession(null); setPhase("casting");
  };
  const discardSession = () => { clearStoredSession(); setResumeSession(null); };
  const restartCast = () => {
    cancelRoll(); clearStoredSession(); setResumeSession(null); setCasts([]); setCoins(["heads", "heads", "heads"]); setAi(null); setAiSource(null); setAnnouncement("途中の起卦を破棄しました。");
  };
  const reset = () => { cancelRoll(); clearStoredSession(); setResumeSession(null); setQuestion(""); setCasts([]); setAi(null); setAiSource(null); setAiError(null); setAnnouncement(""); setPhase("question"); };

  const place = (cast: CoinCast) => {
    if (castLockedRef.current || completing || casts.length >= 6) return;
    const next = [...casts, cast]; setCasts(next); playLinePlace();
    setAnnouncement(`${next.length}投目、${COIN_LINE_LABELS[cast.value]}の爻を置きました。`);
    if (next.length === 6) {
      castLockedRef.current = true;
      setCompleting(true);
      clearStoredSession();
      completionTimerRef.current = window.setTimeout(() => {
        if (next.some(c => c.value === 6 || c.value === 9)) playChanging();
        playComplete();
        setAnnouncement("六本の爻が揃いました。結果を表示します。");
        setCompleting(false);
        completionTimerRef.current = null;
        setPhase("result");
      }, reduced ? 120 : 700);
    }
  };
  const roll = () => {
    if (rolling || completing || castLockedRef.current || casts.length >= 6) return;
    unlockCoinSound(); setRolling(true); setSettledCoinCount(0); playCoinSpin();
    const result = randomCoinCast();
    const stopTimes = reduced ? [60, 90, 120] : [800, 900, 1000];
    rollTimersRef.current = stopTimes.map((delay, index) => window.setTimeout(() => {
      setCoins(current => current.map((face, coinIndex) => coinIndex === index ? result.coins[index] : face) as [CoinFace, CoinFace, CoinFace]);
      setSettledCoinCount(index + 1);
      playCoinStop(index);
    }, delay));
    rollTimersRef.current.push(window.setTimeout(() => {
      setRolling(false); setSettledCoinCount(3); place(result); rollTimersRef.current = [];
    }, reduced ? 180 : 1400));
  };
  const toggleCoin = (index: number) => {
    if (rolling || completing || castLockedRef.current || casts.length >= 6) return;
    unlockCoinSound(); playCoinFlip(); setCoins(current => current.map((face, i) => i === index ? (face === "heads" ? "tails" : "heads") : face) as [CoinFace, CoinFace, CoinFace]);
  };
  const undoCast = () => {
    if (mode !== "manual" || rolling || completing || castLockedRef.current || casts.length === 0) return;
    const removed = casts[casts.length - 1];
    setCasts(current => current.slice(0, -1));
    setCoins(removed.coins);
    playUndo();
    setAnnouncement(`${casts.length}投目を取り消しました。`);
  };

  const askAi = async () => {
    if (!reading || !primary || aiBusy) return; setAiBusy(true); setAiStage(0); setAi(null); setAiSource(null); setAiError(null); setAnnouncement("AIが問いと卦を読み合わせています。"); unlockCoinSound();
    try {
      const response = await fetch("/api/iching/coin-interpret", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, category, primaryNumber: primary.number, changingLineIndexes: reading.changingLineIndexes, relatingNumber: relating?.number ?? null }) });
      if (!response.ok) throw new Error(); const data = await response.json(); setAi(data.interpretation); setAiSource(data.source); playAiComplete(); setAnnouncement("AIと読んだ結果を表示しました。");
    } catch { setAiError("AIと読んだ結果を用意できませんでした。時間をおいてお試しください。"); setAnnouncement("AIの読みを用意できませんでした。"); }
    finally { setAiBusy(false); }
  };

  return <main className="coin-app">
    {phase === "question" && <><HelpButton onClick={() => setHelpOpen(true)} /><IconButton muted={muted} onClick={toggleMute} /></>}
    <CoinHelpDialog locale="ja" open={helpOpen} onClose={() => setHelpOpen(false)} />
    <div className="coin-sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
    <AnimatePresence mode="wait">
      {phase === "question" && <motion.section key="question" className="coin-screen coin-question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <header className="coin-hero"><h1 ref={screenTitleRef} tabIndex={-1}>コイン易占い</h1><p>問いを立て、コインを投げ、卦を読む。</p></header>
        {resumeSession && <div className="coin-resume"><p>途中の起卦があります（{resumeSession.casts.length}投目まで）</p><div><button className="coin-secondary" onClick={resume}>続きから</button><button className="coin-link-button" onClick={discardSession}>最初から</button></div></div>}
        <div className="coin-glass coin-question-card"><label htmlFor="question">いま問いたいことを書いてください</label><textarea id="question" maxLength={200} value={question} onChange={e => setQuestion(e.target.value)} placeholder="例：この仕事を進める上で、今注意すべきことは？" aria-describedby="question-help question-required" /><p id="question-help">問いをより具体的にしてみましょう（占的をしぼる）</p><span id="question-required" className="coin-required-hint">問いを入力すると始められます。</span></div>
        <div className="coin-categories" aria-label="質問カテゴリ">{CATEGORIES.map(item => <button key={item} className={category === item ? "is-selected" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
        <div className="coin-ambient" aria-hidden>{[0, 1, 2].map(index => <span className="coin-ambient-coin" key={index}><span className="coin-ambient-inner"><Image className="coin-ambient-front" src="/images/coin/ancient-coin-heads.png" width={56} height={56} alt="" priority /><Image className="coin-ambient-back" src="/images/coin/ancient-coin-tails.png" width={56} height={56} alt="" priority /></span></span>)}</div>
        <button className="coin-primary" onClick={start} disabled={!question.trim()}>{hasInProgressCast ? "起卦に戻る" : "占いをはじめる"} <span>→</span></button>
        {hasInProgressCast && <button className="coin-link-button coin-restart-cast" onClick={restartCast}>途中の起卦を破棄して最初から</button>}
      </motion.section>}

      {phase === "casting" && <motion.section key="casting" className="coin-screen coin-casting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <CoinTopbar label={`${Math.min(casts.length + 1, 6)}投目 / 6`} backLabel="問いに戻る" onBack={() => setPhase("question")} muted={muted} onMute={toggleMute} onHelp={() => setHelpOpen(true)} disabled={rolling || completing} /><h1 ref={screenTitleRef} tabIndex={-1}>コイン易占い</h1>
        <div className="coin-tabs" role="tablist" aria-label="起卦方法"><button role="tab" aria-selected={mode === "manual"} className={mode === "manual" ? "is-active" : ""} onClick={() => setMode("manual")} disabled={rolling || completing}>コインの結果を入力</button><button role="tab" aria-selected={mode === "auto"} className={mode === "auto" ? "is-active" : ""} onClick={() => setMode("auto")} disabled={rolling || completing}>コインが手元にない人はこちら</button></div>
        <div className="coin-progress">{completing ? <><h2>六本の爻が揃いました</h2><p>結果を整えています。</p></> : <><h2>{POSITION_NAMES[Math.min(casts.length, 5)]}の爻を作ります</h2><p>{mode === "manual" ? "手元のコインを三枚投げて、出た表裏を入力してください。" : "アプリ内で三枚のコインを投げます。"}</p></>}</div>
        <div className="coin-cast-stage"><div className="coin-discs">{coins.map((face, index) => <CoinButton key={index} index={index} face={face} flipping={rolling && index >= settledCoinCount} onClick={mode === "manual" && !completing ? () => toggleCoin(index) : undefined} />)}</div><div className="coin-sum">表{coins.filter(c => c === "heads").length}枚 = {makeCoinCast(coins).value} = {COIN_LINE_LABELS[makeCoinCast(coins).value]}</div></div>
        <div className="coin-build"><div className="coin-direction">上<br />↑<br />下から積む<br />↓<br />下</div><HexStack lines={casts.map(c => c.line)} changing={casts.flatMap((c, i) => c.value === 6 || c.value === 9 ? [i] : [])} showEmpty /></div>
        {!completing && <div className="coin-cast-actions">{mode === "manual" ? <><button className="coin-primary" onClick={() => place(makeCoinCast(coins))} disabled={casts.length >= 6}>この結果で置く <span>→</span></button><button className="coin-undo" onClick={undoCast} disabled={rolling || casts.length === 0}>直前の一投を戻す</button></> : <button className="coin-primary" onClick={roll} disabled={rolling || casts.length >= 6}>{rolling ? "投げています…" : "コインを投げる"}</button>}</div>}
      </motion.section>}

      {(phase === "result" || phase === "detail") && reading && primary && dictionary && text && <motion.section key={phase} className={`coin-screen coin-${phase}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <CoinTopbar label={phase === "detail" ? "卦から読む" : "結果"} backLabel={phase === "detail" ? "結果に戻る" : "はじめに戻る"} onBack={() => phase === "detail" ? setPhase("result") : reset()} muted={muted} onMute={toggleMute} onHelp={() => setHelpOpen(true)} /><h1 ref={screenTitleRef} tabIndex={-1}>{phase === "detail" ? "卦から読む" : "コイン易占い"}</h1>
        {phase === "result" ? <>
          <div className="coin-inquiry"><small>あなたの問い</small><p>{question}</p><span>{category}</span></div>
          <div className="coin-glass coin-result-card"><ReadingPair casts={casts} /><div className="coin-change-label">{reading.changingLineIndexes.length === 0 ? "変爻なし" : reading.changingLineIndexes.length === 6 ? "六爻すべてが変化" : reading.changingLineIndexes.length >= 3 ? `変爻${reading.changingLineIndexes.length}本（${reading.changingLineIndexes.map(i => LINE_LABELS[i]).join("・")}）` : `変爻　${reading.changingLineIndexes.map(i => LINE_LABELS[i]).join("・")}`}</div><div className="coin-keywords">{dictionary.keywords.map((word, i) => <motion.span key={word} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 * i }}>{word}</motion.span>)}</div><p className="coin-essence">{dictionary.essence}</p><blockquote>{text.judgment.original}<cite>— 『易経』第{primary.number}卦</cite></blockquote></div>
          <div className="coin-actions"><button className="coin-primary" onClick={() => setPhase("detail")}>卦から読む <span>→</span></button><div className="coin-ai-action"><button className="coin-secondary" onClick={askAi} disabled={aiBusy} aria-busy={aiBusy}>{aiBusy ? "読み合わせています…" : "AIと読む"}</button></div><p className="coin-ai-privacy">押したときだけ、問いと卦の結果をAIへ送ります。</p></div>
        </> : <div className="coin-detail-body"><div className="coin-detail-summary">本卦 第{primary.number}卦 {primary.name}{reading.changingLineIndexes.length ? `　—　変爻 ${reading.changingLineIndexes.map(i => LINE_LABELS[i]).join("・")}　—　之卦 ${relating?.name}` : "　—　変爻なし"}</div><nav className="coin-detail-nav" aria-label="詳細の目次"><a href="#coin-judgment">卦辞</a>{reading.changingLineIndexes.length > 0 && <a href="#coin-changing">変爻</a>}{relating && <a href="#coin-relating">之卦</a>}<a href="#coin-hints">卦から読む</a></nav><p className="coin-reading-source">64卦辞典をもとにした読みです。</p><section><h2>卦の概要</h2><p>{dictionary.trigramSymbolism}</p><p>{dictionary.classical}</p></section><section id="coin-judgment"><h2>卦辞</h2><p>{text.judgment.original}</p><h3>卦辞の現代語訳</h3><p>{text.judgment.modern}</p></section><div id="coin-changing">{reading.changingLineIndexes.map(index => <section key={index}><h2>変爻の爻辞（{LINE_LABELS[index]}）</h2><p>{text.lines[index].original}</p><h3>爻辞の現代語訳</h3><p>{text.lines[index].modern}</p></section>)}</div>{relating && <section id="coin-relating"><h2>之卦の意味</h2><p>{HEXAGRAM_DICTIONARY[relating.number].modern}</p></section>}<section><h2>キーワード</h2><div className="coin-keywords">{dictionary.keywords.map(word => <span key={word}>{word}</span>)}</div></section><section id="coin-hints"><h2>卦から読む</h2><p>{dictionary.modern}</p><h3>{category}の視点</h3><p>{categoryGuidance}</p><h3>自分に問い返す</h3><ul>{reflectionPrompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ul></section><section><h2>注意点</h2><p>易は未来を固定するものではなく、今の状況を見るための手がかりです。大きな決断は、現実の情報や信頼できる人への相談も合わせて考えてください。</p></section><div className="coin-ai-callout"><p>押したときだけ、問いと卦の結果をAIへ送ります。</p><button className="coin-secondary" onClick={askAi} disabled={aiBusy} aria-busy={aiBusy}>{aiBusy ? "読み合わせています…" : "AIと読む"}</button></div></div>}
        {aiError && <p className="coin-error">{aiError}</p>}
        {aiBusy && <div className="coin-ai-loading coin-glass" role="status" aria-live="polite" aria-busy="true"><div className="coin-ai-orbit" aria-hidden><i /><i /><i /></div><p>{AI_LOADING_STEPS[aiStage]}</p><small>問いと卦を重ねて、短い言葉に整えています。</small></div>}
        {ai && <motion.div className="coin-ai coin-glass" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}><h2>AIと読んだ結果</h2>{aiSource === "fallback" && <p className="coin-ai-source">AIに接続できなかったため、卦のデータから補助読みを表示しています。</p>}{[["問いへの読み", ai.situation],["変化しているポイント", ai.changingPoint],["注意点", ai.caution],["取れる行動", ai.action],["自分で考えるための問い", ai.reflection]].map(([label, value], index) => <motion.section key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : index * .06 }}><h3>{label}</h3><p>{value}</p></motion.section>)}</motion.div>}
        <div className="coin-end-actions coin-glass"><button className="coin-secondary coin-restart-button" onClick={reset}>もう一度占う</button></div>
      </motion.section>}
    </AnimatePresence>
    {phase === "question" && <section className="coin-home-support" aria-labelledby="coin-kofi-title"><div className="coin-kofi-divider" aria-hidden="true" /><aside className="coin-kofi-card"><h2 id="coin-kofi-title">易アプリの開発を応援する</h2><a href="https://ko-fi.com/awaicommons" target="_blank" rel="noopener noreferrer" className="coin-kofi-link">Ko-fiで応援する</a></aside></section>}
  </main>;
}
