"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { BinaryLine } from "@/data/taikyoku/generation";
import type { Vec3 } from "@/data/taikyoku/camera";

type Props = {
  forms: readonly (readonly BinaryLine[])[];
  positions: readonly Vec3[];
  scale?: number;
  color?: string;
  opacity?: number;
};

const BAR_WIDTH = 1.28;
const BAR_HEIGHT = 0.09;
const BAR_DEPTH = 0.07;
const LINE_GAP = 0.25;

type Matrices = {
  full: THREE.Matrix4[];
  half: THREE.Matrix4[];
};

function matrixAt(
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  depth: number,
): THREE.Matrix4 {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion(),
    new THREE.Vector3(width, height, depth),
  );
}

export default function LineForms({
  forms,
  positions,
  scale = 1,
  color = "#d6bd82",
  opacity = 1,
}: Props) {
  const fullRef = useRef<THREE.InstancedMesh>(null);
  const halfRef = useRef<THREE.InstancedMesh>(null);

  const matrices = useMemo<Matrices>(() => {
    const full: THREE.Matrix4[] = [];
    const half: THREE.Matrix4[] = [];

    forms.forEach((form, formIndex) => {
      const [baseX, baseY, baseZ] = positions[formIndex];
      const centerOffset = ((form.length - 1) * LINE_GAP * scale) / 2;

      form.forEach((line, lineIndex) => {
        const y = baseY + lineIndex * LINE_GAP * scale - centerOffset;
        if (line === "yang") {
          full.push(
            matrixAt(
              baseX,
              y,
              baseZ,
              BAR_WIDTH * scale,
              BAR_HEIGHT * scale,
              BAR_DEPTH * scale,
            ),
          );
          return;
        }

        const halfWidth = BAR_WIDTH * 0.42 * scale;
        const offset = BAR_WIDTH * 0.29 * scale;
        half.push(
          matrixAt(
            baseX - offset,
            y,
            baseZ,
            halfWidth,
            BAR_HEIGHT * scale,
            BAR_DEPTH * scale,
          ),
          matrixAt(
            baseX + offset,
            y,
            baseZ,
            halfWidth,
            BAR_HEIGHT * scale,
            BAR_DEPTH * scale,
          ),
        );
      });
    });

    return { full, half };
  }, [forms, positions, scale]);

  useLayoutEffect(() => {
    matrices.full.forEach((matrix, index) => fullRef.current?.setMatrixAt(index, matrix));
    matrices.half.forEach((matrix, index) => halfRef.current?.setMatrixAt(index, matrix));
    if (fullRef.current) fullRef.current.instanceMatrix.needsUpdate = true;
    if (halfRef.current) halfRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <group>
      {matrices.full.length ? (
        <instancedMesh
          ref={fullRef}
          args={[undefined, undefined, matrices.full.length]}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color={color}
            transparent={opacity < 1}
            opacity={opacity}
            depthWrite={opacity === 1}
            toneMapped={false}
          />
        </instancedMesh>
      ) : null}
      {matrices.half.length ? (
        <instancedMesh
          ref={halfRef}
          args={[undefined, undefined, matrices.half.length]}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color={color}
            transparent={opacity < 1}
            opacity={opacity}
            depthWrite={opacity === 1}
            toneMapped={false}
          />
        </instancedMesh>
      ) : null}
    </group>
  );
}
