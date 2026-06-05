"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8"
          style={{ background: "var(--color-bg)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Wordmark */}
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                letterSpacing: "0.06em",
                color: "var(--color-fg)",
              }}
            >
              Guild Shop
            </motion.div>
          </motion.div>

          {/* Progress line */}
          <div
            className="w-20 h-px overflow-hidden"
            style={{ background: "var(--color-border)" }}
          >
            <motion.div
              className="h-full"
              style={{ background: "var(--color-fg)" }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Label */}
          <motion.span
            className="text-label"
            style={{ color: "var(--color-fg-dim)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            AW 2026
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
