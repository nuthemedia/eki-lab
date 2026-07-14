"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AmbientNodes = {
  context: AudioContext;
  master: GainNode;
  filter: BiquadFilterNode;
  musicFilter: BiquadFilterNode;
  lowTone: OscillatorNode;
  highTone: OscillatorNode;
  noise: AudioBufferSourceNode;
  music: HTMLAudioElement;
};

const AMBIENT_TRACK_URL = "/audio/taikyoku/feedback-dreams.mp3";

function createAmbientNodes(): AmbientNodes {
  const context = new AudioContext();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const musicFilter = context.createBiquadFilter();
  const lowTone = context.createOscillator();
  const highTone = context.createOscillator();
  const lowGain = context.createGain();
  const highGain = context.createGain();
  const noiseGain = context.createGain();
  const proceduralGain = context.createGain();
  const musicGain = context.createGain();
  const noise = context.createBufferSource();
  const music = new Audio(AMBIENT_TRACK_URL);
  const musicSource = context.createMediaElementSource(music);
  const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = (Math.random() * 2 - 1) * 0.32;
  }

  master.gain.value = 0.0001;
  proceduralGain.gain.value = 0.022;
  musicGain.gain.value = 0.14;
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 0.7;
  musicFilter.type = "lowpass";
  musicFilter.frequency.value = 2600;
  musicFilter.Q.value = 0.25;
  lowTone.type = "sine";
  lowTone.frequency.value = 48;
  highTone.type = "sine";
  highTone.frequency.value = 72;
  lowGain.gain.value = 0.7;
  highGain.gain.value = 0.2;
  noiseGain.gain.value = 0.16;
  noise.buffer = buffer;
  noise.loop = true;
  music.loop = true;
  music.preload = "metadata";

  lowTone.connect(lowGain).connect(filter);
  highTone.connect(highGain).connect(filter);
  noise.connect(noiseGain).connect(filter);
  filter.connect(proceduralGain).connect(master);
  musicSource.connect(musicFilter).connect(musicGain).connect(master);
  master.connect(context.destination);
  lowTone.start();
  highTone.start();
  noise.start();

  return {
    context,
    master,
    filter,
    musicFilter,
    lowTone,
    highTone,
    noise,
    music,
  };
}

export function useAmbientSound(activeStage: number) {
  const nodesRef = useRef<AmbientNodes | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes) return;
    const now = nodes.context.currentTime;
    nodes.filter.frequency.setTargetAtTime(420 + activeStage * 85, now, 1.8);
    nodes.musicFilter.frequency.setTargetAtTime(2600 + activeStage * 650, now, 2.6);
    nodes.lowTone.frequency.setTargetAtTime(48 + activeStage * 4, now, 2.4);
    nodes.highTone.frequency.setTargetAtTime(72 + activeStage * 7, now, 2.1);
  }, [activeStage]);

  useEffect(
    () => () => {
      const nodes = nodesRef.current;
      if (pauseTimerRef.current !== null) {
        window.clearTimeout(pauseTimerRef.current);
      }
      if (!nodes) return;
      nodes.music.pause();
      nodes.lowTone.stop();
      nodes.highTone.stop();
      nodes.noise.stop();
      void nodes.context.close();
      nodesRef.current = null;
    },
    [],
  );

  const toggle = useCallback(() => {
    const nodes = nodesRef.current ?? createAmbientNodes();
    nodesRef.current = nodes;
    const now = nodes.context.currentTime;
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    if (enabled) {
      nodes.master.gain.cancelScheduledValues(now);
      nodes.master.gain.setTargetAtTime(0.0001, now, 0.36);
      pauseTimerRef.current = window.setTimeout(() => {
        nodes.music.pause();
        pauseTimerRef.current = null;
      }, 1100);
      setEnabled(false);
      return;
    }

    nodes.master.gain.cancelScheduledValues(now);
    nodes.master.gain.setTargetAtTime(0.72, now, 1.15);
    setEnabled(true);
    void nodes.context.resume().catch(() => undefined);
    void nodes.music.play().catch(() => {
      const failedAt = nodes.context.currentTime;
      nodes.master.gain.cancelScheduledValues(failedAt);
      nodes.master.gain.setTargetAtTime(0.0001, failedAt, 0.08);
      nodes.music.pause();
      setEnabled(false);
    });
  }, [enabled]);

  return { enabled, toggle };
}
