"use client";

import { useEffect, useState } from "react";
import {
  buildCardImageUrl,
  buildShareUrl,
  buildXShareUrl,
  type CardContent,
} from "@/lib/ichingCard";

type Props = { content: CardContent };

async function fetchCardImageFile(code: string): Promise<File> {
  const res = await fetch(buildCardImageUrl(code));
  if (!res.ok) throw new Error(String(res.status));
  const blob = await res.blob();
  return new File([blob], `iching-card-${code}.png`, { type: "image/png" });
}

/** 共有パネル: 画像共有(Web Share) / 画像保存 / X / リンクコピー */
export function SharePanel({ content }: Props) {
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const probe = new File([""], "probe.png", { type: "image/png" });
      setCanShareFiles(
        typeof navigator.canShare === "function" &&
          navigator.canShare({ files: [probe] }),
      );
    } catch {
      setCanShareFiles(false);
    }
  }, []);

  const shareImage = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const file = await fetchCardImageFile(content.code);
      await navigator.share({
        files: [file],
        text: `「${content.question}」に、${content.hexName}の一枚。`,
      });
    } catch (e) {
      // 共有シートのキャンセルはエラー扱いにしない
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        setError("画像を用意できませんでした。時間をおいて試してください。");
      }
    }
    setBusy(false);
  };

  const downloadImage = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const file = await fetchCardImageFile(content.code);
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("画像を用意できませんでした。時間をおいて試してください。");
    }
    setBusy(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(content.code));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("リンクをコピーできませんでした。");
    }
  };

  return (
    <div className="ik-flow-col" style={{ gap: 12 }}>
      <div className="ik-share-row">
        {canShareFiles && (
          <button
            className="ik-btn ik-btn--primary"
            onClick={shareImage}
            disabled={busy}
          >
            画像を共有
          </button>
        )}
        <button className="ik-btn" onClick={downloadImage} disabled={busy}>
          画像を保存
        </button>
        <a
          className="ik-btn"
          href={buildXShareUrl(content)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Xで共有
        </a>
        <button className="ik-btn" onClick={copyLink}>
          {copied ? "コピーしました" : "リンクをコピー"}
        </button>
      </div>
      <p className="ik-caption" style={{ margin: 0 }}>
        Instagram / TikTok へは、画像を共有・保存して
        ストーリーズや投稿に貼りつけてください。
      </p>
      {error && (
        <p className="ik-caption" style={{ margin: 0, color: "var(--ik-vermilion)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
