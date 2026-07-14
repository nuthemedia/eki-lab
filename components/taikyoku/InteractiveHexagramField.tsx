"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { TRIGRAMS } from "@/domain/iching/hexagrams";
import {
  FIRST_HIGHLIGHT_DELAY_MS,
  HIGHLIGHT_DURATION_SECONDS,
  HIGHLIGHT_INTERVAL_MS,
  pickAmbientHighlight,
  REDUCED_HIGHLIGHT_INTERVAL_MS,
} from "@/data/taikyoku/ambientHighlight";
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
  const particleRef = useRef<THREE.Points>(null);
  const ambientHighlightRef = useRef<THREE.Group>(null);
  const ambientPulseTime = useRef(HIGHLIGHT_DURATION_SECONDS);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const rotationTarget = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const depthTarget = useRef(0);
  const interactionEnergy = useRef(0);
  const moved = useRef(false);
  const revealScale = useRef(reducedMotion ? 1 : 0.08);
  const [ambientHighlightIndex, setAmbientHighlightIndex] = useState<number | null>(null);
  const { invalidate } = useThree();

  const particleGeometry = useMemo(() => {
    const count = reducedMotion ? 24 : 96;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const column = index % 12;
      const row = Math.floor(index / 12);
      values[index * 3] = (column - 5.5) * 0.34 + Math.sin(index * 3.17) * 0.08;
      values[index * 3 + 1] = (row - 3.5) * 0.58 + Math.cos(index * 1.91) * 0.1;
      values[index * 3 + 2] = ((index * 29) % 17) * 0.035 - 0.25;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(values, 3));
    return geometry;
  }, [reducedMotion]);

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

  const activeAmbientIndex = ambientHighlightIndex === selectedIndex
    ? null
    : ambientHighlightIndex;
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
  useEffect(() => () => particleGeometry.dispose(), [particleGeometry]);

  useEffect(() => {
    const selectNext = () => {
      setAmbientHighlightIndex((previousIndex) => (
        pickAmbientHighlight(previousIndex, selectedIndex)
      ));
      ambientPulseTime.current = 0;
      invalidate();
    };
    const firstHighlight = window.setTimeout(selectNext, FIRST_HIGHLIGHT_DELAY_MS);
    const interval = window.setInterval(
      selectNext,
      reducedMotion ? REDUCED_HIGHLIGHT_INTERVAL_MS : HIGHLIGHT_INTERVAL_MS,
    );
    return () => {
      window.clearTimeout(firstHighlight);
      window.clearInterval(interval);
    };
  }, [invalidate, reducedMotion, selectedIndex]);

  useFrame((_, delta) => {
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
          -0.32,
          0.32,
        );
        rotationTarget.current.y = THREE.MathUtils.clamp(
          (rotationTarget.current.y + rotationVelocity.current.y) * 0.93,
          -0.52,
          0.52,
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
    depthTarget.current *= dragStart.current ? 0.995 : 0.94;
    tilt.position.z = THREE.MathUtils.lerp(tilt.position.z, depthTarget.current, 0.12);
    interactionEnergy.current *= reducedMotion ? 0.72 : 0.935;
    if (particleRef.current) {
      const material = particleRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.08 + Math.min(0.7, interactionEnergy.current * 2.8);
      material.size = 0.014 + Math.min(0.045, interactionEnergy.current * 0.15);
      particleRef.current.rotation.z += interactionEnergy.current * 0.008;
      particleRef.current.position.z = -0.12 + interactionEnergy.current * 0.55;
    }

    const ambientHighlight = ambientHighlightRef.current;
    if (ambientHighlight && activeAmbientIndex !== null) {
      ambientPulseTime.current = Math.min(
        HIGHLIGHT_DURATION_SECONDS,
        ambientPulseTime.current + delta,
      );
      const phase = ambientPulseTime.current / HIGHLIGHT_DURATION_SECONDS;
      const pulse = Math.sin(phase * Math.PI);
      const opacity = pulse * (reducedMotion ? 0.48 : 0.92);
      ambientHighlight.position.z = 0.2 + pulse * (reducedMotion ? 0.02 : 0.16);
      ambientHighlight.scale.setScalar(1 + pulse * (reducedMotion ? 0 : 0.08));
      ambientHighlight.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshBasicMaterial;
          material.opacity = opacity;
        }
      });
    }

    if (
      Math.abs(1 - nextReveal) > 0.002 ||
      Math.abs(tilt.rotation.x) > 0.002 ||
      Math.abs(tilt.rotation.y) > 0.002 ||
      interactionEnergy.current > 0.006 ||
      ambientPulseTime.current < HIGHLIGHT_DURATION_SECONDS ||
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

    const maxX = reducedMotion ? 0.06 : 0.32;
    const maxY = reducedMotion ? 0.08 : 0.52;
    const nextX = THREE.MathUtils.clamp(
      dragOrigin.current.x - dy / (window.innerHeight * 0.72),
      -maxX,
      maxX,
    );
    const nextY = THREE.MathUtils.clamp(
      dragOrigin.current.y + dx / (window.innerWidth * 0.64),
      -maxY,
      maxY,
    );
    rotationVelocity.current.x = (nextX - rotationTarget.current.x) * 0.42;
    rotationVelocity.current.y = (nextY - rotationTarget.current.y) * 0.42;
    depthTarget.current = THREE.MathUtils.clamp(
      (Math.abs(dx) + Math.abs(dy)) / 380,
      0,
      reducedMotion ? 0.08 : 0.72,
    );
    interactionEnergy.current = Math.min(
      1,
      interactionEnergy.current + Math.abs(rotationVelocity.current.x) + Math.abs(rotationVelocity.current.y),
    );
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
  const ambientPosition = activeAmbientIndex === null ? null : positions[activeAmbientIndex];
  const ambientForm = activeAmbientIndex === null ? null : forms[activeAmbientIndex];

  return (
    <group ref={revealRef} position={FIELD_POSITION}>
      <group ref={tiltRef}>
        <points ref={particleRef} geometry={particleGeometry}>
          <pointsMaterial
            color="#d9bd7d"
            size={0.018}
            sizeAttenuation
            transparent
            opacity={0.08}
            depthWrite={false}
            toneMapped={false}
          />
        </points>
        <LineForms
          forms={visibleForms}
          positions={visiblePositions}
          scale={PANEL_SCALE}
          color="#c6ae72"
          opacity={0.72}
        />
        {ambientForm && ambientPosition ? (
          <group
            key={activeAmbientIndex ?? "ambient"}
            ref={ambientHighlightRef}
            position={[ambientPosition[0], ambientPosition[1], 0.2]}
          >
            <LineForms
              forms={[ambientForm]}
              positions={[SELECTED_POSITION]}
              scale={PANEL_SCALE}
              color="#ffe8ac"
              opacity={0}
            />
          </group>
        ) : null}
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
          <planeGeometry args={[4.8, 5.6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
