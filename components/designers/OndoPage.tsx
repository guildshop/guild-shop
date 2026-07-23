"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import type { Designer, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductModal } from "./VesperPage";
import { useOpenProductFromQuery } from "@/lib/useOpenProductFromQuery";

const OndoCanvas = dynamic(() => import("./OndoCanvas"), {
  ssr: false,
  loading: () => null,
});

// ONDO — Avant-garde · deconstructed · stark geometry · experimental tension
// Palette: #080808 bg, #f0f0f0 white, #ff2200 red, #f5ff00 yellow

const C = {
  bg:     "#080808",
  bg2:    "#0f0f0f",
  white:  "#f0f0f0",
  red:    "#ff2200",
  yellow: "#f5ff00",
  dim:    "rgba(240,240,240,0.4)",
  border: "rgba(240,240,240,0.1)",
  rBord:  "rgba(255,34,0,0.25)",
};

export function OndoPage({ designer }: { designer: Designer }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useOpenProductFromQuery(designer.products, setSelectedProduct);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.white }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-end overflow-hidden"
        style={{ background: C.bg }}
      >
        {/* Grid lines — avant-garde structural */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`v${i}`}
              className="absolute top-0 bottom-0"
              style={{ left: `${(i + 1) * (100 / 7)}%`, width: 1, background: `${C.white}06` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.06, duration: 1.4 }}
            />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`h${i}`}
              className="absolute left-0 right-0"
              style={{ top: `${(i + 1) * 25}%`, height: 1, background: `${C.white}06` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 1.2 }}
            />
          ))}
          {/* Red diagonal slash */}
          <motion.div
            className="absolute"
            style={{
              top: 0, left: "30%",
              width: 1, height: "140%",
              background: `linear-gradient(to bottom, transparent, ${C.red}40, transparent)`,
              transform: "rotate(15deg)",
              transformOrigin: "top center",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
          />
        </div>

        {/* 3D Canvas */}
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <OndoCanvas />
        </motion.div>

        {/* Bottom vignette */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[50%] z-[3] pointer-events-none"
          style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 100%)` }}
        />

        {/* Top bar */}
        <div
          className="absolute top-[var(--nav-h)] inset-x-0 z-[4]"
          style={{ borderBottom: `1px solid ${C.border}`, padding: "7px clamp(20px,3vw,40px)" }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.22em", color: C.dim }}>
              SEOUL, SOUTH KOREA · EST. {designer.founded}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.22em", color: C.red }}>
              AVANT-GARDE
            </span>
          </div>
        </div>

        {/* Hero content — deconstructed layout */}
        <div className="relative z-[5] px-8 md:px-16 pb-20 pt-[calc(var(--nav-h)+80px)] w-full">
          {/* Offset number — avant-garde typographic accent */}
          <motion.div
            className="absolute"
            style={{ right: "clamp(32px,5vw,80px)", top: "calc(var(--nav-h) + 80px)" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.12, x: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <span
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: "clamp(120px, 18vw, 260px)",
                fontWeight: 900,
                color: C.white,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              23
            </span>
          </motion.div>

          <motion.p
            style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.25em", color: C.red }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            CONCEPTUAL TAILORING
          </motion.p>

          <div className="mt-4 overflow-hidden">
            <motion.h1
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(80px, 16vw, 220px)",
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                color: C.white,
              }}
              initial={{ y: "110%", skewY: -5 }}
              animate={{ y: "0%", skewY: 0 }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              ON
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(80px, 16vw, 220px)",
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                color: C.white,
                marginLeft: "clamp(40px, 6vw, 100px)",
              }}
              initial={{ y: "110%", skewY: -5 }}
              animate={{ y: "0%", skewY: 0 }}
              transition={{ delay: 0.62, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              DO
            </motion.h1>
          </div>

          <motion.div
            className="flex items-center gap-8 mt-10"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.75, color: C.dim, maxWidth: 320 }}>
              {designer.tagline}
            </p>
            <a
              href="#collection"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                padding: "10px 22px",
                border: `1px solid ${C.white}`,
                color: C.white,
                textDecoration: "none",
                transition: "all 0.4s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.red; (e.currentTarget as HTMLElement).style.borderColor = C.red; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = C.white; }}
            >
              VIEW COLLECTION ↓
            </a>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 right-8 z-[5]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", color: C.dim }}>↓</span>
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
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.red, marginBottom: 24 }}>
              THE STUDIO
            </p>
            {/* Deconstructed cross */}
            <div style={{ position: "relative", width: 40, height: 40 }}>
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: C.white, opacity: 0.4 }} />
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: C.red, opacity: 0.6 }} />
            </div>
          </motion.div>
          <div className="md:col-span-8 flex flex-col gap-5">
            {designer.story.map((paragraph, i) => (
              <motion.p
                key={i}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: i === 0 ? "clamp(14px, 1.5vw, 18px)" : "12px",
                  lineHeight: 1.85,
                  color: i === 0 ? C.white : C.dim,
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

      {/* ── AVANT-GARDE PRINCIPLES ────────────────────────────────────────── */}
      <section
        className="py-24 px-8 md:px-16 relative overflow-hidden"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-14">
            <motion.p
              style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.3em", color: C.yellow, marginBottom: 12 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THERMAL PROTOCOL
            </motion.p>
            <motion.h2
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(38px, 5.5vw, 80px)",
                fontWeight: 900,
                lineHeight: 0.88,
                color: C.white,
                letterSpacing: "-0.02em",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              FOUR<br /><span style={{ color: C.red }}>RUPTURES</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: C.border }}>
            {[
              { n: "—01", title: "Break the silhouette.", body: "Expected shapes hide expected thinking. ONDO constructs from the seam outward — the join is the point, not the form it produces." },
              { n: "—02", title: "Heat is not warmth.", body: "We use thermal properties as conceptual material. A jacket that conducts. A collar that insulates. Function elevated to language." },
              { n: "—03", title: "Discomfort is information.", body: "Comfort is agreement. We do not always agree. Our pieces create productive friction — a shoulder that redirects attention, a cut that demands posture." },
              { n: "—04", title: "The system is the fabric.", body: "ONDO does not decorate cloth. It builds systems: patterns of tension and release that travel through every garment's construction, making structure visible." },
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
                      fontSize: "clamp(44px,5vw,72px)",
                      fontWeight: 900,
                      lineHeight: 0.8,
                      color: [C.white, C.red, C.yellow, C.white][i],
                    }}
                  >
                    {m.n}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.dim }}>
                    RUP.0{i + 1}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(15px,1.6vw,20px)", fontWeight: 900, color: C.white, marginBottom: 10, lineHeight: 1.2 }}>
                  {m.title}
                </h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.85, color: C.dim }}>
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
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.red, marginBottom: 40 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          LOOKBOOK — SEONGSU-DONG
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {designer.lookbook.map((img, i) => {
            const isWide = img.span === "wide";
            const isTall = img.span === "tall";
            return (
              <motion.div
                key={img.id}
                className={`${isWide ? "col-span-2" : ""} ${isTall ? "row-span-2" : ""} relative overflow-hidden`}
                style={{
                  height: isTall ? "clamp(320px, 35vw, 500px)" : "clamp(160px, 16vw, 240px)",
                  background: img.gradient,
                  border: `1px solid ${C.border}`,
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.9 }}
                whileHover={{ scale: 1.015 }}
              >
                {/* Red corner accent on hover */}
                <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: `2px solid ${C.red}`, borderLeft: `2px solid ${C.red}`, opacity: 0.5 }} />
                <div className="absolute bottom-3 left-3" style={{ color: C.dim, fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.12em" }}>
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
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.red, marginBottom: 10 }}>
              COLLECTION — THERMAL
            </p>
            <h2
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(32px, 5vw, 68px)",
                fontWeight: 900,
                lineHeight: 0.9,
                color: C.white,
                letterSpacing: "-0.02em",
              }}
            >
              Heat Studies
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-sm" style={{ color: C.dim, fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.7 }}>
            {designer.products.length} constructed pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px max-w-6xl mx-auto" style={{ background: C.border }}>
          {designer.products.map((product, i) => (
            <OndoProductCard
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
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", color: C.white }}
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

function OndoProductCard({ product, index, onSelect }: { product: Product; index: number; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const accentColor = [C.white, C.red, C.yellow, C.white][index % 4];

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
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(8,8,8,0.6)" }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: accentColor,
              border: `1px solid ${accentColor}`,
              padding: "10px 22px",
            }}
          >
            VIEW DETAILS
          </span>
        </motion.div>
        {/* Corner tick marks — avant-garde detail */}
        <div className="absolute top-3 left-3" style={{ width: 12, height: 12, borderTop: `1px solid ${C.white}`, borderLeft: `1px solid ${C.white}`, opacity: 0.4 }} />
        <div className="absolute top-3 right-3" style={{ width: 12, height: 12, borderTop: `1px solid ${C.white}`, borderRight: `1px solid ${C.white}`, opacity: 0.4 }} />
        <span
          className="absolute bottom-4 left-4"
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em", color: "#fff", opacity: 0.3 }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {product.featured && (
          <span
            className="absolute bottom-4 right-4"
            style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.18em", color: C.red }}
          >
            FEATURED
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
                color: C.white,
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </h3>
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(13px,1.3vw,16px)", color: accentColor, whiteSpace: "nowrap" }}>
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
            border: `1px solid ${accentColor}`,
            color: accentColor,
            background: "transparent",
            cursor: "pointer",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = accentColor; (e.currentTarget as HTMLElement).style.color = C.bg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = accentColor; }}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
