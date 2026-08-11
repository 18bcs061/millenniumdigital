"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Tier } from "@/lib/tier";

const TIER_COLORS: Record<Tier, [number, number]> = {
  Member: [0x75787b, 0x54575a],
  Preferred: [0x9b1b5c, 0x75787b],
  Premier: [0xe0508c, 0x9b1b5c],
};

function Medallion({ tier }: { tier: Tier }) {
  const groupRef = useRef<THREE.Group>(null);
  const [c1, c2] = TIER_COLORS[tier];

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.22, 48]} />
        <meshStandardMaterial color={c1} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.115]}>
        <cylinderGeometry args={[0.72, 0.72, 0.02, 48]} />
        <meshStandardMaterial color={c2} metalness={0.7} roughness={0.3} emissive={c2} emissiveIntensity={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.115]}>
        <cylinderGeometry args={[0.72, 0.72, 0.02, 48]} />
        <meshStandardMaterial color={c2} metalness={0.7} roughness={0.3} emissive={c2} emissiveIntensity={0.25} />
      </mesh>
      <mesh>
        <torusGeometry args={[1, 0.05, 16, 48]} />
        <meshStandardMaterial color={c2} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

export function LoyaltyMedallionScene({ tier }: { tier: Tier }) {
  return (
    <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0, 3.4], fov: 40 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 3]} intensity={30} color={0xe0508c} />
      <pointLight position={[-3, -2, 2]} intensity={20} color={0x9b1b5c} />
      <Medallion tier={tier} />
    </Canvas>
  );
}
