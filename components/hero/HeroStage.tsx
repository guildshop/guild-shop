"use client";

/**
 * HeroStage — the homepage hero. A full-screen video is pinned while you
 * scroll through a tall "stage". As scroll progresses, the designer panels
 * fly in OVER the video from their sides (scroll-scrubbed, so scrolling back
 * up reverses them), assemble into the bento, then the page scrolls on.
 */

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { designers } from "@/lib/designers";
import { useWorldTransition } from "@/components/ui/WorldTransition";

const BLOCK_COLORS: Record<string, { bg: string; fg: string }> = {
  vesper:      { bg: "#0a0a0a", fg: "#ffffff" },
  "nova-aura": { bg: "#1e2d5a", fg: "#ffffff" },
  terra:       { bg: "#b84e28", fg: "#ffffff" },
  lumi:        { bg: "#3d5a28", fg: "#ffffff" },
  soleil:      { bg: "#8a1828", fg: "#ffffff" },
  ondo:        { bg: "#1a30a0", fg: "#ffffff" },
};

// Bento placement + entrance side
const PANELS: Array<{ slug: string; gc: string; gr: string; from: "left" | "right" }> = [
  { slug: "vesper",    gc: "1 / span 1", gr: "1 / span 2", from: "left"  }, // left column
  { slug: "nova-aura", gc: "2 / span 2", gr: "1 / span 1", from: "right" }, // top middle → right
  { slug: "terra",     gc: "4 / span 1", gr: "1 / span 1", from: "right" }, // right column
  { slug: "ondo",      gc: "2 / span 2", gr: "2 / span 2", from: "left"  }, // bottom middle → left
  { slug: "soleil",    gc: "4 / span 1", gr: "2 / span 2", from: "right" }, // right column
  { slug: "lumi",      gc: "1 / span 1", gr: "3 / span 1", from: "left"  }, // left column
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroStage() {
  const stageRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  // Spring-smoothed progress — dampens quick scroll-ups so the panels hold
  // their place and ease out instead of snapping away.
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 30, mass: 0.8 });

  return (
    <section ref={stageRef} style={{ height: "280vh", position: "relative" }}>
      {/* Pinned viewport */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#000" }}>
        {/* Full-screen video */}
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Tagline overlaid at the bottom of the hero (covered as panels arrive) */}
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 1,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
            padding: "clamp(16px,2vw,24px) var(--content-pad)",
            background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
          }}
        >
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>
            Emerging independent designers. One platform.
          </p>
          <Link href="/designers" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>
            Scroll to enter ↓
          </Link>
        </div>

        {/* Bento grid that flies in over the video */}
        <div
          style={{
            position: "absolute",
            top: "var(--nav-h)", left: 0, right: 0, bottom: 0,
            zIndex: 2,
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
    </section>
  );
}

function Panel({
  panel,
  progress,
}: {
  panel: { slug: string; gc: string; gr: string; from: "left" | "right" };
  progress: MotionValue<number>;
}) {
  const d = designers.find((x) => x.slug === panel.slug);
  const { enterWorld } = useWorldTransition();
  // Panels finish assembling by 55% of the stage scroll
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
