"use client";

import { useRef, type PropsWithChildren } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * A populated circuit board, not a wafer fab.
 *
 * Millennium sources and resells finished parts — ICs, connectors,
 * capacitors, resistors, crystals — it doesn't fabricate silicon. So the
 * hero reads as a fully populated, glossy board carrying real inventory,
 * lit by two neon trace colors (brand pink + cyan) racing along
 * Manhattan-routed copper, the way a shelf of stock would light up.
 *
 * Every Math.random() call lives in a build* function invoked once at
 * module load, so component render stays pure; per-frame mutation happens
 * only inside useFrame through refs.
 * ------------------------------------------------------------------ */

const COLOR_BOARD = 0x05070a;
const COLOR_BOARD_EDGE = 0x0d1420;
const COLOR_TRACE_A = 0xe0508c; // brand pink
const COLOR_TRACE_B = 0x38bdf8; // cyan
const COLOR_SILVER = 0xc7ccd1;
const COLOR_GOLD = 0xd9a441;
const COLOR_CHIP = 0x14171c;

const BOARD_W = 15;
const BOARD_D = 7.5;

interface Trace {
  points: THREE.Vector3[];
  cumulative: number[];
  total: number;
  color: number;
}

const TRACE_COUNT = 30;
const ROUTE_GRID = 0.5;

function snapToGrid(v: number, half: number) {
  const snapped = Math.round(v / ROUTE_GRID) * ROUTE_GRID;
  return Math.max(-half, Math.min(half, snapped));
}

/** Orthogonal ("Manhattan") copper routes — each segment runs along X or Z only, turning at right angles. */
function buildTraces(): Trace[] {
  const traces: Trace[] = [];
  const halfW = BOARD_W / 2 - 0.4;
  const halfD = BOARD_D / 2 - 0.4;

  for (let i = 0; i < TRACE_COUNT; i++) {
    const y = 0.06 + (i % 3) * 0.015;
    let x = snapToGrid((Math.random() - 0.5) * BOARD_W, halfW);
    let z = snapToGrid((Math.random() - 0.5) * BOARD_D, halfD);

    const points = [new THREE.Vector3(x, y, z)];
    let alongX = Math.random() < 0.5;

    const segments = 3 + Math.floor(Math.random() * 4);
    for (let s = 0; s < segments; s++) {
      const steps = 1 + Math.floor(Math.random() * 5);
      const delta = steps * ROUTE_GRID * (Math.random() < 0.5 ? 1 : -1);
      if (alongX) x = snapToGrid(x + delta, halfW);
      else z = snapToGrid(z + delta, halfD);
      points.push(new THREE.Vector3(x, y, z));
      alongX = !alongX;
    }

    const cumulative = [0];
    let total = 0;
    for (let p = 1; p < points.length; p++) {
      total += points[p].distanceTo(points[p - 1]);
      cumulative.push(total);
    }

    traces.push({ points, cumulative, total, color: i % 2 === 0 ? COLOR_TRACE_A : COLOR_TRACE_B });
  }

  return traces;
}

const TRACES = buildTraces();

/** Flattened trace geometry, split by color so each glow tint gets its own draw call. */
function buildTraceSegments(color: number): Float32Array {
  const verts: number[] = [];
  for (const trace of TRACES) {
    if (trace.color !== color) continue;
    for (let i = 1; i < trace.points.length; i++) {
      const a = trace.points[i - 1];
      const b = trace.points[i];
      verts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  return new Float32Array(verts);
}

const TRACE_SEGMENTS_A = buildTraceSegments(COLOR_TRACE_A);
const TRACE_SEGMENTS_B = buildTraceSegments(COLOR_TRACE_B);

/** Vias: bright solder points at every corner where a route turns. */
function buildVias(color: number): Float32Array {
  const verts: number[] = [];
  for (const trace of TRACES) {
    if (trace.color !== color) continue;
    for (let i = 1; i < trace.points.length - 1; i++) {
      const p = trace.points[i];
      verts.push(p.x, p.y, p.z);
    }
  }
  return new Float32Array(verts);
}

const VIAS_A = buildVias(COLOR_TRACE_A);
const VIAS_B = buildVias(COLOR_TRACE_B);

interface PulseState {
  trace: number;
  dist: number;
  speed: number;
}

const PULSE_COUNT = 46;

function buildPulses(): PulseState[] {
  return Array.from({ length: PULSE_COUNT }, () => {
    const trace = Math.floor(Math.random() * TRACES.length);
    return {
      trace,
      dist: Math.random() * TRACES[trace].total,
      speed: 2.6 + Math.random() * 3.8,
    };
  });
}

const INITIAL_PULSES_A = buildPulses().filter((p) => TRACES[p.trace].color === COLOR_TRACE_A);
const INITIAL_PULSES_B = buildPulses().filter((p) => TRACES[p.trace].color === COLOR_TRACE_B);

/** Position of a pulse a given distance along its polyline. */
function samplePolyline(trace: Trace, dist: number, out: THREE.Vector3) {
  const { points, cumulative } = trace;
  for (let i = 1; i < points.length; i++) {
    if (dist <= cumulative[i]) {
      const segLen = cumulative[i] - cumulative[i - 1];
      const t = segLen > 0 ? (dist - cumulative[i - 1]) / segLen : 0;
      out.copy(points[i - 1]).lerp(points[i], t);
      return;
    }
  }
  out.copy(points[points.length - 1]);
}

/* ------------------------------------------------------------------ */

function Board() {
  return (
    <group>
      {/* Glossy solder-mask substrate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[BOARD_W, 0.12, BOARD_D]} />
        <meshStandardMaterial color={COLOR_BOARD} metalness={0.55} roughness={0.18} />
      </mesh>
      {/* Subtle edge highlight so the board rim catches the rim light */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[BOARD_W + 0.06, 0.06, BOARD_D + 0.06]} />
        <meshStandardMaterial color={COLOR_BOARD_EDGE} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function TraceLayer({ segments, vias, color }: { segments: Float32Array; vias: Float32Array; color: number }) {
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const viaMatRef = useRef<THREE.PointsMaterial>(null);
  const phase = useRef(Math.random() * Math.PI * 2).current;

  useFrame((state) => {
    const glow = 0.42 + Math.sin(state.clock.elapsedTime * 0.7 + phase) * 0.18;
    if (lineMatRef.current) lineMatRef.current.opacity = glow;
    if (viaMatRef.current) viaMatRef.current.opacity = glow + 0.25;
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMatRef} color={color} transparent opacity={0.55} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[vias, 3]} />
        </bufferGeometry>
        <pointsMaterial ref={viaMatRef} color={color} size={0.07} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

function PulseLayer({ pulses: initialPulses, color }: { pulses: PulseState[]; color: number }) {
  const coreRef = useRef<THREE.Points>(null);
  const haloRef = useRef<THREE.Points>(null);
  const pulsesRef = useRef<PulseState[] | null>(null);
  const scratch = useRef(new THREE.Vector3());
  const corePositions = useRef(new Float32Array(initialPulses.length * 3));
  const haloPositions = useRef(new Float32Array(initialPulses.length * 3));

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const coreAttr = coreRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    const haloAttr = haloRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!coreAttr || !haloAttr) return;

    pulsesRef.current ??= initialPulses.map((p) => ({ ...p }));
    const pulses = pulsesRef.current;

    for (let i = 0; i < pulses.length; i++) {
      const pulse = pulses[i];
      const trace = TRACES[pulse.trace];
      pulse.dist += delta * pulse.speed;
      if (pulse.dist > trace.total) pulse.dist = 0;

      samplePolyline(trace, pulse.dist, scratch.current);
      coreAttr.setXYZ(i, scratch.current.x, scratch.current.y + 0.03, scratch.current.z);
      haloAttr.setXYZ(i, scratch.current.x, scratch.current.y + 0.03, scratch.current.z);
    }
    coreAttr.needsUpdate = true;
    haloAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Soft colored halo for a cheap bloom-like glow */}
      <points ref={haloRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[haloPositions.current, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.5}
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
      {/* Bright white-hot core */}
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[corePositions.current, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={0xffffff}
          size={0.18}
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */

type ComponentKind = "ic" | "connector" | "cap" | "resistor" | "crystal";

interface ComponentSpec {
  kind: ComponentKind;
  x: number;
  z: number;
  rotY?: number;
  scale?: number;
  hero?: boolean;
}

const COMPONENTS: ComponentSpec[] = [
  { kind: "ic", x: 1.1, z: 0.3, rotY: 0.12, scale: 1.7, hero: true },
  { kind: "ic", x: -4.6, z: -2.1, rotY: -0.3, scale: 1 },
  { kind: "ic", x: -1.8, z: 2.5, rotY: 0.5, scale: 0.9 },
  { kind: "ic", x: 4.8, z: -2.6, rotY: -0.15, scale: 1.1 },
  { kind: "ic", x: 5.9, z: 1.7, rotY: 0.35, scale: 0.85 },
  { kind: "connector", x: -6.4, z: 0.2, rotY: 0 },
  { kind: "connector", x: 6.6, z: -0.5, rotY: Math.PI },
  { kind: "cap", x: -3.2, z: -0.4, scale: 1 },
  { kind: "cap", x: -1.0, z: -2.6, scale: 0.8 },
  { kind: "cap", x: 0.4, z: 2.9, scale: 0.9 },
  { kind: "cap", x: 2.9, z: -1.1, scale: 1.1 },
  { kind: "cap", x: 3.7, z: 2.3, scale: 0.75 },
  { kind: "cap", x: -5.1, z: 2.0, scale: 0.85 },
  { kind: "cap", x: 5.1, z: 3.0, scale: 0.7 },
  { kind: "resistor", x: -2.7, z: 0.7, rotY: 0.4 },
  { kind: "resistor", x: 1.9, z: 0.9, rotY: -0.2 },
  { kind: "resistor", x: -4.1, z: -2.9, rotY: 0.6 },
  { kind: "resistor", x: 4.3, z: 0.5, rotY: -0.5 },
  { kind: "crystal", x: 0.1, z: -1.5 },
];

function IcPackage({ hero, scale }: { hero?: boolean; scale: number }) {
  const pinPositions: [number, number][] = [];
  const pinsPerSide = 6;
  for (let side = 0; side < 4; side++) {
    for (let p = 0; p < pinsPerSide; p++) {
      const offset = (p / (pinsPerSide - 1) - 0.5) * 0.72;
      pinPositions.push([side, offset]);
    }
  }

  return (
    <group scale={scale}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial color={COLOR_CHIP} metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.5]} />
        <meshStandardMaterial
          color={hero ? COLOR_TRACE_A : 0x241019}
          emissive={hero ? COLOR_TRACE_A : COLOR_TRACE_B}
          emissiveIntensity={hero ? 0.9 : 0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {pinPositions.map(([side, offset], i) => {
        const angle = (side * Math.PI) / 2;
        const dirX = Math.cos(angle);
        const dirZ = Math.sin(angle);
        const perpX = -dirZ * offset;
        const perpZ = dirX * offset;
        return (
          <mesh
            key={i}
            position={[dirX * 0.52 + perpX, 0.02, dirZ * 0.52 + perpZ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.14, 0.02, 0.05]} />
            <meshStandardMaterial color={COLOR_SILVER} metalness={0.9} roughness={0.25} />
          </mesh>
        );
      })}
    </group>
  );
}

function Connector() {
  return (
    <group>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.5, 0.28, 1.4]} />
        <meshStandardMaterial color={COLOR_SILVER} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0.2, 0.14, 0]}>
        <boxGeometry args={[0.14, 0.2, 1.2]} />
        <meshStandardMaterial color={0x0a0a0a} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Capacitor({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.44, 20]} />
        <meshStandardMaterial color={COLOR_GOLD} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 20]} />
        <meshStandardMaterial color={0xe8e8e8} metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Resistor({ rotY }: { rotY: number }) {
  return (
    <group rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.5, 0.16, 0.16]} />
        <meshStandardMaterial color={0x2b2118} metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[-0.12, 0.09, 0]}>
        <boxGeometry args={[0.05, 0.17, 0.17]} />
        <meshStandardMaterial color={COLOR_TRACE_B} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.09, 0]}>
        <boxGeometry args={[0.05, 0.17, 0.17]} />
        <meshStandardMaterial color={COLOR_TRACE_A} metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Crystal() {
  return (
    <mesh position={[0, 0.14, 0]}>
      <boxGeometry args={[0.32, 0.28, 0.6]} />
      <meshStandardMaterial color={COLOR_SILVER} metalness={0.9} roughness={0.2} />
    </mesh>
  );
}

function ComponentInstance({ spec, index }: { spec: ComponentSpec; index: number }) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(index * 0.9 + spec.x * 0.4 + spec.z * 0.3).current;
  const floats = spec.kind === "ic" || spec.kind === "cap" || spec.kind === "crystal";

  useFrame((state) => {
    if (!ref.current || !floats) return;
    const t = state.clock.elapsedTime;
    if (spec.hero) {
      ref.current.rotation.y = (spec.rotY ?? 0) + Math.sin(t * 0.5) * 0.08;
      ref.current.position.y = 0.06 + Math.sin(t * 0.9) * 0.05;
    } else {
      ref.current.rotation.y = (spec.rotY ?? 0) + Math.sin(t * 0.35 + phase) * 0.05;
      ref.current.position.y = 0.06 + Math.sin(t * 0.6 + phase) * 0.03;
    }
  });

  return (
    <group ref={ref} position={[spec.x, 0.06, spec.z]} rotation={[0, spec.rotY ?? 0, 0]}>
      {spec.kind === "ic" && <IcPackage hero={spec.hero} scale={spec.scale ?? 1} />}
      {spec.kind === "connector" && <Connector />}
      {spec.kind === "cap" && <Capacitor scale={spec.scale ?? 1} />}
      {spec.kind === "resistor" && <Resistor rotY={0} />}
      {spec.kind === "crystal" && <Crystal />}
    </group>
  );
}

/** A soft raking highlight that sweeps across the board, like light catching gloss on a moving surface. */
function ShineSweep() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.22) % 1;
    ref.current.position.x = -BOARD_W / 2 - 3 + t * (BOARD_W + 6);
  });

  return (
    <mesh ref={ref} position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0.35, 0]}>
      <planeGeometry args={[1.6, BOARD_D + 2]} />
      <meshBasicMaterial
        color={0xffffff}
        transparent
        opacity={0.14}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The board is composed to flank a centred copy block on wide screens.
 * Narrow viewports see a much smaller slice of world space, so the whole
 * rig scales down to keep the board in frame instead of cropping it.
 */
function ResponsiveRig({ children }: PropsWithChildren) {
  const width = useThree((s) => s.size.width);
  const scale = width < 640 ? 0.46 : width < 1024 ? 0.72 : 1;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.22;
    groupRef.current.rotation.x = Math.sin(t * 0.09 + 1.3) * 0.05;
    groupRef.current.position.y = Math.sin(t * 0.18) * 0.18;
  });

  return (
    <group ref={groupRef} scale={scale}>
      {children}
    </group>
  );
}

/** Camera drifts slightly toward the cursor for a parallax feel, always re-aiming at the board. */
function CameraRig({ target }: { target: [number, number, number] }) {
  const { camera, pointer } = useThree();
  const base = useRef(camera.position.clone());
  const lookTarget = useRef(new THREE.Vector3(...target));

  useFrame(() => {
    const targetX = base.current.x + pointer.x * 1.3;
    const targetY = base.current.y + pointer.y * 0.7;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(lookTarget.current);
  });

  return null;
}

export function CircuitBoardScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 6, 9], fov: 45 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, -0.5)}
      className="!absolute !inset-0"
    >
      <fog attach="fog" args={["#05070a", 11, 24]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[7, 6, 6]} intensity={70} color={COLOR_TRACE_A} />
      <pointLight position={[-7, -2, 5]} intensity={55} color={COLOR_TRACE_B} />
      <pointLight position={[0, 5, -3]} intensity={35} color={0xffffff} />

      <CameraRig target={[0, 0, -0.5]} />

      <ResponsiveRig>
        <Board />
        <ShineSweep />
        <TraceLayer segments={TRACE_SEGMENTS_A} vias={VIAS_A} color={COLOR_TRACE_A} />
        <TraceLayer segments={TRACE_SEGMENTS_B} vias={VIAS_B} color={COLOR_TRACE_B} />
        <PulseLayer pulses={INITIAL_PULSES_A} color={COLOR_TRACE_A} />
        <PulseLayer pulses={INITIAL_PULSES_B} color={COLOR_TRACE_B} />
        {COMPONENTS.map((spec, i) => (
          <ComponentInstance key={i} spec={spec} index={i} />
        ))}
      </ResponsiveRig>
    </Canvas>
  );
}
