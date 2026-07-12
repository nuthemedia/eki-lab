/**
 * /hakke の効果音。手続き的 Web Audio で合成する(アセットなし)。
 *
 * 方針:
 * - 全体は chill: マスターに lowpass + 手続き的リバーブ + 低め gain、ゆっくりめのアタック。
 * - 自然音はリアル寄り: 単純なオシレーターではなく、ピンクノイズ + フィルタ + LFO の
 *   レイヤー合成で質感を作る。
 * - オン/オフは localStorage に永続化(初回はオン)。useSyncExternalStore 向けの購読ストア。
 */

const STORAGE_KEY = "hakke-sound-v1";

let soundOn = false;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate(): void {
  if (hydrated) return;
  hydrated = true;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    soundOn = saved === null ? true : saved === "1";
  } catch {
    soundOn = true;
  }
}

export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSoundOn(): boolean {
  hydrate();
  return soundOn;
}

export function getServerSoundOn(): boolean {
  return true;
}

export function setSoundOn(next: boolean): void {
  hydrate();
  soundOn = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // 保存できないだけ。セッション中は効く
  }
  if (next) unlock();
  listeners.forEach((listener) => listener());
}

/* ---------- audio graph (lazy) ---------- */

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  lowpass: BiquadFilterNode;
  reverb: ConvolverNode;
  noise: AudioBuffer;
};

let engine: Engine | null = null;

function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  // ピンクノイズ(Voss-McCartney 近似)。自然音の素材。
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return buffer;
}

function makeReverbIR(ctx: AudioContext): AudioBuffer {
  // 減衰するノイズをインパルス応答に。空間感を足して chill にする。
  const length = ctx.sampleRate * 1.8;
  const ir = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2);
    }
  }
  return ir;
}

function getEngine(): Engine | null {
  if (engine) return engine;
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.5; // 全体は控えめ
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 5200; // 高域を丸めて chill に
  const reverb = ctx.createConvolver();
  reverb.buffer = makeReverbIR(ctx);
  const reverbSend = ctx.createGain();
  reverbSend.gain.value = 0.32;

  // 各音 → lowpass →(dry + reverb)→ master → destination
  lowpass.connect(master);
  lowpass.connect(reverbSend);
  reverbSend.connect(reverb);
  reverb.connect(master);
  master.connect(ctx.destination);

  engine = { ctx, master, lowpass, reverb, noise: makeNoiseBuffer(ctx) };
  return engine;
}

export function unlock(): void {
  if (!soundOn) return;
  const e = getEngine();
  if (e && e.ctx.state === "suspended") {
    e.ctx.resume().catch(() => {});
  }
}

/* ---------- synthesis helpers ---------- */

function noiseSource(e: Engine): AudioBufferSourceNode {
  const src = e.ctx.createBufferSource();
  src.buffer = e.noise;
  src.loop = true;
  src.playbackRate.value = 0.8 + Math.random() * 0.4;
  return src;
}

/** ゆっくり立ち上げ、ゆっくり落とすエンベロープ(chill) */
function envGain(e: Engine, peak: number, t0: number, attack: number, dur: number): GainNode {
  const g = e.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  return g;
}

function tone(e: Engine, type: OscillatorType, freq: number, peak: number, t0: number, attack: number, dur: number, bendTo?: number) {
  const osc = e.ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (bendTo) osc.frequency.exponentialRampToValueAtTime(bendTo, t0 + dur);
  const g = envGain(e, peak, t0, attack, dur);
  osc.connect(g);
  g.connect(e.lowpass);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** 帯域ノイズのレイヤー。自然音の主素材。 */
function noiseLayer(
  e: Engine,
  filterType: BiquadFilterType,
  freqStart: number,
  freqEnd: number,
  q: number,
  peak: number,
  t0: number,
  attack: number,
  dur: number,
) {
  const src = noiseSource(e);
  const filter = e.ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(freqStart, t0);
  if (freqEnd !== freqStart) filter.frequency.linearRampToValueAtTime(freqEnd, t0 + dur);
  filter.Q.value = q;
  const g = envGain(e, peak, t0, attack, dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(e.lowpass);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

/** ごく短いノイズのパチ(焚き火・雷の割れ) */
function crackle(e: Engine, t0: number, peak: number) {
  const src = noiseSource(e);
  const filter = e.ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1200 + Math.random() * 2600;
  filter.Q.value = 2;
  const g = e.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
  src.connect(filter);
  filter.connect(g);
  g.connect(e.lowpass);
  src.start(t0);
  src.stop(t0 + 0.08);
}

/* ---------- nature cues (per trigram id) ---------- */

const NATURE: Record<number, (e: Engine, t: number) => void> = {
  // 乾/天: 明るく開ける空気 + かすかなきらめき
  0: (e, t) => {
    noiseLayer(e, "highpass", 900, 2400, 0.7, 0.05, t, 0.5, 1.8);
    tone(e, "sine", 660, 0.04, t + 0.2, 0.6, 1.4, 990);
    tone(e, "sine", 1320, 0.02, t + 0.5, 0.4, 1.0);
  },
  // 兌/沢: やわらかい水面のプリン ×3
  1: (e, t) => {
    noiseLayer(e, "bandpass", 700, 500, 2, 0.03, t, 0.3, 1.4);
    tone(e, "sine", 900, 0.06, t + 0.1, 0.01, 0.5, 1200);
    tone(e, "sine", 760, 0.05, t + 0.5, 0.01, 0.5, 1050);
    tone(e, "sine", 1040, 0.045, t + 0.95, 0.01, 0.5, 1300);
  },
  // 離/火: 焚き火(持続する帯域ノイズ + ランダムなパチ)
  2: (e, t) => {
    noiseLayer(e, "bandpass", 520, 640, 1.1, 0.05, t, 0.4, 1.8);
    for (let i = 0; i < 9; i++) crackle(e, t + 0.15 + Math.random() * 1.5, 0.05 + Math.random() * 0.05);
  },
  // 震/雷: 頭の割れ + 低い轟きのゴロゴロ
  3: (e, t) => {
    crackle(e, t + 0.02, 0.12);
    noiseLayer(e, "lowpass", 400, 120, 0.5, 0.12, t, 0.03, 1.9);
    const osc = e.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 48;
    const g = e.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
    // 振幅を揺らして遠雷の唸り
    const lfo = e.ctx.createOscillator();
    lfo.frequency.value = 5.5;
    const lfoGain = e.ctx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);
    osc.connect(g);
    g.connect(e.lowpass);
    osc.start(t);
    osc.stop(t + 2);
    lfo.start(t);
    lfo.stop(t + 2);
  },
  // 巽/風: bandpass ノイズの中心をゆっくり上下(ヒュー)
  4: (e, t) => {
    const src = noiseSource(e);
    const filter = e.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.linearRampToValueAtTime(1400, t + 0.9);
    filter.frequency.linearRampToValueAtTime(700, t + 1.8);
    filter.Q.value = 1.2;
    const g = envGain(e, 0.09, t, 0.6, 1.9);
    src.connect(filter);
    filter.connect(g);
    g.connect(e.lowpass);
    src.start(t);
    src.stop(t + 2);
  },
  // 坎/水: 下降スウィープ + 水滴 ×3
  5: (e, t) => {
    noiseLayer(e, "bandpass", 1600, 500, 3, 0.05, t, 0.2, 1.6);
    tone(e, "sine", 1400, 0.05, t + 0.25, 0.01, 0.28, 620);
    tone(e, "sine", 1150, 0.045, t + 0.7, 0.01, 0.28, 520);
    tone(e, "sine", 1600, 0.04, t + 1.15, 0.01, 0.28, 700);
  },
  // 艮/山: とても低い持続ドローン、ゆっくり(静けさ)
  6: (e, t) => {
    tone(e, "sine", 96, 0.09, t, 0.8, 2.0, 88);
    tone(e, "sine", 145, 0.04, t + 0.3, 1.0, 1.7);
    noiseLayer(e, "lowpass", 220, 180, 0.4, 0.02, t, 0.9, 2.0);
  },
  // 坤/地: 土の重み(lowpass ノイズ + 低い正弦が沈む)
  7: (e, t) => {
    noiseLayer(e, "lowpass", 300, 140, 0.5, 0.09, t, 0.4, 1.9);
    tone(e, "sine", 180, 0.08, t + 0.1, 0.3, 1.6, 90);
  },
};

/* ---------- public API ---------- */

export type NatureId = number;

function fire(play: (e: Engine, t: number) => void): void {
  if (!soundOn) return;
  const e = getEngine();
  if (!e) return;
  if (e.ctx.state === "suspended") e.ctx.resume().catch(() => {});
  play(e, e.ctx.currentTime);
}

/** 卦ごとの自然音 */
export function playNature(id: NatureId): void {
  const cue = NATURE[id];
  if (cue) fire(cue);
}

/** 爻が正しく積まれた瞬間の、まるいポン */
export function playTap(): void {
  fire((e, t) => tone(e, "triangle", 340, 0.09, t, 0.01, 0.22, 300));
}

/** 違う爻が溶けるときの、ごく小さなやわらかい下降 */
export function playDissolve(): void {
  fire((e, t) => tone(e, "sine", 320, 0.05, t, 0.01, 0.34, 190));
}

/** 結果カードが開くときの、やわらかな2〜3音 */
export function playChime(): void {
  fire((e, t) => {
    tone(e, "sine", 523.25, 0.06, t, 0.02, 0.9); // C5
    tone(e, "sine", 659.25, 0.05, t + 0.12, 0.02, 0.9); // E5
    tone(e, "sine", 783.99, 0.045, t + 0.24, 0.02, 1.0); // G5
  });
}

/** トグルをオンにしたときの確認ブリップ */
export function playConfirm(): void {
  fire((e, t) => tone(e, "sine", 620, 0.06, t, 0.01, 0.3, 720));
}
