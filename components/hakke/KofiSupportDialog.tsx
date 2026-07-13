"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const KOFI_PANEL_URL =
  "https://ko-fi.com/awaicommons/?hidefeed=true&widget=true&embed=true&preview=true";

export default function KofiSupportDialog({ open, onClose }: Props) {
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
      className="hk-kofi-dialog"
      aria-labelledby="hk-kofi-dialog-title"
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
      <div className="hk-kofi-panel">
        <div className="hk-kofi-bar">
          <h2 id="hk-kofi-dialog-title">易アプリの開発を応援する</h2>
          <button type="button" className="hk-kofi-close" onClick={closeDialog}>
            閉じる
          </button>
        </div>

        <div className="hk-kofi-frame-wrap">
          {open ? (
            <iframe
              className="hk-kofi-frame"
              src={KOFI_PANEL_URL}
              title="AWAI CommonsをKo-fiで応援する"
              allow="payment"
            />
          ) : null}
        </div>

        <a
          className="hk-kofi-external"
          href="https://ko-fi.com/awaicommons"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ko-fiを別画面で開く
        </a>
      </div>
    </dialog>
  );
}
