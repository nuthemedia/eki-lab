"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSoundOn,
  getSoundOn,
  playConfirm,
  setSoundOn,
  subscribeSound,
} from "@/lib/hakkeSound";

export default function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, getSoundOn, getServerSoundOn);

  return (
    <button
      type="button"
      className="hk-sound-toggle"
      aria-pressed={on}
      aria-label={on ? "サウンドをオフにする" : "サウンドをオンにする"}
      onClick={() => {
        const next = !on;
        setSoundOn(next);
        if (next) playConfirm();
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
        <path
          d="M4 9v6h4l5 4V5L8 9H4z"
          fill="currentColor"
        />
        {on ? (
          <>
            <path
              d="M16 8.5a4.5 4.5 0 0 1 0 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M18.5 6a8 8 0 0 1 0 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path
            d="M17 9.5l4 5M21 9.5l-4 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
