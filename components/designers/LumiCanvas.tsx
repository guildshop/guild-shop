"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const CHROME  = "#c8d8ff";
const PINK    = "#ff80d0";
const CYAN    = "#80ffff";
const LAVEND  = "#d0a0ff";
const WHITE   = "#ffffff";

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
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.8 + 0.3 - camera.position.y) * 0.04;
    camera.position.z = 7;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function ChromeSphere() {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.22;
    ref.current.rotation.z = Math.sin(t.current * 0.3) * 0.1;
    ref.current.position.y = Math.sin(t.current * 0.45) * 0.2;
  });

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial color={CHROME} metalness={1} roughness={0.04} envMapIntensity={2} />
    </mesh>
  );
}

function CDDisc() {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (!ref.current) return;
    ref.current.rotation.z += dt * 0.45;
    ref.current.rotation.x = Math.PI / 2.6 + Math.sin(t.current * 0.28) * 0.14;
    ref.current.position.x = 2.3 + Math.sin(t.current * 0.38) * 0.28;
    ref.current.position.y = 0.9 + Math.cos(t.current * 0.32) * 0.18;
  });

  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 0.04, 64]} />
        <meshStandardMaterial color="#d8e8ff" metalness={1} roughness={0.02} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 32]} />
        <meshStandardMaterial color={CHROME} metalness={1} roughness={0.05} />
      </mesh>
    </group>
  );
}

function HoloRings() {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.32;
    ref.current.rotation.x = Math.PI / 5 + Math.sin(t.current * 0.18) * 0.1;
  });

  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[1.92, 0.016, 8, 120]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} metalness={1} roughness={0} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.15, 0.011, 8, 120]} />
        <meshStandardMaterial color={PINK} emissive={PINK} emissiveIntensity={1.3} metalness={1} roughness={0} />
      </mesh>
      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <torusGeometry args={[2.4, 0.009, 8, 120]} />
        <meshStandardMaterial color={LAVEND} emissive={LAVEND} emissiveIntensity={0.9} metalness={1} roughness={0} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function FloatingCharms() {
  const charms = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return {
        x: Math.cos(angle) * (3.2 + (i % 3) * 0.4),
        y: Math.sin(angle) * 1.8 - 0.3,
        z: Math.sin(angle * 1.3) * 1.5,
        color: [PINK, CYAN, LAVEND, WHITE, PINK, CYAN, LAVEND, WHITE][i],
        speed: 0.45 + i * 0.12,
        scale: 0.14 + (i % 3) * 0.09,
      };
    })
  , []);

  return (
    <>
      {charms.map((c, i) => (
        <Float key={i} floatIntensity={0.9} rotationIntensity={1.3} speed={c.speed}>
          <mesh position={[c.x, c.y, c.z]} scale={c.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.7} metalness={0.9} roughness={0.1} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Sparkles({ count = 200 }: { count?: number }) {
  const pts = useRef<THREE.Points>(null);
  const t = useRef(0);

  const { positions, phases, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const colors    = new Float32Array(count * 3);
    const palette   = [new THREE.Color(CYAN), new THREE.Color(PINK), new THREE.Color(LAVEND), new THREE.Color(WHITE)];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3 + Math.random() * 3.5;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i * 3 + 2] = r * Math.cos(phi);
      phases[i]   = Math.random() * Math.PI * 2;
      const c     = palette[i % 4];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, phases, colors };
  }, [count]);

  useFrame((_, dt) => {
    t.current += dt * 0.4;
    if (!pts.current) return;
    const arr = pts.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t.current + phases[i]) * 0.003;
    }
    pts.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.048} vertexColors transparent opacity={0.88} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={["#080014"]} />
      <fog attach="fog" args={["#080014", 12, 25]} />

      <ambientLight intensity={0.14} color="#a0b0ff" />
      <pointLight position={[3, 3, 4]}   intensity={3}   color={CYAN}   distance={18} />
      <pointLight position={[-3, -2, 3]} intensity={2.5} color={PINK}   distance={16} />
      <pointLight position={[0, 4, -2]}  intensity={1.5} color={LAVEND} distance={14} />
      <pointLight position={[1, -3, 5]}  intensity={1.2} color={WHITE}  distance={12} />

      <ChromeSphere />
      <HoloRings />
      <CDDisc />
      <FloatingCharms />
      <Sparkles count={200} />
    </>
  );
}

export default function LumiCanvas() {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.3, 7], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
