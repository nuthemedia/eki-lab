"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { TRIGRAMS } from "@/domain/iching/hexagrams";
import { sampleCamera, stageIndexAt, type Vec3 } from "@/data/taikyoku/camera";
import {
  binaryForms,
  hexagramField,
  type BinaryLine,
} from "@/data/taikyoku/generation";
import LineForms from "./LineForms";
import StaticScene from "./StaticScene";

export type TaikyokuCanvasProps = {
  progress: MotionValue<number>;
  activeStage: number;
  reducedMotion: boolean;
  pulseKey: number;
  dualityBias: number;
  selectedTrigram: number;
  stacked: boolean;
  onPulse: () => void;
  onDualityBias: (value: number) => void;
  onSelectTrigram: (index: number) => void;
  onStack: () => void;
  onWebGLFailure: () => void;
};

const REDUCED_PROGRESS = [0, 0.24, 0.5, 0.78, 1] as const;

function applyCameraPose(
  camera: THREE.Camera,
  position: Vec3,
  lookAt: Vec3,
  fov: number,
  target: THREE.Vector3,
) {
  camera.position.set(...position);
  target.set(...lookAt);
  camera.lookAt(target);
  if (camera instanceof THREE.PerspectiveCamera && camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

function applySphereUniforms(
  material: THREE.ShaderMaterial,
  bias: number,
  pulse: number,
  stage: number,
) {
  material.uniforms.uBias.value = bias;
  material.uniforms.uPulse.value = pulse;
  material.uniforms.uStage.value = stage;
}

const VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vView;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vView = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uBias;
  uniform float uPulse;
  uniform float uStage;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vView;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float rim = pow(1.0 - facing, 2.25);
    float flow = sin(vPosition.y * 2.8 + vPosition.x * (2.2 + uBias * 3.0));
    flow += sin(vPosition.z * 3.4 - vPosition.y * 1.7) * 0.42;
    float dual = smoothstep(-0.08, 0.08, flow);
    float grain = hash(floor(vPosition * 42.0));
    vec3 ink = vec3(0.025, 0.028, 0.03);
    vec3 gold = vec3(0.84, 0.72, 0.48);
    vec3 inside = mix(ink, gold * 0.56, dual * uStage);
    float pulseRing = 1.0 - smoothstep(0.03, 0.16, abs(length(vPosition.xy) - (1.0 - uPulse)));
    vec3 color = inside + gold * (rim * 1.15 + pulseRing * uPulse * 0.65 + grain * 0.025);
    float alpha = 0.2 + rim * 0.72 + dual * uStage * 0.12 + pulseRing * uPulse * 0.18;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.92));
  }
`;

function CameraRig({
  progress,
  reducedMotion,
}: Pick<TaikyokuCanvasProps, "progress" | "reducedMotion">) {
  const { camera, invalidate } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => progress.on("change", () => invalidate()), [invalidate, progress]);

  useFrame(() => {
    const raw = progress.get();
    const pose = sampleCamera(
      reducedMotion ? REDUCED_PROGRESS[stageIndexAt(raw)] : raw,
    );
    applyCameraPose(camera, pose.position, pose.target, pose.fov, target);
  });

  return null;
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", handleLoss);
    return () => gl.domElement.removeEventListener("webglcontextlost", handleLoss);
  }, [gl, onFailure]);

  return null;
}

function Dust() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(210 * 3);
    let seed = 1297;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let index = 0; index < 210; index += 1) {
      positions[index * 3] = (random() - 0.5) * 13;
      positions[index * 3 + 1] = (random() - 0.5) * 9;
      positions[index * 3 + 2] = 4 - random() * 43;
    }
    const value = new THREE.BufferGeometry();
    value.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return value;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#bfa66f"
        size={0.024}
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function TaikyokuSphere({
  activeStage,
  pulseKey,
  dualityBias,
  onPulse,
  onDualityBias,
}: Pick<
  TaikyokuCanvasProps,
  "activeStage" | "pulseKey" | "dualityBias" | "onPulse" | "onDualityBias"
>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const dragStart = useRef<number | null>(null);
  const displayBias = useRef(0);
  const pulse = useRef(0);
  const { invalidate } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uBias: { value: 0 },
          uPulse: { value: 0 },
          uStage: { value: 0 },
        },
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => {
    if (pulseKey > 0) {
      pulse.current = 1;
      invalidate();
    }
  }, [invalidate, pulseKey]);

  useFrame((_, delta) => {
    const targetBias = activeStage === 1 ? dualityBias : 0;
    displayBias.current = THREE.MathUtils.lerp(displayBias.current, targetBias, 0.16);
    pulse.current = Math.max(0, pulse.current - delta * 0.72);
    const stage = THREE.MathUtils.lerp(
      material.uniforms.uStage.value,
      activeStage === 1 ? 1 : 0,
      0.12,
    );
    applySphereUniforms(material, displayBias.current, pulse.current, stage);
    if (
      pulse.current > 0 ||
      Math.abs(displayBias.current - targetBias) > 0.002 ||
      Math.abs(stage - (activeStage === 1 ? 1 : 0)) > 0.002
    ) {
      invalidate();
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (activeStage !== 1) return;
    event.stopPropagation();
    dragStart.current = event.nativeEvent.clientX;
    (event.nativeEvent.target as Element | null)?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (dragStart.current === null || activeStage !== 1) return;
    const distance = event.nativeEvent.clientX - dragStart.current;
    onDualityBias(THREE.MathUtils.clamp(distance / window.innerWidth, -0.2, 0.2));
  };

  const endDrag = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    onDualityBias(0);
  };

  return (
    <mesh
      ref={meshRef}
      material={material}
      onClick={() => {
        if (activeStage === 0) onPulse();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}

function Branches() {
  const geometry = useMemo(() => {
    const points = [
      0, 0, -9.7, -0.52, 0.64, -9.92,
      0, 0, -9.7, 0.52, 0.64, -10.08,
      0, 0, -9.7, -0.52, -0.64, -10.08,
      0, 0, -9.7, 0.52, -0.64, -9.92,
    ];
    const value = new THREE.BufferGeometry();
    value.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return value;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#8f7b52" transparent opacity={0.5} toneMapped={false} />
    </lineSegments>
  );
}

const FOUR_POSITIONS: readonly Vec3[] = [
  [-0.52, 0.64, -9.92],
  [0.52, 0.64, -10.08],
  [-0.52, -0.64, -10.08],
  [0.52, -0.64, -9.92],
] as const;

const RING_POSITIONS: readonly Vec3[] = Array.from({ length: 8 }, (_, index) => {
  const angle = Math.PI / 2 - (index / 8) * Math.PI * 2;
  return [Math.cos(angle) * 0.85, Math.sin(angle) * 0.9 - 0.25, -18] as Vec3;
});

function TrigramRing({
  activeStage,
  selectedTrigram,
  onSelect,
}: {
  activeStage: number;
  selectedTrigram: number;
  onSelect: (index: number) => void;
}) {
  return (
    <group>
      <LineForms
        forms={TRIGRAMS.map((trigram) => trigram.lines)}
        positions={RING_POSITIONS}
        scale={0.36}
      />
      <LineForms
        forms={[TRIGRAMS[selectedTrigram].lines]}
        positions={[[0, -0.25, -17.92]]}
        scale={0.56}
        color="#f0d99f"
      />
      {RING_POSITIONS.map((position, index) => (
        <mesh
          key={index}
          position={position}
          onClick={(event) => {
            if (activeStage !== 3) return;
            event.stopPropagation();
            onSelect(index);
          }}
        >
          <planeGeometry args={[1.25, 1]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function StackingHexagram({
  activeStage,
  selectedTrigram,
  stacked,
  onStack,
}: Pick<TaikyokuCanvasProps, "activeStage" | "selectedTrigram" | "stacked" | "onStack">) {
  const lower = TRIGRAMS[selectedTrigram].lines as BinaryLine[];
  const upper = TRIGRAMS[(selectedTrigram + 3) % TRIGRAMS.length].lines as BinaryLine[];
  const forms = stacked ? [[...lower, ...upper]] : [lower, upper];
  const positions: Vec3[] = stacked
    ? [[0, 0, -27]]
    : [[0, -0.55, -27], [0, 0.55, -27]];

  return (
    <group>
      <LineForms forms={forms} positions={positions} scale={0.55} color="#ead39a" />
      <mesh
        position={[0, 0, -26.92]}
        onClick={(event) => {
          if (activeStage !== 4) return;
          event.stopPropagation();
          onStack();
        }}
      >
        <planeGeometry args={[1.7, 1.8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function HexagramField() {
  const forms = useMemo(() => hexagramField(TRIGRAMS), []);
  const positions = useMemo<Vec3[]>(
    () =>
      forms.map((_, index) => {
        const column = index % 8;
        const row = Math.floor(index / 8);
        return [(column - 3.5) * 0.52, (3.5 - row) * 0.5, -34] as Vec3;
      }),
    [forms],
  );
  return <LineForms forms={forms} positions={positions} scale={0.22} color="#bda66f" />;
}

function Scene(props: TaikyokuCanvasProps) {
  return (
    <>
      <color attach="background" args={["#070808"]} />
      <fog attach="fog" args={["#070808", 8, 28]} />
      <CameraRig progress={props.progress} reducedMotion={props.reducedMotion} />
      <ContextGuard onFailure={props.onWebGLFailure} />
      <Dust />
      <TaikyokuSphere
        activeStage={props.activeStage}
        pulseKey={props.pulseKey}
        dualityBias={props.dualityBias}
        onPulse={props.onPulse}
        onDualityBias={props.onDualityBias}
      />
      <group visible={props.activeStage === 2}>
        <Branches />
        <LineForms forms={binaryForms(2)} positions={FOUR_POSITIONS} scale={0.48} />
      </group>
      <group visible={props.activeStage === 3}>
        <TrigramRing
          activeStage={props.activeStage}
          selectedTrigram={props.selectedTrigram}
          onSelect={props.onSelectTrigram}
        />
      </group>
      <group visible={props.activeStage === 4}>
        <StackingHexagram
          activeStage={props.activeStage}
          selectedTrigram={props.selectedTrigram}
          stacked={props.stacked}
          onStack={props.onStack}
        />
        <HexagramField />
      </group>
    </>
  );
}

export default function TaikyokuCanvas(props: TaikyokuCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 38, near: 0.1, far: 80 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      fallback={<StaticScene activeStage={props.activeStage} />}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#070808", 1);
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
