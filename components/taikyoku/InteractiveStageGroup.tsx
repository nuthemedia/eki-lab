"use client";

import { useRef, type ReactNode } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Vec3 } from "@/data/taikyoku/camera";

type Props = {
  children: ReactNode;
  position: Vec3;
  enabled: boolean;
  reducedMotion: boolean;
  hitSize?: readonly [number, number];
  targetRotationZ?: number;
};

/** A common, restrained drag/inertia surface for the four- and eight-form displays. */
export default function InteractiveStageGroup({
  children,
  position,
  enabled,
  reducedMotion,
  hitSize = [3.2, 3.2],
  targetRotationZ = 0,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const { invalidate } = useThree();

  useFrame(() => {
    const current = group.current;
    if (!current) return;
    if (!start.current) {
      velocity.current.x *= reducedMotion ? 0 : 0.88;
      velocity.current.y *= reducedMotion ? 0 : 0.88;
      target.current.x = THREE.MathUtils.clamp(
        (target.current.x + velocity.current.x) * 0.965,
        -0.26,
        0.26,
      );
      target.current.y = THREE.MathUtils.clamp(
        (target.current.y + velocity.current.y) * 0.965,
        -0.42,
        0.42,
      );
    }
    current.rotation.x = THREE.MathUtils.lerp(current.rotation.x, target.current.x, 0.12);
    current.rotation.y = THREE.MathUtils.lerp(current.rotation.y, target.current.y, 0.12);
    current.rotation.z = THREE.MathUtils.lerp(
      current.rotation.z,
      targetRotationZ,
      reducedMotion ? 0.34 : 0.105,
    );
    if (
      start.current ||
      Math.abs(current.rotation.x) > 0.002 ||
      Math.abs(current.rotation.y) > 0.002 ||
      Math.abs(current.rotation.z - targetRotationZ) > 0.002
    ) invalidate();
  });

  const down = (event: ThreeEvent<PointerEvent>) => {
    if (!enabled) return;
    event.stopPropagation();
    start.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY };
    origin.current = { ...target.current };
    velocity.current = { x: 0, y: 0 };
    (event.nativeEvent.target as Element | null)?.setPointerCapture?.(event.pointerId);
  };
  const move = (event: ThreeEvent<PointerEvent>) => {
    if (!enabled || !start.current) return;
    event.stopPropagation();
    const dx = event.nativeEvent.clientX - start.current.x;
    const dy = event.nativeEvent.clientY - start.current.y;
    const nextX = THREE.MathUtils.clamp(origin.current.x - dy / 460, -0.26, 0.26);
    const nextY = THREE.MathUtils.clamp(origin.current.y + dx / 420, -0.42, 0.42);
    velocity.current.x = (nextX - target.current.x) * 0.35;
    velocity.current.y = (nextY - target.current.y) * 0.35;
    target.current = { x: nextX, y: nextY };
    invalidate();
  };
  const up = (event: ThreeEvent<PointerEvent>) => {
    if (!start.current) return;
    event.stopPropagation();
    start.current = null;
    (event.nativeEvent.target as Element | null)?.releasePointerCapture?.(event.pointerId);
    invalidate();
  };

  return (
    <group
      ref={group}
      position={position}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      {children}
      <mesh
        position={[0, 0, -0.12]}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <planeGeometry args={[hitSize[0], hitSize[1]]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
