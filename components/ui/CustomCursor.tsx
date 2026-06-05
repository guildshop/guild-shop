"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorVariant = "default" | "hover" | "text" | "drag";

export function CustomCursor() {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 280, damping: 28, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if ("ontouchstart" in window) {
      setIsTouch(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [role='button'], [data-cursor='hover']")) {
        setVariant("hover");
      } else if (el.closest("[data-cursor='drag']")) {
        setVariant("drag");
      } else if (el.closest("p, h1, h2, h3, h4, h5, h6, span, label")) {
        setVariant("text");
      } else {
        setVariant("default");
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY, visible]);

  if (isTouch) return null;

  const dotSize = variant === "hover" ? 8 : variant === "text" ? 2 : 5;
  const ringSize = variant === "hover" ? 52 : variant === "drag" ? 72 : 36;
  const ringOpacity = variant === "hover" ? 0.5 : 0.25;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Dot — exact position */}
      <motion.div
        style={{
          position: "fixed",
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: "var(--color-fg)",
        }}
        animate={{ width: dotSize, height: dotSize }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring — spring follow */}
      <motion.div
        style={{
          position: "fixed",
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: "1px solid var(--color-fg)",
          opacity: ringOpacity,
        }}
        animate={{ width: ringSize, height: ringSize, opacity: ringOpacity }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Drag label */}
      {variant === "drag" && (
        <motion.div
          style={{
            position: "fixed",
            left: ringX,
            top: ringY,
            x: "-50%",
            y: "-50%",
            fontFamily: "var(--font-body)",
            fontSize: "9px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-fg)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          drag
        </motion.div>
      )}
    </div>
  );
}
