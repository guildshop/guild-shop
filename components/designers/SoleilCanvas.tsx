"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const GOLD     = "#c9a030";
const PURPLE   = "#7040b0";
const BURGUNDY = "#8b1a3a";
const DUST     = "#d4b8e0";
const MOONLIT  = "#e8dfc8";

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.6 + 0.2 - camera.position.y) * 0.04;
    camera.position.z = 7.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Moon() {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.055;
    ref.current.position.y = Math.sin(t.current * 0.18) * 0.18;
    ref.current.position.x = 1.5 + Math.sin(t.current * 0.08) * 0.1;
  });

  return (
    <group ref={ref} position={[1.5, 0.5, -0.5]}>
      <mesh>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshStandardMaterial color={MOONLIT} roughness={0.88} metalness={0.08} />
      </mesh>
      {/* Halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.75, 0.04, 8, 100]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.75} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function GothicArches() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.z = Math.sin(t.current * 0.08 + i * 0.5) * 0.04;
    });
  });

  return (
    <>
      <mesh ref={el => { refs.current[0] = el; }} position={[-3.8, 0, -2]} rotation={[0, 0.4, Math.PI / 2]}>
        <torusGeometry args={[2.1, 0.04, 8, 80, Math.PI]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.28} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh ref={el => { refs.current[1] = el; }} position={[3.4, 0.3, -2.5]} rotation={[0, -0.5, Math.PI / 2]}>
        <torusGeometry args={[1.9, 0.03, 8, 80, Math.PI]} />
        <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.38} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={el => { refs.current[2] = el; }} position={[0, -2.5, -3]} rotation={[Math.PI / 2, 0, 0.3]}>
        <torusGeometry args={[3.5, 0.025, 8, 80, Math.PI * 0.6]} />
        <meshStandardMaterial color={BURGUNDY} emissive={BURGUNDY} emissiveIntensity={0.2} metalness={0.7} roughness={0.4} transparent opacity={0.6} />
      </mesh>
    </>
  );
}

function PentagramOrbit() {
  const groupRef = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (!groupRef.current) return;
    groupRef.current.rotation.z += dt * 0.075;
    groupRef.current.rotation.y = Math.sin(t.current * 0.14) * 0.3;
  });

  return (
    <group ref={groupRef} position={[-1.8, -0.6, 0.5]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.018, 8, 100]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.55} metalness={1} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.55, 0, Math.sin(a) * 1.55]}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={1.2} metalness={1} roughness={0} />
          </mesh>
        );
      })}
    </group>
  );
}

function FloatingStars() {
  const stars = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      x: (Math.sin(i * 1.5) * 5),
      y: (Math.cos(i * 2.1) * 2.5),
      z: -1 + Math.sin(i * 0.7) * 2,
      color: [GOLD, PURPLE, DUST, BURGUNDY, GOLD, PURPLE, DUST, MOONLIT][i],
      speed: 0.28 + (i % 4) * 0.12,
      scale: 0.1 + (i % 3) * 0.14,
    }))
  , []);

  return (
    <>
      {stars.map((s, i) => (
        <Float key={i} floatIntensity={0.55} rotationIntensity={0.75} speed={s.speed}>
          <mesh position={[s.x, s.y, s.z]} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.55} metalness={0.7} roughness={0.2} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function MysticParticles({ count = 170 }: { count?: number }) {
  const pts = useRef<THREE.Points>(null);
  const t = useRef(0);

  const { positions, phases, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const colors    = new Float32Array(count * 3);
    const palette   = [new THREE.Color(GOLD), new THREE.Color(PURPLE), new THREE.Color(DUST), new THREE.Color(MOONLIT)];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = -3 + Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      phases[i] = Math.random() * Math.PI * 2;
      const c = palette[i % 4];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, phases, colors };
  }, [count]);

  useFrame((_, dt) => {
    t.current += dt * 0.18;
    if (!pts.current) return;
    const arr = pts.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.004 + Math.sin(t.current + phases[i]) * 0.0018;
      arr[i * 3]     += Math.sin(t.current * 0.5 + phases[i] * 0.3) * 0.001;
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -3;
    }
    pts.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.042} vertexColors transparent opacity={0.52} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={["#07001a"]} />
      <fog attach="fog" args={["#07001a", 10, 22]} />

      <ambientLight intensity={0.07} color="#4020a0" />
      <pointLight position={[2, 3, 4]}    intensity={2}   color={GOLD}     distance={16} />
      <pointLight position={[-2, -1, 3]}  intensity={1.5} color={PURPLE}   distance={14} />
      <pointLight position={[0, -3, 2]}   intensity={1}   color={BURGUNDY} distance={12} />
      <pointLight position={[1.5, 0.5, 3]} intensity={2.2} color="#fff4d0" distance={10} />

      <Moon />
      <GothicArches />
      <PentagramOrbit />
      <FloatingStars />
      <MysticParticles count={170} />
    </>
  );
}

export default function SoleilCanvas() {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.2, 7.5], fov: 52 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
