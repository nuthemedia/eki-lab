"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { TRIGRAMS } from "@/domain/iching/hexagrams";
import { sampleCamera, stageIndexAt, type Vec3 } from "@/data/taikyoku/camera";
import {
  binaryForms,
  type BinaryLine,
  type HexagramPhase,
} from "@/data/taikyoku/generation";
import InteractiveHexagramField from "./InteractiveHexagramField";
import InteractiveStageGroup from "./InteractiveStageGroup";
import LineForms from "./LineForms";
import StaticScene from "./StaticScene";

export type TaikyokuCanvasProps = {
  progress: MotionValue<number>;
  activeStage: number;
  reducedMotion: boolean;
  pulseKey: number;
  dualityBias: number;
  selectedFour: number;
  selectedTrigram: number;
  upperTrigram: number;
  lowerTrigram: number;
  hexagramPhase: HexagramPhase;
  selectedHexagramPanel: number | null;
  onPulse: () => void;
  onDualityBias: (value: number) => void;
  onSelectFour: (index: number) => void;
  onSelectTrigram: (index: number) => void;
  onRevealHexagramField: () => void;
  onSelectHexagramPanel: (index: number) => void;
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
  time: number,
  progress: number,
) {
  material.uniforms.uBias.value = bias;
  material.uniforms.uPulse.value = pulse;
  material.uniforms.uStage.value = stage;
  material.uniforms.uTime.value = time;
  material.uniforms.uProgress.value = progress;
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
  uniform float uTime;
  uniform float uProgress;
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
    vec2 p = vPosition.xy;
    float boundary = 0.43 * sin(p.y * 3.14159) + uBias * 0.48;
    float side = smoothstep(-0.035, 0.035, p.x - boundary);
    float upperDot = 1.0 - smoothstep(0.13, 0.19, distance(p, vec2(-0.02 + uBias * 0.18, 0.48)));
    float lowerDot = 1.0 - smoothstep(0.13, 0.19, distance(p, vec2(0.02 + uBias * 0.18, -0.48)));
    float taijitu = clamp(side + upperDot - lowerDot, 0.0, 1.0);
    float flow = p.x - boundary;
    float grain = hash(floor(vPosition * 42.0));
    vec3 ink = vec3(0.025, 0.028, 0.03);
    vec3 gold = vec3(0.84, 0.72, 0.48);
    vec3 pearl = vec3(0.72, 0.69, 0.61);
    float currentA = exp(-abs(flow) * 5.2);
    float dualityMix = smoothstep(0.10, 0.28, uProgress) * (1.0 - smoothstep(0.33, 0.42, uProgress));
    vec3 dualColor = mix(ink, pearl, taijitu) + gold * currentA * 0.22;
    vec3 inside = mix(ink, dualColor, max(uStage, dualityMix));
    float pulseRing = 1.0 - smoothstep(0.03, 0.16, abs(length(vPosition.xy) - (1.0 - uPulse)));
    vec3 color = inside + gold * (rim * 1.15 + pulseRing * uPulse * 0.65 + grain * 0.025);
    float fade = 1.0 - smoothstep(0.33, 0.43, uProgress);
    float alpha = (0.24 + rim * 0.72 + currentA * uStage * 0.18 + pulseRing * uPulse * 0.18) * fade;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.92));
  }
`;

function CameraRig({
  progress,
  reducedMotion,
  fieldOpen,
}: Pick<TaikyokuCanvasProps, "progress" | "reducedMotion"> & { fieldOpen: boolean }) {
  const { camera, invalidate } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const fieldMix = useRef(0);

  useEffect(() => progress.on("change", () => invalidate()), [invalidate, progress]);
  useEffect(() => invalidate(), [fieldOpen, invalidate]);

  useFrame(() => {
    const raw = progress.get();
    const pose = sampleCamera(
      reducedMotion ? REDUCED_PROGRESS[stageIndexAt(raw)] : raw,
    );
    const desiredMix = fieldOpen ? 1 : 0;
    fieldMix.current = reducedMotion
      ? desiredMix
      : THREE.MathUtils.lerp(fieldMix.current, desiredMix, 0.1);
    const mix = fieldMix.current;
    const position: Vec3 = [
      THREE.MathUtils.lerp(pose.position[0], 0, mix),
      THREE.MathUtils.lerp(pose.position[1], 0, mix),
      THREE.MathUtils.lerp(pose.position[2], -24.5, mix),
    ];
    const lookAt: Vec3 = [
      THREE.MathUtils.lerp(pose.target[0], 0, mix),
      THREE.MathUtils.lerp(pose.target[1], 0, mix),
      THREE.MathUtils.lerp(pose.target[2], -34, mix),
    ];
    applyCameraPose(camera, position, lookAt, THREE.MathUtils.lerp(pose.fov, 48, mix), target);
    if (Math.abs(mix - desiredMix) > 0.002) invalidate();
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
  progress,
  activeStage,
  pulseKey,
  dualityBias,
  onPulse,
  onDualityBias,
}: Pick<
  TaikyokuCanvasProps,
  "progress" | "activeStage" | "pulseKey" | "dualityBias" | "onPulse" | "onDualityBias"
>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const dragStart = useRef<number | null>(null);
  const dragOrigin = useRef(0);
  const displayBias = useRef(0);
  const pulse = useRef(0);
  const elapsed = useRef(0);
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
          uTime: { value: 0 },
          uProgress: { value: 0 },
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
    elapsed.current += delta;
    const targetBias = activeStage === 1 ? dualityBias : 0;
    displayBias.current = THREE.MathUtils.lerp(displayBias.current, targetBias, 0.16);
    pulse.current = Math.max(0, pulse.current - delta * 0.72);
    const stage = THREE.MathUtils.lerp(
      material.uniforms.uStage.value,
      activeStage === 1 ? 1 : 0,
      0.12,
    );
    applySphereUniforms(
      material,
      displayBias.current,
      pulse.current,
      stage,
      elapsed.current,
      progress.get(),
    );
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.035;
      const breath = 1 + Math.sin(elapsed.current * 0.72) * 0.018;
      meshRef.current.scale.setScalar(breath);
    }
    if (
      pulse.current > 0 ||
      Math.abs(displayBias.current - targetBias) > 0.002 ||
      Math.abs(stage - (activeStage === 1 ? 1 : 0)) > 0.002 ||
      activeStage <= 1
    ) {
      invalidate();
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (activeStage !== 1) return;
    event.stopPropagation();
    dragStart.current = event.nativeEvent.clientX;
    dragOrigin.current = dualityBias;
    (event.nativeEvent.target as Element | null)?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (dragStart.current === null || activeStage !== 1) return;
    const distance = event.nativeEvent.clientX - dragStart.current;
    onDualityBias(
      THREE.MathUtils.clamp(dragOrigin.current + distance / (window.innerWidth * 0.42), -1, 1),
    );
  };

  const endDrag = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
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
      0, 0, 0.3, -0.52, 0.64, 0.08,
      0, 0, 0.3, 0.52, 0.64, -0.08,
      0, 0, 0.3, -0.52, -0.64, -0.08,
      0, 0, 0.3, 0.52, -0.64, 0.08,
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
  [-0.52, 0.64, 0.08],
  [0.52, 0.64, -0.08],
  [-0.52, -0.64, -0.08],
  [0.52, -0.64, 0.08],
] as const;

const RING_POSITIONS: readonly Vec3[] = Array.from({ length: 8 }, (_, index) => {
  const angle = Math.PI / 2 - (index / 8) * Math.PI * 2;
  return [Math.cos(angle) * 0.85, Math.sin(angle) * 0.9 - 0.25, 0] as Vec3;
});

function ProgressReveal({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number, number, number];
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  useEffect(() => progress.on("change", invalidate), [invalidate, progress]);
  useFrame(() => {
    if (!ref.current) return;
    const p = progress.get();
    const enter = THREE.MathUtils.smoothstep(p, range[0], range[1]);
    const exit = 1 - THREE.MathUtils.smoothstep(p, range[2], range[3]);
    const amount = Math.max(0.001, enter * exit);
    ref.current.visible = amount > 0.002;
    ref.current.scale.setScalar(amount);
  });
  return <group ref={ref}>{children}</group>;
}

function FourSymbols({
  progress,
  reducedMotion,
  activeStage,
  selectedFour,
  onSelect,
}: {
  activeStage: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  selectedFour: number;
  onSelect: (index: number) => void;
}) {
  const forms = binaryForms(2);

  return (
    <ProgressReveal progress={progress} range={[0.28, 0.42, 0.57, 0.66]}>
    <InteractiveStageGroup
      position={[0, 0, -10]}
      enabled={activeStage === 2}
      reducedMotion={reducedMotion}
      hitSize={[3.1, 3.1]}
    >
      <Branches />
      {forms.map((form, index) => {
        const position = FOUR_POSITIONS[index];
        const selected = selectedFour === index;
        const displayPosition: Vec3 = [
          position[0],
          position[1] + (selected ? 0.14 : 0),
          position[2] + (selected ? 0.18 : 0),
        ];
        return (
          <group key={index}>
            <LineForms
              forms={[form]}
              positions={[displayPosition]}
              scale={selected ? 0.65 : 0.46}
              color={selected ? "#f2dca5" : "#a99566"}
            />
            <mesh
              position={displayPosition}
              onClick={(event) => {
                if (activeStage !== 2 || event.delta > 5) return;
                event.stopPropagation();
                onSelect(index);
              }}
            >
              <planeGeometry args={[1.25, 1.2]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </InteractiveStageGroup>
    </ProgressReveal>
  );
}

function TrigramRing({
  progress,
  reducedMotion,
  activeStage,
  selectedTrigram,
  onSelect,
}: {
  activeStage: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  selectedTrigram: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ProgressReveal progress={progress} range={[0.52, 0.66, 0.81, 0.88]}>
    <InteractiveStageGroup
      position={[0, 0, -18]}
      enabled={activeStage === 3}
      reducedMotion={reducedMotion}
      hitSize={[3.2, 3.4]}
      targetRotationZ={selectedTrigram * Math.PI / 4}
    >
      {RING_POSITIONS.map((position, index) => {
        const selected = selectedTrigram === index;
        const displayPosition: Vec3 = [
          position[0],
          position[1],
          position[2] + (selected ? 0.16 : 0),
        ];
        return (
          <group key={index}>
            <LineForms
              forms={[TRIGRAMS[index].lines]}
              positions={[displayPosition]}
              scale={selected ? 0.44 : 0.34}
              color={selected ? "#f2dca5" : "#a99566"}
            />
            <mesh
              position={displayPosition}
              onClick={(event) => {
                if (activeStage !== 3 || event.delta > 5) return;
                event.stopPropagation();
                onSelect(index);
              }}
            >
              <planeGeometry args={[1.15, 0.9]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </InteractiveStageGroup>
    </ProgressReveal>
  );
}

function StackingHexagram({
  activeStage,
  upperTrigram,
  lowerTrigram,
  hexagramPhase,
  onRevealHexagramField,
}: Pick<
  TaikyokuCanvasProps,
  | "activeStage"
  | "upperTrigram"
  | "lowerTrigram"
  | "hexagramPhase"
  | "onRevealHexagramField"
>) {
  const lowerRef = useRef<THREE.Group>(null);
  const upperRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const burst = useRef(hexagramPhase === "stacked" ? 1 : 0);
  const previousPhase = useRef(hexagramPhase);
  const { invalidate } = useThree();
  const lower = TRIGRAMS[lowerTrigram].lines as BinaryLine[];
  const upper = TRIGRAMS[upperTrigram].lines as BinaryLine[];
  const stacked = hexagramPhase === "stacked";
  const particleGeometry = useMemo(() => {
    const values = new Float32Array(72 * 3);
    for (let i = 0; i < 72; i += 1) {
      const angle = i * 2.39996;
      const radius = 0.12 + ((i * 37) % 71) / 71;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = Math.sin(angle) * radius * 1.35;
      values[i * 3 + 2] = ((i % 9) - 4) * 0.025;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(values, 3));
    return geometry;
  }, []);

  useEffect(() => () => particleGeometry.dispose(), [particleGeometry]);
  useFrame((_, delta) => {
    if (previousPhase.current !== hexagramPhase) {
      if (hexagramPhase === "stacked") burst.current = 1;
      previousPhase.current = hexagramPhase;
    }
    const lowerY = stacked ? -0.06 : -0.42;
    const upperY = stacked ? 0.42 : 0.52;
    if (lowerRef.current) lowerRef.current.position.y = THREE.MathUtils.lerp(lowerRef.current.position.y, lowerY, 0.13);
    if (upperRef.current) upperRef.current.position.y = THREE.MathUtils.lerp(upperRef.current.position.y, upperY, 0.13);
    burst.current = Math.max(0, burst.current - delta * 0.72);
    if (particlesRef.current) {
      (particlesRef.current.material as THREE.PointsMaterial).opacity = Math.sin(burst.current * Math.PI) * 0.75;
      particlesRef.current.scale.setScalar(1 + (1 - burst.current) * 1.9);
      particlesRef.current.rotation.z += delta * 0.34;
    }
    if (burst.current > 0.001 || (lowerRef.current && Math.abs(lowerRef.current.position.y - lowerY) > 0.002)) invalidate();
  });

  return (
    <group position={[0, 0, -27]}>
      <group ref={lowerRef} position={[0, -0.42, 0]}>
        <LineForms forms={[lower]} positions={[[0, 0, 0]]} scale={0.55} color="#ead39a" />
      </group>
      <group ref={upperRef} position={[0, 0.52, 0]}>
        <LineForms forms={[upper]} positions={[[0, 0, 0]]} scale={0.55} color="#ead39a" />
      </group>
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial color="#e8cf91" size={0.035} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </points>
      <mesh
        position={[0, 0, 0.08]}
        onClick={(event) => {
          if (activeStage !== 4 || !stacked) return;
          event.stopPropagation();
          onRevealHexagramField();
        }}
      >
        <planeGeometry args={[1.7, 1.8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Scene(props: TaikyokuCanvasProps) {
  return (
    <>
      <color attach="background" args={["#070808"]} />
      <fog attach="fog" args={["#070808", 8, 28]} />
      <CameraRig
        progress={props.progress}
        reducedMotion={props.reducedMotion}
        fieldOpen={props.hexagramPhase === "field"}
      />
      <ContextGuard onFailure={props.onWebGLFailure} />
      <Dust />
      <TaikyokuSphere
        progress={props.progress}
        activeStage={props.activeStage}
        pulseKey={props.pulseKey}
        dualityBias={props.dualityBias}
        onPulse={props.onPulse}
        onDualityBias={props.onDualityBias}
      />
      <FourSymbols
        progress={props.progress}
        reducedMotion={props.reducedMotion}
        activeStage={props.activeStage}
        selectedFour={props.selectedFour}
        onSelect={props.onSelectFour}
      />
      <TrigramRing
        progress={props.progress}
        reducedMotion={props.reducedMotion}
        activeStage={props.activeStage}
        selectedTrigram={props.selectedTrigram}
        onSelect={props.onSelectTrigram}
      />
      {props.activeStage === 4 ? (
        props.hexagramPhase === "field" ? (
          <InteractiveHexagramField
            reducedMotion={props.reducedMotion}
            selectedIndex={props.selectedHexagramPanel}
            onSelect={props.onSelectHexagramPanel}
          />
        ) : (
          <StackingHexagram
            activeStage={props.activeStage}
            upperTrigram={props.upperTrigram}
            lowerTrigram={props.lowerTrigram}
            hexagramPhase={props.hexagramPhase}
            onRevealHexagramField={props.onRevealHexagramField}
          />
        )
      ) : null}
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
