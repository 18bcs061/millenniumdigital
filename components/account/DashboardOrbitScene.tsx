"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitDef {
  radius: number;
  speed: number;
  phase: number;
  tiltZ: number;
  heightAmp: number;
  color: number;
  size: number;
}

function buildOrbits(): OrbitDef[] {
  const colors = [0xe0508c, 0x9b1b5c, 0xc9578f, 0x75787b, 0xe0508c];
  return Array.from({ length: 5 }, (_, i) => ({
    radius: 1.15 + i * 0.42,
    speed: 0.5 - i * 0.07,
    phase: (i / 5) * Math.PI * 2,
    tiltZ: (i * Math.PI) / 7,
    heightAmp: 0.25 + i * 0.05,
    color: colors[i],
    size: 0.09 - i * 0.008,
  }));
}

const ORBITS = buildOrbits();

function Core() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.28;
    ref.current.rotation.x += delta * 0.1;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial color={0x9b1b5c} emissive={0xe0508c} emissiveIntensity={0.5} metalness={0.5} roughness={0.35} wireframe />
    </mesh>
  );
}

function OrbitNode({ radius, speed, phase, tiltZ, heightAmp, color, size }: OrbitDef) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 1.6) * heightAmp, Math.sin(t) * radius);
  });

  return (
    <group rotation={[0, 0, tiltZ]}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 14, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

/** Ambient decorative scene — a wireframe core with orbiting glowing nodes, brand-colored. */
export function DashboardOrbitScene() {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 1.1, 4.4], fov: 42 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={26} color={0xe0508c} />
      <pointLight position={[-3, -1.5, 2]} intensity={14} color={0x75787b} />
      <Core />
      {ORBITS.map((o, i) => (
        <OrbitNode key={i} {...o} />
      ))}
    </Canvas>
  );
}
