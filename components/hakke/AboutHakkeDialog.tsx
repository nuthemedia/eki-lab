"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AboutHakkeDialog({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

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
      className="hk-about-dialog"
      aria-labelledby="hk-about-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeDialog();
        }
      }}
      onClose={() => {
        onClose();
        returnFocusRef.current?.focus();
      }}
    >
      <div className="hk-about-panel">
        <div className="hk-about-bar">
          <h2 id="hk-about-title">Hakkeについて</h2>
          <button type="button" className="hk-about-close" onClick={closeDialog}>
            閉じる
          </button>
        </div>

        <div className="hk-about-content">
          <p className="hk-about-lead">
            Hakkeは、八卦の形・名前・自然のイメージを、手を動かしながら覚えるための学習アプリです。
          </p>

          <section>
            <h3>八卦とは？</h3>
            <p>
              八卦（はっけ）は、陰と陽の線を三本組み合わせた、八つの基本のかたちです。天・地・火・水など、自然の姿やはたらきと結びついています。易を学ぶ人の間では、「はっか」と読むこともあります。
            </p>
          </section>

          <section>
            <h3>易ってなに？</h3>
            <p>
              易は、ものごとの変化を陰と陽の組み合わせから読み解く、古代中国から伝わる考え方です。八卦を二つ重ねると六十四卦になり、状況の移り変わりを表します。
            </p>
          </section>
        </div>

        <button type="button" className="hk-cta hk-about-done" onClick={closeDialog}>
          わかった
        </button>
      </div>
    </dialog>
  );
}
