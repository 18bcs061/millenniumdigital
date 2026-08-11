"use client";

import { useRef, type PropsWithChildren } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * A semiconductor fab, not a starfield.
 *
 * Three things make this read as silicon rather than generic particles:
 *  - the wafer carries a real die grid with a yield map (good/defective dies),
 *  - a photolithography beam sweeps the wafer and exposes dies row by row,
 *  - interconnect traces turn at 90 degrees (Manhattan routing), the way
 *    real metal layers are actually routed, instead of random diagonals.
 *
 * Every Math.random() call lives in a build* function invoked once at module
 * load, so component render stays pure; per-frame mutation happens only inside
 * useFrame through refs.
 * ------------------------------------------------------------------ */

const COLOR_SILICON = 0x3a2430;
const COLOR_DIE_DARK = new THREE.Color(0x2b1a24);
const COLOR_DIE_HOT = new THREE.Color(0xffc3e0);
const COLOR_ACCENT = 0xe0508c;
const COLOR_PRIMARY = 0x9b1b5c;
const COLOR_GOLD = 0xd9a441;

const WAFER_RADIUS = 3.15;
const DIE_PITCH = 0.28;
const DIE_SIZE = 0.215;
const DEFECT_RATE = 0.09;

const SCAN_SPAN = WAFER_RADIUS + 0.5;
const SCAN_SPEED = 2.6;
const SCAN_PAUSE = 1.1;
const SCAN_WIDTH = 0.19;

interface DieData {
  x: number;
  z: number;
  good: boolean;
}

/** Die grid clipped to the wafer circle, with a scattered defect map like a real probe result. */
function buildDies(): DieData[] {
  const dies: DieData[] = [];
  const half = Math.floor(WAFER_RADIUS / DIE_PITCH);

  for (let col = -half; col <= half; col++) {
    for (let row = -half; row <= half; row++) {
      const x = col * DIE_PITCH;
      const z = row * DIE_PITCH;
      // Keep whole dies inside the wafer edge exclusion zone.
      if (Math.hypot(x, z) > WAFER_RADIUS - DIE_SIZE * 1.6) continue;
      dies.push({ x, z, good: Math.random() > DEFECT_RATE });
    }
  }
  return dies;
}

const DIES = buildDies();

interface Trace {
  points: THREE.Vector3[];
  cumulative: number[];
  total: number;
}

const TRACE_COUNT = 26;
const LAYER_Y = [-1.9, 0.15, 2.1];
const ROUTE_GRID = 0.55;

function snapToGrid(v: number) {
  return Math.round(v / ROUTE_GRID) * ROUTE_GRID;
}

/** Orthogonal ("Manhattan") routes — each segment runs along X or Z only, turning at right angles. */
function buildTraces(): Trace[] {
  const traces: Trace[] = [];

  for (let i = 0; i < TRACE_COUNT; i++) {
    const y = LAYER_Y[i % LAYER_Y.length] + (Math.random() - 0.5) * 0.35;
    let x = snapToGrid((Math.random() - 0.5) * 17);
    let z = snapToGrid((Math.random() - 0.5) * 6 - 2);

    const points = [new THREE.Vector3(x, y, z)];
    let alongX = Math.random() < 0.5;

    const segments = 3 + Math.floor(Math.random() * 3);
    for (let s = 0; s < segments; s++) {
      const steps = 1 + Math.floor(Math.random() * 4);
      const delta = steps * ROUTE_GRID * (Math.random() < 0.5 ? 1 : -1);
      if (alongX) x += delta;
      else z += delta;
      points.push(new THREE.Vector3(x, y, z));
      alongX = !alongX;
    }

    const cumulative = [0];
    let total = 0;
    for (let p = 1; p < points.length; p++) {
      total += points[p].distanceTo(points[p - 1]);
      cumulative.push(total);
    }

    traces.push({ points, cumulative, total });
  }

  return traces;
}

const TRACES = buildTraces();

/** Flattened trace geometry: every consecutive point pair becomes one line segment. */
function buildTraceSegments(): Float32Array {
  const verts: number[] = [];
  for (const trace of TRACES) {
    for (let i = 1; i < trace.points.length; i++) {
      const a = trace.points[i - 1];
      const b = trace.points[i];
      verts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  return new Float32Array(verts);
}

const TRACE_SEGMENTS = buildTraceSegments();

/** Vias: the vertical hops where a route changes metal layer. Rendered as bright dots at every corner. */
function buildVias(): Float32Array {
  const verts: number[] = [];
  for (const trace of TRACES) {
    for (let i = 1; i < trace.points.length - 1; i++) {
      const p = trace.points[i];
      verts.push(p.x, p.y, p.z);
    }
  }
  return new Float32Array(verts);
}

const VIAS = buildVias();

interface PulseState {
  trace: number;
  dist: number;
  speed: number;
}

const PULSE_COUNT = 22;

function buildPulses(): PulseState[] {
  return Array.from({ length: PULSE_COUNT }, () => {
    const trace = Math.floor(Math.random() * TRACES.length);
    return {
      trace,
      dist: Math.random() * TRACES[trace].total,
      speed: 1.6 + Math.random() * 2.4,
    };
  });
}

const INITIAL_PULSES = buildPulses();

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

function Wafer() {
  const diesRef = useRef<THREE.InstancedMesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const intensityRef = useRef<Float32Array | null>(null);
  const scanRef = useRef({ x: -SCAN_SPAN, pause: 0 });
  const matrixWrittenRef = useRef(false);
  const matrix = useRef(new THREE.Matrix4());
  const color = useRef(new THREE.Color());

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const mesh = diesRef.current;
    if (!mesh) return;

    intensityRef.current ??= new Float32Array(DIES.length);
    const intensity = intensityRef.current;
    const scan = scanRef.current;

    // Advance the lithography beam, with a beat between exposure passes.
    if (scan.pause > 0) {
      scan.pause -= delta;
    } else {
      scan.x += delta * SCAN_SPEED;
      if (scan.x > SCAN_SPAN) {
        scan.x = -SCAN_SPAN;
        scan.pause = SCAN_PAUSE;
      }
    }

    // Clip the exposure beam to the wafer's chord at its current x, so it spans
    // exactly the silicon and never overhangs the round edge.
    if (beamRef.current) {
      const overWafer = scan.pause <= 0 && Math.abs(scan.x) < WAFER_RADIUS;
      beamRef.current.visible = overWafer;
      if (overWafer) {
        const chord = 2 * Math.sqrt(WAFER_RADIUS * WAFER_RADIUS - scan.x * scan.x);
        beamRef.current.position.x = scan.x;
        beamRef.current.scale.y = chord / (WAFER_RADIUS * 2.1);
      }
    }

    // Each die's transform only has to be written once.
    const needsMatrix = !matrixWrittenRef.current;

    for (let i = 0; i < DIES.length; i++) {
      const die = DIES[i];

      if (needsMatrix) {
        matrix.current.makeTranslation(die.x, 0.05, die.z);
        mesh.setMatrixAt(i, matrix.current);
      }

      const ceiling = die.good ? 1 : 0.13;
      const resting = die.good ? 0.22 : 0.04;

      if (scan.pause <= 0 && Math.abs(die.x - scan.x) < SCAN_WIDTH) {
        intensity[i] = ceiling;
      } else if (intensity[i] > resting) {
        intensity[i] = Math.max(resting, intensity[i] - delta * 0.85);
      }

      color.current.copy(COLOR_DIE_DARK).lerp(COLOR_DIE_HOT, intensity[i]);
      mesh.setColorAt(i, color.current);
    }

    if (needsMatrix) {
      mesh.instanceMatrix.needsUpdate = true;
      matrixWrittenRef.current = true;
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    // Tilted back like a wafer sitting on a stepper chuck.
    <group position={[3.9, -1.35, -0.6]} rotation={[-1.02, 0, 0.22]}>
      {/* Polished silicon substrate */}
      <mesh castShadow={false}>
        <cylinderGeometry args={[WAFER_RADIUS, WAFER_RADIUS, 0.08, 96]} />
        <meshStandardMaterial color={COLOR_SILICON} metalness={0.94} roughness={0.22} />
      </mesh>

      {/* Edge bevel ring */}
      <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[WAFER_RADIUS - 0.07, WAFER_RADIUS, 96]} />
        <meshBasicMaterial color={COLOR_ACCENT} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Orientation notch — the flat every real wafer carries */}
      <mesh position={[0, 0.02, WAFER_RADIUS - 0.04]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.26, 0.14, 0.26]} />
        <meshBasicMaterial color={0x120a0f} />
      </mesh>

      {/* The die grid */}
      <instancedMesh ref={diesRef} args={[undefined, undefined, DIES.length]} frustumCulled={false}>
        <boxGeometry args={[DIE_SIZE, 0.03, DIE_SIZE]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Photolithography exposure beam */}
      <mesh ref={beamRef} position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.34, WAFER_RADIUS * 2.1]} />
        <meshBasicMaterial
          color={0xffe4f2}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Interconnect() {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const pulsesRef = useRef<PulseState[] | null>(null);
  const scratch = useRef(new THREE.Vector3());

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.12;
    }

    const attr = pulseRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!attr) return;

    pulsesRef.current ??= INITIAL_PULSES.map((p) => ({ ...p }));
    const pulses = pulsesRef.current;

    for (let i = 0; i < pulses.length; i++) {
      const pulse = pulses[i];
      const trace = TRACES[pulse.trace];
      pulse.dist += delta * pulse.speed;
      if (pulse.dist > trace.total) pulse.dist = 0;

      samplePolyline(trace, pulse.dist, scratch.current);
      attr.setXYZ(i, scratch.current.x, scratch.current.y, scratch.current.z);
    }
    attr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[TRACE_SEGMENTS, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={COLOR_ACCENT} transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[VIAS, 3]} />
        </bufferGeometry>
        <pointsMaterial color={COLOR_ACCENT} size={0.075} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>

      <points ref={pulseRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(PULSE_COUNT * 3), 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={0xffd6ea}
          size={0.2}
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

const BOND_PADS = 9;

/** Gold bond wires arcing from the die pads out to the package leads, sampled off bezier curves. */
function buildBondWires(): Float32Array {
  const verts: number[] = [];
  const steps = 12;
  const curve = new THREE.QuadraticBezierCurve3();
  const point = new THREE.Vector3();
  const prev = new THREE.Vector3();

  for (let side = 0; side < 4; side++) {
    const angle = (side * Math.PI) / 2;
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);

    for (let p = 0; p < BOND_PADS; p++) {
      const offset = (p / (BOND_PADS - 1) - 0.5) * 0.82;
      // Perpendicular spread along the package edge.
      const perpX = -dirZ * offset;
      const perpZ = dirX * offset;

      curve.v0.set(dirX * 0.42 + perpX, 0.16, dirZ * 0.42 + perpZ);
      curve.v1.set(dirX * 0.78 + perpX, 0.56, dirZ * 0.78 + perpZ);
      curve.v2.set(dirX * 1.12 + perpX, 0.02, dirZ * 1.12 + perpZ);

      for (let s = 0; s <= steps; s++) {
        curve.getPoint(s / steps, point);
        if (s > 0) verts.push(prev.x, prev.y, prev.z, point.x, point.y, point.z);
        prev.copy(point);
      }
    }
  }

  return new Float32Array(verts);
}

const BOND_WIRES = buildBondWires();

/** Solder ball grid array on the underside of the package. */
function buildBallGrid(): Float32Array {
  const verts: number[] = [];
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      verts.push(i * 0.3, -0.16, j * 0.3);
    }
  }
  return new Float32Array(verts);
}

const BALL_GRID = buildBallGrid();

function ChipPackage() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.16;
    ref.current.position.y = 0.35 + Math.sin(state.clock.elapsedTime * 0.9) * 0.12;
  });

  return (
    <group ref={ref} position={[-5.4, 0.35, 0.4]} rotation={[0.62, 0, 0]} scale={1.35}>
      {/* Package substrate */}
      <mesh>
        <boxGeometry args={[2.3, 0.12, 2.3]} />
        <meshStandardMaterial color={0x241019} metalness={0.5} roughness={0.55} />
      </mesh>

      {/* The die itself, sitting proud of the substrate */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.86, 0.12, 0.86]} />
        <meshStandardMaterial
          color={COLOR_PRIMARY}
          emissive={COLOR_ACCENT}
          emissiveIntensity={0.65}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[BOND_WIRES, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={COLOR_GOLD} transparent opacity={0.85} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[BALL_GRID, 3]} />
        </bufferGeometry>
        <pointsMaterial color={COLOR_GOLD} size={0.17} sizeAttenuation transparent opacity={0.75} />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The wafer and package are composed to flank a centred copy block on wide
 * screens. Narrow viewports see a much smaller slice of world space, so the
 * whole rig scales down to keep both props in frame instead of cropping them.
 */
function ResponsiveRig({ children }: PropsWithChildren) {
  const width = useThree((s) => s.size.width);
  const scale = width < 640 ? 0.46 : width < 1024 ? 0.72 : 1;

  return (
    <group scale={scale} position={[0, scale < 1 ? -0.4 : 0, 0]}>
      {children}
    </group>
  );
}

export function FabScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0.6, 10], fov: 52 }}
      className="!absolute !inset-0"
    >
      <fog attach="fog" args={["#1a0e14", 9, 21]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[6, 5, 6]} intensity={55} color={COLOR_ACCENT} />
      <pointLight position={[-6, -2, 4]} intensity={35} color={COLOR_PRIMARY} />
      <pointLight position={[0, 4, -4]} intensity={20} color={0xffffff} />

      <ResponsiveRig>
        <Wafer />
        <Interconnect />
        <ChipPackage />
      </ResponsiveRig>
    </Canvas>
  );
}
