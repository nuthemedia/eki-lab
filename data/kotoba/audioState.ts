export type KotobaAudioPlayback = "pending" | "loading" | "playing" | "muted" | "error";

export type KotobaAudioState = {
  enabled: boolean;
  playback: KotobaAudioPlayback;
  errorName?: string;
};

export type KotobaAudioEvent =
  | { type: "request-play" }
  | { type: "play-succeeded" }
  | { type: "play-blocked" }
  | { type: "play-failed"; errorName?: string }
  | { type: "mute" };

export const DEFAULT_KOTOBA_AUDIO_STATE: KotobaAudioState = {
  enabled: false,
  playback: "muted",
};

export function reduceKotobaAudioState(
  state: KotobaAudioState,
  event: KotobaAudioEvent,
): KotobaAudioState {
  switch (event.type) {
    case "request-play":
      return { enabled: true, playback: "loading" };
    case "play-succeeded":
      return { enabled: true, playback: "playing" };
    case "play-blocked":
      return { enabled: true, playback: "pending" };
    case "play-failed":
      return { enabled: true, playback: "error", errorName: event.errorName };
    case "mute":
      return { enabled: false, playback: "muted" };
  }
}
