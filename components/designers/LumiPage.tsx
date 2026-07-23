"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Designer, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { ProductModal } from "./VesperPage";
import { useOpenProductFromQuery } from "@/lib/useOpenProductFromQuery";

const LumiCanvas = dynamic(() => import("./LumiCanvas"), {
  ssr: false,
  loading: () => null,
});

// LUMI — Y2K Chrome · holographic iridescent · bubbly futurism
// Palette: #080014 bg, #c8d8ff chrome, #ff80d0 pink, #80ffff cyan, #d0a0ff lavender

const C = {
  bg:     "#080014",
  bg2:    "#0d0022",
  chrome: "#c8d8ff",
  pink:   "#ff80d0",
  cyan:   "#80ffff",
  lav:    "#d0a0ff",
  dim:    "rgba(200,216,255,0.45)",
  border: "rgba(128,255,255,0.15)",
};

export function LumiPage({ designer }: { designer: Designer }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useOpenProductFromQuery(designer.products, setSelectedProduct);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.chrome }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-end overflow-hidden"
        style={{ background: C.bg }}
      >
        {/* Scanline overlay — Y2K CRT feel */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(128,255,255,0.025) 2px, rgba(128,255,255,0.025) 4px)",
          }}
        />

        {/* 3D Canvas */}
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <LumiCanvas />
        </motion.div>

        {/* Holographic gradient glow blobs */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "50vw", height: "50vw",
              top: "-10%", right: "-5%",
              background: "radial-gradient(circle, rgba(128,255,255,0.08) 0%, transparent 65%)",
            }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "40vw", height: "40vw",
              bottom: "5%", left: "-5%",
              background: "radial-gradient(circle, rgba(255,128,208,0.07) 0%, transparent 65%)",
            }}
            animate={{ scale: [1, 1.08, 1], rotate: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Bottom vignette */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[45%] z-[3] pointer-events-none"
          style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 100%)` }}
        />

        {/* ── Ticker — Y2K marquee ── */}
        <div
          className="absolute top-[var(--nav-h)] inset-x-0 z-[4] overflow-hidden"
          style={{ borderBottom: `1px solid ${C.border}`, padding: "6px 0" }}
        >
          <motion.div
            className="flex gap-10 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 2 }).map((_, rep) => (
              ["CHROME ✦", "HOLOGRAPHIC ✦", "Y2K ✦", "IRIDESCENT ✦", "DIGITAL ✦", "LUMI ✦", "CHROMATIC ✦", "FUTURIST ✦"].map((w, i) => (
                <span
                  key={`${rep}-${i}`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    color: i % 2 === 0 ? C.cyan : C.pink,
                    opacity: 0.7,
                  }}
                >
                  {w}
                </span>
              ))
            ))}
          </motion.div>
        </div>

        {/* Hero content */}
        <div className="relative z-[5] px-8 md:px-16 pb-20 pt-[calc(var(--nav-h)+80px)] w-full">
          <motion.p
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.22em", color: C.cyan, opacity: 0.7 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Lagos, Nigeria · Est. {designer.founded}
          </motion.p>

          <div className="mt-4 overflow-hidden">
            <motion.h1
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(80px, 16vw, 220px)",
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                background: `linear-gradient(135deg, ${C.chrome} 0%, ${C.cyan} 35%, ${C.pink} 65%, ${C.lav} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ y: "110%", skewY: 4 }}
              animate={{ y: "0%", skewY: 0 }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              LUMI
            </motion.h1>
          </div>

          <motion.div
            className="flex items-center gap-8 mt-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8 }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: 1.7, color: C.dim, maxWidth: 340 }}>
              {designer.tagline}
            </p>
            <a
              href="#collection"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                padding: "10px 22px",
                border: `1px solid ${C.cyan}`,
                color: C.cyan,
                textDecoration: "none",
                transition: "all 0.4s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.cyan; (e.currentTarget as HTMLElement).style.color = C.bg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = C.cyan; }}
            >
              VIEW COLLECTION ↓
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 z-[5]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", color: C.pink, opacity: 0.6 }}>
            SCROLL
          </span>
        </motion.div>
      </section>

      {/* ── STORY ─────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-8 md:px-16"
        style={{ background: C.bg2, borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <motion.div
            className="md:col-span-4"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.pink, marginBottom: 24 }}>
              THE STUDIO
            </p>
            {/* Y2K decorative diamond row */}
            <div className="flex gap-3 items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8, height: 8,
                    background: [C.cyan, C.pink, C.lav, C.chrome, C.cyan][i],
                    transform: "rotate(45deg)",
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </motion.div>
          <div className="md:col-span-8 flex flex-col gap-6">
            {designer.story.map((paragraph, i) => (
              <motion.p
                key={i}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: i === 0 ? "clamp(15px, 1.6vw, 19px)" : "13px",
                  lineHeight: 1.85,
                  color: i === 0 ? C.chrome : C.dim,
                  fontStyle: i === designer.story.length - 1 ? "italic" : "normal",
                }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Y2K MANIFESTO ─────────────────────────────────────────────────── */}
      <section
        className="py-24 px-8 md:px-16 relative overflow-hidden"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
      >
        {/* Holographic background pulse */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(128,255,255,0.04) 0%, transparent 65%)`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-14">
            <motion.p
              style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.3em", color: C.cyan, marginBottom: 12 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              CHROME CODEX
            </motion.p>
            <motion.h2
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(38px, 5.5vw, 80px)",
                fontWeight: 900,
                lineHeight: 0.9,
                background: `linear-gradient(90deg, ${C.chrome}, ${C.cyan})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.01em",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              FOUR<br />FREQUENCIES
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: C.border }}>
            {[
              { n: "01", title: "Iridescence as Identity.", body: "We refuse single-wavelength colour. Every garment shifts under light, refusing to be pinned to one reading. You are not one thing. Neither are we." },
              { n: "02", title: "Chrome is not cold.", body: "Reflective surfaces carry warmth. They mirror back the wearer — their glow, their heat, their mood. LUMI pieces are wearable mirrors." },
              { n: "03", title: "Y2K was a prophecy.", body: "The millennium glitch never came for technology. It came for identity instead. We dress the overflow: the too-bright, the too-bold, the overflow." },
              { n: "04", title: "Digital bodies. Real texture.", body: "Holographic is not synthetic. Our fabrications are hand-finished, pixel-precise. The future has a surface you can touch." },
            ].map((m, i) => (
              <motion.div
                key={m.n}
                style={{ background: C.bg2, padding: "clamp(28px,3vw,40px)" }}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <div className="flex items-baseline justify-between mb-5">
                  <span
                    style={{
                      fontFamily: "'Arial Black', sans-serif",
                      fontSize: "clamp(52px,6vw,88px)",
                      fontWeight: 900,
                      lineHeight: 0.8,
                      background: `linear-gradient(135deg, ${[C.cyan, C.pink, C.lav, C.chrome][i]}, ${[C.pink, C.lav, C.chrome, C.cyan][i]})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {m.n}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.dim }}>
                    FREQ.{m.n}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 900, color: C.chrome, marginBottom: 10, lineHeight: 1.2 }}>
                  {m.title}
                </h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.8, color: C.dim }}>
                  {m.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-8 md:px-16" style={{ background: C.bg2 }}>
        <motion.p
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.pink, marginBottom: 40 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          LOOKBOOK — ZINC SEASON
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {designer.lookbook.map((img, i) => {
            const isWide = img.span === "wide";
            const isTall = img.span === "tall";
            const glowColor = [C.cyan, C.pink, C.lav, C.chrome, C.cyan][i % 5];
            return (
              <motion.div
                key={img.id}
                className={`${isWide ? "col-span-2" : ""} ${isTall ? "row-span-2" : ""} relative overflow-hidden`}
                style={{
                  height: isTall ? "clamp(320px, 35vw, 500px)" : "clamp(160px, 16vw, 240px)",
                  background: img.gradient,
                  boxShadow: `0 0 18px ${glowColor}18`,
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.9 }}
                whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${glowColor}35` }}
              >
                {/* Holographic shimmer overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, rgba(128,255,255,0.06) 0%, rgba(255,128,208,0.06) 50%, rgba(208,160,255,0.06) 100%)`,
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 text-label opacity-50"
                  style={{ color: C.chrome, fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.14em" }}
                >
                  {img.alt.split("—")[0].trim()}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── COLLECTION ────────────────────────────────────────────────────── */}
      <section
        id="collection"
        className="py-24 px-8 md:px-16"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
      >
        <div className="flex items-end justify-between mb-16 max-w-6xl mx-auto">
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.cyan, marginBottom: 10 }}>
              AW24 COLLECTION
            </p>
            <h2
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(32px, 5vw, 68px)",
                fontWeight: 900,
                lineHeight: 0.92,
                background: `linear-gradient(90deg, ${C.chrome}, ${C.lav})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.01em",
              }}
            >
              Chrome Dreams
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-sm" style={{ color: C.dim, fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.7 }}>
            {designer.products.length} holographic pieces. Iridescent editions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px max-w-6xl mx-auto" style={{ background: C.border }}>
          {designer.products.map((product, i) => (
            <LumiProductCard
              key={product.id}
              product={product}
              index={i}
              onSelect={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* ── FOOTER NAV ────────────────────────────────────────────────────── */}
      <div
        className="py-12 px-8 md:px-16 flex items-center justify-between border-t"
        style={{ background: C.bg2, borderColor: C.border }}
      >
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-60"
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", color: C.chrome }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          GUILD SHOP
        </Link>
        <Link
          href="/designers"
          className="transition-opacity hover:opacity-60"
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", color: C.dim }}
        >
          OTHER DESIGNERS →
        </Link>
      </div>

      <ProductModal
        product={selectedProduct}
        designer={designer}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

function LumiProductCard({ product, index, onSelect }: { product: Product; index: number; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const glowColor = [C.cyan, C.pink, C.lav, C.chrome][index % 4];

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ background: C.bg2 }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <div
        style={{
          height: "clamp(260px, 26vw, 400px)",
          background: product.colorway,
          position: "relative",
          overflow: "hidden",
          transition: "box-shadow 0.4s",
          boxShadow: hovered ? `0 0 40px ${glowColor}40` : "none",
        }}
      >
        {/* Holographic overlay on hover */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(128,255,255,0.18) 0%, rgba(255,128,208,0.18) 50%, rgba(208,160,255,0.18) 100%)`,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: C.bg,
              background: glowColor,
              padding: "10px 22px",
            }}
          >
            VIEW DETAILS
          </span>
        </motion.div>
        <span
          className="absolute top-4 left-4"
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em", color: "#fff", opacity: 0.35 }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {product.featured && (
          <span
            className="absolute top-4 right-4"
            style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.18em", color: C.cyan }}
          >
            ✦ FEATURED
          </span>
        )}
      </div>

      <div style={{ padding: "clamp(16px,2vw,24px) clamp(20px,2.5vw,32px)", borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", color: C.dim, marginBottom: 6 }}>
              {product.category.toUpperCase()}
            </p>
            <h3
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(18px, 2vw, 28px)",
                fontWeight: 900,
                color: C.chrome,
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </h3>
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(13px,1.3vw,16px)", color: glowColor, whiteSpace: "nowrap" }}>
            {formatPrice(product.price)}
          </p>
        </div>
        <p style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: "11px", lineHeight: 1.7, color: C.dim }} className="line-clamp-2">
          {product.description}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="mt-4 w-full py-3 flex items-center justify-center transition-all duration-300"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            border: `1px solid ${glowColor}`,
            color: glowColor,
            background: "transparent",
            cursor: "pointer",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = glowColor; (e.currentTarget as HTMLElement).style.color = C.bg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = glowColor; }}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
