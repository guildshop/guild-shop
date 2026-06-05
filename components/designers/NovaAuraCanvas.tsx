"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function NeonRings() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x += (mouse.current.y * 0.3 - groupRef.current.rotation.x) * 0.03;
    groupRef.current.position.x += (mouse.current.x * 1.5 - groupRef.current.position.x) * 0.04;
  });

  const cyanMat = new THREE.MeshStandardMaterial({
    color: "#00f0ff",
    emissive: "#00f0ff",
    emissiveIntensity: 2,
    metalness: 1,
    roughness: 0,
  });

  const magentaMat = new THREE.MeshStandardMaterial({
    color: "#ff00aa",
    emissive: "#ff00aa",
    emissiveIntensity: 2,
    metalness: 1,
    roughness: 0,
  });

  const rings = [
    { pos: [0, 0, 0] as [number, number, number], rot: [Math.PI / 4, 0, 0] as [number, number, number], scale: 2.5, mat: cyanMat },
    { pos: [0, 0, 0] as [number, number, number], rot: [0, Math.PI / 4, Math.PI / 6] as [number, number, number], scale: 2.5, mat: magentaMat },
    { pos: [0, 0, 0] as [number, number, number], rot: [Math.PI / 2, Math.PI / 3, 0] as [number, number, number], scale: 2.5, mat: cyanMat },
    { pos: [3, 1, -3] as [number, number, number], rot: [0.5, 0.5, 0] as [number, number, number], scale: 0.8, mat: cyanMat },
    { pos: [-3, -1, -2] as [number, number, number], rot: [1, -0.5, 0.3] as [number, number, number], scale: 0.6, mat: magentaMat },
  ];

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.pos} rotation={ring.rot} scale={ring.scale}>
          <torusGeometry args={[1, 0.015, 8, 100]} />
          <primitive object={ring.mat} />
        </mesh>
      ))}
      {/* Central sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#e0e8ff"
          emissive="#00f0ff"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 5]} intensity={2} color="#00f0ff" distance={20} />
      <pointLight position={[3, -3, 2]} intensity={1.5} color="#ff00aa" distance={15} />
      <pointLight position={[-3, 3, 2]} intensity={1} color="#00f0ff" distance={15} />
      <NeonRings />
    </>
  );
}

export default function NovaAuraCanvas() {
  return (
    <div className="canvas-container" style={{ opacity: 0.7 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
