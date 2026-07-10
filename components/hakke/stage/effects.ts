import type { HakkePalette } from "@/data/hakke/trigrams";
import type { EffectFactory, EffectFrame, NatureEffect } from "./effectTypes";

/* ---------- helpers ---------- */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** t を [a,b] 区間で 0→1 に正規化 */
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${clamp01(alpha)})`;
}

/** 背景を淡く染める */
function wash(f: EffectFrame, color: string, alpha: number) {
  f.ctx.fillStyle = rgba(color, alpha);
  f.ctx.fillRect(0, 0, f.w, f.h);
}

/** 中央の輝度を抑えて三本線の視認性を保つマスク */
function centerMask(f: EffectFrame) {
  const { ctx, w, h } = f;
  const r = Math.min(w, h) * 0.42;
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, r);
  g.addColorStop(0, "rgba(255,255,255,0.42)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  seed: number;
};

function makeParticles(count: number, rng: () => number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: rng(),
    y: rng(),
    vx: rng() * 2 - 1,
    vy: rng() * 2 - 1,
    r: rng(),
    seed: rng(),
  }));
}

/* ---------- 0 乾・天: 空が開き、光が上へ広がる ---------- */

const ken: EffectFactory = (p, rng) => {
  const dots = makeParticles(90, rng);
  return {
    duration: 2300,
    draw(f) {
      const { ctx, t, w, h } = f;
      wash(f, p.base, 0.75 * easeOut(span(t, 0, 0.5)));
      // 下中央から上へ開く放射光
      const open = easeOut(span(t, 0.05, 0.7));
      const cy = h * 1.05;
      const radius = Math.max(1, Math.hypot(w, h) * 1.1 * open);
      const g = ctx.createRadialGradient(w / 2, cy, 0, w / 2, cy, radius);
      g.addColorStop(0, rgba(p.glow, 0.85));
      g.addColorStop(0.55, rgba(p.glow, 0.3));
      g.addColorStop(1, rgba(p.glow, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // 光線
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i - 3) * 0.22;
        const len = radius * 0.85;
        ctx.strokeStyle = rgba(p.deep, 0.14 * open * (1 - span(t, 0.75, 1)));
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(w / 2, cy);
        ctx.lineTo(w / 2 + Math.cos(a) * len, cy + Math.sin(a) * len);
        ctx.stroke();
      }
      // 上昇する微粒子
      for (const d of dots) {
        const y = (d.y - t * (0.35 + d.r * 0.5)) % 1;
        const yy = y < 0 ? y + 1 : y;
        ctx.fillStyle = rgba("#ffffff", 0.7 * open * (1 - yy));
        ctx.beginPath();
        ctx.arc(d.x * w, yy * h, 1 + d.r * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      centerMask(f);
    },
  };
};

/* ---------- 7 坤・地: 大地が広がり、粒子が下へ沈む ---------- */

const kon: EffectFactory = (p, rng) => {
  const dots = makeParticles(120, rng);
  return {
    duration: 2300,
    draw(f) {
      const { ctx, t, w, h } = f;
      wash(f, p.base, 0.8 * easeOut(span(t, 0, 0.45)));
      // 沈降する粒子
      const settle = easeOut(span(t, 0.5, 1));
      for (const d of dots) {
        const fallY = d.y + easeOut(span(t, 0, 0.85)) * (1.15 - d.y);
        const y = Math.min(fallY, 1 - d.seed * 0.16);
        ctx.fillStyle = rgba(p.deep, 0.35 + d.r * 0.3);
        ctx.beginPath();
        ctx.arc(d.x * w, y * h, 1 + d.r * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // 下部に積もる地平の帯
      const band = h * 0.22 * easeOut(span(t, 0.35, 0.95));
      const g = ctx.createLinearGradient(0, h - band, 0, h);
      g.addColorStop(0, rgba(p.glow, 0));
      g.addColorStop(1, rgba(p.deep, 0.55 + settle * 0.2));
      ctx.fillStyle = g;
      ctx.fillRect(0, h - band, w, band);
      centerMask(f);
    },
  };
};

/* ---------- 2 離・火: 光が灯り、周囲を照らす ---------- */

const ri: EffectFactory = (p, rng) => {
  const sparks = makeParticles(60, rng);
  return {
    duration: 2300,
    draw(f) {
      const { ctx, t, w, h } = f;
      wash(f, p.base, 0.7 * easeOut(span(t, 0, 0.4)));
      const cx = w / 2;
      const cy = h * 0.6;
      // ゆらぐ灯り
      const flicker = 1 + Math.sin(t * 34) * 0.05 + Math.sin(t * 61) * 0.03;
      const grow = easeOut(span(t, 0.05, 0.55));
      const radius = Math.max(1, Math.min(w, h) * 0.55 * grow * flicker);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      g.addColorStop(0, rgba("#ffffff", 0.9));
      g.addColorStop(0.3, rgba(p.glow, 0.75));
      g.addColorStop(1, rgba(p.deep, 0));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // 上へのぼる火の粉
      for (const s of sparks) {
        const life = (s.y + t * (0.6 + s.r * 0.7)) % 1;
        const x = cx + (s.x - 0.5) * w * 0.5 * life + Math.sin(life * 9 + s.seed * 9) * 8;
        const y = cy - life * h * 0.55;
        ctx.fillStyle = rgba(p.glow, 0.8 * grow * (1 - life));
        ctx.beginPath();
        ctx.arc(x, y, 1 + s.r * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      centerMask(f);
    },
  };
};

/* ---------- 5 坎・水: 深い水に沈み、波紋が内側へ ---------- */

const kan: EffectFactory = (p, rng) => {
  const bubbles = makeParticles(40, rng);
  return {
    duration: 2400,
    draw(f) {
      const { ctx, t, w, h } = f;
      wash(f, p.base, 0.85 * easeOut(span(t, 0, 0.4)));
      // 深まるビネット
      const deepen = easeInOut(span(t, 0.1, 0.8));
      const vg = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.2,
        w / 2, h / 2, Math.hypot(w, h) * 0.6,
      );
      vg.addColorStop(0, rgba(p.deep, 0));
      vg.addColorStop(1, rgba(p.deep, 0.55 * deepen));
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
      // 内側へ収束する波紋
      const maxR = Math.min(w, h) * 0.58;
      for (let i = 0; i < 4; i++) {
        const phase = (t * 1.1 + i / 4) % 1;
        const r = maxR * (1 - easeOut(phase));
        if (r < 6) continue;
        ctx.strokeStyle = rgba(p.glow, 0.5 * phase * deepen);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      // 沈む気泡
      for (const b of bubbles) {
        const y = (b.y + t * (0.25 + b.r * 0.3)) % 1;
        ctx.strokeStyle = rgba(p.glow, 0.4 * deepen * (1 - y));
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(b.x * w, y * h, 1.5 + b.r * 2.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      centerMask(f);
    },
  };
};

/* ---------- 3 震・雷: 下から衝撃、画面が震える ---------- */

const shin: EffectFactory = (p, rng) => {
  // 稲妻の折れ線(決定的に生成)
  const bolts = [0, 1].map((k) => {
    const points: { x: number; y: number }[] = [];
    let x = 0.5 + (k === 0 ? -0.06 : 0.1) + (rng() - 0.5) * 0.06;
    for (let y = 1.05; y > 0.3; y -= 0.09 + rng() * 0.05) {
      points.push({ x, y });
      x += (rng() - 0.5) * 0.16;
    }
    return points;
  });
  const grit = makeParticles(70, rng);
  return {
    duration: 2100,
    draw(f) {
      const { ctx, t, w, h } = f;
      wash(f, p.base, 0.7 * easeOut(span(t, 0, 0.3)));
      ctx.save();
      // シェイクは canvas 内 translate のみ(0.2〜0.5、振幅小)
      const shake = span(t, 0.2, 0.28) * (1 - span(t, 0.28, 0.55));
      if (shake > 0) {
        ctx.translate(
          Math.sin(t * 200) * 5 * shake,
          Math.cos(t * 230) * 4 * shake,
        );
      }
      // 白フラッシュ
      const flash =
        span(t, 0.18, 0.24) * (1 - span(t, 0.24, 0.42));
      if (flash > 0) {
        ctx.fillStyle = rgba("#ffffff", 0.55 * flash);
        ctx.fillRect(-10, -10, w + 20, h + 20);
      }
      // 稲妻
      const strike = span(t, 0.15, 0.3);
      const fade = 1 - span(t, 0.55, 0.85);
      if (strike > 0 && fade > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const bolt of bolts) {
          const visible = Math.max(1, Math.floor(bolt.length * easeOut(strike)));
          ctx.strokeStyle = rgba(p.deep, 0.9 * fade);
          ctx.lineWidth = 2.4;
          ctx.lineJoin = "round";
          ctx.beginPath();
          bolt.slice(0, visible).forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x * w, pt.y * h);
            else ctx.lineTo(pt.x * w, pt.y * h);
          });
          ctx.stroke();
          ctx.strokeStyle = rgba(p.glow, 0.5 * fade);
          ctx.lineWidth = 7;
          ctx.stroke();
        }
        ctx.restore();
      }
      // 地面から舞う振動粒子
      for (const g of grit) {
        const rise = easeOut(span(t, 0.22, 0.9));
        const y = 1 - rise * g.r * 0.5;
        ctx.fillStyle = rgba(p.deep, 0.4 * (1 - span(t, 0.7, 1)));
        ctx.beginPath();
        ctx.arc(g.x * w, y * h, 1 + g.seed * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      centerMask(f);
    },
  };
};

/* ---------- 6 艮・山: 動きが止まり、山の輪郭が立ち上がる ---------- */

const gon: EffectFactory = (p, rng) => {
  const drift = makeParticles(60, rng);
  const ridge = Array.from({ length: 24 }, (_, i) => {
    const x = i / 23;
    const peak = 1 - Math.abs(x - 0.5) * 2;
    return 0.36 * easeInOut(peak) + (rng() - 0.5) * 0.03;
  });
  return {
    duration: 2400,
    draw(f) {
      const { ctx, t, w, h } = f;
      wash(f, p.base, 0.8 * easeOut(span(t, 0, 0.4)));
      // 減速して静止する粒子
      const still = easeOut(span(t, 0.1, 0.7));
      for (const d of drift) {
        const move = (1 - still) * 0.12;
        const x = d.x + Math.sin(d.seed * 9 + t * 6 * (1 - still)) * move;
        const y = d.y + Math.cos(d.seed * 7 + t * 5 * (1 - still)) * move;
        ctx.fillStyle = rgba(p.deep, 0.25 + d.r * 0.2);
        ctx.beginPath();
        ctx.arc(x * w, y * h, 1 + d.r * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      // 下から立ち上がる稜線
      const rise = easeOut(span(t, 0.3, 0.9));
      if (rise > 0) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ridge.forEach((peak, i) => {
          ctx.lineTo((i / (ridge.length - 1)) * w, h - peak * h * rise);
        });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = rgba(p.deep, 0.5);
        ctx.fill();
        ctx.strokeStyle = rgba(p.glow, 0.8 * rise);
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      centerMask(f);
    },
  };
};

/* ---------- 1 兌・沢: 水面が開き、反射して潤う ---------- */

const da: EffectFactory = (p, rng) => {
  const glints = makeParticles(50, rng);
  return {
    duration: 2300,
    draw(f) {
      const { ctx, t, w, h } = f;
      wash(f, p.base, 0.8 * easeOut(span(t, 0, 0.4)));
      const waterY = h * 0.62;
      // 水面下の明るさ
      const fill = easeOut(span(t, 0.1, 0.6));
      const g = ctx.createLinearGradient(0, waterY, 0, h);
      g.addColorStop(0, rgba(p.glow, 0.65 * fill));
      g.addColorStop(1, rgba(p.deep, 0.35 * fill));
      ctx.fillStyle = g;
      ctx.fillRect(0, waterY, w, h - waterY);
      // 水面線
      ctx.strokeStyle = rgba(p.deep, 0.6 * fill);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, waterY);
      ctx.lineTo(w, waterY);
      ctx.stroke();
      // 中央から外へ開く波紋(水面線上の楕円)
      for (let i = 0; i < 3; i++) {
        const phase = span(t, 0.25 + i * 0.16, 0.85 + i * 0.16);
        if (phase <= 0) continue;
        const rx = w * 0.45 * easeOut(phase);
        ctx.strokeStyle = rgba(p.deep, 0.5 * (1 - phase));
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(w / 2, waterY, rx, rx * 0.16, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // きらめく反射
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const s of glints) {
        const tw = Math.max(0, Math.sin(t * 14 + s.seed * 20));
        ctx.fillStyle = rgba("#ffffff", 0.8 * fill * tw * s.r);
        const y = waterY + s.y * (h - waterY) * 0.8;
        ctx.fillRect(s.x * w, y, 5 + s.r * 8, 1.4);
      }
      ctx.restore();
      centerMask(f);
    },
  };
};

/* ---------- 4 巽・風: 透明な流線がすき間を通る ---------- */

const son: EffectFactory = (p, rng) => {
  const streams = Array.from({ length: 6 }, (_, i) => ({
    y: 0.16 + (i / 5) * 0.68 + (rng() - 0.5) * 0.08,
    amp: 0.04 + rng() * 0.05,
    speed: 0.7 + rng() * 0.7,
    delay: rng() * 0.25,
    width: 1 + rng() * 1.4,
  }));
  return {
    duration: 2300,
    draw(f) {
      const { ctx, t, w, h } = f;
      wash(f, p.base, 0.75 * easeOut(span(t, 0, 0.4)));
      for (const s of streams) {
        const progress = span(t, s.delay, s.delay + 0.6 / s.speed);
        const gone = span(t, 0.75, 1);
        if (progress <= 0) continue;
        // 左→右へ通り抜ける流線(先端 head、尾 tail)
        const head = easeOut(progress) * 1.3;
        const tail = Math.max(0, head - 0.45);
        ctx.strokeStyle = rgba(p.deep, 0.5 * (1 - gone));
        ctx.lineWidth = s.width;
        ctx.beginPath();
        let started = false;
        for (let x = tail; x <= Math.min(head, 1.05); x += 0.02) {
          const y = s.y + Math.sin(x * 7 + s.delay * 20) * s.amp;
          if (!started) {
            ctx.moveTo(x * w, y * h);
            started = true;
          } else {
            ctx.lineTo(x * w, y * h);
          }
        }
        ctx.stroke();
        // 先端の小さな葉のような点
        if (head < 1.05) {
          const hy = s.y + Math.sin(head * 7 + s.delay * 20) * s.amp;
          ctx.fillStyle = rgba(p.glow, 0.9 * (1 - gone));
          ctx.beginPath();
          ctx.arc(head * w, hy * h, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      centerMask(f);
    },
  };
};

/* ---------- registry ---------- */

const FACTORIES: Record<number, EffectFactory> = {
  0: ken,
  1: da,
  2: ri,
  3: shin,
  4: son,
  5: kan,
  6: gon,
  7: kon,
};

/** 卦 id + パレットから決定的な演出インスタンスを作る */
export function createNatureEffect(
  id: number,
  palette: HakkePalette,
): NatureEffect {
  const factory = FACTORIES[id] ?? ken;
  return factory(palette, mulberry32(id * 7919 + 17));
}
