"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import type { Designer, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductModal } from "./VesperPage";
import { useOpenProductFromQuery } from "@/lib/useOpenProductFromQuery";

const SoleilCanvas = dynamic(() => import("./SoleilCanvas"), {
  ssr: false,
  loading: () => null,
});

// SOLEIL — Whimsigoth · celestial dark · gold + midnight purple · moody opulence
// Palette: #07001a midnight, #c9a030 gold, #7040b0 purple, #d4b8e0 dusty lavender

const C = {
  bg:     "#07001a",
  bg2:    "#0d0028",
  gold:   "#c9a030",
  purple: "#7040b0",
  burg:   "#8b1a3a",
  dust:   "#d4b8e0",
  moon:   "#e8dfc8",
  dim:    "rgba(212,184,224,0.45)",
  border: "rgba(201,160,48,0.18)",
};

export function SoleilPage({ designer }: { designer: Designer }) {
  const [selectedProduct, setSelectedProduct] = useState<import("@/lib/types").Product | null>(null);
  useOpenProductFromQuery(designer.products, setSelectedProduct);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.dust }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-end overflow-hidden"
        style={{ background: C.bg }}
      >
        {/* Star field dots */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: i % 7 === 0 ? 2 : 1,
                height: i % 7 === 0 ? 2 : 1,
                left: `${(Math.sin(i * 137.5) * 0.5 + 0.5) * 100}%`,
                top: `${(Math.cos(i * 97.3) * 0.5 + 0.5) * 100}%`,
                background: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.dust : "#fff",
              }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + (i % 5) * 0.8, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* 3D Canvas */}
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <SoleilCanvas />
        </motion.div>

        {/* Left vignette */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[55%] z-[2] pointer-events-none"
          style={{ background: `linear-gradient(90deg, rgba(7,0,26,0.88) 0%, rgba(7,0,26,0.4) 55%, transparent 100%)` }}
        />
        {/* Bottom vignette */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[45%] z-[2] pointer-events-none"
          style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 100%)` }}
        />

        {/* Ornamental top border */}
        <div
          className="absolute top-[var(--nav-h)] inset-x-0 z-[3]"
          style={{ borderBottom: `1px solid ${C.border}`, padding: "8px clamp(20px,3vw,40px)" }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.22em", color: C.gold, opacity: 0.7 }}>
              ☽ PARIS, FRANCE · EST. {designer.founded} ☾
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.22em", color: C.dust, opacity: 0.5 }}>
              WHIMSIGOTH
            </span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-[4] px-8 md:px-16 pb-20 pt-[calc(var(--nav-h)+80px)] w-full">
          <motion.p
            style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.24em", color: C.gold, opacity: 0.75 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 0.4, duration: 0.9 }}
          >
            ✦ — DEMI-COUTURE OBSCURA
          </motion.p>

          <div className="mt-5 overflow-hidden">
            <motion.h1
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(72px, 14vw, 200px)",
                fontWeight: 700,
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                color: C.moon,
              }}
              initial={{ y: "110%", skewY: 4 }}
              animate={{ y: "0%", skewY: 0 }}
              transition={{ delay: 0.5, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              SO
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(72px, 14vw, 200px)",
                fontWeight: 700,
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                color: C.moon,
              }}
              initial={{ y: "110%", skewY: 4 }}
              animate={{ y: "0%", skewY: 0 }}
              transition={{ delay: 0.62, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              LEIL
            </motion.h1>
          </div>

          <motion.div
            className="flex items-center gap-8 mt-10"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontStyle: "italic", lineHeight: 1.8, color: C.dim, maxWidth: 320 }}>
              {designer.tagline}
            </p>
            <a
              href="#collection"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                padding: "10px 22px",
                border: `1px solid ${C.gold}`,
                color: C.gold,
                textDecoration: "none",
                transition: "all 0.4s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.gold; (e.currentTarget as HTMLElement).style.color = C.bg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = C.gold; }}
            >
              VIEW COLLECTION ↓
            </a>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 right-8 z-[4]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", color: C.gold, opacity: 0.5 }}>
            DESCEND
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
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.gold, marginBottom: 28 }}>
              THE ATELIER
            </p>
            {/* Moon phase symbols */}
            <div className="flex gap-4 items-center">
              {["🌑", "🌒", "🌓", "🌔", "🌕"].map((m, i) => (
                <span key={i} style={{ fontSize: "18px", opacity: 0.4 + i * 0.12 }}>{m}</span>
              ))}
            </div>
            <div className="w-px h-24 mt-6" style={{ background: `linear-gradient(to bottom, ${C.gold}, transparent)` }} />
          </motion.div>
          <div className="md:col-span-8 flex flex-col gap-6">
            {designer.story.map((paragraph, i) => (
              <motion.p
                key={i}
                style={{
                  fontFamily: i === 0 ? "Georgia, serif" : "var(--font-mono)",
                  fontSize: i === 0 ? "clamp(15px, 1.6vw, 20px)" : "13px",
                  lineHeight: 1.9,
                  color: i === 0 ? C.moon : C.dim,
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

      {/* ── GRIMOIRE ──────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-8 md:px-16 relative overflow-hidden"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-14">
            <motion.p
              style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.3em", color: C.gold, marginBottom: 12 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE GRIMOIRE
            </motion.p>
            <motion.h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(38px, 5.5vw, 80px)",
                fontWeight: 700,
                lineHeight: 0.9,
                color: C.moon,
                letterSpacing: "-0.01em",
                fontStyle: "italic",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              Four<br />Shadows
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: C.border }}>
            {[
              { sym: "☽", title: "Darkness is the canvas.", body: "We dress the in-between: midnight and dusk, the hour when light relinquishes its claim. SOLEIL pieces belong to transitional light." },
              { sym: "✦", title: "Whimsy survives grief.", body: "Gothic is not the absence of joy. It is joy that has survived something. Our silhouettes carry levity and weight simultaneously — deliberately." },
              { sym: "☿", title: "Gold against shadow.", body: "Opulence belongs to the night. Candlelight, gilded embroidery, amber — these are not daytime pleasures. They reveal themselves slowly, in darkness." },
              { sym: "⊕", title: "Celestial imprecision.", body: "The stars do not ask permission to be beautiful. SOLEIL does not seek approval from trend. We orbit our own fixed point — the ever-becoming." },
            ].map((m, i) => (
              <motion.div
                key={m.sym}
                style={{ background: C.bg2, padding: "clamp(28px,3vw,40px)" }}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <div className="flex items-baseline justify-between mb-5">
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "clamp(52px,6vw,88px)",
                      fontWeight: 700,
                      lineHeight: 0.8,
                      color: [C.gold, C.purple, C.dust, C.burg][i],
                    }}
                  >
                    {m.sym}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.dim }}>
                    TOME.0{i + 1}
                  </span>
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 700, fontStyle: "italic", color: C.moon, marginBottom: 10, lineHeight: 1.25 }}>
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
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.gold, marginBottom: 40 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          LOOKBOOK — SS25
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
                whileHover={{ scale: 1.015, borderColor: C.gold }}
              >
                <div className="absolute bottom-3 left-3" style={{ color: C.dust, fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.12em", opacity: 0.4 }}>
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
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.28em", color: C.gold, marginBottom: 10 }}>
              SS25 COLLECTION
            </p>
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(32px, 5vw, 68px)",
                fontWeight: 700,
                fontStyle: "italic",
                lineHeight: 0.92,
                color: C.moon,
                letterSpacing: "-0.01em",
              }}
            >
              Midnight Bloom
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-sm" style={{ color: C.dim, fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.7 }}>
            {designer.products.length} bewitched pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px max-w-6xl mx-auto" style={{ background: C.border }}>
          {designer.products.map((product, i) => (
            <SoleilProductCard
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
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", color: C.dust }}
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

function SoleilProductCard({ product, index, onSelect }: { product: import("@/lib/types").Product; index: number; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const accentColor = [C.gold, C.purple, C.dust, C.burg][index % 4];

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
          style={{ background: "rgba(7,0,26,0.55)" }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
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
        <span className="absolute top-4 left-4" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#fff", opacity: 0.3 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        {product.featured && (
          <span className="absolute top-4 right-4" style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.18em", color: C.gold }}>
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
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px, 2vw, 28px)", fontWeight: 700, fontStyle: "italic", color: C.moon, letterSpacing: "-0.01em" }}>
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
