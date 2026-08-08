"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PALETTE = [0x7c3aed, 0x06b6d4, 0xf59e0b, 0xa78bfa];
const NODE_COUNT = 90;
const CONNECT_DISTANCE = 2.6;
const PULSE_COUNT = 14;
const BOUNDS = { x: 9, y: 5, z: 4 };

function randomIn(range: number) {
  return (Math.random() - 0.5) * 2 * range;
}

interface PulseState {
  edge: [number, number];
  t: number;
  speed: number;
}

/**
 * All randomized geometry is generated once at module load (not inside any component
 * render), so the scene layout is stable and never trips React's render-purity checks —
 * only the useFrame animation loop (which runs outside React's render phase) is allowed
 * to keep calling Math.random() for the traveling signal pulses.
 */
function buildCircuitData() {
  const positions = new Float32Array(NODE_COUNT * 3);
  const colors = new Float32Array(NODE_COUNT * 3);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    const x = randomIn(BOUNDS.x);
    const y = randomIn(BOUNDS.y);
    const z = randomIn(BOUNDS.z);
    positions.set([x, y, z], i * 3);
    points.push(new THREE.Vector3(x, y, z));

    const color = new THREE.Color(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    colors.set([color.r, color.g, color.b], i * 3);
  }

  const edges: [number, number][] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (points[i].distanceTo(points[j]) < CONNECT_DISTANCE) edges.push([i, j]);
    }
  }

  const linePositions = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    linePositions.set(
      [positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2], positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]],
      i * 6
    );
  });

  const initialPulses: PulseState[] = Array.from({ length: PULSE_COUNT }, () => ({
    edge: edges[Math.floor(Math.random() * edges.length)],
    t: Math.random(),
    speed: 0.15 + Math.random() * 0.25,
  }));

  const pulseColors = new Float32Array(PULSE_COUNT * 3);
  for (let i = 0; i < PULSE_COUNT; i++) {
    const c = new THREE.Color(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    pulseColors.set([c.r, c.g, c.b], i * 3);
  }

  return { positions, colors, edges, linePositions, initialPulses, pulseColors };
}

const CIRCUIT_DATA = buildCircuitData();

/** Field of glowing "circuit" nodes connected by trace lines, with light pulses flowing along the traces. */
function CircuitField() {
  const groupRef = useRef<THREE.Group>(null);
  const pulsesRef = useRef<PulseState[]>(CIRCUIT_DATA.initialPulses.map((p) => ({ ...p })));
  const pulsePointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.035;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    }

    const positionAttr = pulsePointsRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!positionAttr) return;

    const { positions, edges } = CIRCUIT_DATA;
    const pulses = pulsesRef.current;

    for (let i = 0; i < PULSE_COUNT; i++) {
      const pulse = pulses[i];
      pulse.t += delta * pulse.speed;
      if (pulse.t >= 1) {
        pulse.t = 0;
        pulse.edge = edges[Math.floor(Math.random() * edges.length)];
      }
      const [a, b] = pulse.edge;
      const x = THREE.MathUtils.lerp(positions[a * 3], positions[b * 3], pulse.t);
      const y = THREE.MathUtils.lerp(positions[a * 3 + 1], positions[b * 3 + 1], pulse.t);
      const z = THREE.MathUtils.lerp(positions[a * 3 + 2], positions[b * 3 + 2], pulse.t);
      positionAttr.setXYZ(i, x, y, z);
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[CIRCUIT_DATA.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[CIRCUIT_DATA.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.09} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[CIRCUIT_DATA.linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={0x8fa3ff} transparent opacity={0.14} depthWrite={false} />
      </lineSegments>

      <points ref={pulsePointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(PULSE_COUNT * 3), 3]} />
          <bufferAttribute attach="attributes-color" args={[CIRCUIT_DATA.pulseColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.16} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

const CHIP_EDGES = new THREE.BoxGeometry(1, 0.12, 1);

function ChipMesh({ position, scale = 1, speed = 0.07 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
      ref.current.rotation.x += delta * speed * 0.4;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[1, 0.12, 1]} />
        <meshStandardMaterial color={0x1e1b4b} metalness={0.6} roughness={0.35} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[CHIP_EDGES]} />
        <lineBasicMaterial color={0x7c3aed} transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

export function CircuitScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 9], fov: 55 }}
      className="!absolute !inset-0"
    >
      <color attach="background" args={["#0f172a"]} />
      <fog attach="fog" args={["#0f172a", 6, 15]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={40} color={0x7c3aed} />
      <pointLight position={[-5, -3, 3]} intensity={30} color={0x06b6d4} />

      <CircuitField />
      <ChipMesh position={[-4, 1.6, -1]} scale={1.3} speed={0.06} />
      <ChipMesh position={[4.2, -1.2, -2]} scale={1.7} speed={0.09} />
      <ChipMesh position={[2, 2.2, -3]} scale={0.9} speed={0.11} />
    </Canvas>
  );
}
