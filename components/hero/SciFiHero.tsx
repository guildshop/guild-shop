"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CLIPS = ["/hero-scifi-1.mp4", "/hero-scifi-2.mp4", "/hero-scifi-3.mp4"];
const CLIP_MS = 20_000;

const HUD_LINES = [
  "GS-NET 2.4 · SIGNAL LOCKED",
  "DESIGNERS: 6 · ACTIVE FEEDS",
  "CHANNEL ENCRYPTED · SECURE",
  "UPLINK STABLE · 99.7%",
  "EMERGING TALENT · ONLINE",
];

export function SciFiHero() {
  const [clip, setClip] = useState(0);
  const [fading, setFading] = useState(false);
  const [hudLine, setHudLine] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const nextRef = useRef(1);

  useEffect(() => { setMounted(true); }, []);

  // Cycle clips with cross-fade
  useEffect(() => {
    const id = setInterval(() => {
      const next = nextRef.current;
      setFading(true);
      setTimeout(() => {
        setClip(next);
        setFading(false);
        nextRef.current = (next + 1) % CLIPS.length;
      }, 1200);
    }, CLIP_MS);
    return () => clearInterval(id);
  }, []);

  // Cycle HUD status lines
  useEffect(() => {
    const id = setInterval(() => setHudLine(i => (i + 1) % HUD_LINES.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Randomised glitch bursts
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const schedule = () => {
      id = setTimeout(() => {
        setGlitchOffset({ x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 2 });
        setGlitch(true);
        setTimeout(() => { setGlitch(false); schedule(); }, 160 + Math.random() * 100);
      }, 2800 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* ── VIDEOS ─────────────────────────────────── */}
      {CLIPS.map((src, i) => {
        const isActive = i === clip;
        const isNext = i === nextRef.current;
        return (
          <video
            key={src}
            src={src}
            autoPlay={isActive}
            muted
            playsInline
            loop
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.52) contrast(1.18) saturate(1.12)",
              opacity: isActive ? (fading ? 0 : 1) : isNext && fading ? 1 : 0,
              transition: "opacity 1.2s ease",
              zIndex: fading && isNext ? 1 : 0,
            }}
          />
        );
      })}

      {/* ── COLOUR GRADE ───────────────────────────── */}
      {/* Cold blue tint in shadows via multiply */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "rgba(4,18,65,0.30)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Cyan bloom highlight via screen */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 58% 38%, rgba(0,110,190,0.14), transparent)",
          mixBlendMode: "screen",
        }}
      />
      {/* Subtle warm centre lens flare */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          background: "radial-gradient(ellipse 40% 30% at 50% 45%, rgba(255,220,160,0.04), transparent)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── SCANLINES ──────────────────────────────── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.032) 3px, rgba(0,0,0,0.032) 4px)",
        }}
      />

      {/* ── VIGNETTE ───────────────────────────────── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(0,0,0,0.48) 70%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* ── GRAIN (SVG filter) ─────────────────────── */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="sf-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
            <feBlend in="SourceGraphic" in2="grey" mode="overlay" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
          filter: "url(#sf-grain)", opacity: 0.16, background: "#fff",
        }}
      />

      {/* ── SWEEPING SCAN LINE ─────────────────────── */}
      <div
        className="sf-scan-line"
        style={{ position: "absolute", left: 0, right: 0, zIndex: 8, pointerEvents: "none" }}
      />

      {/* ── HUD LAYER ──────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}>
        {/* Corner brackets */}
        <CornerBrackets show={mounted} />

        {/* Top-left status panel */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -16 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            top: "calc(var(--nav-h) + 24px)",
            left: "clamp(20px,3vw,48px)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em",
              color: "rgba(60,190,255,0.4)", textTransform: "uppercase", marginBottom: 7,
            }}
          >
            ◈ system status
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={hudLine}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.22 }}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.16em",
                color: "rgba(60,190,255,0.85)", textTransform: "uppercase",
              }}
            >
              {HUD_LINES[hudLine]}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Top-right live data stream */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ delay: 1.3, duration: 1 }}
          style={{
            position: "absolute",
            top: "calc(var(--nav-h) + 24px)",
            right: "clamp(20px,3vw,48px)",
            textAlign: "right",
            fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.05em",
            color: "rgba(60,190,255,0.28)", lineHeight: 1.75,
          }}
        >
          <DataStream />
        </motion.div>

        {/* Bottom row: feed counter + tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 16 }}
          transition={{ delay: 1.6, duration: 0.9 }}
          style={{
            position: "absolute",
            bottom: "clamp(28px,4vh,52px)",
            left: "clamp(20px,3vw,48px)",
            right: "clamp(20px,3vw,48px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.22em",
                color: "rgba(60,190,255,0.55)", textTransform: "uppercase", marginBottom: 7,
              }}
            >
              ◆ FEED {clip + 1}/{CLIPS.length}
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              {CLIPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: "1px",
                    background:
                      i === clip
                        ? "rgba(60,190,255,0.9)"
                        : "rgba(255,255,255,0.18)",
                    transition: "background 0.8s",
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.38)", textTransform: "uppercase",
            }}
          >
            Emerging independent designers · One platform
          </div>
        </motion.div>
      </div>

      {/* ── CENTRE TITLE ───────────────────────────── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 15,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: "0 clamp(20px,5vw,60px)",
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: mounted ? 0.8 : 0, letterSpacing: mounted ? "0.28em" : "0.5em" }}
          transition={{ delay: 0.5, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-mono)", fontSize: "clamp(8px,1vw,11px)",
            textTransform: "uppercase", color: "rgba(60,190,255,0.9)",
            marginBottom: 20,
            display: "flex", alignItems: "center", gap: 14,
          }}
        >
          <span
            style={{
              display: "inline-block", width: 22, height: "1px",
              background: "rgba(60,190,255,0.5)",
            }}
          />
          Guild · Independent Designers
          <span
            style={{
              display: "inline-block", width: 22, height: "1px",
              background: "rgba(60,190,255,0.5)",
            }}
          />
        </motion.div>

        {/* Wordmark with glitch */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 50 }}
          transition={{ delay: 0.15, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Barlow', system-ui, sans-serif",
            fontSize: "clamp(80px,16vw,220px)",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.87,
            letterSpacing: "-0.025em",
            textShadow: glitch
              ? `${glitchOffset.x * 0.8}px 0 rgba(255,10,80,0.75), ${-glitchOffset.x * 0.8}px 0 rgba(0,200,255,0.75), 0 0 50px rgba(60,190,255,0.18)`
              : "0 0 80px rgba(60,190,255,0.1), 0 0 160px rgba(60,190,255,0.05)",
            transform: glitch
              ? `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`
              : "translate(0,0)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          GUILD
        </motion.h1>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
          transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 48,
            display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
          }}
        >
          <Link
            href="/designers"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#000",
              background: "rgba(60,190,255,0.92)",
              padding: "14px 30px",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            Enter Platform
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/products"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(60,190,255,0.9)",
              border: "1px solid rgba(60,190,255,0.35)",
              padding: "14px 30px",
            }}
          >
            Browse Collection
          </Link>
        </motion.div>
      </div>

      {/* ── KEYFRAMES ──────────────────────────────── */}
      <style>{`
        .sf-scan-line {
          height: 120px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(60,190,255,0.03) 35%,
            rgba(60,190,255,0.07) 50%,
            rgba(60,190,255,0.03) 65%,
            transparent
          );
          animation: sf-scan 6s linear infinite;
        }
        @keyframes sf-scan {
          0%   { top: -120px; }
          100% { top: 100vh; }
        }
        @keyframes sf-blink {
          0%, 88%, 100% { opacity: 1; }
          92%            { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────── */

function DataStream() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const gen = () => Math.random().toString(36).substring(2, 10).toUpperCase();
    setLines(Array.from({ length: 10 }, gen));
    const id = setInterval(
      () => setLines(prev => [...prev.slice(1), gen()]),
      900
    );
    return () => clearInterval(id);
  }, []);
  return (
    <>
      {lines.map((l, i) => (
        <div key={i} style={{ opacity: ((i + 1) / lines.length) * 0.85 }}>
          {l}
        </div>
      ))}
    </>
  );
}

function CornerBrackets({ show }: { show: boolean }) {
  const s = 34;
  const c = "rgba(60,190,255,0.5)";

  const corners: Array<{
    pos: Record<string, string>;
    d: string;
  }> = [
    { pos: { top: "calc(var(--nav-h) + 8px)", left: "clamp(20px,3vw,48px)" }, d: `M${s},0 L0,0 L0,${s}` },
    { pos: { top: "calc(var(--nav-h) + 8px)", right: "clamp(20px,3vw,48px)" }, d: `M0,0 L${s},0 L${s},${s}` },
    { pos: { bottom: "clamp(20px,4vh,48px)", left: "clamp(20px,3vw,48px)" }, d: `M0,0 L0,${s} L${s},${s}` },
    { pos: { bottom: "clamp(20px,4vh,48px)", right: "clamp(20px,3vw,48px)" }, d: `M${s},0 L${s},${s} L0,${s}` },
  ];

  return (
    <>
      {corners.map((corner, i) => (
        <motion.svg
          key={i}
          width={s + 4}
          height={s + 4}
          viewBox={`-2 -2 ${s + 4} ${s + 4}`}
          style={{ position: "absolute", ...corner.pos }}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 1.15 }}
          transition={{ delay: 0.5 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d={corner.d} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="square" />
        </motion.svg>
      ))}
    </>
  );
}
