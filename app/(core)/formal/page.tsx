import type { Metadata } from "next";
import { FormalModeScene } from "@/components/core/formal/FormalModeScene";

const title = "本格モード | 易のかたち";
const description =
  "五十本の筮竹を操り、六爻が算木として積み上がって卦になる。易占いの儀式をビジュアルで体験します。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/formal",
  },
};

export default function FormalModePage() {
  return <FormalModeScene />;
}
