import type { Metadata } from "next";
import { DiceModeScene } from "@/components/core/dice/DiceModeScene";

const title = "サイコロモード | 易のかたち";
const description =
  "三つの骰子に下卦・上卦・変爻を委ね、本卦から之卦への変化をビジュアルで体験します。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/dice",
  },
};

export default function DiceModePage() {
  return <DiceModeScene />;
}
