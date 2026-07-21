"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import {
  advanceExchangePhase,
  FLOW_STAGES,
  getPhenomenonCue,
  interpolateFormationPoint,
  nextFlowStage,
  PHENOMENON_CUE_HOLD_MS,
  pointerToFormation,
  pointerToPhase,
  type FlowStage,
  type PhenomenonCue,
} from "@/data/kotoba/interactions";
import type { KotobaPassage } from "@/data/kotoba/passages";
import { useKotobaAudio } from "./KotobaAudioProvider";

type Frame = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
};

type KotobaCanvasProps = {
  passage: KotobaPassage;
  preview?: boolean;
};

function rgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawGlowPoint(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha = 1,
) {
  const glow = context.createRadialGradient(x, y, 0, x, y, radius * 4);
  glow.addColorStop(0, rgba(color, alpha));
  glow.addColorStop(0.25, rgba(color, alpha * 0.38));
  glow.addColorStop(1, rgba(color, 0));
  context.fillStyle = glow;
  context.beginPath();
  context.arc(x, y, radius * 4, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = rgba(color, alpha);
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function drawYinYang(
  frame: Frame,
  primary: string,
  secondary: string,
  phase: number,
  reduced: boolean,
) {
  const { context, width, height, time } = frame;
  const cx = width / 2;
  const cy = height * 0.43;
  const span = Math.min(width * 0.43, 410);
  const rise = Math.min(height * 0.21, 112);
  const exchange = phase * 2 - 1;
  const strengths = [(1 - exchange) / 2, (exchange + 1) / 2];
  const shimmer = reduced ? 0 : time * 0.00035;

  context.save();
  context.globalCompositeOperation = "lighter";
  [primary, secondary].forEach((color, side) => {
    const direction = side === 0 ? 1 : -1;
    const strength = 0.24 + strengths[side] * 0.76;
    const spread = 10 + strength * Math.min(32, height * 0.07);
    context.shadowColor = rgba(color, 0.7);
    context.shadowBlur = 7 + strength * 12;
    for (let strand = 0; strand < 18; strand += 1) {
      const offset = ((strand - 8.5) / 8.5) * spread;
      context.beginPath();
      for (let step = 0; step <= 110; step += 1) {
        const progress = step / 110;
        const axis = progress * 2 - 1;
        const x = cx + axis * span;
        const breathing = Math.sin(progress * Math.PI * 3 + shimmer + strand * 0.22) * 2.2;
        const y =
          cy +
          direction * axis * rise +
          offset * Math.abs(axis) +
          breathing * Math.sin(progress * Math.PI);
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = rgba(color, 0.035 + strength * (0.045 + strand * 0.005));
      context.lineWidth = 0.55 + strength * 1.15;
      context.stroke();
    }

    context.shadowBlur = 0;
    for (let index = 0; index < 72; index += 1) {
      const travel = (index / 72 + phase * direction + 2) % 1;
      const axis = travel * 2 - 1;
      const edgeScatter = Math.sin(index * 17.17) * spread * Math.abs(axis) * 0.72;
      const x = cx + axis * span;
      const y = cy + direction * axis * rise + edgeScatter;
      const head = Math.pow(travel, direction > 0 ? 2.4 : 0.45);
      const alpha = 0.18 + strength * (0.24 + head * 0.34);
      drawGlowPoint(context, x, y, index % 9 === 0 ? 1.9 : 0.72, color, alpha);
    }
  });

  const gate = context.createRadialGradient(cx, cy, 0, cx, cy, 54);
  gate.addColorStop(0, "rgba(243,245,242,.82)");
  gate.addColorStop(0.08, "rgba(243,245,242,.23)");
  gate.addColorStop(1, "rgba(243,245,242,0)");
  context.fillStyle = gate;
  context.beginPath();
  context.arc(cx, cy, 54, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(243,245,242,.38)";
  context.lineWidth = 1;
  context.beginPath();
  context.ellipse(cx, cy, 10, 38, 0, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function branchNoise(seed: number) {
  return Math.sin(seed * 91.733) * 0.5 + Math.sin(seed * 17.17) * 0.5;
}

function drawBranch(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number,
  seed: number,
  color: string,
  growth: number,
) {
  if (depth <= 0 || length < 4) {
    drawGlowPoint(context, x, y, 1.2 + growth * 1.2, color, 0.45 + growth * 0.3);
    return;
  }
  const visibleLength = length * Math.min(1, growth * 1.8);
  const nx = x + Math.cos(angle) * visibleLength;
  const ny = y + Math.sin(angle) * visibleLength;
  context.beginPath();
  context.moveTo(x, y);
  context.quadraticCurveTo(
    x + Math.cos(angle - 0.12) * visibleLength * 0.55,
    y + Math.sin(angle - 0.12) * visibleLength * 0.55,
    nx,
    ny,
  );
  context.strokeStyle = rgba(color, 0.15 + growth * 0.44);
  context.lineWidth = Math.max(0.5, depth * 0.44);
  context.stroke();

  const nextGrowth = Math.max(0, growth - 0.09);
  drawBranch(
    context,
    nx,
    ny,
    angle - 0.38 + branchNoise(seed) * 0.14,
    length * 0.73,
    depth - 1,
    seed + 1.3,
    color,
    nextGrowth,
  );
  drawBranch(
    context,
    nx,
    ny,
    angle + 0.38 + branchNoise(seed + 8) * 0.14,
    length * 0.71,
    depth - 1,
    seed + 4.7,
    color,
    nextGrowth,
  );
}

function drawGeneration(frame: Frame, color: string, energy: number, reduced: boolean) {
  const { context, width, height, time } = frame;
  const cx = width / 2;
  const cy = height * 0.72;
  const breath = reduced ? 0 : Math.sin(time * 0.0013) * 0.025;
  const growth = Math.max(0.18, Math.min(1, energy + breath));
  const depth = 4 + Math.floor(energy * 2);

  context.save();
  context.globalCompositeOperation = "lighter";
  drawGlowPoint(context, cx, cy, 4, color, 0.9);
  const roots = 5;
  for (let index = 0; index < roots; index += 1) {
    const spread = (index - (roots - 1) / 2) * 0.31;
    drawBranch(
      context,
      cx,
      cy,
      -Math.PI / 2 + spread,
      Math.min(width, height) * 0.28,
      depth,
      index * 7.1,
      color,
      growth,
    );
  }
  context.restore();
}

function flowPoint(
  progress: number,
  width: number,
  height: number,
  stage: FlowStage,
) {
  const left = width * 0.08;
  const right = width * 0.92;
  const center = width * 0.51;
  const y = height * 0.5;
  const pass = stage >= 2;
  const x = left + progress * (pass ? right - left : center - left - width * 0.035);
  const wave = Math.sin(progress * Math.PI * 3.5) * height * 0.035 * (1 - progress * 0.5);
  const opening = pass && progress > 0.52 ? Math.sin((progress - 0.52) * Math.PI) * height * 0.12 : 0;
  return [x, y + wave - opening] as const;
}

function drawFlow(frame: Frame, primary: string, secondary: string, stage: FlowStage, reduced: boolean) {
  const { context, width, height, time } = frame;
  const barrierX = width * 0.51;
  const centerY = height * 0.5;

  context.save();
  const barrier = context.createLinearGradient(barrierX - 18, 0, barrierX + 18, 0);
  barrier.addColorStop(0, "rgba(16,25,32,0)");
  barrier.addColorStop(0.5, stage >= 2 ? "rgba(102,142,152,.12)" : "rgba(132,146,151,.55)");
  barrier.addColorStop(1, "rgba(16,25,32,0)");
  context.fillStyle = barrier;
  context.fillRect(barrierX - 28, height * 0.16, 56, height * 0.68);

  context.globalCompositeOperation = "lighter";
  const speed = reduced ? 0 : time * 0.00024;
  for (let index = 0; index < 84; index += 1) {
    const progress = (index / 84 + speed) % 1;
    const [x, y] = flowPoint(progress, width, height, stage);
    const pressure = stage === 1 && progress > 0.72 ? (progress - 0.72) * 20 : 0;
    drawGlowPoint(context, x - pressure, y + Math.sin(index * 3.1) * 5, index % 9 === 0 ? 1.7 : 0.7, primary, 0.5);
  }

  if (stage >= 2) {
    for (let index = 0; index < 62; index += 1) {
      const progress = (index / 62 + speed * 0.82) % 1;
      if (progress < 0.49) continue;
      const x = barrierX + (progress - 0.49) * width * 0.84;
      const y = centerY - Math.sin((progress - 0.49) * Math.PI * 1.7) * height * 0.12;
      drawGlowPoint(context, x, y + Math.sin(index * 2.3) * 4, index % 10 === 0 ? 1.8 : 0.7, secondary, 0.52);
    }
  }

  if (stage === 3) {
    context.beginPath();
    context.ellipse(width / 2, centerY, width * 0.37, height * 0.16, 0, 0, Math.PI * 2);
    context.strokeStyle = rgba(secondary, 0.22);
    context.lineWidth = 1;
    context.stroke();
  }
  context.restore();
}

function drawDisc(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number,
) {
  const gradient = context.createRadialGradient(x - radius * 0.25, y - radius * 0.3, 0, x, y, radius * 2.8);
  gradient.addColorStop(0, rgba("#ffffff", alpha));
  gradient.addColorStop(0.25, rgba(color, alpha));
  gradient.addColorStop(1, rgba(color, 0));
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius * 2.8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = rgba(color, alpha * 0.9);
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function drawSunMoon(
  frame: Frame,
  sunColor: string,
  moonColor: string,
  phase: number,
  reduced: boolean,
) {
  const { context, width, height, time } = frame;
  const cx = width / 2;
  const cy = height * 0.49;
  const rx = Math.min(width * 0.37, 300);
  const ry = Math.min(height * 0.19, 145);
  const drift = reduced ? 0 : time * 0.00002;
  const angle = (phase + drift) * Math.PI * 2;

  context.save();
  context.beginPath();
  context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  const track = context.createLinearGradient(cx - rx, cy, cx + rx, cy);
  track.addColorStop(0, rgba(sunColor, 0.4));
  track.addColorStop(0.5, rgba("#d9e4e9", 0.14));
  track.addColorStop(1, rgba(moonColor, 0.38));
  context.strokeStyle = track;
  context.lineWidth = 1.3;
  context.stroke();
  context.globalCompositeOperation = "lighter";
  const sunX = cx + Math.cos(angle) * rx;
  const sunY = cy + Math.sin(angle) * ry;
  const moonX = cx + Math.cos(angle + Math.PI) * rx;
  const moonY = cy + Math.sin(angle + Math.PI) * ry;
  drawDisc(context, sunX, sunY, Math.max(8, width * 0.024), sunColor, 0.95);
  drawDisc(context, moonX, moonY, Math.max(8, width * 0.024), moonColor, 0.9);
  context.restore();
}

const FORMATION_SIGN_POINTS = [
  [0.12, 0.2], [0.23, 0.13], [0.32, 0.24], [0.42, 0.15], [0.51, 0.27],
  [0.6, 0.12], [0.69, 0.23], [0.79, 0.15], [0.89, 0.27], [0.61, 0.31],
] as const;

const FORMATION_FORM_POINTS = [
  [0.1, 0.73], [0.22, 0.64], [0.31, 0.76], [0.41, 0.67], [0.5, 0.8],
  [0.59, 0.63], [0.7, 0.75], [0.8, 0.65], [0.91, 0.77], [0.61, 0.82],
] as const;

const FORMATION_EDGES = [
  [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5],
  [4, 5], [4, 6], [4, 9], [5, 6], [5, 7], [6, 7], [6, 9], [6, 8],
  [7, 8], [8, 9],
] as const;

function drawFormation(
  frame: Frame,
  signColor: string,
  formColor: string,
  formation: number,
  reduced: boolean,
) {
  const { context, width, height, time } = frame;
  const shimmer = reduced ? 0 : Math.sin(time * 0.001) * 0.06;
  const transition = Math.sin(formation * Math.PI);
  const topAlpha = 0.22 + (1 - formation) * 0.65;
  const formAlpha = 0.14 + formation * 0.72;
  context.save();
  context.globalCompositeOperation = "lighter";

  FORMATION_EDGES.forEach(([fromIndex, toIndex]) => {
    const from = FORMATION_SIGN_POINTS[fromIndex];
    const to = FORMATION_SIGN_POINTS[toIndex];
    context.strokeStyle = rgba(signColor, topAlpha * 0.56);
    context.lineWidth = 0.85;
    context.beginPath();
    context.moveTo(from[0] * width, from[1] * height);
    context.lineTo(to[0] * width, to[1] * height);
    context.stroke();

    for (let layer = 1; layer <= 5; layer += 1) {
      const amount = Math.max(0, Math.min(1, formation + (layer - 3) * 0.065));
      const mappedFrom = interpolateFormationPoint(
        from,
        FORMATION_FORM_POINTS[fromIndex],
        amount,
      );
      const mappedTo = interpolateFormationPoint(
        to,
        FORMATION_FORM_POINTS[toIndex],
        amount,
      );
      context.strokeStyle = rgba(signColor, transition * (0.055 + layer * 0.018));
      context.beginPath();
      context.moveTo(mappedFrom[0] * width, mappedFrom[1] * height);
      context.lineTo(mappedTo[0] * width, mappedTo[1] * height);
      context.stroke();
    }
  });

  FORMATION_SIGN_POINTS.forEach((signPoint, index) => {
    const formPoint = FORMATION_FORM_POINTS[index];
    const currentPoint = interpolateFormationPoint(signPoint, formPoint, formation);
    const sx = signPoint[0] * width;
    const sy = signPoint[1] * height;
    const fx = formPoint[0] * width;
    const fy = formPoint[1] * height;
    const gradient = context.createLinearGradient(sx, sy, fx, fy);
    gradient.addColorStop(0, rgba(signColor, topAlpha * 0.38));
    gradient.addColorStop(0.5, rgba(signColor, 0.08 + transition * 0.34));
    gradient.addColorStop(1, rgba(formColor, formAlpha * 0.34));
    context.strokeStyle = gradient;
    context.lineWidth = 0.7 + transition * 0.7;
    context.beginPath();
    context.moveTo(sx, sy);
    context.bezierCurveTo(
      sx + Math.sin(index * 2.1) * width * 0.055,
      height * 0.42,
      fx + Math.cos(index * 1.7) * width * 0.04,
      height * 0.53,
      fx,
      fy,
    );
    context.stroke();
    drawGlowPoint(context, sx, sy, index % 3 === 0 ? 1.8 : 1, signColor, topAlpha + shimmer);
    drawGlowPoint(
      context,
      currentPoint[0] * width,
      currentPoint[1] * height,
      1.3 + transition * 1.4,
      signColor,
      0.24 + transition * 0.7,
    );
    drawGlowPoint(context, fx, fy, index % 4 === 0 ? 1.7 : 0.9, formColor, formAlpha * 0.75);
  });

  context.globalCompositeOperation = "source-over";
  for (let layer = 0; layer < 16; layer += 1) {
    const depth = 1 - layer / 24;
    const baseY = height * 0.7 + layer * height * 0.012;
    context.beginPath();
    for (let step = 0; step <= 110; step += 1) {
      const progress = step / 110;
      const x = progress * width;
      let lift = 0;
      FORMATION_FORM_POINTS.forEach(([px], index) => {
        const spread = 0.052 + (index % 3) * 0.014;
        const distance = (progress - px) / spread;
        const shoulder = (progress - px - (index % 2 === 0 ? -0.035 : 0.035)) / (spread * 1.35);
        lift +=
          (Math.exp(-(distance * distance)) + Math.exp(-(shoulder * shoulder)) * 0.34) *
          height *
          (0.052 + (index % 4) * 0.013);
      });
      const y =
        baseY -
        lift * (0.22 + formation * 1.05) * depth +
        Math.sin(step * 0.2 + layer * 0.82) * (2.2 + formation * 2.4);
      if (step === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = rgba(formColor, formAlpha * (0.52 - layer * 0.016));
    context.lineWidth = 0.72 + formation * 0.48;
    context.stroke();
  }

  context.globalCompositeOperation = "lighter";
  FORMATION_EDGES.forEach(([fromIndex, toIndex]) => {
    const from = FORMATION_FORM_POINTS[fromIndex];
    const to = FORMATION_FORM_POINTS[toIndex];
    context.strokeStyle = rgba(formColor, formation * 0.13);
    context.lineWidth = 0.7;
    context.beginPath();
    context.moveTo(from[0] * width, from[1] * height);
    context.quadraticCurveTo(
      ((from[0] + to[0]) / 2) * width,
      Math.min(from[1], to[1]) * height - height * 0.045,
      to[0] * width,
      to[1] * height,
    );
    context.stroke();
  });

  context.strokeStyle = rgba("#e5eadb", 0.12 + formation * 0.56);
  context.lineWidth = 1 + formation * 1.2;
  context.beginPath();
  for (let step = 0; step <= 70; step += 1) {
    const progress = step / 70;
    const x = width * (0.47 + Math.sin(progress * Math.PI * 4.4) * 0.055 * (1 - progress * 0.4));
    const y = height * (0.62 + progress * 0.25);
    if (step === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
  context.restore();
}

export default function KotobaCanvas({ passage, preview = false }: KotobaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const interactingExchangeRef = useRef(false);
  const exchangeDirectionRef = useRef<1 | -1>(1);
  const holdTimerRef = useRef<number | null>(null);
  const cueHideTimerRef = useRef<number | null>(null);
  const exchangePhaseRef = useRef(preview ? 0.72 : 0.5);
  const energyRef = useRef(preview ? 0.72 : 0.38);
  const flowStageRef = useRef<FlowStage>(preview ? 2 : 0);
  const phaseRef = useRef(preview ? 0.08 : 0.04);
  const formationRef = useRef(preview ? 0.78 : 0.55);
  const reducedMotion = useReducedMotion() ?? false;
  const { pulse } = useKotobaAudio();
  const [exchangePhase, setExchangePhase] = useState(preview ? 0.72 : 0.5);
  const [, setEnergy] = useState(preview ? 0.72 : 0.38);
  const [flowStage, setFlowStage] = useState<FlowStage>(preview ? 2 : 0);
  const [phase, setPhase] = useState(preview ? 0.08 : 0.04);
  const [formation, setFormation] = useState(preview ? 0.78 : 0.55);
  const [phenomenonCue, setPhenomenonCue] = useState<PhenomenonCue | null>(null);
  const [cueVisible, setCueVisible] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const showPhenomenonCue = useCallback((value: number) => {
    const cue = getPhenomenonCue(passage.visual, value);
    if (cueHideTimerRef.current !== null) {
      window.clearTimeout(cueHideTimerRef.current);
      cueHideTimerRef.current = null;
    }
    setPhenomenonCue(cue);
    setCueVisible(true);
    setAnnouncement((current) => current === cue.announcement ? current : cue.announcement);
  }, [passage.visual]);

  const hidePhenomenonCueLater = useCallback(() => {
    if (cueHideTimerRef.current !== null) window.clearTimeout(cueHideTimerRef.current);
    cueHideTimerRef.current = window.setTimeout(() => {
      cueHideTimerRef.current = null;
      setCueVisible(false);
    }, PHENOMENON_CUE_HOLD_MS);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { rootMargin: "100px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let previousTime = 0;
    let lastExchangeUiUpdate = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const draw = (time: number) => {
      frameId = window.requestAnimationFrame(draw);
      if (!visibleRef.current || document.hidden) return;
      const delta = previousTime === 0 ? 0 : Math.min(64, time - previousTime);
      previousTime = time;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      if (
        passage.visual === "yin-yang" &&
        !reducedMotion &&
        !interactingExchangeRef.current
      ) {
        const exchange = advanceExchangePhase(
          exchangePhaseRef.current,
          exchangeDirectionRef.current,
          delta / 14500,
        );
        exchangePhaseRef.current = exchange.phase;
        exchangeDirectionRef.current = exchange.direction;
        if (!preview && time - lastExchangeUiUpdate > 80) {
          lastExchangeUiUpdate = time;
          setExchangePhase(exchange.phase);
        }
      }
      const frame = { context, width, height, time };
      switch (passage.visual) {
        case "yin-yang":
          drawYinYang(frame, passage.theme.primary, passage.theme.secondary, exchangePhaseRef.current, reducedMotion);
          break;
        case "sheng-sheng":
          drawGeneration(frame, passage.theme.primary, energyRef.current, reducedMotion);
          break;
        case "change-opens":
          drawFlow(frame, passage.theme.primary, passage.theme.secondary, flowStageRef.current, reducedMotion);
          break;
        case "sun-moon":
          drawSunMoon(frame, passage.theme.primary, passage.theme.secondary, phaseRef.current, reducedMotion);
          break;
        case "sign-and-form":
          drawFormation(frame, passage.theme.primary, passage.theme.secondary, formationRef.current, reducedMotion);
          break;
      }
    };
    frameId = window.requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [passage.theme.primary, passage.theme.secondary, passage.visual, preview, reducedMotion]);

  useEffect(
    () => () => {
      if (holdTimerRef.current !== null) window.clearInterval(holdTimerRef.current);
      if (cueHideTimerRef.current !== null) window.clearTimeout(cueHideTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const finishExchangeInteraction = () => {
      interactingExchangeRef.current = false;
    };
    window.addEventListener("pointerup", finishExchangeInteraction);
    window.addEventListener("pointercancel", finishExchangeInteraction);
    return () => {
      window.removeEventListener("pointerup", finishExchangeInteraction);
      window.removeEventListener("pointercancel", finishExchangeInteraction);
    };
  }, []);

  const updateExchangePhase = useCallback((value: number) => {
    const next = Math.max(0, Math.min(1, value));
    exchangePhaseRef.current = next;
    setExchangePhase(next);
    showPhenomenonCue(next);
  }, [showPhenomenonCue]);

  const updatePhase = useCallback((value: number) => {
    const next = Math.max(0, Math.min(1, value));
    phaseRef.current = next;
    setPhase(next);
    showPhenomenonCue(next);
  }, [showPhenomenonCue]);

  const updateFormation = useCallback((value: number) => {
    const next = Math.max(0, Math.min(1, value));
    formationRef.current = next;
    setFormation(next);
    showPhenomenonCue(next);
  }, [showPhenomenonCue]);

  const updateFromPointer = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (passage.visual === "yin-yang") {
        updateExchangePhase(pointerToPhase(event.clientX, rect.left, rect.width));
      } else if (passage.visual === "sun-moon") {
        updatePhase(pointerToPhase(event.clientX, rect.left, rect.width));
      } else if (passage.visual === "sign-and-form") {
        updateFormation(pointerToFormation(event.clientY, rect.top, rect.height));
      }
    },
    [passage.visual, updateExchangePhase, updateFormation, updatePhase],
  );

  const addEnergy = useCallback(() => {
    const next = Math.min(1, energyRef.current + 0.11);
    energyRef.current = next;
    setEnergy(next);
    showPhenomenonCue(next);
    pulse(0.68);
  }, [pulse, showPhenomenonCue]);

  const advanceFlow = useCallback(() => {
    const next = flowStageRef.current === 3 ? 0 : nextFlowStage(flowStageRef.current);
    flowStageRef.current = next;
    setFlowStage(next);
    showPhenomenonCue(next);
    pulse(0.35 + next * 0.16);
  }, [pulse, showPhenomenonCue]);

  const startInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (preview) return;
    draggingRef.current = true;
    if (passage.visual === "yin-yang") {
      interactingExchangeRef.current = true;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
    if (passage.visual === "sheng-sheng") {
      addEnergy();
      holdTimerRef.current = window.setInterval(addEnergy, 260);
    }
    if (passage.visual === "change-opens") {
      advanceFlow();
      holdTimerRef.current = window.setInterval(advanceFlow, 640);
    }
  };

  const moveInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || preview) return;
    updateFromPointer(event);
  };

  const stopInteraction = () => {
    draggingRef.current = false;
    if (holdTimerRef.current !== null) {
      window.clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (passage.visual === "yin-yang") {
      interactingExchangeRef.current = false;
    }
    hidePhenomenonCueLater();
  };

  const beginExchangeControl = () => {
    interactingExchangeRef.current = true;
    showPhenomenonCue(exchangePhaseRef.current);
  };

  const endExchangeControl = () => {
    interactingExchangeRef.current = false;
    hidePhenomenonCueLater();
  };

  const beginPhaseControl = () => showPhenomenonCue(phaseRef.current);
  const beginFormationControl = () => showPhenomenonCue(formationRef.current);

  const triggerEnergy = () => {
    addEnergy();
    hidePhenomenonCueLater();
  };

  const triggerFlow = () => {
    advanceFlow();
    hidePhenomenonCueLater();
  };

  const cueStyle = (() => {
    if (!phenomenonCue) return undefined;
    if (passage.visual === "sun-moon") {
      const angle = phase * Math.PI * 2;
      const sun = [50 + Math.cos(angle) * 37, 49 + Math.sin(angle) * 19];
      const moon = [50 + Math.cos(angle + Math.PI) * 37, 49 + Math.sin(angle + Math.PI) * 19];
      const primary = phenomenonCue.key === "sun-goes" ? sun : moon;
      const secondary = phenomenonCue.key === "sun-goes" ? moon : sun;
      return {
        "--kt-cue-primary-x": `${primary[0]}%`,
        "--kt-cue-primary-y": `${primary[1]}%`,
        "--kt-cue-secondary-x": `${secondary[0]}%`,
        "--kt-cue-secondary-y": `${secondary[1]}%`,
      } as CSSProperties;
    }
    if (passage.visual === "sign-and-form") {
      return { "--kt-cue-y": `${20 + formation * 58}%` } as CSSProperties;
    }
    return undefined;
  })();

  return (
    <div
      className={`kt-canvas-shell is-${passage.visual}${preview ? " is-preview" : ""}`}
      style={{
        "--kt-primary": passage.theme.primary,
        "--kt-secondary": passage.theme.secondary,
        "--kt-glow": passage.theme.glow,
      } as CSSProperties}
    >
      <div
        ref={containerRef}
        className={`kt-canvas-scene is-${passage.visual}${preview ? " is-preview" : ""}`}
        onPointerDown={startInteraction}
        onPointerMove={moveInteraction}
        onPointerUp={stopInteraction}
        onPointerCancel={stopInteraction}
      >
        <canvas ref={canvasRef} aria-hidden />
        {preview || !phenomenonCue ? null : (
          <div
            className={`kt-phenomenon-cue${cueVisible ? " is-visible" : ""}${phenomenonCue.secondary ? " has-pair" : ""}`}
            data-cue={phenomenonCue.key}
            style={cueStyle}
            aria-hidden="true"
          >
            <span className="is-primary">{phenomenonCue.primary}</span>
            {phenomenonCue.secondary ? (
              <span className="is-secondary">{phenomenonCue.secondary}</span>
            ) : null}
          </div>
        )}
      </div>
      {preview ? null : (
        <span className="kt-sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
      )}
      {preview ? null : (
        <div className="kt-canvas-controls">
          {passage.visual === "yin-yang" ? (
            <label>
              <span className="kt-range-labels" aria-hidden><span>陰</span><span>交替</span><span>陽</span></span>
              <span className="kt-sr-only">陰陽が交替する位相</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={exchangePhase}
                aria-valuetext={getPhenomenonCue("yin-yang", exchangePhase).announcement}
                onInput={(event) => updateExchangePhase(Number(event.currentTarget.value))}
                onPointerDown={beginExchangeControl}
                onPointerUp={endExchangeControl}
                onPointerCancel={endExchangeControl}
                onKeyDown={beginExchangeControl}
                onKeyUp={endExchangeControl}
                onBlur={endExchangeControl}
              />
            </label>
          ) : null}
          {passage.visual === "sheng-sheng" ? (
            <button type="button" onClick={triggerEnergy}>次の生成を生む</button>
          ) : null}
          {passage.visual === "change-opens" ? (
            <button type="button" onClick={triggerFlow}>
              流れを進める　{FLOW_STAGES[flowStage]}
            </button>
          ) : null}
          {passage.visual === "sun-moon" ? (
            <label>
              <span className="kt-sr-only">日月の位置</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={phase}
                aria-valuetext={getPhenomenonCue("sun-moon", phase).announcement}
                onInput={(event) => updatePhase(Number(event.currentTarget.value))}
                onPointerDown={beginPhaseControl}
                onPointerUp={hidePhenomenonCueLater}
                onPointerCancel={hidePhenomenonCueLater}
                onKeyDown={beginPhaseControl}
                onKeyUp={hidePhenomenonCueLater}
                onBlur={hidePhenomenonCueLater}
              />
            </label>
          ) : null}
          {passage.visual === "sign-and-form" ? (
            <label>
              <span className="kt-range-labels" aria-hidden><span>象</span><span>変化</span><span>形</span></span>
              <span className="kt-sr-only">象が形になる度合い</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={formation}
                aria-valuetext={getPhenomenonCue("sign-and-form", formation).announcement}
                onInput={(event) => updateFormation(Number(event.currentTarget.value))}
                onPointerDown={beginFormationControl}
                onPointerUp={hidePhenomenonCueLater}
                onPointerCancel={hidePhenomenonCueLater}
                onKeyDown={beginFormationControl}
                onKeyUp={hidePhenomenonCueLater}
                onBlur={hidePhenomenonCueLater}
              />
            </label>
          ) : null}
        </div>
      )}
    </div>
  );
}
