"use client";

/**
 * BlackHoleCanvas — a cinematic, Interstellar-grade singularity rendered on a
 * single <canvas> for 60fps performance.
 *
 * It runs a self-timed cinematic sequence:
 *   IMPLODE  (0 – 1300ms)  singularity forms, accretion disk spins up, the UI
 *                          disintegrates into particles that spiral inward,
 *                          accelerating + stretching toward the event horizon.
 *   COVER    (at 1300ms)   onCover() fires → the parent swaps the route while
 *                          the screen is fully black.
 *   BLACK    (1300–1650ms) brief absolute darkness with a pulsing core.
 *   EMERGE   (1650–2650ms) starfield blooms, darkness lifts, the new world
 *                          materializes (the parent scales the page back in).
 *   DONE     (at 2650ms)   onComplete() fires → parent unmounts this canvas.
 *
 * Particles are seeded from the bounding boxes + colours of the real on-screen
 * elements, so the interface itself appears to shatter and fall into the hole.
 */

import { useEffect, useRef } from "react";

// ── Timeline (ms) ───────────────────────────────────────────────────
const IMPLODE = 1300;
const BLACK_START = IMPLODE;
const EMERGE_START = 1650;
const DONE = 2650;

type Origin = { x: number; y: number };

interface Particle {
  ox: number; oy: number;        // origin (singularity)
  angle: number;                 // polar angle around the hole
  radius: number;                // distance from the hole
  spin: number;                  // angular velocity
  inward: number;                // inward velocity factor
  size: number;
  r: number; g: number; b: number;
  px: number; py: number;        // previous position (for motion-trail streak)
  alive: boolean;
}

interface Star {
  x: number; y: number; size: number; tw: number; phase: number;
}

function parseColor(str: string): { r: number; g: number; b: number; a: number } {
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) return { r: 255, g: 255, b: 255, a: 1 };
  const parts = m[1].split(",").map((s) => parseFloat(s));
  return { r: parts[0] || 0, g: parts[1] || 0, b: parts[2] || 0, a: parts[3] ?? 1 };
}

export function BlackHoleCanvas({
  origin,
  onCover,
  onComplete,
}: {
  origin: Origin;
  onCover: () => void;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coveredRef = useRef(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const ox = origin.x;
    const oy = origin.y;

    // ── Seed particles from real on-screen elements ──────────────────
    const particles: Particle[] = [];
    const PALETTE = [
      [255, 255, 255],
      [154, 123, 255], // violet
      [255, 217, 160], // hot accretion
      [255, 106, 61],  // ember
    ];
    const pushParticle = (x: number, y: number, col: [number, number, number]) => {
      const dx = x - ox;
      const dy = y - oy;
      const radius = Math.hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx);
      particles.push({
        ox, oy, angle, radius,
        spin: 0.6 + Math.random() * 1.4,
        inward: 0.6 + Math.random() * 0.7,
        size: 1.2 + Math.random() * 2.6,
        r: col[0], g: col[1], b: col[2],
        px: x, py: y, alive: true,
      });
    };

    try {
      const els = Array.from(
        document.querySelectorAll("a, button, h1, h2, h3, p, img, span, svg, [class*='grid'] > *")
      ).slice(0, 90);
      for (const el of els) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        if (rect.bottom < 0 || rect.top > H || rect.right < 0 || rect.left > W) continue;
        const cs = getComputedStyle(el as HTMLElement);
        let col = parseColor(cs.backgroundColor);
        if (col.a < 0.1) col = parseColor(cs.color);
        const rgb: [number, number, number] =
          col.a < 0.1 ? [230, 230, 230] : [col.r, col.g, col.b];
        const count = Math.min(10, Math.max(2, Math.floor((rect.width * rect.height) / 9000)));
        for (let i = 0; i < count; i++) {
          pushParticle(
            rect.left + Math.random() * rect.width,
            rect.top + Math.random() * rect.height,
            rgb
          );
        }
      }
    } catch {
      /* sampling is best-effort */
    }

    // Ambient cosmic dust so the field always feels full
    for (let i = 0; i < 180; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 80 + Math.random() * Math.hypot(W, H) * 0.6;
      pushParticle(
        ox + Math.cos(a) * rad,
        oy + Math.sin(a) * rad,
        PALETTE[(Math.random() * PALETTE.length) | 0] as [number, number, number]
      );
    }

    // Emerge starfield
    const stars: Star[] = Array.from({ length: 170 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.6 + 0.3,
      tw: Math.random() * 2 + 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const start = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const t = now - start;
      const dt = 1 / 60;

      ctx.clearRect(0, 0, W, H);

      // Blackout envelope: stays clear early (so the warping page shows
      // through), ramps to full black as the page collapses, holds, then
      // lifts during emerge.
      let blackAlpha = 0;
      if (t < 900) blackAlpha = 0;
      else if (t < IMPLODE) blackAlpha = (t - 900) / (IMPLODE - 900);
      else if (t < EMERGE_START) blackAlpha = 1;
      else if (t < DONE) blackAlpha = Math.max(0, 1 - (t - EMERGE_START) / 1000);
      if (blackAlpha > 0) {
        ctx.fillStyle = `rgba(0,0,0,${blackAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      const implodeP = Math.min(1, t / IMPLODE); // 0..1

      // ── IMPLODE phase visuals ──────────────────────────────────────
      if (t < IMPLODE) {
        // Accretion disk — rotating, perspective-squashed glowing rings
        const diskAngle = t * 0.004;
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(diskAngle);
        ctx.scale(1, 0.34);
        ctx.globalCompositeOperation = "lighter";
        const diskColors = ["#ffd9a0", "#9a7bff", "#ff6a3d", "#ffffff"];
        for (let i = 0; i < 5; i++) {
          const rr = (40 + i * 26) * (0.4 + implodeP * 1.4);
          ctx.beginPath();
          ctx.arc(0, 0, rr, 0, Math.PI * 2);
          ctx.strokeStyle = diskColors[i % diskColors.length];
          ctx.globalAlpha = 0.10 + 0.10 * Math.sin(t * 0.01 + i);
          ctx.lineWidth = 6 + i * 2;
          ctx.stroke();
        }
        ctx.restore();

        // Gravitational-lensing ring with chromatic aberration (RGB split)
        const ringR = 30 + implodeP * 90;
        ctx.globalCompositeOperation = "lighter";
        const channels: Array<[string, number, number]> = [
          ["rgba(255,40,40,0.5)", -2.5, 0],
          ["rgba(40,255,120,0.5)", 0, 0],
          ["rgba(80,120,255,0.5)", 2.5, 0],
        ];
        for (const [col, dx, dy] of channels) {
          ctx.beginPath();
          ctx.arc(ox + dx, oy + dy, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = col;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Particles — spiral inward, accelerating, leaving motion-trail streaks
        ctx.globalCompositeOperation = "lighter";
        for (const p of particles) {
          if (!p.alive) continue;
          // Keplerian-ish: faster swirl + faster pull the closer it gets
          const pull = p.inward * (1 + 90 / p.radius) * dt * 2.4;
          p.radius -= p.radius * pull * 0.5 + 1.5;
          p.angle += p.spin * dt * (1 + 60 / Math.max(p.radius, 8));
          const nx = ox + Math.cos(p.angle) * p.radius;
          const ny = oy + Math.sin(p.angle) * p.radius;

          // stretch streak from previous → current (gravitational shear)
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},0.9)`;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(nx, ny);
          ctx.stroke();

          p.px = nx;
          p.py = ny;
          if (p.radius < 14) {
            p.size *= 0.9;
            if (p.size < 0.4) p.alive = false;
          }
        }

        // Event horizon — growing black core with a bright photon ring
        const coreR = 6 + implodeP * implodeP * 64;
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.arc(ox, oy, coreR, 0, Math.PI * 2);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.globalCompositeOperation = "lighter";
        const ph = ctx.createRadialGradient(ox, oy, coreR * 0.7, ox, oy, coreR * 1.5);
        ph.addColorStop(0, "rgba(255,235,200,0.9)");
        ph.addColorStop(1, "rgba(154,123,255,0)");
        ctx.fillStyle = ph;
        ctx.beginPath();
        ctx.arc(ox, oy, coreR * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── BLACK hold — tiny pulsing singularity ──────────────────────
      if (t >= BLACK_START && t < EMERGE_START) {
        const pulse = 4 + Math.sin(t * 0.02) * 2;
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, 60);
        g.addColorStop(0, `rgba(180,150,255,${0.5 + Math.sin(t * 0.02) * 0.2})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ox, oy, pulse, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      // ── EMERGE — starfield blooms as darkness lifts ────────────────
      if (t >= EMERGE_START) {
        const e = (t - EMERGE_START) / (DONE - EMERGE_START); // 0..1
        ctx.globalCompositeOperation = "lighter";
        // central bloom that dissipates
        const bloom = ctx.createRadialGradient(ox, oy, 0, ox, oy, 200 * (0.4 + e));
        const bloomA = Math.max(0, 0.7 - e);
        bloom.addColorStop(0, `rgba(220,210,255,${bloomA})`);
        bloom.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, W, H);
        // twinkling stars fade in then out
        const starA = Math.min(1, e * 2.2) * Math.max(0, 1 - (e - 0.5) * 2);
        for (const s of stars) {
          const tw = 0.5 + 0.5 * Math.sin(t * 0.005 * s.tw + s.phase);
          ctx.globalAlpha = starA * tw;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // ── Fire lifecycle callbacks ───────────────────────────────────
      if (!coveredRef.current && t >= IMPLODE) {
        coveredRef.current = true;
        onCover();
      }
      if (!doneRef.current && t >= DONE) {
        doneRef.current = true;
        onComplete();
        return; // stop the loop
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[10000] pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden
    />
  );
}
