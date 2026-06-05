"use client";

/**
 * TerraCanvas — Earthy 3D scene
 *
 * A slowly turning hand-shaped terracotta vessel (torus knot) at center,
 * floating clay pebbles, woven thread loops in golden ochre, and warm
 * dust motes drifting in soft sunlight. The whole palette is sand,
 * terracotta, cream, ochre — earth as material.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ── Palette ───────────────────────────────────────────────────────────────────
const CREAM    = "#f2ece4";
const TERRA    = "#c17f52";
const OCHRE    = "#a86234";
const CLAY_DK  = "#7a4628";
const SAND     = "#d6b896";
const RUST     = "#8b4a26";

// ── Camera with parallax + slow orbit ─────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse  = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const t = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, dt) => {
    t.current += dt;
    target.current.x += (mouse.current.x * 0.4 - target.current.x) * 0.05;
    target.current.y += (mouse.current.y * 0.25 - target.current.y) * 0.05;
    // Subtle slow orbit
    const orbit = Math.sin(t.current * 0.08) * 0.4;
    camera.position.x = target.current.x + orbit;
    camera.position.y = 0.6 + target.current.y;
    camera.position.z = 7.2;
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

// ── Central Clay Vessel — slow-rotating terracotta torus knot ─────────────────
function ClayVessel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.18;
      meshRef.current.rotation.x = Math.sin(t.current * 0.4) * 0.08;
      meshRef.current.position.y = Math.sin(t.current * 0.5) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <torusKnotGeometry args={[1.05, 0.34, 220, 36, 2, 3]} />
      <meshStandardMaterial
        color={TERRA}
        roughness={0.85}
        metalness={0.1}
      />
    </mesh>
  );
}

// ── Floating clay pebbles ─────────────────────────────────────────────────────
function ClayPebbles() {
  const pebbles = useMemo(() => {
    const N = 9;
    return Array.from({ length: N }, (_, i) => {
      const hash = (x: number) => (Math.sin(x * 78.233) * 43758.5453) % 1;
      const r1 = Math.abs(hash(i * 1.7));
      const r2 = Math.abs(hash(i * 2.3 + 1));
      const r3 = Math.abs(hash(i * 3.1 + 2));
      const angle = (i / N) * Math.PI * 2 + r1;
      return {
        x: Math.cos(angle) * (2.6 + r1 * 1.2),
        y: -1.4 + r2 * 2.8,
        z: Math.sin(angle) * (2.6 + r1 * 1.2),
        size: 0.22 + r3 * 0.32,
        color: [TERRA, OCHRE, CLAY_DK, RUST, SAND][i % 5],
        speed: 0.6 + r1 * 0.8,
        phase: r2 * Math.PI * 2,
      };
    });
  }, []);

  return (
    <>
      {pebbles.map((p, i) => (
        <Float
          key={i}
          floatIntensity={0.6}
          rotationIntensity={0.5}
          speed={p.speed}
        >
          <mesh position={[p.x, p.y, p.z]} castShadow>
            <icosahedronGeometry args={[p.size, 1]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.92}
              metalness={0.05}
              flatShading
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// ── Woven Thread Loops — ochre rings drifting in space ────────────────────────
function WovenLoops() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const t = useRef(0);

  const loops = useMemo(
    () => [
      { pos: [-2.3,  1.5, -1.5] as [number, number, number], r: 0.95, t: 0.018, rot: [1.2, 0.4, 0.3] as [number, number, number] },
      { pos: [ 2.6, -1.2, -1.0] as [number, number, number], r: 1.20, t: 0.014, rot: [0.4, 1.2, 0.6] as [number, number, number] },
      { pos: [-2.0, -1.6,  1.2] as [number, number, number], r: 0.75, t: 0.020, rot: [0.9, 0.2, 1.1] as [number, number, number] },
    ],
    []
  );

  useFrame((_, dt) => {
    t.current += dt;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.x = loops[i].rot[0] + Math.sin(t.current * 0.3 + i) * 0.2;
      m.rotation.y = loops[i].rot[1] + t.current * (0.15 + i * 0.05);
      m.rotation.z = loops[i].rot[2] + Math.cos(t.current * 0.25 + i) * 0.15;
    });
  });

  return (
    <>
      {loops.map((l, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={l.pos}
        >
          <torusGeometry args={[l.r, l.t, 16, 100]} />
          <meshStandardMaterial
            color={OCHRE}
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

// ── Warm dust motes — drifting particles in sunbeam ───────────────────────────
function DustMotes({ count = 200 }: { count?: number }) {
  const pts = useRef<THREE.Points>(null);
  const t = useRef(0);

  const { positions, phases, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const colors    = new Float32Array(count * 3);
    const c1 = new THREE.Color(SAND);
    const c2 = new THREE.Color(TERRA);
    const c3 = new THREE.Color("#f5dfbf");

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = -2 + Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      phases[i] = Math.random() * Math.PI * 2;
      const r = Math.random();
      const c = r < 0.4 ? c1 : r < 0.75 ? c3 : c2;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, phases, colors };
  }, [count]);

  useFrame((_, dt) => {
    t.current += dt * 0.3;
    if (!pts.current) return;
    const arr = pts.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.004 + Math.sin(t.current + phases[i]) * 0.0012;
      arr[i * 3]     += Math.cos(t.current * 0.4 + phases[i]) * 0.0008;
      if (arr[i * 3 + 1] > 4.5) arr[i * 3 + 1] = -2.2;
    }
    pts.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        transparent
        opacity={0.6}
        vertexColors
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Sand floor — receives shadow ──────────────────────────────────────────────
function SandFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#e9dcc8" roughness={1} metalness={0} />
    </mesh>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={[CREAM]} />
      <fog attach="fog" args={[CREAM, 10, 22]} />

      {/* Warm "sun" — strong golden directional light */}
      <ambientLight intensity={0.55} color="#fff4e0" />
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.1}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Cool sky fill */}
      <directionalLight position={[-5, 3, -4]} intensity={0.25} color="#dfe5ea" />

      <SandFloor />
      <ClayVessel />
      <WovenLoops />
      <ClayPebbles />
      <DustMotes count={200} />
    </>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────────
export default function TerraCanvas() {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.6, 7.2], fov: 48 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={[1, 1.6]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
