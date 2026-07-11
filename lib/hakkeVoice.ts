/**
 * 「となえる」の読み上げ。
 * まず収録クリップ(/audio/hakke/{slug}.mp3)を試し、無ければブラウザ内蔵の
 * 音声合成(SpeechSynthesis, ja-JP)にフォールバックする。将来 ElevenLabs 等の
 * 自然音声を public/audio/hakke に置けば、自動でそちらが優先される。
 *
 * サウンド既定オフ(hakkeSound)に従う。呼び出し側(となえる)は再生前に
 * setSoundOn(true) して「音を出す意思」を反映させる。
 */

import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";
import { getSoundOn } from "./hakkeSound";

/** id(先天順)→ クリップのファイル名 */
const SLUG = ["ken", "da", "ri", "shin", "son", "kan", "gon", "kon"] as const;

/** クリップが存在するかの判定キャッシュ(404 のたびに試さない) */
const clipMissing = new Set<number>();

function playClip(id: number): Promise<boolean> {
  // 既に無いと分かっているものは即諦める
  if (clipMissing.has(id)) return Promise.resolve(false);
  return new Promise<boolean>((resolve) => {
    try {
      const audio = new Audio(`/audio/hakke/${SLUG[id]}.mp3`);
      let settled = false;
      const done = (ok: boolean) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };
      audio.addEventListener("ended", () => done(true));
      audio.addEventListener("error", () => {
        clipMissing.add(id);
        done(false);
      });
      // 再生できたら成功。ブロックされたらフォールバックへ
      audio.play().catch(() => {
        clipMissing.add(id);
        done(false);
      });
      // 保険:長すぎる場合の打ち切り
      window.setTimeout(() => done(true), 4000);
    } catch {
      clipMissing.add(id);
      resolve(false);
    }
  });
}

function speakSynthesis(text: string): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.95;
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      u.onend = done;
      u.onerror = done;
      window.speechSynthesis.speak(u);
      // 一部ブラウザで onend が来ないことがあるための保険
      window.setTimeout(done, 1600);
    } catch {
      resolve();
    }
  });
}

/**
 * 卦の読みを声で読み上げる。クリップ優先、無ければ音声合成。
 * サウンドがオフのときは無音で即 resolve。
 */
export async function speakReading(id: number): Promise<void> {
  if (!getSoundOn()) return;
  const played = await playClip(id);
  if (played) return;
  await speakSynthesis(HAKKE_TRIGRAMS[id].reading);
}

const clipMissingSrc = new Set<string>();

/** 指定の音声クリップが置かれているか。無ければ二度と試さない(src ごと) */
export async function clipExists(src: string): Promise<boolean> {
  if (clipMissingSrc.has(src)) return false;
  try {
    const res = await fetch(src, { method: "HEAD" });
    if (!res.ok) clipMissingSrc.add(src);
    return res.ok;
  } catch {
    clipMissingSrc.add(src);
    return false;
  }
}

/** 通し読み(/audio/hakke/chant.mp3)が置かれているか */
export function chantExists(): Promise<boolean> {
  return clipExists("/audio/hakke/chant.mp3");
}

/** 進行中の読み上げを止める */
export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // noop
    }
  }
}
