"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import HexagramGlyph from "@/components/core/HexagramGlyph";
import { TRIGRAMS } from "@/domain/iching/hexagrams";

export type WheelHexagram = {
  number: number;
  name: string;
  reading: string;
  essence: string;
  lines: ("yin" | "yang")[];
};

type HexagramWheelProps = {
  /** 序卦順 1〜64 */
  hexagrams: WheelHexagram[];
  /** 選択中の卦から辞典へ進むリンクを表示する */
  showDetailLink?: boolean;
};

const CX = 200;
const CY = 200;
const OUTER_R = 176;
const TRIGRAM_R = 104;
const STEP = 360 / 64; // 5.625°
const TAP_THRESHOLD = 6;
const SNAP_DURATION = 200;
const BASE_TILT = 26; // 円盤のベースチルト(deg)
const IDLE_SPEED = 1.2; // 自転速度(deg/s)
const IDLE_DELAY = 4000; // 操作後に自転を再開するまでの待ち(ms)

/** 12時スロットに載っている卦の index(0-63) */
function selectedIndex(angle: number): number {
  return ((Math.round(-angle / STEP) % 64) + 64) % 64;
}

/**
 * ポインタの中心角。rotateX で y が cos 圧縮されるため、
 * 射影後の rect サイズで正規化して歪みを打ち消す。
 */
function pointerAngle(e: { clientX: number; clientY: number }, el: SVGSVGElement): number {
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
  const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

/** 外輪のミニ卦画(下の爻ほど外周側)。ローカル座標は原点=スロット中心 */
function MiniGlyph({ lines }: { lines: ("yin" | "yang")[] }) {
  const w = 13;
  const h = 1.7;
  const gap = 1.3;
  return (
    <>
      {lines.map((line, i) => {
        const y = 6 - i * (h + gap); // 初爻が外側(下)
        return line === "yang" ? (
          <rect key={i} x={-w / 2} y={y} width={w} height={h} rx={0.6} />
        ) : (
          <g key={i}>
            <rect x={-w / 2} y={y} width={w * 0.42} height={h} rx={0.6} />
            <rect x={w / 2 - w * 0.42} y={y} width={w * 0.42} height={h} rx={0.6} />
          </g>
        );
      })}
    </>
  );
}

/** rotor の中身。自転の毎フレーム更新では外側 <g transform> だけが変わるよう memo 化 */
const RotorContent = memo(function RotorContent({
  hexagrams,
  selected,
}: {
  hexagrams: WheelHexagram[];
  selected: number;
}) {
  return (
    <>
      {hexagrams.map((hexagram, i) => (
        <g
          key={hexagram.number}
          data-index={i}
          className={`ik-wheel-glyph${i === selected ? " is-selected" : ""}`}
          transform={`rotate(${i * STEP} ${CX} ${CY}) translate(${CX} ${CY - OUTER_R})`}
        >
          <MiniGlyph lines={hexagram.lines} />
          <text x={0} y={-13} textAnchor="middle">
            {hexagram.number}
          </text>
          <rect className="ik-wheel-hit" x={-10} y={-20} width={20} height={32} fill="transparent" />
        </g>
      ))}
      {TRIGRAMS.map((trigram, i) => (
        <g
          key={trigram.name}
          className="ik-wheel-trigram"
          transform={`rotate(${i * 45} ${CX} ${CY}) translate(${CX} ${CY - TRIGRAM_R})`}
        >
          <text x={0} y={4} textAnchor="middle" fontSize={15}>
            {trigram.symbol}
          </text>
        </g>
      ))}
    </>
  );
});

export function HexagramWheel({ hexagrams, showDetailLink = true }: HexagramWheelProps) {
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ startPointer: number; startAngle: number; travel: number; lastX: number; lastY: number } | null>(null);
  const animRef = useRef<number | null>(null);
  const idleRef = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const hoverable = useRef(false);
  // 自転の停止条件(ref で rAF ループから参照)
  const suspend = useRef({ dragging: false, animating: false, focused: false, until: 0 });

  const markInteraction = useCallback(() => {
    suspend.current.until = performance.now() + IDLE_DELAY;
  }, []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hoverable.current = window.matchMedia("(hover: hover)").matches;
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      if (idleRef.current !== null) cancelAnimationFrame(idleRef.current);
    };
  }, []);

  // ゆっくり自転(変化は止まらない)。停止条件下では進めない
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = performance.now();
    const tick = (now: number) => {
      // タブ復帰時などの巨大な dt で卦が飛ばないようクランプ
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const s = suspend.current;
      if (!s.dragging && !s.animating && !s.focused && now >= s.until) {
        setAngle((a) => a + IDLE_SPEED * dt);
      }
      idleRef.current = requestAnimationFrame(tick);
    };
    idleRef.current = requestAnimationFrame(tick);
    return () => {
      if (idleRef.current !== null) cancelAnimationFrame(idleRef.current);
    };
  }, []);

  const animateTo = useCallback((from: number, to: number) => {
    if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    if (reducedMotion.current || from === to) {
      setAngle(to);
      return;
    }
    suspend.current.animating = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / SNAP_DURATION, 1);
      const eased = 1 - (1 - t) ** 3;
      setAngle(from + (to - from) * eased);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
        suspend.current.animating = false;
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  const snap = useCallback(
    (current: number) => {
      animateTo(current, Math.round(current / STEP) * STEP);
    },
    [animateTo],
  );

  /** index の卦を12時へ、最短経路で回す */
  const rotateToIndex = useCallback(
    (index: number, from: number) => {
      const target = -index * STEP;
      let delta = (((target - from) % 360) + 540) % 360 - 180;
      // ちょうど半周は正方向に
      if (delta === -180) delta = 180;
      animateTo(from, from + delta);
    },
    [animateTo],
  );

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      suspend.current.animating = false;
    }
    try {
      svgRef.current.setPointerCapture(e.pointerId);
    } catch {
      // 合成イベント等で pointer が捕捉できなくてもドラッグ自体は続行する
    }
    drag.current = {
      startPointer: pointerAngle(e, svgRef.current),
      startAngle: angle,
      travel: 0,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    suspend.current.dragging = true;
    markInteraction();
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const d = drag.current;
    d.travel += Math.hypot(e.clientX - d.lastX, e.clientY - d.lastY);
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    let delta = pointerAngle(e, svgRef.current) - d.startPointer;
    delta = ((delta % 360) + 540) % 360 - 180;
    setAngle(d.startAngle + delta);
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const d = drag.current;
    drag.current = null;
    suspend.current.dragging = false;
    markInteraction();
    setDragging(false);
    if (d.travel < TAP_THRESHOLD) {
      // タップ: 卦グリフなら12時へ回転
      const glyph = (e.target as Element).closest("[data-index]");
      if (glyph) {
        rotateToIndex(Number(glyph.getAttribute("data-index")), angle);
        return;
      }
      setAngle(d.startAngle);
      return;
    }
    let delta = pointerAngle(e, svgRef.current) - d.startPointer;
    delta = ((delta % 360) + 540) % 360 - 180;
    snap(d.startAngle + delta);
  };

  /** パララックス(hover 環境のみ、非ドラッグ時) */
  const onStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hoverable.current || drag.current || reducedMotion.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: dy * 3, y: dx * 4 });
  };

  const onStagePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (dir === 0) return;
    e.preventDefault();
    markInteraction();
    const next = (selectedIndex(angle) + dir + 64) % 64;
    rotateToIndex(next, angle);
  };

  const selected = hexagrams[selectedIndex(angle)];

  return (
    <div className="ik-wheel-block">
      <div
        className={`ik-wheel${dragging ? " is-dragging" : ""}`}
        role="slider"
        tabIndex={0}
        aria-label="六十四卦ホイール"
        aria-valuemin={1}
        aria-valuemax={64}
        aria-valuenow={selected.number}
        aria-valuetext={`第${selected.number}卦 ${selected.name}(${selected.reading})`}
        onKeyDown={onKeyDown}
        onFocus={() => {
          suspend.current.focused = true;
        }}
        onBlur={() => {
          suspend.current.focused = false;
          markInteraction();
        }}
      >
        <div
          className="ik-wheel-stage"
          onPointerMove={onStagePointerMove}
          onPointerLeave={onStagePointerLeave}
        >
          <div
            className="ik-wheel-disc"
            style={{ transform: `rotateX(${BASE_TILT + tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <circle className="ik-wheel-ring" cx={CX} cy={CY} r={OUTER_R + 15} />
              <circle className="ik-wheel-ring" cx={CX} cy={CY} r={OUTER_R - 18} />
              <circle className="ik-wheel-ring" cx={CX} cy={CY} r={TRIGRAM_R + 16} />
              <g transform={`rotate(${angle} ${CX} ${CY})`}>
                <RotorContent hexagrams={hexagrams} selected={selectedIndex(angle)} />
              </g>
              <path className="ik-wheel-marker" d={`M ${CX - 5} 3 L ${CX + 5} 3 L ${CX} 12 Z`} />
            </svg>
          </div>
        </div>
        <div className="ik-wheel-center">
          <HexagramGlyph lines={selected.lines} />
          <div aria-live="polite">
            <div className="ik-wheel-center-name">{selected.name}</div>
            <div className="ik-wheel-center-reading">{selected.reading}</div>
          </div>
          <p className="ik-wheel-center-essence">{selected.essence}</p>
          {showDetailLink ? (
            <Link href={`/hexagrams/${selected.number}`} className="ik-wheel-center-link">
              辞典で見る →
            </Link>
          ) : null}
        </div>
      </div>
      <p className="ik-wheel-hint">まわして、六十四の変化をたどる</p>
    </div>
  );
}
