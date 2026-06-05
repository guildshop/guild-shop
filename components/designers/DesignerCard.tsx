"use client";

/**
 * DesignerCard — Surrealist painting card
 *
 * A framed canvas hanging in the void. Italic serif designer name
 * over a tonal painted backdrop. On hover the frame brightens and
 * the card lifts off the wall.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Designer } from "@/lib/types";

interface Props {
  designer: Designer;
  index: number;
}

const FRAME_COLORS = ["var(--s-red)", "var(--s-green)", "var(--s-maroon)"] as const;

export function DesignerCard({ designer, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 25 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const frameColor = FRAME_COLORS[index % FRAME_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1300 }}
    >
      <Link href={`/designers/${designer.slug}`}>
        <motion.div
          ref={cardRef}
          className="relative cursor-pointer group"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            height: "clamp(380px, 38vw, 500px)",
            background: "var(--s-black)",
            border: `2px solid ${frameColor}`,
            boxShadow: hovered
              ? `0 30px 80px -20px ${frameColor === "var(--s-red)" ? "rgba(255,31,46,0.5)" : frameColor === "var(--s-green)" ? "rgba(45,143,63,0.5)" : "rgba(92,10,20,0.7)"}, 0 0 0 4px rgba(0,0,0,0.6)`
              : `0 18px 50px -20px rgba(0,0,0,0.7), 0 0 0 2px rgba(0,0,0,0.4)`,
            transition: "box-shadow 0.7s var(--ease-luxury)",
          }}
          onMouseMove={handleMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0); }}
          whileTap={{ scale: 0.985 }}
        >
          {/* Inner painting surface — tonal radial */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 80% at 50% 60%, ${
                index === 0 ? "rgba(255,31,46,0.18)" : index === 1 ? "rgba(45,143,63,0.18)" : "rgba(92,10,20,0.35)"
              } 0%, rgba(0,0,0,0.95) 70%)`,
            }}
          />
          <div className="s-grain absolute inset-0" />

          {/* Fig caption — top-left */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className="s-serif s-italic"
              style={{ fontSize: "13px", color: frameColor }}
            >
              fig. {index + 1}.
            </span>
          </div>
          {/* Year — top-right */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className="s-serif s-italic"
              style={{ fontSize: "12px", color: "var(--s-green)", opacity: 0.7 }}
            >
              est. {designer.founded}
            </span>
          </div>

          {/* Designer name — center */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center" style={{ transform: "translateZ(40px)" }}>
            <h3
              className="s-display s-italic"
              style={{
                fontSize: "clamp(48px, 6vw, 84px)",
                color: "var(--s-red)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textShadow: hovered ? "var(--s-glow-red)" : "none",
                transition: "text-shadow 0.6s var(--ease-luxury)",
              }}
            >
              {designer.name.toLowerCase()}
            </h3>
            <p
              className="s-serif s-italic mt-4 max-w-xs"
              style={{ fontSize: "15px", color: "var(--s-green)", lineHeight: 1.55 }}
            >
              “{designer.tagline.toLowerCase()}.”
            </p>
          </div>

          {/* Bottom — location + enter cue */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
            <span
              className="s-serif s-italic"
              style={{ fontSize: "12px", color: "var(--s-maroon)" }}
            >
              from <span style={{ color: "var(--s-green)" }}>{designer.location.toLowerCase()}</span>
            </span>
            <motion.span
              className="s-serif s-italic flex items-center gap-2"
              style={{ fontSize: "13px", color: frameColor }}
              animate={hovered ? { x: 4 } : { x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              enter <span>→</span>
            </motion.span>
          </div>

          {/* Hover thin red rim on bottom */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
            style={{ background: frameColor, boxShadow: `0 0 12px ${frameColor}` }}
            animate={{ opacity: hovered ? 1 : 0.3, scaleX: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
