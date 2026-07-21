"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  DEFAULT_KOTOBA_AUDIO_STATE,
  reduceKotobaAudioState,
  type KotobaAudioPlayback,
} from "@/data/kotoba/audioState";
import type { KotobaSoundProfile } from "@/data/kotoba/passages";

type AudioNodes = {
  context: AudioContext;
  master: GainNode;
  music: HTMLAudioElement;
  lowTone: OscillatorNode;
  lowGain: GainNode;
};

type KotobaAudioContextValue = {
  enabled: boolean;
  failed: boolean;
  errorName?: string;
  playback: KotobaAudioPlayback;
  toggle: () => void;
  setProfile: (profile: KotobaSoundProfile) => void;
  pulse: (intensity?: number) => void;
};

const TRACK_URL = "/audio/kotoba/ambient.mp3";
const PROFILE_FREQUENCIES: Record<KotobaSoundProfile, [number, number]> = {
  exchange: [54, 2100],
  generation: [67, 3200],
  release: [46, 1750],
  orbit: [58, 2700],
  formation: [42, 2300],
};

const KotobaAudioContext = createContext<KotobaAudioContextValue | null>(null);

function createAudioNodes(): AudioNodes {
  const context = new AudioContext();
  const master = context.createGain();
  const lowTone = context.createOscillator();
  const lowGain = context.createGain();
  const music = new Audio(TRACK_URL);

  master.gain.value = 0.0001;
  lowTone.type = "sine";
  lowTone.frequency.value = 54;
  lowGain.gain.value = 0.012;
  music.loop = true;
  music.preload = "none";
  music.volume = 0;

  lowTone.connect(lowGain).connect(master);
  master.connect(context.destination);
  lowTone.start();

  return { context, master, music, lowTone, lowGain };
}

export function KotobaAudioProvider({ children }: { children: ReactNode }) {
  const nodesRef = useRef<AudioNodes | null>(null);
  const playRequestRef = useRef(0);
  const musicFadeFrameRef = useRef<number | null>(null);
  const profileRef = useRef<KotobaSoundProfile>("exchange");
  const stateRef = useRef(DEFAULT_KOTOBA_AUDIO_STATE);
  const [state, dispatch] = useReducer(reduceKotobaAudioState, DEFAULT_KOTOBA_AUDIO_STATE);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const applyProfile = useCallback((nodes: AudioNodes, profile: KotobaSoundProfile) => {
    const [tone] = PROFILE_FREQUENCIES[profile];
    const now = nodes.context.currentTime;
    nodes.lowTone.frequency.setTargetAtTime(tone, now, 1.4);
  }, []);

  const fadeMusic = useCallback(
    (music: HTMLAudioElement, target: number, duration: number, onComplete?: () => void) => {
      if (musicFadeFrameRef.current !== null) {
        window.cancelAnimationFrame(musicFadeFrameRef.current);
      }
      const initial = music.volume;
      const startedAt = performance.now();
      const update = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        music.volume = initial + (target - initial) * eased;
        if (progress < 1) {
          musicFadeFrameRef.current = window.requestAnimationFrame(update);
          return;
        }
        musicFadeFrameRef.current = null;
        onComplete?.();
      };
      musicFadeFrameRef.current = window.requestAnimationFrame(update);
    },
    [],
  );

  const setProfile = useCallback(
    (profile: KotobaSoundProfile) => {
      profileRef.current = profile;
      const nodes = nodesRef.current;
      if (nodes) applyProfile(nodes, profile);
    },
    [applyProfile],
  );

  const startPlayback = useCallback(() => {
    const requestId = ++playRequestRef.current;
    dispatch({ type: "request-play" });
    const nodes = nodesRef.current ?? createAudioNodes();
    nodesRef.current = nodes;
    applyProfile(nodes, profileRef.current);
    const now = nodes.context.currentTime;

    nodes.master.gain.cancelScheduledValues(now);
    nodes.master.gain.setTargetAtTime(0.82, now, 0.8);
    void nodes.context.resume().catch(() => undefined);
    void nodes.music.play().then(
      () => {
        if (requestId !== playRequestRef.current) {
          nodes.music.pause();
          return;
        }
        fadeMusic(nodes.music, 0.26, 900);
        dispatch({ type: "play-succeeded" });
      },
      (error) => {
        if (requestId !== playRequestRef.current) return;
        nodes.master.gain.setValueAtTime(0.0001, nodes.context.currentTime);
        nodes.music.pause();
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          dispatch({ type: "play-blocked" });
          return;
        }
        console.warn("[kotoba audio] playback failed", error);
        dispatch({
          type: "play-failed",
          errorName: error instanceof DOMException ? error.name : "PlaybackError",
        });
      },
    );
  }, [applyProfile, fadeMusic]);

  const mutePlayback = useCallback(() => {
    playRequestRef.current += 1;
    const nodes = nodesRef.current;
    if (nodes) {
      const now = nodes.context.currentTime;
      nodes.master.gain.cancelScheduledValues(now);
      nodes.master.gain.setTargetAtTime(0.0001, now, 0.16);
      fadeMusic(nodes.music, 0, 520, () => {
        nodes.music.pause();
      });
    }
    dispatch({ type: "mute" });
  }, [fadeMusic]);

  const toggle = useCallback(() => {
    if (stateRef.current.playback === "error") {
      startPlayback();
      return;
    }
    if (stateRef.current.enabled) {
      mutePlayback();
      return;
    }
    startPlayback();
  }, [mutePlayback, startPlayback]);

  const pulse = useCallback((intensity = 0.5) => {
    const nodes = nodesRef.current;
    if (!nodes || stateRef.current.playback !== "playing") return;
    const now = nodes.context.currentTime;
    const oscillator = nodes.context.createOscillator();
    const gain = nodes.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(180 + intensity * 220, now);
    oscillator.frequency.exponentialRampToValueAtTime(92 + intensity * 80, now + 0.55);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.02 + intensity * 0.025, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
    oscillator.connect(gain).connect(nodes.master);
    oscillator.start(now);
    oscillator.stop(now + 0.62);
  }, []);

  useEffect(
    () => () => {
      playRequestRef.current += 1;
      if (musicFadeFrameRef.current !== null) window.cancelAnimationFrame(musicFadeFrameRef.current);
      const nodes = nodesRef.current;
      if (!nodes) return;
      nodesRef.current = null;
      nodes.music.pause();
      nodes.lowTone.stop();
      void nodes.context.close();
    },
    [],
  );

  return (
    <KotobaAudioContext.Provider
      value={{
        enabled: state.enabled,
        failed: state.playback === "error",
        errorName: state.errorName,
        playback: state.playback,
        toggle,
        setProfile,
        pulse,
      }}
    >
      {children}
    </KotobaAudioContext.Provider>
  );
}

export function useKotobaAudio() {
  const value = useContext(KotobaAudioContext);
  if (!value) throw new Error("useKotobaAudio must be used inside KotobaAudioProvider");
  return value;
}
