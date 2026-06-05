"use client";

/**
 * HeroCanvas — Guild Shop "Thermal Heat Globe" (cursor-cooled)
 *
 * A sphere rendered with a custom GLSL shader painting a thermal Earth
 * (red/orange dominant, blue cool bands, yellow hotspots). Wherever the
 * cursor moves over the globe, a localized cool spot blooms on the
 * surface — animated blue↔green tones — like cold water poured on hot
 * metal. The spot follows the cursor smoothly and fades when the
 * cursor leaves.
 *
 * Pointer tracking: `onPointerMove` provides the world hit point; we
 * convert to mesh-local space and lerp a uniform `uHitPos`. The
 * fragment shader uses 3D distance from each fragment to that point
 * to blend in an animated cool color.
 */

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

// ── Mouse-reactive camera (subtle parallax only) ──────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse  = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x * 0.18 - target.current.x) * 0.05;
    target.current.y += (mouse.current.y * 0.10 - target.current.y) * 0.05;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.position.z = 5.0;
    // Look at world origin — globe is at +x, so it renders on the right
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Shaders ───────────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

// Thermal shader with cursor-driven cool spot (blue + green)
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uCool;     // 0..1 — overall cool intensity (hover)
  uniform vec3  uHitPos;   // local-space hit point on the sphere surface

  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  // ── Simplex 3D noise (Stefan Gustavson / Ashima Arts, public domain) ─
  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // FBM
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // Thermal palette: deep blue → cyan → red → orange → yellow-white
  vec3 thermal(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 col;
    if (t < 0.14) {
      col = mix(vec3(0.02, 0.04, 0.18), vec3(0.10, 0.30, 0.85), t / 0.14);
    } else if (t < 0.26) {
      col = mix(vec3(0.10, 0.30, 0.85), vec3(0.55, 0.05, 0.08), (t - 0.14) / 0.12);
    } else if (t < 0.48) {
      col = mix(vec3(0.55, 0.05, 0.08), vec3(0.92, 0.14, 0.05), (t - 0.26) / 0.22);
    } else if (t < 0.78) {
      col = mix(vec3(0.92, 0.14, 0.05), vec3(1.0, 0.50, 0.05), (t - 0.48) / 0.30);
    } else {
      col = mix(vec3(1.0, 0.50, 0.05), vec3(1.0, 0.95, 0.55), (t - 0.78) / 0.22);
    }
    return col;
  }

  void main() {
    // ── 1. Fluid-flow thermal pattern ──────────────────────────
    // Two-stage advection through a time-varying velocity field.
    // Patterns follow streamlines that themselves curl and reorganize
    // over time, producing genuine fluid-like motion (rather than
    // mere translation).
    float tt = uTime;
    vec3 p = normalize(vPos) * 2.4;

    // ── Stage 1: large-scale slow velocity field ───────────────
    // Each component of the velocity vector is its OWN animated FBM,
    // so the entire flow field morphs continuously — streamlines
    // curl and break apart.
    vec3 vel1 = vec3(
      fbm(p * 0.55 + vec3(0.0,  tt * 0.08, 0.0)),
      fbm(p * 0.55 + vec3(5.2,  1.3,  tt * 0.07)),
      fbm(p * 0.55 + vec3(2.5,  tt * 0.06, 1.8))
    );

    // Advect the sample position by the flow
    vec3 p1 = p + vel1 * (1.4 + uCool * 0.4);

    // ── Stage 2: finer, faster velocity field at advected position ─
    // Second pass adds smaller eddies — "currents within currents".
    vec3 vel2 = vec3(
      fbm(p1 * 1.3 + vec3(tt * 0.18, 0.0, 0.0)),
      fbm(p1 * 1.3 + vec3(0.0, tt * 0.16, 0.0)),
      fbm(p1 * 1.3 + vec3(0.0, 0.0, tt * 0.20))
    );

    vec3 p2 = p1 + vel2 * 0.7;

    // ── Stage 3: final noise sample at twice-advected position ─
    // Mix two offset samples slightly apart in time for extra fluidity
    float nA = fbm(p2);
    float nB = fbm(p2 + vec3(0.0, tt * 0.04, tt * 0.03));
    float n  = mix(nA, nB, 0.5);
    n = n * 0.5 + 0.5;

    // Bias toward red/orange; lift hot mask
    float t = pow(n, 0.85);
    float hotMask = smoothstep(0.62, 0.78, n);
    t += hotMask * 0.10;

    vec3 col = thermal(t);

    // ── 2. Cursor cool spot — blue + green bloom on the surface ─
    if (uCool > 0.001) {
      // 3D distance from each fragment to the hit point (both in object space)
      float d = distance(vPos, uHitPos);

      // Soft radial mask — fades from full at hit to 0 at radius ~0.7
      float mask = smoothstep(0.7, 0.0, d) * uCool;

      // Animated cool color: oscillate between cyan-blue and green over distance + time
      float swirl = 0.5 + 0.5 * sin(uTime * 1.6 + d * 14.0);
      vec3 coolBlue  = vec3(0.08, 0.55, 1.00);
      vec3 coolGreen = vec3(0.15, 0.95, 0.50);
      vec3 coolWhite = vec3(0.85, 1.00, 0.95);
      vec3 coolCol = mix(coolBlue, coolGreen, swirl);

      // Bright cyan-white core right at the cursor
      float core = smoothstep(0.18, 0.0, d) * uCool;
      coolCol = mix(coolCol, coolWhite, core * 0.6);

      // Wavy "ripple" lines moving outward from cursor — heat-leaching pattern
      float ripple = sin(d * 30.0 - uTime * 4.0);
      ripple = smoothstep(0.0, 1.0, ripple);
      coolCol *= 0.85 + ripple * 0.25;

      // Blend cool over the thermal base
      col = mix(col, coolCol, mask * 0.92);
    }

    // ── 3. Spherical shading — rim darkening for depth ──────────
    float NdotV = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
    float depth = pow(NdotV, 0.55);
    col *= 0.55 + depth * 0.6;
    col = pow(col, vec3(0.92));

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ── Thermal Globe mesh ────────────────────────────────────────────────────────
const GLOBE_RADIUS = 1.05;

function ThermalGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const cool = useRef(0);

  // Hit-point tracking — local-space position the cursor last touched
  // Defaults to off-globe so no cool spot shows when unhovered.
  const hitTarget  = useRef(new THREE.Vector3(99, 99, 99));
  const hitCurrent = useRef(new THREE.Vector3(99, 99, 99));

  // Hide cursor while hovering the globe
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.cursor = hovered ? "none" : "";
    }
    return () => {
      if (typeof document !== "undefined") document.body.style.cursor = "";
    };
  }, [hovered]);

  const uniforms = useMemo(
    () => ({
      uTime:   { value: 0 },
      uCool:   { value: 0 },
      uHitPos: { value: new THREE.Vector3(99, 99, 99) },
    }),
    []
  );

  useFrame((_, delta) => {
    const target = hovered ? 1 : 0;
    cool.current += (target - cool.current) * Math.min(1, delta * 5);

    uniforms.uTime.value += delta;
    uniforms.uCool.value = cool.current;

    // Smoothly chase the cursor (cool spot eases toward the cursor)
    hitCurrent.current.lerp(hitTarget.current, Math.min(1, delta * 10));
    uniforms.uHitPos.value.copy(hitCurrent.current);

    // Slow idle rotation — patterns drift across the surface
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.03;
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!meshRef.current) return;
    // Convert the world hit point into the mesh's local space.
    // Using local space means the cool spot "sticks" to the surface even
    // as the sphere slowly rotates — like a cold mark on hot metal.
    const local = meshRef.current.worldToLocal(e.point.clone());
    hitTarget.current.copy(local);
  };

  return (
    <mesh
      ref={meshRef}
      position={[1.8, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        // Snap the current hit point so the spot doesn't lerp in from afar
        if (meshRef.current) {
          const local = meshRef.current.worldToLocal(e.point.clone());
          hitTarget.current.copy(local);
          hitCurrent.current.copy(local);
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={["#000000"]} />
      <ThermalGlobe />
    </>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────────
export default function HeroCanvas(_props: { isDark: boolean }) {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "auto" }}>
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 48 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.8]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
