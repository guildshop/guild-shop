"use client";

/**
 * VesperCanvas — Brutalist 3D scene
 *
 * A slowly-rotating monolithic concrete stack inside a wireframe
 * architectural frame. Single hard directional light casting deep
 * shadows, off-white slabs against the void. Echoes Tadao Ando /
 * brutalist sculpture: weight, silence, negative space.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Camera with slow mouse parallax ───────────────────────────────────────────
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
    target.current.x += (mouse.current.x * 0.6 - target.current.x) * 0.04;
    target.current.y += (mouse.current.y * 0.35 - target.current.y) * 0.04;
    camera.position.x = target.current.x;
    camera.position.y = 1.2 + target.current.y;
    camera.position.z = 9.5 + Math.sin(t.current * 0.15) * 0.5;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

// ── Monolith Stack — 8 concrete slabs, jittered, slowly rotating ──────────────
function MonolithStack() {
  const group = useRef<THREE.Group>(null);
  const t = useRef(0);

  // Pre-generated slab parameters (jitter is stable across renders)
  const slabs = useMemo(() => {
    const N = 8;
    return Array.from({ length: N }, (_, i) => {
      const hash = (x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1;
      const r1 = Math.abs(hash(i * 1.3 + 0.7));
      const r2 = Math.abs(hash(i * 2.1 + 1.5));
      const r3 = Math.abs(hash(i * 0.9 + 2.3));
      const r4 = Math.abs(hash(i * 3.1 + 4.7));
      return {
        y:   -3.2 + i * 0.78,
        x:   (r1 - 0.5) * 0.6,
        z:   (r2 - 0.5) * 0.4,
        rot: (r3 - 0.5) * 0.18,
        w:   2.8 - i * 0.13,
        h:   0.55 + r4 * 0.22,
        d:   2.0 - i * 0.10,
        tone: 0.55 + r4 * 0.35,  // grayscale 0.55–0.90
      };
    });
  }, []);

  useFrame((_, dt) => {
    t.current += dt;
    if (group.current) {
      group.current.rotation.y += dt * 0.07;
      // Gentle vertical drift — the stack breathes
      group.current.position.y = Math.sin(t.current * 0.3) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {slabs.map((s, i) => {
        const c = Math.floor(s.tone * 255);
        return (
          <mesh
            key={i}
            position={[s.x, s.y, s.z]}
            rotation={[0, s.rot, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[s.w, s.h, s.d]} />
            <meshStandardMaterial
              color={`rgb(${c},${c},${c})`}
              roughness={0.92}
              metalness={0.04}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Floating fragments — small cubes orbiting the stack ───────────────────────
function FloatingFragments({ count = 14 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(0);

  const frags = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const hash = (x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1;
      const r1 = Math.abs(hash(i + 0.5));
      const r2 = Math.abs(hash(i + 1.7));
      const r3 = Math.abs(hash(i + 3.3));
      return {
        radius: 3.5 + r1 * 2.2,
        height: -2.5 + r2 * 6,
        phase:  r3 * Math.PI * 2,
        speed:  0.18 + r1 * 0.35,
        size:   0.15 + r3 * 0.35,
        tone:   0.7 + r1 * 0.25,
      };
    });
  }, [count]);

  useFrame((_, dt) => {
    t.current += dt;
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const f = frags[i];
        const a = t.current * f.speed + f.phase;
        child.position.x = Math.cos(a) * f.radius;
        child.position.z = Math.sin(a) * f.radius;
        child.position.y = f.height + Math.sin(t.current * 0.4 + f.phase) * 0.3;
        child.rotation.x = a * 0.6;
        child.rotation.y = a * 0.8;
      });
    }
  });

  return (
    <group ref={group}>
      {frags.map((f, i) => {
        const c = Math.floor(f.tone * 255);
        return (
          <mesh key={i} castShadow>
            <boxGeometry args={[f.size, f.size, f.size]} />
            <meshStandardMaterial
              color={`rgb(${c},${c},${c})`}
              roughness={0.85}
              metalness={0.08}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Wireframe Architectural Frame — large box outline around the stack ───────
function ArchitecturalFrame() {
  const ref = useRef<THREE.LineSegments>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (ref.current) {
      ref.current.rotation.y = -Math.sin(t.current * 0.1) * 0.08;
    }
  });

  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(6.5, 9, 4.5)), []);

  return (
    <lineSegments ref={ref} geometry={geo} position={[0, 0.5, 0]}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.18} />
    </lineSegments>
  );
}

// ── Ground plane — receives shadow ────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
    </mesh>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={["#080808"]} />
      <fog attach="fog" args={["#080808", 10, 24]} />

      <ambientLight intensity={0.12} />
      {/* Hard top key light — dramatic shadow */}
      <directionalLight
        position={[5, 14, 4]}
        intensity={1.6}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
      />
      {/* Cold fill from below-back */}
      <directionalLight position={[-6, -2, -6]} intensity={0.25} color="#a8b0c0" />

      <Ground />
      <ArchitecturalFrame />
      <MonolithStack />
      <FloatingFragments count={14} />
    </>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────────
export default function VesperCanvas() {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 1.2, 9.5], fov: 45 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.6]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
