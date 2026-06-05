"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const RED    = "#ff2200";
const WHITE  = "#f0f0f0";
const YELLOW = "#f5ff00";

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
    camera.position.x += (mouse.current.x * 2   - camera.position.x) * 0.03;
    camera.position.y += (mouse.current.y * 1   - camera.position.y) * 0.03;
    camera.position.z = 8;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function DeconstructedBox() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (outerRef.current) {
      outerRef.current.rotation.x += dt * 0.11;
      outerRef.current.rotation.y += dt * 0.18;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= dt * 0.21;
      innerRef.current.rotation.z += dt * 0.14;
      innerRef.current.position.y = Math.sin(t.current * 0.38) * 0.3;
    }
  });

  return (
    <>
      <mesh ref={outerRef}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshStandardMaterial color={WHITE} wireframe emissive={WHITE} emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.65} metalness={0.8} roughness={0.2} />
      </mesh>
    </>
  );
}

function FloatingPlanes() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const t = useRef(0);

  const planes = useMemo(() => [
    { pos: [-3.2,  1.6, -0.8] as [number,number,number], rot: [0.3,  0.5,  0.1] as [number,number,number], color: WHITE,  w: 1.9, h: 0.75 },
    { pos: [ 3.6, -1.1, -0.4] as [number,number,number], rot: [-0.2,-0.6,  0.3] as [number,number,number], color: RED,    w: 0.5, h: 2.3  },
    { pos: [-2.6, -2.1,  1.1] as [number,number,number], rot: [0.8,  0.2, -0.4] as [number,number,number], color: YELLOW, w: 1.3, h: 0.38 },
    { pos: [ 2.1,  2.6,  0.6] as [number,number,number], rot: [-0.5, 0.9,  0.2] as [number,number,number], color: WHITE,  w: 0.55,h: 1.7  },
    { pos: [-0.5, -3.0,  0.3] as [number,number,number], rot: [0.1, -0.3,  0.7] as [number,number,number], color: YELLOW, w: 2.8, h: 0.22 },
  ], []);

  useFrame((_, dt) => {
    t.current += dt;
    refs.current.forEach((m, i) => {
      if (!m || !planes[i]) return;
      m.rotation.z = planes[i].rot[2] + Math.sin(t.current * 0.18 + i * 0.8) * 0.15;
      m.position.y = planes[i].pos[1] + Math.sin(t.current * 0.28 + i) * 0.22;
    });
  });

  return (
    <>
      {planes.map((p, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el; }} position={p.pos} rotation={p.rot}>
          <planeGeometry args={[p.w, p.h]} />
          <meshStandardMaterial
            color={p.color} emissive={p.color} emissiveIntensity={0.22}
            side={THREE.DoubleSide} transparent opacity={0.65}
          />
        </mesh>
      ))}
    </>
  );
}

function GridPoints({ count = 220 }: { count?: number }) {
  const pts = useRef<THREE.Points>(null);
  const t = useRef(0);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const w = new THREE.Color(WHITE);
    const r = new THREE.Color(RED);
    const y = new THREE.Color(YELLOW);

    for (let i = 0; i < count; i++) {
      const col = i % 22;
      const row = Math.floor(i / 22);
      positions[i * 3]     = (col / 21 - 0.5) * 18 + (Math.random() - 0.5) * 0.35;
      positions[i * 3 + 1] = (row / 9  - 0.5) * 9  + (Math.random() - 0.5) * 0.35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 3;
      const c = i % 11 === 0 ? r : i % 7 === 0 ? y : w;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, dt) => {
    t.current += dt * 0.14;
    if (!pts.current) return;
    const arr = pts.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += Math.sin(t.current + i * 0.1) * 0.003;
    }
    pts.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.032} vertexColors transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function AvantCircle() {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (!ref.current) return;
    ref.current.rotation.z += dt * 0.048;
    ref.current.rotation.x = Math.sin(t.current * 0.11) * 0.14;
  });

  return (
    <mesh ref={ref} position={[0, 0, -2.5]}>
      <torusGeometry args={[4.8, 0.02, 8, 200]} />
      <meshStandardMaterial color={WHITE} emissive={WHITE} emissiveIntensity={0.28} transparent opacity={0.32} />
    </mesh>
  );
}

function SlashLine() {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (!ref.current) return;
    ref.current.rotation.z = 0.55 + Math.sin(t.current * 0.06) * 0.04;
    ref.current.position.x = Math.sin(t.current * 0.1) * 0.3;
  });

  return (
    <mesh ref={ref} position={[0, 0, -1.5]}>
      <boxGeometry args={[12, 0.018, 0.01]} />
      <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.5} transparent opacity={0.55} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={["#080808"]} />

      <ambientLight intensity={0.11} color="#ffffff" />
      <pointLight position={[4, 4, 5]}   intensity={3}   color={WHITE}  distance={20} />
      <pointLight position={[-3, -3, 4]} intensity={2.5} color={RED}    distance={16} />
      <pointLight position={[0, 3, 3]}   intensity={1.5} color={YELLOW} distance={14} />

      <AvantCircle />
      <SlashLine />
      <DeconstructedBox />
      <FloatingPlanes />
      <GridPoints count={220} />
    </>
  );
}

export default function OndoCanvas() {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
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
