"use client";

import { useKotobaAudio } from "./KotobaAudioProvider";

export default function SoundToggle() {
  const { enabled, errorName, failed, playback, toggle } = useKotobaAudio();
  const label = failed
    ? "環境音を再試行"
    : enabled
      ? playback === "playing"
        ? "環境音を止める"
        : playback === "loading"
          ? "環境音を読み込み中"
          : "環境音はオン（操作後に再生）"
      : "環境音を流す";
  const status = failed ? "音を再試行" : enabled ? "音 ON" : "音 OFF";

  return (
    <button
      type="button"
      className={`kt-sound${enabled ? " is-on" : ""}${failed ? " is-failed" : ""}`}
      data-kotoba-sound
      data-playback={playback}
      data-error={errorName}
      aria-label={label}
      aria-busy={playback === "loading"}
      aria-pressed={enabled}
      onClick={toggle}
    >
      <span className="kt-sound-hint" aria-hidden>
        <span>{status}</span>
        {enabled && playback === "pending" ? <small>最初の操作後に再生</small> : null}
      </span>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 13v-2m4 5V8m4 11V5m4 11V8m4 5v-2" />
      </svg>
    </button>
  );
}
