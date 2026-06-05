"use client";

/**
 * SurrealCanvas — A library of surrealist 3D scenes, all built with
 * the strict four-color palette (black, red, maroon, green).
 *
 * Each variant composes a different set of objects evoking Dalí
 * and Magritte: tracking eye, melting clock, floating doors, levitating
 * apple, bowler hat, key in the void, displaced hand.
 *
 * Pass `variant` to choose the scene; all share gentle zero-G drift
 * and parallax-tracked camera.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ── Palette (strict) ──────────────────────────────────────────────────────────
const BLACK  = "#000000";
const RED    = "#ff1f2e";
const MAROON = "#5c0a14";
const GREEN  = "#2d8f3f";

export type SurrealVariant =
  | "eye"        // Hero — eye, clock, apple, door
  | "doors"      // Designers — three floating doorways
  | "apple"      // About — floating apple + bowler hat
  | "key"        // Login — single key in void
  | "envelope"   // Contact — letter + melted seal
  | "hand"       // Join — outstretched hand reaching upward
  | "still";     // Footer — minimal stilllife

// ── Mouse-reactive camera ─────────────────────────────────────────────────────
function CameraRig({ trackingTargetRef }: { trackingTargetRef?: React.MutableRefObject<THREE.Vector3> }) {
  const { camera } = useThree();
  const mouse  = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      if (trackingTargetRef) {
        // Store the world-space mouse projection for the eye to look at
        trackingTargetRef.current.set(mouse.current.x * 6, mouse.current.y * 4, 4);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [trackingTargetRef]);

  useFrame(() => {
    target.current.x += (mouse.current.x * 0.5 - target.current.x) * 0.04;
    target.current.y += (mouse.current.y * 0.3 - target.current.y) * 0.04;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── The Eye (Dalí) ────────────────────────────────────────────────────────────
function SurrealEye({
  position = [0, 0, 0],
  scale = 1,
  trackingTargetRef,
}: {
  position?: [number, number, number];
  scale?: number;
  trackingTargetRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const eyeRef = useRef<THREE.Group>(null);
  const irisGroupRef = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (eyeRef.current) {
      // Whole eye gently drifts and breathes
      eyeRef.current.position.y = position[1] + Math.sin(t.current * 0.4) * 0.08;
      eyeRef.current.rotation.z = Math.sin(t.current * 0.2) * 0.04;
    }
    if (irisGroupRef.current) {
      // Iris+pupil look toward the cursor — limited rotation so it stays in the eye
      const tgt = trackingTargetRef.current;
      const dx = THREE.MathUtils.clamp(tgt.x * 0.05, -0.45, 0.45);
      const dy = THREE.MathUtils.clamp(tgt.y * 0.04, -0.3, 0.3);
      irisGroupRef.current.rotation.y += (dx - irisGroupRef.current.rotation.y) * 0.08;
      irisGroupRef.current.rotation.x += (-dy - irisGroupRef.current.rotation.x) * 0.08;
    }
  });

  return (
    <group ref={eyeRef} position={position} scale={scale}>
      {/* Sclera — maroon sphere with subtle roughness */}
      <mesh>
        <sphereGeometry args={[1.6, 96, 96]} />
        <meshStandardMaterial color={MAROON} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* Subtle red veining (a thin torus wrapping the eye) */}
      <mesh rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.62, 0.012, 8, 100]} />
        <meshBasicMaterial color={RED} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-0.2, 0.7, 0.3]}>
        <torusGeometry args={[1.61, 0.008, 8, 100]} />
        <meshBasicMaterial color={RED} transparent opacity={0.3} />
      </mesh>

      {/* Iris + pupil — rotates as a unit to "look" at the cursor */}
      <group ref={irisGroupRef}>
        {/* Iris — bright green */}
        <mesh position={[0, 0, 1.3]}>
          <sphereGeometry args={[0.62, 64, 64]} />
          <meshStandardMaterial
            color={GREEN}
            emissive={GREEN}
            emissiveIntensity={0.35}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        {/* Iris ring detail — thin red circle */}
        <mesh position={[0, 0, 1.55]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.018, 8, 64]} />
          <meshBasicMaterial color={RED} />
        </mesh>
        {/* Pupil — pure black sphere */}
        <mesh position={[0, 0, 1.78]}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshBasicMaterial color={BLACK} />
        </mesh>
        {/* Glint — small red highlight */}
        <mesh position={[-0.12, 0.13, 1.96]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={RED} />
        </mesh>
      </group>

      {/* Eye light — red glow from above */}
      <pointLight position={[0, 2, 2]} color={RED}   intensity={1.4} distance={6} />
      <pointLight position={[-2, -1, 2]} color={GREEN} intensity={0.8} distance={5} />
    </group>
  );
}

// ── Melting Clock (Dalí) ──────────────────────────────────────────────────────
function MeltingClock({
  position,
  scale = 1,
  color = RED,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.PI / 5 + Math.sin(t.current * 0.3) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(t.current * 0.5) * 0.15;
    }
  });

  return (
    <Float floatIntensity={0.5} rotationIntensity={0.2} speed={1.2}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Squashed disc face — the "melting" look */}
        <mesh scale={[1, 0.35, 1]} rotation={[Math.PI / 2.5, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.08, 64]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Edge ring */}
        <mesh scale={[1, 0.35, 1]} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 8, 64]} />
          <meshStandardMaterial color={MAROON} roughness={0.7} />
        </mesh>
        {/* Hour hand */}
        <mesh position={[0.18, 0.05, 0.05]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.45, 0.025, 0.02]} />
          <meshStandardMaterial color={BLACK} />
        </mesh>
        {/* Minute hand */}
        <mesh position={[0.05, 0.22, 0.06]} rotation={[0, 0, Math.PI / 3]}>
          <boxGeometry args={[0.6, 0.018, 0.02]} />
          <meshStandardMaterial color={BLACK} />
        </mesh>
        {/* Center pin */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={GREEN} />
        </mesh>
        {/* Drip — a tail melting downward */}
        <mesh position={[0.3, -0.5, 0.02]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.08, 0.7, 8]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Floating Apple (Magritte) ─────────────────────────────────────────────────
function MagritteApple({
  position,
  scale = 1,
  color = GREEN,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  return (
    <Float floatIntensity={0.6} rotationIntensity={0.4} speed={1.5}>
      <group position={position} scale={scale}>
        {/* Body — slightly squashed sphere */}
        <mesh scale={[1, 0.95, 1]}>
          <sphereGeometry args={[0.42, 48, 48]} />
          <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.18, 8]} />
          <meshStandardMaterial color={MAROON} roughness={0.8} />
        </mesh>
        {/* Leaf */}
        <mesh position={[0.08, 0.5, 0]} rotation={[0, 0, 0.5]} scale={[0.4, 0.18, 0.05]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color={GREEN} roughness={0.7} />
        </mesh>
        {/* Highlight glint */}
        <mesh position={[-0.18, 0.18, 0.36]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color={RED} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Floating Doorway (Magritte) ───────────────────────────────────────────────
function FloatingDoor({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  color = RED,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}) {
  return (
    <Float floatIntensity={0.35} rotationIntensity={0.15} speed={0.9}>
      <group position={position} rotation={rotation} scale={scale}>
        {/* Frame top */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1.2, 0.08, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* Left jamb */}
        <mesh position={[-0.55, 0, 0]}>
          <boxGeometry args={[0.08, 2.4, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* Right jamb */}
        <mesh position={[0.55, 0, 0]}>
          <boxGeometry args={[0.08, 2.4, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* Threshold */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[1.2, 0.08, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* The void within — a black plane */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.02, 2.32]} />
          <meshBasicMaterial color={BLACK} />
        </mesh>
        {/* Tiny green light inside — a hint of another world */}
        <pointLight position={[0, 0, -0.05]} color={GREEN} intensity={1.0} distance={1.4} />
      </group>
    </Float>
  );
}

// ── Bowler Hat (Magritte's Son of Man) ────────────────────────────────────────
function BowlerHat({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <Float floatIntensity={0.5} rotationIntensity={0.3} speed={1.1}>
      <group position={position} scale={scale}>
        {/* Brim */}
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.04, 48]} />
          <meshStandardMaterial color={BLACK} roughness={0.45} metalness={0.05} />
        </mesh>
        {/* Crown */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.42, 0.5, 0.55, 48]} />
          <meshStandardMaterial color={BLACK} roughness={0.45} metalness={0.05} />
        </mesh>
        {/* Crown top dome */}
        <mesh position={[0, 0.45, 0]} scale={[1, 0.6, 1]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color={BLACK} roughness={0.45} metalness={0.05} />
        </mesh>
        {/* Hat band — a red ring */}
        <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.018, 8, 48]} />
          <meshBasicMaterial color={RED} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Key in the Void ───────────────────────────────────────────────────────────
function SurrealKey({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.4;
      ref.current.rotation.x = Math.sin(ref.current.rotation.y * 0.3) * 0.2;
    }
  });
  return (
    <Float floatIntensity={0.5} rotationIntensity={0} speed={1.2}>
      <group ref={ref} position={position} scale={scale}>
        {/* Bow (the ring) */}
        <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.06, 16, 48]} />
          <meshStandardMaterial color={RED} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Shaft */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1.6, 16]} />
          <meshStandardMaterial color={RED} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Bit — the tooth */}
        <mesh position={[0.18, -0.65, 0]}>
          <boxGeometry args={[0.32, 0.16, 0.1]} />
          <meshStandardMaterial color={RED} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0.18, -0.86, 0]}>
          <boxGeometry args={[0.22, 0.12, 0.1]} />
          <meshStandardMaterial color={RED} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Envelope with melted wax seal ─────────────────────────────────────────────
function SurrealEnvelope({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <Float floatIntensity={0.5} rotationIntensity={0.25} speed={1.1}>
      <group position={position} scale={scale} rotation={[0.2, 0.4, -0.1]}>
        {/* Envelope body */}
        <mesh>
          <boxGeometry args={[2, 1.2, 0.06]} />
          <meshStandardMaterial color={MAROON} roughness={0.7} />
        </mesh>
        {/* Flap (diagonal seam from center) */}
        <mesh position={[0, 0, 0.035]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[1.05, 0.6, 4]} />
          <meshStandardMaterial color={BLACK} roughness={0.6} />
        </mesh>
        {/* Wax seal — drip in red */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={RED} roughness={0.4} metalness={0.4} />
        </mesh>
        {/* Drip from seal */}
        <mesh position={[0, -0.22, 0.07]}>
          <coneGeometry args={[0.06, 0.25, 8]} />
          <meshStandardMaterial color={RED} roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Outstretched Hand (just a stylized form — pillar with palm/fingers) ───────
function SurrealHand({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <Float floatIntensity={0.4} rotationIntensity={0.15} speed={1.0}>
      <group position={position} scale={scale}>
        {/* Wrist */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.7, 16]} />
          <meshStandardMaterial color={MAROON} roughness={0.7} />
        </mesh>
        {/* Palm */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.7, 0.18]} />
          <meshStandardMaterial color={MAROON} roughness={0.7} />
        </mesh>
        {/* Fingers — 4 cylinders */}
        {[-0.21, -0.07, 0.07, 0.21].map((x, i) => (
          <mesh key={i} position={[x, 0.55, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.5, 12]} />
            <meshStandardMaterial color={MAROON} roughness={0.7} />
          </mesh>
        ))}
        {/* Thumb */}
        <mesh position={[0.32, 0.1, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
          <meshStandardMaterial color={MAROON} roughness={0.7} />
        </mesh>
        {/* Floating red apple held above */}
        <Float floatIntensity={0.3} rotationIntensity={0.3} speed={1.4}>
          <mesh position={[0, 1.3, 0]}>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial color={RED} roughness={0.5} metalness={0.2} />
          </mesh>
        </Float>
      </group>
    </Float>
  );
}

// ── Floating particles — small red/green dust ─────────────────────────────────
function DriftDust({ count = 80 }: { count?: number }) {
  const pts = useRef<THREE.Points>(null);
  const { positions, colors, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const cR = new THREE.Color(RED);
    const cG = new THREE.Color(GREEN);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
      phases[i] = Math.random() * Math.PI * 2;
      const c = Math.random() < 0.6 ? cR : cG;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, phases };
  }, [count]);

  useFrame((_, dt) => {
    if (!pts.current) return;
    const arr = pts.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.003 + Math.sin(phases[i]) * 0.001;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
    }
    pts.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.7}
        vertexColors
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Surreal horizon — a thin red bar far away ─────────────────────────────────
function HorizonLine() {
  return (
    <mesh position={[0, -2.6, -3]}>
      <boxGeometry args={[28, 0.03, 0.01]} />
      <meshBasicMaterial color={RED} />
    </mesh>
  );
}

// ── Scene compositions ───────────────────────────────────────────────────────
function SceneEye({ trackingTargetRef }: { trackingTargetRef: React.MutableRefObject<THREE.Vector3> }) {
  return (
    <>
      <SurrealEye position={[0, 0.1, 0]} scale={1.0} trackingTargetRef={trackingTargetRef} />
      <MeltingClock position={[-3.2, 1.5, -1]} scale={0.85} color={RED} />
      <MagritteApple position={[3.0, -1.4, -1]} scale={1.0} color={GREEN} />
      <FloatingDoor position={[3.4, 1.3, -3]} rotation={[0, -0.4, 0.05]} scale={0.55} color={RED} />
      <MagritteApple position={[-2.8, -1.8, -2]} scale={0.55} color={RED} />
      <HorizonLine />
      <DriftDust count={70} />
    </>
  );
}

function SceneDoors({ trackingTargetRef }: { trackingTargetRef: React.MutableRefObject<THREE.Vector3> }) {
  return (
    <>
      <FloatingDoor position={[-2.8, 0,  -1]} rotation={[0, 0.5, 0]}   scale={1.0} color={RED} />
      <FloatingDoor position={[ 0,   0.2, 0]} rotation={[0, 0, 0]}     scale={1.2} color={GREEN} />
      <FloatingDoor position={[ 2.8, 0,  -1]} rotation={[0, -0.5, 0]}  scale={1.0} color={RED} />
      <MagritteApple position={[-3.5, 1.6, 0]} scale={0.5} color={GREEN} />
      <MeltingClock position={[3.0, 1.8, -1.5]} scale={0.6} />
      <HorizonLine />
      <DriftDust count={90} />
    </>
  );
}

function SceneApple({ trackingTargetRef }: { trackingTargetRef: React.MutableRefObject<THREE.Vector3> }) {
  return (
    <>
      <BowlerHat position={[0, 1.2, 0]} scale={1.4} />
      <MagritteApple position={[0, -0.4, 0.5]} scale={1.3} color={GREEN} />
      <MeltingClock position={[-3.5, -0.8, -1]} scale={0.7} />
      <MagritteApple position={[3.0, 1.6, -1.2]} scale={0.55} color={RED} />
      <HorizonLine />
      <DriftDust count={60} />
    </>
  );
}

function SceneKey() {
  return (
    <>
      <SurrealKey position={[0, 0, 0]} scale={1.4} />
      <MagritteApple position={[-2.8, 1.2, -1]} scale={0.5} color={GREEN} />
      <MagritteApple position={[2.6, -1.2, -1]} scale={0.5} color={RED} />
      <HorizonLine />
      <DriftDust count={60} />
    </>
  );
}

function SceneEnvelope() {
  return (
    <>
      <SurrealEnvelope position={[0, 0, 0]} scale={1.3} />
      <MagritteApple position={[-3.2, 1.5, -1]} scale={0.5} color={RED} />
      <MeltingClock position={[3.0, -1.4, -1]} scale={0.6} color={GREEN} />
      <HorizonLine />
      <DriftDust count={60} />
    </>
  );
}

function SceneHand() {
  return (
    <>
      <SurrealHand position={[0, -0.3, 0]} scale={1.4} />
      <MagritteApple position={[-3.0, 1.3, -1]} scale={0.55} color={GREEN} />
      <FloatingDoor position={[3.0, 0.4, -2]} rotation={[0, -0.4, 0]} scale={0.65} color={RED} />
      <HorizonLine />
      <DriftDust count={60} />
    </>
  );
}

function SceneStill() {
  return (
    <>
      <BowlerHat position={[-1.2, 0, 0]} scale={0.7} />
      <MagritteApple position={[1.2, 0, 0]} scale={0.7} color={GREEN} />
      <DriftDust count={40} />
    </>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────────
export default function SurrealCanvas({
  variant = "eye",
  className,
}: {
  variant?: SurrealVariant;
  className?: string;
}) {
  const trackingTargetRef = useRef(new THREE.Vector3(0, 0, 4));

  return (
    <div className={`absolute inset-0 ${className ?? ""}`} style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.6]}
      >
        <CameraRig trackingTargetRef={trackingTargetRef} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} color={RED} />
        <directionalLight position={[-6, -4, -4]} intensity={0.3} color={GREEN} />

        {variant === "eye"      && <SceneEye trackingTargetRef={trackingTargetRef} />}
        {variant === "doors"    && <SceneDoors trackingTargetRef={trackingTargetRef} />}
        {variant === "apple"    && <SceneApple trackingTargetRef={trackingTargetRef} />}
        {variant === "key"      && <SceneKey />}
        {variant === "envelope" && <SceneEnvelope />}
        {variant === "hand"     && <SceneHand />}
        {variant === "still"    && <SceneStill />}
      </Canvas>
    </div>
  );
}
