"use client";

/**
 * EditorialSplitHero — a cinematic opening panel above the video hero.
 * A vertical slit follows the cursor and reveals the hero footage behind an
 * otherwise-black stage, with the GuildShop wordmark, manifesto and CTAs.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWorldTransition } from "@/components/ui/WorldTransition";

const WORDMARK = "/guild-shop-wordmark.svg";

export function EditorialSplitHero() {
  const ref = useRef<HTMLElement>(null);
  const [x, setX] = useState(50);
  const { enterWorld } = useWorldTransition();

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setX(((e.clientX - r.left) / r.width) * 100);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setX(50)}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: "#0A0A0A" }}
      aria-label="GuildShop editorial introduction"
    >
      {/* Cinematic reveal behind the split */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          clipPath: `polygon(${x - 6}% 0, ${x + 6}% 0, ${x + 6}% 100%, ${x - 6}% 100%)`,
          transition: "clip-path 0.15s ease-out",
        }}
      >
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          style={{ opacity: 0.9 }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.2)" }} />
      </div>

      {/* Moving bisecting line */}
      <div
        className="pointer-events-none absolute top-0 z-[15] h-full"
        style={{ left: `${x}%`, width: 1, background: "rgba(255,255,255,0.6)", transition: "left 0.15s ease-out" }}
      />

      {/* Wordmark (inverted to white for the dark stage) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex w-full items-center justify-center px-6"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WORDMARK}
          alt="GuildShop"
          className="w-[78vw] max-w-[1100px] select-none object-contain md:w-[52vw]"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </motion.div>

      {/* Manifesto strip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute left-1/2 top-[58%] z-20 w-full max-w-xl -translate-x-1/2 px-6 text-center"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(16px, 1.8vw, 22px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}
      >
        A guild for independent fashion — the curated platform and operational layer
        behind the labels defining what comes next.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-10 z-20 flex w-full flex-col items-center justify-between gap-4 px-6 sm:flex-row md:px-16"
      >
        <Link
          href="/designers"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            enterWorld("/designers", "The Guild", e);
          }}
          style={btn()}
        >
          Explore the Guild ↗
        </Link>
        <Link href="/join" style={btn()}>
          Enter Platform ↗
        </Link>
      </motion.div>

      {/* meta corner */}
      <span
        className="absolute right-6 top-24 z-20 hidden md:block"
        style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}
      >
        India · France · Worldwide
      </span>

      {/* scroll hint */}
      <span
        className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2"
        style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
      >
        Scroll ↓
      </span>
    </section>
  );
}

function btn(): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
    color: "#fff", border: "1px solid rgba(255,255,255,0.4)", padding: "14px 26px",
    background: "rgba(255,255,255,0.02)", display: "inline-block",
  };
}
