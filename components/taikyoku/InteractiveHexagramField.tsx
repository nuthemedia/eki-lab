"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { TRIGRAMS } from "@/domain/iching/hexagrams";
import { hexagramField } from "@/data/taikyoku/generation";
import type { Vec3 } from "@/data/taikyoku/camera";
import LineForms from "./LineForms";

type InteractiveHexagramFieldProps = {
  reducedMotion: boolean;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

const FIELD_POSITION: Vec3 = [0, 0, -34];
const SELECTED_POSITION: Vec3 = [0, 0, 0];
const PANEL_SCALE = 0.22;

export default function InteractiveHexagramField({
  reducedMotion,
  selectedIndex,
  onSelect,
}: InteractiveHexagramFieldProps) {
  const revealRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const hitRef = useRef<THREE.InstancedMesh>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const rotationTarget = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const revealScale = useRef(reducedMotion ? 1 : 0.08);
  const { invalidate } = useThree();

  const forms = useMemo(() => hexagramField(TRIGRAMS), []);
  const positions = useMemo<Vec3[]>(
    () =>
      forms.map((_, index) => {
        const column = index % 8;
        const row = Math.floor(index / 8);
        return [(column - 3.5) * 0.45, (3.5 - row) * 0.56, 0] as Vec3;
      }),
    [forms],
  );

  const visibleForms = useMemo(
    () => forms.filter((_, index) => index !== selectedIndex),
    [forms, selectedIndex],
  );
  const visiblePositions = useMemo(
    () => positions.filter((_, index) => index !== selectedIndex),
    [positions, selectedIndex],
  );

  useLayoutEffect(() => {
    const hitMesh = hitRef.current;
    if (!hitMesh) return;
    const matrix = new THREE.Matrix4();
    positions.forEach(([x, y, z], index) => {
      matrix.makeTranslation(x, y, z + 0.08);
      hitMesh.setMatrixAt(index, matrix);
    });
    hitMesh.instanceMatrix.needsUpdate = true;
  }, [positions]);

  useEffect(() => invalidate(), [invalidate, selectedIndex]);

  useFrame(() => {
    const reveal = revealRef.current;
    const tilt = tiltRef.current;
    if (!reveal || !tilt) return;

    const nextReveal = reducedMotion
      ? 1
      : THREE.MathUtils.lerp(revealScale.current, 1, 0.105);
    revealScale.current = nextReveal;
    reveal.scale.setScalar(nextReveal);

    if (!dragStart.current) {
      if (reducedMotion) {
        rotationTarget.current.x = 0;
        rotationTarget.current.y = 0;
        rotationVelocity.current.x = 0;
        rotationVelocity.current.y = 0;
      } else {
        rotationTarget.current.x = THREE.MathUtils.clamp(
          (rotationTarget.current.x + rotationVelocity.current.x) * 0.93,
          -0.18,
          0.18,
        );
        rotationTarget.current.y = THREE.MathUtils.clamp(
          (rotationTarget.current.y + rotationVelocity.current.y) * 0.93,
          -0.28,
          0.28,
        );
        rotationVelocity.current.x *= 0.86;
        rotationVelocity.current.y *= 0.86;
      }
    }

    tilt.rotation.x = THREE.MathUtils.lerp(
      tilt.rotation.x,
      rotationTarget.current.x,
      reducedMotion ? 0.32 : 0.14,
    );
    tilt.rotation.y = THREE.MathUtils.lerp(
      tilt.rotation.y,
      rotationTarget.current.y,
      reducedMotion ? 0.32 : 0.14,
    );

    if (
      Math.abs(1 - nextReveal) > 0.002 ||
      Math.abs(tilt.rotation.x) > 0.002 ||
      Math.abs(tilt.rotation.y) > 0.002 ||
      dragStart.current
    ) {
      invalidate();
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    dragStart.current = {
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    };
    dragOrigin.current = {
      x: rotationTarget.current.x,
      y: rotationTarget.current.y,
    };
    rotationVelocity.current.x = 0;
    rotationVelocity.current.y = 0;
    moved.current = false;
    (event.nativeEvent.target as Element | null)?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const start = dragStart.current;
    if (!start) return;
    event.stopPropagation();
    const dx = event.nativeEvent.clientX - start.x;
    const dy = event.nativeEvent.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved.current = true;

    const maxX = reducedMotion ? 0.06 : 0.18;
    const maxY = reducedMotion ? 0.08 : 0.28;
    const nextX = THREE.MathUtils.clamp(
      dragOrigin.current.x - dy / window.innerHeight,
      -maxX,
      maxX,
    );
    const nextY = THREE.MathUtils.clamp(
      dragOrigin.current.y + dx / window.innerWidth,
      -maxY,
      maxY,
    );
    rotationVelocity.current.x = (nextX - rotationTarget.current.x) * 0.42;
    rotationVelocity.current.y = (nextY - rotationTarget.current.y) * 0.42;
    rotationTarget.current.x = nextX;
    rotationTarget.current.y = nextY;
    invalidate();
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    dragStart.current = null;
    (event.nativeEvent.target as Element | null)?.releasePointerCapture?.(event.pointerId);
    invalidate();
  };

  const handlePanelClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (moved.current) {
      moved.current = false;
      return;
    }
    if (event.instanceId !== undefined) onSelect(event.instanceId);
  };

  const selectedPosition = selectedIndex === null ? null : positions[selectedIndex];
  const selectedForm = selectedIndex === null ? null : forms[selectedIndex];

  return (
    <group ref={revealRef} position={FIELD_POSITION}>
      <group ref={tiltRef}>
        <LineForms
          forms={visibleForms}
          positions={visiblePositions}
          scale={PANEL_SCALE}
          color="#c6ae72"
          opacity={0.72}
        />
        {selectedForm && selectedPosition ? (
          <group position={[selectedPosition[0], selectedPosition[1], 0.42]}>
            <LineForms
              forms={[selectedForm]}
              positions={[SELECTED_POSITION]}
              scale={0.29}
              color="#f2dca5"
            />
          </group>
        ) : null}
        <instancedMesh
          ref={hitRef}
          args={[undefined, undefined, positions.length]}
          onClick={handlePanelClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <planeGeometry args={[0.42, 0.5]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </instancedMesh>
        <mesh
          position={[0, 0, -0.1]}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <planeGeometry args={[4.1, 4.9]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
