"use client";

import { motion } from "motion/react";

/** 変爻用サイコロの面の漢字。face = 変爻の位置(0-5) */
const LINE_FACES = ["初", "二", "三", "四", "五", "上"];

/** face(0-5)を正面に向けるキューブの回転(deg)。面の配置と対 */
const SHOW_ROTATION: Record<number, { x: number; y: number }> = {
  0: { x: 0, y: 0 },
  1: { x: 0, y: -90 },
  2: { x: -90, y: 0 },
  3: { x: 90, y: 0 },
  4: { x: 0, y: 90 },
  5: { x: 0, y: 180 },
};

function Face({ label, transform }: { label: string; transform: string }) {
  return (
    <div className="ik-cube-face ik-cube-face--kanji" style={{ transform }}>
      {label}
    </div>
  );
}

type Props = {
  /** 変爻の位置 0-5(初〜上) */
  face: number;
  /** true の間、跳ねながら転がって face で静止する */
  rolling?: boolean;
  /** まだ出番でない骰子 */
  dimmed?: boolean;
  size?: number;
};

/** 初〜上の漢字が入った変爻用の六面体。骨・象牙風の生成り */
export function DieView({ face, rolling = false, dimmed = false, size = 60 }: Props) {
  const d = size / 2;
  const target = SHOW_ROTATION[face] ?? SHOW_ROTATION[0];
  // 転がり終了後も同じ数値を保つ(巻き戻しアニメを防ぐ)。
  // 未ロール時は結果を明かさない中立の姿勢。
  const settled = !dimmed;
  const rx = settled ? target.x + 720 : -16;
  const ry = settled ? target.y - 1080 : 24;

  return (
    <motion.div
      className="ik-cube-scene"
      style={{ "--ik-die-size": `${size}px` } as React.CSSProperties}
      animate={{
        y: rolling ? [0, -24, 0, -9, 0] : 0,
        opacity: dimmed ? 0.32 : 1,
      }}
      transition={
        rolling
          ? { duration: 1.7, times: [0, 0.3, 0.55, 0.76, 1], ease: "easeOut" }
          : { duration: 0.5 }
      }
    >
      <motion.div
        className="ik-cube"
        initial={false}
        animate={{ rotateX: rx, rotateY: ry }}
        transition={
          rolling
            ? { duration: 1.7, ease: [0.18, 0.5, 0.22, 1] }
            : { duration: 0.4 }
        }
      >
        <Face label={LINE_FACES[0]} transform={`translateZ(${d}px)`} />
        <Face label={LINE_FACES[1]} transform={`rotateY(90deg) translateZ(${d}px)`} />
        <Face label={LINE_FACES[2]} transform={`rotateX(90deg) translateZ(${d}px)`} />
        <Face label={LINE_FACES[3]} transform={`rotateX(-90deg) translateZ(${d}px)`} />
        <Face label={LINE_FACES[4]} transform={`rotateY(-90deg) translateZ(${d}px)`} />
        <Face label={LINE_FACES[5]} transform={`rotateY(180deg) translateZ(${d}px)`} />
      </motion.div>
    </motion.div>
  );
}
