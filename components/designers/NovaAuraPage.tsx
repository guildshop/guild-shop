"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Designer, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductModal } from "./VesperPage";
import { useOpenProductFromQuery } from "@/lib/useOpenProductFromQuery";

// NOVA AURA — Futuristic cyber · Space Grotesk · Neon cyan + magenta · Kinetic
// Theme: #04040f bg, #e0e8ff fg, #00f0ff accent, #ff00aa accent-2

const NovaAuraCanvas = dynamic(() => import("./NovaAuraCanvas"), { ssr: false, loading: () => null });

export function NovaAuraPage({ designer }: { designer: Designer }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useOpenProductFromQuery(designer.products, setSelectedProduct);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const cv = designer.theme.cssVars as Record<string, string>;

  return (
    <div
      className="designer-world min-h-screen"
      style={{ ...Object.fromEntries(Object.entries(cv)) as React.CSSProperties }}
    >
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
        style={{ background: cv["--d-bg"] }}
      >
        {/* 3D background */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <NovaAuraCanvas />
        </motion.div>

        {/* Scan line overlay */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${cv["--d-bg"]}10 2px, ${cv["--d-bg"]}10 4px)`,
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 z-2 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, ${cv["--d-bg"]}90 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-between px-8 md:px-16 pt-[calc(var(--nav-h)+80px)] pb-16">
          {/* Top row */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: cv["--d-accent"] }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span
                className="text-label"
                style={{ color: cv["--d-fg-dim"], fontFamily: designer.theme.fontBody }}
              >
                NOVA AURA · {designer.location}
              </span>
            </div>
            <div
              className="hidden md:flex items-center gap-2 text-label px-4 py-2 border"
              style={{ borderColor: cv["--d-accent"], color: cv["--d-accent"], fontFamily: designer.theme.fontBody }}
            >
              <span>LIVE</span>
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cv["--d-accent"] }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Center — glitch title */}
          <div className="text-center relative">
            <motion.p
              className="text-label mb-6"
              style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontBody, letterSpacing: "0.3em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              EVENT HORIZON SERIES IV
            </motion.p>
            <div className="relative">
              <motion.h1
                style={{
                  fontFamily: designer.theme.fontDisplay,
                  fontSize: "clamp(64px, 14vw, 200px)",
                  fontWeight: 700,
                  lineHeight: 0.9,
                  color: cv["--d-fg"],
                  letterSpacing: "0.05em",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                NOVA
              </motion.h1>
              {/* Glitch layers */}
              <motion.span
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{
                  fontFamily: designer.theme.fontDisplay,
                  fontSize: "clamp(64px, 14vw, 200px)",
                  fontWeight: 700,
                  lineHeight: 0.9,
                  color: cv["--d-accent"],
                  letterSpacing: "0.05em",
                  mixBlendMode: "screen",
                  opacity: 0.15,
                }}
                animate={{ x: [-3, 3, -3], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror", repeatDelay: 3 }}
              >
                NOVA
              </motion.span>
            </div>
            <motion.h1
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(64px, 14vw, 200px)",
                fontWeight: 700,
                lineHeight: 0.9,
                color: cv["--d-accent-2"],
                letterSpacing: "0.05em",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              AURA
            </motion.h1>
          </div>

          {/* Bottom row */}
          <motion.div
            className="flex items-end justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p
              className="max-w-xs text-sm leading-relaxed"
              style={{ color: cv["--d-fg-dim"], fontFamily: designer.theme.fontBody }}
            >
              {designer.tagline}
            </p>
            <a
              href="#collection"
              className="text-label flex items-center gap-2 group transition-all duration-300"
              style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontBody }}
            >
              Explore Objects
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── STORY ─────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-8 md:px-16"
        style={{ background: cv["--d-bg-2"], borderTop: `1px solid ${cv["--d-border"]}` }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { label: "Founded", value: designer.founded },
              { label: "Location", value: "Tokyo · Seoul" },
              { label: "Current Series", value: "Event Horizon IV" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="py-6 border-t"
                style={{ borderColor: cv["--d-accent"] }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <p className="text-label mb-2" style={{ color: cv["--d-fg-dim"] }}>{stat.label}</p>
                <p
                  style={{
                    fontFamily: designer.theme.fontDisplay,
                    fontSize: "clamp(20px, 2.5vw, 32px)",
                    fontWeight: 700,
                    color: cv["--d-accent"],
                  }}
                >
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {designer.story.map((para, i) => (
              <motion.p
                key={i}
                className="leading-relaxed"
                style={{
                  color: i === 0 ? cv["--d-fg"] : cv["--d-fg-dim"],
                  fontFamily: designer.theme.fontBody,
                  fontSize: i === 0 ? "clamp(16px, 1.5vw, 20px)" : "15px",
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-8 md:px-16 overflow-hidden"
        style={{ background: cv["--d-bg"] }}
      >
        <p className="text-label mb-12" style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontBody }}>
          EVENT HORIZON IV — OBJECTS
        </p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
          {designer.lookbook.map((img, i) => (
            <motion.div
              key={img.id}
              className="shrink-0 relative overflow-hidden"
              style={{
                width: "clamp(240px, 28vw, 380px)",
                height: "clamp(320px, 36vw, 500px)",
                background: img.gradient,
                border: `1px solid ${cv["--d-border"]}`,
              }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, borderColor: cv["--d-accent"] }}
            >
              {/* Neon corner accent */}
              <div
                className="absolute top-0 right-0 w-8 h-8"
                style={{
                  background: `linear-gradient(225deg, ${cv["--d-accent"]}60 0%, transparent 70%)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-8 h-8"
                style={{
                  background: `linear-gradient(45deg, ${cv["--d-accent-2"]}60 0%, transparent 70%)`,
                }}
              />
              <p
                className="absolute bottom-4 left-4 text-label opacity-50"
                style={{ color: cv["--d-fg"], fontFamily: designer.theme.fontBody, fontSize: "10px" }}
              >
                {String(i + 1).padStart(2, "0")} / {designer.lookbook.length.toString().padStart(2, "0")}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COLLECTION ────────────────────────────────────────────────────── */}
      <section
        id="collection"
        className="py-24 px-8 md:px-16"
        style={{ background: cv["--d-bg-2"], borderTop: `1px solid ${cv["--d-border"]}` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-label mb-3" style={{ color: cv["--d-accent"] }}>OBJECTS FOR SALE</p>
              <h2
                style={{
                  fontFamily: designer.theme.fontDisplay,
                  fontSize: "clamp(36px, 5vw, 72px)",
                  fontWeight: 700,
                  color: cv["--d-fg"],
                  letterSpacing: "0.05em",
                }}
              >
                COLLECTION
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {designer.products.map((product, i) => (
              <NovaProductCard
                key={product.id}
                product={product}
                designer={designer}
                index={i}
                onSelect={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── BACK ─────────────────────────────────────────────────────────── */}
      <div
        className="py-8 px-8 md:px-16 flex items-center justify-between border-t"
        style={{ background: cv["--d-bg"], borderColor: cv["--d-border"] }}
      >
        <Link
          href="/"
          className="text-label flex items-center gap-3 hover:opacity-60 transition-opacity"
          style={{ color: cv["--d-fg-dim"], fontFamily: designer.theme.fontBody }}
        >
          ← GUILD SHOP
        </Link>
        <Link href="/designers" className="text-label" style={{ color: cv["--d-fg-dim"] }}>
          ALL DESIGNERS →
        </Link>
      </div>

      <ProductModal product={selectedProduct} designer={designer} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}

function NovaProductCard({
  product,
  designer,
  index,
  onSelect,
}: {
  product: Product;
  designer: Designer;
  index: number;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const cv = designer.theme.cssVars as Record<string, string>;

  return (
    <motion.div
      className="relative cursor-pointer border"
      style={{
        background: cv["--d-bg"],
        borderColor: hovered ? cv["--d-accent"] : cv["--d-border"],
        transition: "border-color 0.3s",
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${cv["--d-accent"]}06 0%, transparent 70%)` }}
        animate={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Visual */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(240px, 24vw, 360px)", background: product.colorway }}
      >
        {/* Corner markers */}
        {[["top-2 left-2", "border-t border-l"], ["top-2 right-2", "border-t border-r"], ["bottom-2 left-2", "border-b border-l"], ["bottom-2 right-2", "border-b border-r"]].map(([pos, cls], i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 ${pos} ${cls}`}
            style={{ borderColor: cv["--d-accent"], opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s" }}
          />
        ))}
        {/* Scan line */}
        <motion.div
          className="absolute inset-x-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${cv["--d-accent"]}60, transparent)` }}
          animate={{ y: hovered ? [0, 300, 0] : 150 }}
          transition={{ duration: 2, repeat: hovered ? Infinity : 0, ease: "linear" }}
        />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-label mb-1" style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontBody }}>
              {product.category.toUpperCase()}
            </p>
            <h3
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(18px, 2vw, 28px)",
                fontWeight: 700,
                color: cv["--d-fg"],
                letterSpacing: "0.03em",
              }}
            >
              {product.name}
            </h3>
          </div>
          <p
            style={{
              fontFamily: designer.theme.fontBody,
              fontSize: "clamp(14px, 1.4vw, 18px)",
              color: cv["--d-accent"],
              whiteSpace: "nowrap",
            }}
          >
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: cv["--d-fg-dim"] }}>
          {product.description}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="mt-4 w-full py-3 flex items-center justify-center transition-all duration-300"
          style={{
            fontFamily: designer.theme.fontBody,
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            border: `1px solid ${cv["--d-accent"]}`,
            color: cv["--d-accent"],
            background: "transparent",
            cursor: "pointer",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = cv["--d-accent"]; (e.currentTarget as HTMLElement).style.color = cv["--d-bg"]; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = cv["--d-accent"]; }}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
