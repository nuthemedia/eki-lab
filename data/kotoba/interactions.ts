export const FLOW_STAGES = ["窮", "変", "通", "久"] as const;
export type FlowStage = 0 | 1 | 2 | 3;

export type PhenomenonCue = {
  key: string;
  primary: string;
  secondary?: string;
  announcement: string;
};

export const PHENOMENON_CUE_HOLD_MS = 1600;

export function getPhenomenonCue(
  visual: "yin-yang" | "sheng-sheng" | "change-opens" | "sun-moon" | "sign-and-form",
  value: number,
): PhenomenonCue {
  switch (visual) {
    case "yin-yang":
      if (value < 0.4) {
        return {
          key: "yin-appears",
          primary: "陰、現る",
          secondary: "陽、退く",
          announcement: "陰が現れ、陽が退く",
        };
      }
      if (value > 0.6) {
        return {
          key: "yang-appears",
          primary: "陰、退く",
          secondary: "陽、現る",
          announcement: "陽が現れ、陰が退く",
        };
      }
      return {
        key: "exchange",
        primary: "交わり、替わる",
        announcement: "陰と陽が交わり、替わる",
      };
    case "sheng-sheng":
      if (value < 0.5) {
        return { key: "seed", primary: "種がひらく", announcement: "種がひらく" };
      }
      if (value < 0.8) {
        return { key: "branch", primary: "枝が次を生む", announcement: "枝が次を生む" };
      }
      return { key: "sheng-sheng", primary: "生生", announcement: "生まれて、また生まれる" };
    case "change-opens": {
      const cues = [
        { key: "exhaust", primary: "窮まる", announcement: "流れが窮まる" },
        { key: "change", primary: "変ず", announcement: "形が変わる" },
        { key: "open", primary: "通ず", announcement: "道が通じる" },
        { key: "endure", primary: "久し", announcement: "流れが長く続く" },
      ] as const;
      return cues[Math.max(0, Math.min(3, Math.round(value)))];
    }
    case "sun-moon":
      return value < 0.5
        ? {
            key: "sun-goes",
            primary: "日、往く",
            secondary: "月、来る",
            announcement: "日が往き、月が来る",
          }
        : {
            key: "moon-goes",
            primary: "月、往く",
            secondary: "日、来る",
            announcement: "月が往き、日が来る",
          };
    case "sign-and-form":
      if (value < 0.3) {
        return { key: "sign", primary: "兆し", announcement: "天に兆しが現れる" };
      }
      if (value < 0.7) {
        return { key: "condense", primary: "凝る", announcement: "兆しが形へ凝る" };
      }
      return { key: "form", primary: "形、現る", announcement: "地に形が現れる" };
  }
}

export function clampUnit(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function clampBias(value: number) {
  return Math.max(-1, Math.min(1, value));
}

export type ExchangeDirection = -1 | 1;

export function advanceExchangePhase(
  phase: number,
  direction: ExchangeDirection,
  delta: number,
): { phase: number; direction: ExchangeDirection } {
  const next = phase + delta * direction;
  if (next > 1) return { phase: 2 - next, direction: -1 };
  if (next < 0) return { phase: -next, direction: 1 };
  return { phase: next, direction };
}

export function pointerToBias(clientX: number, left: number, width: number) {
  if (width <= 0) return 0;
  return clampBias(((clientX - left) / width) * 2 - 1);
}

export function pointerToPhase(clientX: number, left: number, width: number) {
  if (width <= 0) return 0;
  return clampUnit((clientX - left) / width);
}

export function pointerToFormation(clientY: number, top: number, height: number) {
  if (height <= 0) return 0;
  return clampUnit((clientY - top) / height);
}

export function interpolateFormationPoint(
  sign: readonly [number, number],
  form: readonly [number, number],
  amount: number,
): [number, number] {
  const progress = clampUnit(amount);
  const eased = progress * progress * (3 - 2 * progress);
  return [
    sign[0] + (form[0] - sign[0]) * eased,
    sign[1] + (form[1] - sign[1]) * eased,
  ];
}

export function nextFlowStage(stage: FlowStage): FlowStage {
  return Math.min(3, stage + 1) as FlowStage;
}
