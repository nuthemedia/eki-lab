let context: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
const activeOscillators = new Set<OscillatorNode>();

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(context.destination);
  }
  return context;
}

export function setCoinMuted(value: boolean) {
  muted = value;
  if (value) {
    activeOscillators.forEach(oscillator => {
      try { oscillator.stop(); } catch {}
    });
    activeOscillators.clear();
  }
  if (!context || !master) return;
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(value ? 0 : 1, now + 0.025);
}

export function unlockCoinSound() {
  const audio = ctx();
  if (audio?.state === "suspended") void audio.resume();
}

function tone(
  frequency: number,
  duration: number,
  gain = 0.035,
  type: OscillatorType = "sine",
  delay = 0,
) {
  if (muted) return;
  const audio = ctx();
  if (!audio || !master) return;
  const oscillator = audio.createOscillator();
  const volume = audio.createGain();
  const start = audio.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  volume.gain.setValueAtTime(gain, start);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(volume).connect(master);
  activeOscillators.add(oscillator);
  oscillator.addEventListener("ended", () => activeOscillators.delete(oscillator), { once: true });
  oscillator.start(start);
  oscillator.stop(start + duration);
}

export const playStart = () => {
  tone(196, 0.28, 0.022, "sine");
  tone(294, 0.22, 0.012, "sine", 0.06);
};

export const playSoundOn = () => {
  tone(620, 0.12, 0.018, "sine");
  tone(930, 0.18, 0.012, "sine", 0.04);
};

export const playCoinSpin = () => {
  [0, 0.11, 0.22, 0.34, 0.47, 0.6].forEach((delay, index) => {
    tone(index % 2 ? 1320 : 1540, 0.055, 0.009, "triangle", delay);
  });
};

export const playCoinFlip = () => {
  tone(1180, 0.055, 0.014, "triangle");
  tone(760, 0.08, 0.011, "triangle", 0.045);
};

export const playCoinStop = (index = 0) => {
  tone(900 - index * 70, 0.13, 0.03, "triangle");
  tone(1280 - index * 55, 0.07, 0.011, "sine", 0.015);
};

export const playLinePlace = () => {
  tone(190, 0.13, 0.038, "triangle");
  tone(110, 0.09, 0.018, "sine", 0.025);
};

export const playUndo = () => {
  tone(260, 0.09, 0.02, "triangle");
  tone(170, 0.12, 0.018, "triangle", 0.055);
};

export const playChanging = () => {
  tone(740, 0.45, 0.018, "sine");
  tone(1110, 0.36, 0.012, "sine", 0.08);
  tone(1480, 0.28, 0.008, "sine", 0.16);
};

export const playComplete = () => {
  tone(110, 0.8, 0.042, "sine");
  tone(165, 0.68, 0.022, "sine", 0.06);
  tone(220, 0.55, 0.014, "sine", 0.12);
};

export const playAiComplete = () => {
  tone(520, 0.22, 0.014, "sine");
  tone(780, 0.28, 0.01, "sine", 0.07);
};
