import { describe, expect, it } from "vitest";
import {
  DEFAULT_KOTOBA_AUDIO_STATE,
  reduceKotobaAudioState,
} from "./audioState";

describe("kotoba audio state", () => {
  it("always starts on and waiting for playback", () => {
    expect(DEFAULT_KOTOBA_AUDIO_STATE).toEqual({ enabled: true, playback: "pending" });
  });

  it("can mute and enable playback again", () => {
    const muted = reduceKotobaAudioState(DEFAULT_KOTOBA_AUDIO_STATE, { type: "mute" });
    expect(muted).toEqual({ enabled: false, playback: "muted" });
    expect(reduceKotobaAudioState(muted, { type: "request-play" })).toEqual({
      enabled: true,
      playback: "loading",
    });
  });

  it("keeps autoplay rejection on while waiting for the first interaction", () => {
    const blocked = reduceKotobaAudioState(
      reduceKotobaAudioState(DEFAULT_KOTOBA_AUDIO_STATE, { type: "request-play" }),
      { type: "play-blocked" },
    );
    expect(blocked).toEqual({ enabled: true, playback: "pending" });
  });

  it("keeps retry available after an actual load failure", () => {
    const failed = reduceKotobaAudioState(
      reduceKotobaAudioState(DEFAULT_KOTOBA_AUDIO_STATE, { type: "request-play" }),
      { type: "play-failed", errorName: "NotSupportedError" },
    );
    expect(failed).toEqual({ enabled: true, playback: "error", errorName: "NotSupportedError" });
    expect(reduceKotobaAudioState(failed, { type: "request-play" }).playback).toBe("loading");
  });
});
