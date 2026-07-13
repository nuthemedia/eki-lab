"use client";

import { motion } from "motion/react";
import { TRIGRAMS } from "@/domain/iching/hexagrams";

/**
 * 八卦の漢字が入った八面体の易占いサイコロ(CSS 3D)。
 * face は八卦 index(0-7)。0-3 が上半分、4-7 が下半分の面。
 */

const TILT = 35.264; // 八面体の面の仰角 arctan(1/√2)

type FacePose = { azimuth: number; tilt: number };

function facePose(face: number): FacePose {
  const upper = face < 4;
  return {
    azimuth: 45 + (face % 4) * 90,
    tilt: upper ? TILT : -TILT,
  };
}

/** face を正面に向けるサイコロ全体の回転(deg) */
function showRotation(face: number): { x: number; y: number } {
  const { azimuth, tilt } = facePose(face);
  return { x: -tilt, y: -azimuth };
}

type Props = {
  /** 八卦 index 0-7 */
  face: number;
  rolling?: boolean;
  dimmed?: boolean;
  size?: number;
};

export function TrigramDie({
  face,
  rolling = false,
  dimmed = false,
  size = 66,
}: Props) {
  const edge = size * 0.82;
  const w = edge;
  const h = edge * 0.866;
  const d = edge * 0.4082;
  const target = showRotation(face);
  // 転がり終了後も同じ数値を保つ(巻き戻しアニメを防ぐ)。
  // 未ロール時は結果を明かさない中立の姿勢。
  const settled = !dimmed;
  const rx = settled ? target.x + 720 : -30;
  const ry = settled ? target.y - 1080 : -25;

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
        {TRIGRAMS.map((trigram, i) => {
          const { azimuth, tilt } = facePose(i);
          const upper = i < 4;
          // 三角形の重心を中心に合わせてから面の位置へ押し出す
          const centroidFix = upper ? -h / 6 : h / 6;
          return (
            <div
              key={trigram.name}
              className={`ik-octa-face${upper ? "" : " ik-octa-face--lower"}`}
              style={{
                width: w,
                height: h,
                left: `calc(50% - ${w / 2}px)`,
                top: `calc(50% - ${h / 2}px)`,
                transform: `rotateY(${azimuth}deg) rotateX(${tilt}deg) translateZ(${d}px) translateY(${centroidFix}px)`,
              }}
            >
              <span className="ik-octa-kanji">{trigram.name}</span>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
