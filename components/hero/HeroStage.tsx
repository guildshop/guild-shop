"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { designers } from "@/lib/designers";
import { useWorldTransition } from "@/components/ui/WorldTransition";

/* ── Sci-fi clips ──────────────────────────────────── */
const SCIFI_CLIPS = ["/hero-scifi-1.mp4", "/hero-scifi-3.mp4"];
const CLIP_MS = 20_000;

const HUD_LINES = [
  "GS-NET 2.4 · SIGNAL LOCKED",
  "DESIGNERS: 6 · ACTIVE FEEDS",
  "CHANNEL ENCRYPTED · SECURE",
  "UPLINK STABLE · 99.7%",
  "EMERGING TALENT · ONLINE",
];

/* ── Bento layout ──────────────────────────────────── */
const BLOCK_COLORS: Record<string, { bg: string; fg: string }> = {
  vesper:      { bg: "#0a0a0a", fg: "#ffffff" },
  "nova-aura": { bg: "#1e2d5a", fg: "#ffffff" },
  terra:       { bg: "#b84e28", fg: "#ffffff" },
  lumi:        { bg: "#3d5a28", fg: "#ffffff" },
  soleil:      { bg: "#8a1828", fg: "#ffffff" },
  ondo:        { bg: "#1a30a0", fg: "#ffffff" },
};

const PANELS: Array<{ slug: string; gc: string; gr: string; from: "left" | "right" }> = [
  { slug: "vesper",    gc: "1 / span 1", gr: "1 / span 2", from: "left"  },
  { slug: "nova-aura", gc: "2 / span 2", gr: "1 / span 1", from: "right" },
  { slug: "terra",     gc: "4 / span 1", gr: "1 / span 1", from: "right" },
  { slug: "ondo",      gc: "2 / span 2", gr: "2 / span 2", from: "left"  },
  { slug: "soleil",    gc: "4 / span 1", gr: "2 / span 2", from: "right" },
  { slug: "lumi",      gc: "1 / span 1", gr: "3 / span 1", from: "left"  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── HeroStage ─────────────────────────────────────── */
export function HeroStage() {
  const stageRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.35 });

  /* Sci-fi state — all client-only via useEffect */
  const [clip, setClip] = useState(0);
  const [fading, setFading] = useState(false);
  const nextClipRef = useRef(1);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [hudLine, setHudLine] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Play/pause videos imperatively when active clip changes
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === clip) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [clip]);

  useEffect(() => {
    const id = setInterval(() => {
      const next = nextClipRef.current;
      setFading(true);
      setTimeout(() => {
        setClip(next);
        setFading(false);
        nextClipRef.current = (next + 1) % SCIFI_CLIPS.length;
      }, 1200);
    }, CLIP_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHudLine(i => (i + 1) % HUD_LINES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={stageRef} style={{ height: "280vh", position: "relative" }}>
      {/* ── Pinned viewport ─────────────────────────── */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#000" }}>

        {/* ── Sci-fi videos ───────────────────────────── */}
        {SCIFI_CLIPS.map((src, i) => {
          const isActive = i === clip;
          const isNext = i === nextClipRef.current;
          return (
            <video
              key={src}
              ref={el => { videoRefs.current[i] = el; }}
              src={src}
              autoPlay={isActive}
              muted
              playsInline
              loop
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                filter: "brightness(0.52) contrast(1.18) saturate(1.12)",
                opacity: isActive ? (fading ? 0 : 1) : isNext && fading ? 1 : 0,
                transition: "opacity 1.2s ease",
                zIndex: fading && isNext ? 1 : 0,
              }}
            />
          );
        })}

        {/* ── Colour grade: cold blue multiply ─────────── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "rgba(4,18,65,0.30)", mixBlendMode: "multiply",
        }} />
        {/* Cyan bloom via screen */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 58% 38%, rgba(0,110,190,0.14), transparent)",
          mixBlendMode: "screen",
        }} />

        {/* ── Scanlines ───────────────────────────────── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.032) 3px, rgba(0,0,0,0.032) 4px)",
        }} />

        {/* ── Vignette ────────────────────────────────── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(0,0,0,0.45) 68%, rgba(0,0,0,0.88) 100%)",
        }} />

        {/* ── Grain ───────────────────────────────────── */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="hs-grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
              <feBlend in="SourceGraphic" in2="grey" mode="overlay" />
            </filter>
          </defs>
        </svg>
        <div style={{
          position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
          filter: "url(#hs-grain)", opacity: 0.15, background: "#fff",
        }} />

        {/* ── Sweeping scan line ──────────────────────── */}
        <div className="hs-scan-line" style={{ position: "absolute", left: 0, right: 0, zIndex: 7, pointerEvents: "none" }} />

        {/* ── Centred wordmark (covered as panels fly in) ── */}
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute", inset: 0, zIndex: 8,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              pointerEvents: "none", textAlign: "center",
              padding: "0 clamp(20px,5vw,60px)",
            }}
          >
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "clamp(9px,1vw,11px)",
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: "rgba(60,190,255,0.8)", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ display: "inline-block", width: 20, height: "1px", background: "rgba(60,190,255,0.5)" }} />
              Independent Designers
              <span style={{ display: "inline-block", width: 20, height: "1px", background: "rgba(60,190,255,0.5)" }} />
            </div>
            <h1 style={{
              fontFamily: "'Barlow', system-ui, sans-serif",
              fontSize: "clamp(72px,14vw,200px)",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 0.88,
              letterSpacing: "-0.025em",
              textShadow: "0 0 80px rgba(60,190,255,0.12), 0 0 160px rgba(60,190,255,0.06)",
              userSelect: "none",
              margin: 0,
            }}>
              GUILD SHOP
            </h1>
          </motion.div>
        )}

        {/* ── HUD overlays (client-only via mounted) ─── */}
        {mounted && (
          <div style={{ position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none" }}>
            {/* Corner brackets */}
            <HudCorners />

            {/* Top-left system status */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
              style={{
                position: "absolute",
                top: "calc(var(--nav-h) + 20px)",
                left: "clamp(20px,3vw,44px)",
              }}
            >
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "9px",
                letterSpacing: "0.2em", color: "rgba(60,190,255,0.4)",
                textTransform: "uppercase", marginBottom: 6,
              }}>
                ◈ system status
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={hudLine}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "9px",
                    letterSpacing: "0.16em", color: "rgba(60,190,255,0.85)",
                    textTransform: "uppercase",
                  }}
                >
                  {HUD_LINES[hudLine]}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Top-right data stream */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
              style={{
                position: "absolute",
                top: "calc(var(--nav-h) + 20px)",
                right: "clamp(20px,3vw,44px)",
                textAlign: "right",
                fontFamily: "var(--font-mono)", fontSize: "8px",
                letterSpacing: "0.05em", color: "rgba(60,190,255,0.28)",
                lineHeight: 1.75,
              }}
            >
              <LiveDataStream />
            </motion.div>

            {/* Bottom: feed indicator */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              style={{
                position: "absolute",
                bottom: "clamp(28px,4vh,52px)",
                left: "clamp(20px,3vw,44px)",
              }}
            >
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "8px",
                letterSpacing: "0.22em", color: "rgba(60,190,255,0.55)",
                textTransform: "uppercase", marginBottom: 7,
              }}>
                ◆ FEED {clip + 1}/{SCIFI_CLIPS.length}
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                {SCIFI_CLIPS.map((_, i) => (
                  <div key={i} style={{
                    width: 28, height: "1px",
                    background: i === clip ? "rgba(60,190,255,0.9)" : "rgba(255,255,255,0.18)",
                    transition: "background 0.8s",
                  }} />
                ))}
              </div>
            </motion.div>

            {/* Bottom-right tagline */}
            <div style={{
              position: "absolute",
              bottom: "clamp(28px,4vh,52px)",
              right: "clamp(20px,3vw,44px)",
              fontFamily: "var(--font-mono)", fontSize: "9px",
              letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}>
              Scroll to enter ↓
            </div>
          </div>
        )}

        {/* ── Bento grid — panels fly in over the video ─ */}
        <div
          style={{
            position: "absolute",
            top: "var(--nav-h)", left: 0, right: 0, bottom: 0,
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            overflow: "hidden",
          }}
        >
          {PANELS.map((p) => (
            <Panel key={p.slug} panel={p} progress={smooth} />
          ))}
        </div>
      </div>

      {/* ── Keyframes ───────────────────────────────── */}
      <style>{`
        .hs-scan-line {
          height: 120px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(60,190,255,0.03) 35%,
            rgba(60,190,255,0.07) 50%,
            rgba(60,190,255,0.03) 65%,
            transparent
          );
          animation: hs-scan 6s linear infinite;
        }
        @keyframes hs-scan {
          0%   { top: -120px; }
          100% { top: 100vh; }
        }
      `}</style>
    </section>
  );
}

/* ── HUD corners ───────────────────────────────────── */
function HudCorners() {
  const s = 30;
  const c = "rgba(60,190,255,0.5)";
  const corners: Array<{ pos: Record<string, string>; d: string }> = [
    { pos: { top: "calc(var(--nav-h) + 8px)", left: "clamp(20px,3vw,44px)" }, d: `M${s},0 L0,0 L0,${s}` },
    { pos: { top: "calc(var(--nav-h) + 8px)", right: "clamp(20px,3vw,44px)" }, d: `M0,0 L${s},0 L${s},${s}` },
    { pos: { bottom: "clamp(20px,4vh,44px)", left: "clamp(20px,3vw,44px)" }, d: `M0,0 L0,${s} L${s},${s}` },
    { pos: { bottom: "clamp(20px,4vh,44px)", right: "clamp(20px,3vw,44px)" }, d: `M${s},0 L${s},${s} L0,${s}` },
  ];
  return (
    <>
      {corners.map((corner, i) => (
        <motion.svg
          key={i}
          width={s + 4} height={s + 4}
          viewBox={`-2 -2 ${s + 4} ${s + 4}`}
          style={{ position: "absolute", ...corner.pos }}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d={corner.d} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="square" />
        </motion.svg>
      ))}
    </>
  );
}

/* ── Live data stream ──────────────────────────────── */
function LiveDataStream() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const gen = () => Math.random().toString(36).substring(2, 10).toUpperCase();
    setLines(Array.from({ length: 10 }, gen));
    const id = setInterval(() => setLines(prev => [...prev.slice(1), gen()]), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      {lines.map((l, i) => (
        <div key={i} style={{ opacity: ((i + 1) / 10) * 0.85 }}>{l}</div>
      ))}
    </>
  );
}

/* ── Bento panel ───────────────────────────────────── */
function Panel({
  panel,
  progress,
}: {
  panel: { slug: string; gc: string; gr: string; from: "left" | "right" };
  progress: MotionValue<number>;
}) {
  const d = designers.find((x) => x.slug === panel.slug);
  const { enterWorld } = useWorldTransition();
  const startX = panel.from === "left" ? "-160%" : "160%";
  const x = useTransform(progress, [0, 0.45], [startX, "0%"]);
  if (!d) return null;
  const c = BLOCK_COLORS[d.slug] ?? { bg: "#111", fg: "#fff" };
  const href = `/designers/${d.slug}`;

  return (
    <motion.div
      style={{
        x,
        gridColumn: panel.gc,
        gridRow: panel.gr,
        background: c.bg,
        borderRight: "1px solid rgba(255,255,255,0.12)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
      }}
    >
      <Link
        href={href}
        className="absolute inset-0 flex flex-col justify-between p-4 group"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          enterWorld(href, d.name, e);
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: c.fg, opacity: 0.55 }}>
          {d.location}
        </span>
        <div>
          <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(20px, 2.6vw, 40px)", fontWeight: 900, textTransform: "uppercase", color: c.fg, lineHeight: 0.95, letterSpacing: "-0.01em", marginBottom: 6 }}>
            {d.name}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: c.fg, opacity: 0.5 }}>
            {d.products.length} pieces · {d.founded}
          </div>
        </div>
        <div
          style={{
            position: "absolute", top: 12, right: 12, width: 22, height: 22,
            border: `1px solid ${c.fg}`, opacity: 0.4,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "opacity 0.3s",
          }}
          className="group-hover:!opacity-100"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1 8L8 1M8 1H2M8 1V7" stroke={c.fg} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
