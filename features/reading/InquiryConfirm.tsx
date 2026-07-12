"use client";

import { motion } from "motion/react";

type Props = {
  inquiry: string;
  onConfirm: () => void;
  onBack: () => void;
};

/** Step4: 最終占的の確認。ここではまだ卦を立てない */
export function InquiryConfirm({ inquiry, onConfirm, onBack }: Props) {
  return (
    <motion.div
      className="ik-flow-col ik-flow-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="ik-eyebrow">今回の問い</div>
      <motion.p
        className="ik-inquiry-big"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        {inquiry}
      </motion.p>
      <p className="ik-flow-note" style={{ textAlign: "center" }}>
        この問いに対して卦を立てます。
        <br />
        問いを変えたい場合は、ここで整え直してください。
      </p>
      <div className="ik-flow-col" style={{ gap: 14, alignItems: "center" }}>
        <button className="ik-btn ik-btn--primary" onClick={onConfirm}>
          この問いで占う
        </button>
        <button className="ik-link-quiet ik-linklike" onClick={onBack}>
          問いを整え直す
        </button>
      </div>
    </motion.div>
  );
}
