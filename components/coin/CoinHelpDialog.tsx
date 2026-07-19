"use client";

import { useEffect, useRef } from "react";

type CoinHelpLocale = "ja" | "en";

type Props = {
  locale: CoinHelpLocale;
  open: boolean;
  onClose: () => void;
};

const NOTE_URLS: Record<CoinHelpLocale, string> = {
  ja: "https://note.com/awaicommons/n/n0c007398578d",
  en: "https://note.com/awaicommons/n/n0c007398578d?hl=en",
};

export default function CoinHelpDialog({ locale, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const isEnglish = locale === "en";
  const titleId = `coin-help-title-${locale}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    if (!open && dialog.open) dialog.close();
  }, [open]);

  const closeDialog = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="coin-help-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
      onClose={() => {
        onClose();
        returnFocusRef.current?.focus();
      }}
    >
      <div className="coin-help-panel">
        <div className="coin-help-bar">
          <h2 id={titleId}>{isEnglish ? "How to Use the Coin Reading" : "コイン易占いのやり方"}</h2>
          <button type="button" className="coin-help-close" onClick={closeDialog}>
            {isEnglish ? "Close" : "閉じる"}
          </button>
        </div>

        <div className="coin-help-content">
          <p className="coin-help-lead">
            {isEnglish
              ? "Toss three coins six times and build a hexagram from the bottom line upward."
              : "三枚のコインを六回投げ、結果を下から積み上げて卦を作ります。"}
          </p>

          <section>
            <h3>{isEnglish ? "1. Ask a question" : "1. 問いを立てる"}</h3>
            <p>
              {isEnglish
                ? "Choose one situation you would like to understand. Questions such as “What should I pay attention to?” or “How can I approach this?” are often more useful than asking only what will happen."
                : "いま向き合いたいことを、ひとつの問いにします。「どうなるか」だけでなく、「何に注意するか」「どう向き合うか」と問うと、卦を読みやすくなります。"}
            </p>
          </section>

          <section>
            <h3>{isEnglish ? "2. Toss three coins" : "2. コインを投げる"}</h3>
            <p>
              {isEnglish
                ? "Toss all three coins at the same time. If you have coins, enter the heads and tails you see. If you do not have coins, the app can toss them for you."
                : "三枚のコインを同時に投げます。手元のコインを使う場合は、出た表裏を入力してください。コインがない場合は、アプリ内で投げることもできます。"}
            </p>
          </section>

          <section>
            <h3>{isEnglish ? "3. Count the result" : "3. 表裏を数える"}</h3>
            <ul className="coin-help-values">
              {isEnglish ? (
                <>
                  <li><strong>3 heads: 9 · Old Yang</strong><span>A Yang line that changes to Yin.</span></li>
                  <li><strong>2 heads: 8 · Young Yin</strong><span>An unchanged Yin line.</span></li>
                  <li><strong>1 head: 7 · Young Yang</strong><span>An unchanged Yang line.</span></li>
                  <li><strong>0 heads: 6 · Old Yin</strong><span>A Yin line that changes to Yang.</span></li>
                </>
              ) : (
                <>
                  <li><strong>表3枚：9・老陽</strong><span>陽の線。陰へ変化します。</span></li>
                  <li><strong>表2枚：8・少陰</strong><span>陰の線。そのままです。</span></li>
                  <li><strong>表1枚：7・少陽</strong><span>陽の線。そのままです。</span></li>
                  <li><strong>表0枚：6・老陰</strong><span>陰の線。陽へ変化します。</span></li>
                </>
              )}
            </ul>
            <p>{isEnglish ? "Heads count as 3 and tails count as 2." : "表は3、裏は2として、三枚の合計から爻を作ります。"}</p>
          </section>

          <section>
            <h3>{isEnglish ? "4. Build from the bottom up" : "4. 下から積み上げる"}</h3>
            <p>
              {isEnglish
                ? "Toss the coins six times. The first toss forms the bottom line. The sixth toss forms the top line. Together, the six lines create one hexagram."
                : "コインを六回投げます。1投目が一番下、6投目が一番上です。六本の爻がそろうと、ひとつの卦になります。"}
            </p>
          </section>

          <section>
            <h3>{isEnglish ? "5. Read the hexagram" : "5. 卦を読む"}</h3>
            {isEnglish ? (
              <>
                <p>The Primary Hexagram describes the present situation.</p>
                <p>The Changing Lines show where movement is occurring.</p>
                <p>The Relating Hexagram suggests the direction that may emerge through that change.</p>
                <p>Rather than looking only for good or bad fortune, consider where the pattern overlaps with your situation.</p>
              </>
            ) : (
              <>
                <p>本卦は、いまの状況。</p>
                <p>変爻は、変化しているポイント。</p>
                <p>之卦は、変化の先にある流れです。</p>
                <p>吉凶だけでなく、自分の状況のどこに重なるのかを考えながら読んでみてください。</p>
              </>
            )}
          </section>

          <a className="coin-help-note" href={NOTE_URLS[locale]} target="_blank" rel="noopener noreferrer">
            {isEnglish ? "Read the full guide on note ↗" : "詳しいやり方をNoteで読む ↗"}
          </a>
        </div>

        <button type="button" className="coin-secondary coin-help-done" onClick={closeDialog}>
          {isEnglish ? "Got it" : "わかった"}
        </button>
      </div>
    </dialog>
  );
}
