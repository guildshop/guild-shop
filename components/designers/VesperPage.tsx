"use client";

import { useRef, useState, useEffect, Fragment } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Designer, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useOpenProductFromQuery } from "@/lib/useOpenProductFromQuery";

const VesperCanvas = dynamic(() => import("./VesperCanvas"), {
  ssr: false,
  loading: () => null,
});

// VESPER — Brutalist monochrome · Playfair Display · Stark · Architectural
// Theme: #080808 bg, #f0f0f0 fg, white accent, Space Mono body

export function VesperPage({ designer }: { designer: Designer }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useOpenProductFromQuery(designer.products, setSelectedProduct);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const cssVars = designer.theme.cssVars as Record<string, string>;

  return (
    <div
      className="designer-world min-h-screen"
      style={Object.fromEntries(Object.entries(cssVars)) as React.CSSProperties}
    >
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-end overflow-hidden"
        style={{ background: cssVars["--d-bg"] }}
      >
        {/* Animated grid lines */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 bottom-0 border-l"
              style={{
                left: `${(i + 1) * (100 / 13)}%`,
                borderColor: `${cssVars["--d-fg"]}08`,
              }}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.04, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 border-t"
              style={{
                top: `${(i + 1) * (100 / 9)}%`,
                borderColor: `${cssVars["--d-fg"]}08`,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>

        {/* ── 3D Monolith Canvas — brutalist architectural scene ──── */}
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <VesperCanvas />
        </motion.div>

        {/* Large background text — ghosted, behind the canvas */}
        <motion.div
          className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <span
            className="font-display"
            style={{
              fontFamily: designer.theme.fontDisplay,
              fontSize: "clamp(180px, 28vw, 400px)",
              fontWeight: 700,
              color: `${cssVars["--d-fg"]}03`,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            VESPER
          </span>
        </motion.div>

        {/* Left vignette so the title remains crisp over the 3D scene */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[55%] z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.45) 50%, transparent 100%)",
          }}
        />
        {/* Bottom vignette */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[40%] z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 100%)",
          }}
        />

        {/* ── RULER TICKS — left edge, architectural blueprint feel ── */}
        <div
          aria-hidden
          className="absolute top-[var(--nav-h)] bottom-0 left-2 z-[3] flex flex-col justify-between py-8 pointer-events-none"
          style={{ width: 24 }}
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="block"
                style={{
                  width: i % 5 === 0 ? 14 : 7,
                  height: 1,
                  background: cssVars["--d-fg"],
                  opacity: i % 5 === 0 ? 0.4 : 0.15,
                }}
              />
              {i % 5 === 0 && (
                <span
                  style={{
                    fontFamily: designer.theme.fontMono,
                    fontSize: "9px",
                    color: cssVars["--d-fg"],
                    opacity: 0.35,
                    letterSpacing: "0.15em",
                  }}
                >
                  {String(i * 7).padStart(3, "0")}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Coordinates — single line, ties the ruler ticks to a real place */}
        <motion.p
          className="absolute top-[calc(var(--nav-h)+24px)] right-8 z-[3] text-right pointer-events-none"
          style={{
            fontFamily: designer.theme.fontMono,
            fontSize: "10px",
            color: cssVars["--d-fg-dim"],
            letterSpacing: "0.22em",
          }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          N 52°31′27″ · E 13°24′37″
        </motion.p>

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 pb-20 pt-[calc(var(--nav-h)+80px)] w-full">
          <motion.p
            className="text-label mb-6"
            style={{ color: cssVars["--d-fg-dim"], fontFamily: designer.theme.fontMono }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Berlin, Germany · Est. {designer.founded}
          </motion.p>

          <div className="overflow-hidden mb-2">
            <motion.h1
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(72px, 14vw, 200px)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                color: cssVars["--d-fg"],
              }}
              initial={{ y: "110%", skewY: 5 }}
              animate={{ y: "0%", skewY: 0 }}
              transition={{ delay: 0.5, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              VES
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(72px, 14vw, 200px)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                color: cssVars["--d-fg"],
              }}
              initial={{ y: "110%", skewY: 5 }}
              animate={{ y: "0%", skewY: 0 }}
              transition={{ delay: 0.62, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              PER
            </motion.h1>
          </div>

          <motion.div
            className="flex items-center gap-8 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p
              className="max-w-xs text-sm leading-relaxed"
              style={{ color: cssVars["--d-fg-dim"], fontFamily: designer.theme.fontBody }}
            >
              {designer.tagline}
            </p>
            <a
              href="#collection"
              className="text-label border border-current px-6 py-3 hover:bg-white hover:text-black transition-all duration-500"
              style={{ color: cssVars["--d-fg"], fontFamily: designer.theme.fontMono }}
            >
              View Collection ↓
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span
            className="text-label"
            style={{ color: `${cssVars["--d-fg"]}50`, fontFamily: designer.theme.fontMono, fontSize: "10px" }}
          >
            SCROLL
          </span>
        </motion.div>
      </section>

      {/* ── STORY ─────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-8 md:px-16"
        style={{ background: cssVars["--d-bg-2"], borderTop: `1px solid ${cssVars["--d-border"]}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-6xl mx-auto">
          <motion.div
            className="md:col-span-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p
              className="text-label mb-8"
              style={{ color: cssVars["--d-accent"], fontFamily: designer.theme.fontMono }}
            >
              THE STUDIO
            </p>
            <div className="w-px h-32" style={{ background: cssVars["--d-fg-dim"] }} />
          </motion.div>
          <div className="md:col-span-8 flex flex-col gap-6">
            {designer.story.map((paragraph, i) => (
              <motion.p
                key={i}
                className="leading-relaxed"
                style={{
                  color: i === 0 ? cssVars["--d-fg"] : cssVars["--d-fg-dim"],
                  fontFamily: designer.theme.fontBody,
                  fontSize: i === 0 ? "clamp(18px, 2vw, 24px)" : "15px",
                  fontStyle: i === designer.story.length - 1 ? "italic" : "normal",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.8 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-8 md:px-16 overflow-hidden"
        style={{
          background: cssVars["--d-bg"],
          borderTop: `1px solid ${cssVars["--d-border"]}`,
        }}
      >
        {/* Concrete grid backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 bottom-0 border-l"
              style={{
                left: `${(i + 1) * (100 / 23)}%`,
                borderColor: cssVars["--d-fg"],
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
            <div className="md:col-span-3">
              <p
                style={{
                  fontFamily: designer.theme.fontMono,
                  fontSize: "10px",
                  color: cssVars["--d-fg-dim"],
                  letterSpacing: "0.3em",
                }}
              >
                MANIFESTO / 04
              </p>
              <div
                className="w-full h-px mt-3"
                style={{ background: cssVars["--d-fg"], opacity: 0.4 }}
              />
            </div>
            <h2
              className="md:col-span-9"
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(40px, 6vw, 88px)",
                fontWeight: 900,
                color: cssVars["--d-fg"],
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
              }}
            >
              FOUR<br />DECISIONS<br />
              <span
                style={{
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: cssVars["--d-fg-dim"],
                }}
              >
                (no exceptions)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: cssVars["--d-border"] }}>
            {[
              {
                n: "I",
                title: "Structure before silhouette.",
                body: "Every garment begins with an architectural problem: how shall this body inhabit this volume? Aesthetics emerge from solution, not from style.",
              },
              {
                n: "II",
                title: "Weight is honesty.",
                body: "We do not lighten what should be heavy. Boiled wool, cast brass, dense linen — material declares itself in its mass.",
              },
              {
                n: "III",
                title: "Forty pieces. Then nothing.",
                body: "Every edition closes at forty. There is no restocking, no second run, no compromise of scarcity for revenue.",
              },
              {
                n: "IV",
                title: "Silence is a finish.",
                body: "We remove what does not need to be there: branding, ornament, the conversation a garment has with the eye. What remains, speaks.",
              },
            ].map((m, i) => (
              <motion.div
                key={m.n}
                className="p-8 md:p-10"
                style={{ background: cssVars["--d-bg-2"] }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span
                    style={{
                      fontFamily: designer.theme.fontDisplay,
                      fontSize: "clamp(60px, 6vw, 100px)",
                      fontWeight: 900,
                      color: cssVars["--d-accent"],
                      lineHeight: 0.8,
                    }}
                  >
                    {m.n}
                  </span>
                  <span
                    style={{
                      fontFamily: designer.theme.fontMono,
                      fontSize: "10px",
                      color: cssVars["--d-fg-dim"],
                      letterSpacing: "0.3em",
                    }}
                  >
                    DEC.0{i + 1}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: designer.theme.fontDisplay,
                    fontSize: "clamp(20px, 2vw, 28px)",
                    fontWeight: 700,
                    color: cssVars["--d-fg"],
                    lineHeight: 1.15,
                    marginBottom: 12,
                  }}
                >
                  {m.title}
                </h3>
                <p
                  style={{
                    fontFamily: designer.theme.fontBody,
                    fontSize: "14px",
                    color: cssVars["--d-fg-dim"],
                    lineHeight: 1.7,
                  }}
                >
                  {m.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-8 md:px-16"
        style={{ background: cssVars["--d-bg"] }}
      >
        <motion.p
          className="text-label mb-12"
          style={{ color: cssVars["--d-fg-dim"], fontFamily: designer.theme.fontMono }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          LOOKBOOK — AW24
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
                  height: isTall ? "clamp(320px, 35vw, 520px)" : "clamp(180px, 18vw, 260px)",
                  background: img.gradient,
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="absolute bottom-3 left-3 text-label opacity-40"
                  style={{ color: cssVars["--d-fg"], fontFamily: designer.theme.fontMono, fontSize: "9px" }}
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
        style={{ background: cssVars["--d-bg-2"], borderTop: `1px solid ${cssVars["--d-border"]}` }}
      >
        <div className="flex items-end justify-between mb-16 max-w-6xl mx-auto">
          <div>
            <p
              className="text-label mb-3"
              style={{ color: cssVars["--d-accent"], fontFamily: designer.theme.fontMono }}
            >
              AW24 COLLECTION
            </p>
            <h2
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 700,
                color: cssVars["--d-fg"],
                letterSpacing: "-0.01em",
              }}
            >
              Void Studies
            </h2>
          </div>
          <p
            className="hidden md:block max-w-xs text-sm"
            style={{ color: cssVars["--d-fg-dim"], fontFamily: designer.theme.fontBody }}
          >
            {designer.products.length} works. Edition runs of 40.
          </p>
        </div>

        {/* Product grid — brutalist layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px max-w-6xl mx-auto" style={{ background: cssVars["--d-border"] }}>
          {designer.products.map((product, i) => (
            <VesperProductCard
              key={product.id}
              product={product}
              designer={designer}
              index={i}
              onSelect={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* ── BACK TO GUILD ─────────────────────────────────────────────────── */}
      <div
        className="py-12 px-8 md:px-16 flex items-center justify-between border-t"
        style={{ background: cssVars["--d-bg"], borderColor: cssVars["--d-border"] }}
      >
        <Link
          href="/"
          className="text-label flex items-center gap-3 hover:opacity-60 transition-opacity"
          style={{ color: cssVars["--d-fg"], fontFamily: designer.theme.fontMono }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          GUILD SHOP
        </Link>
        <Link
          href="/designers"
          className="text-label hover:opacity-60 transition-opacity"
          style={{ color: cssVars["--d-fg-dim"], fontFamily: designer.theme.fontMono }}
        >
          OTHER DESIGNERS →
        </Link>
      </div>

      {/* Product detail modal */}
      <ProductModal
        product={selectedProduct}
        designer={designer}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

function VesperProductCard({
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
  const cssVars = designer.theme.cssVars as Record<string, string>;

  return (
    <motion.div
      className="relative cursor-pointer group"
      style={{ background: cssVars["--d-bg"] }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Product visual */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(280px, 28vw, 420px)", background: product.colorway }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <span
            className="text-label border border-white/60 px-6 py-3"
            style={{ color: "#fff", fontFamily: designer.theme.fontMono }}
          >
            VIEW DETAILS
          </span>
        </motion.div>
        {/* Index */}
        <span
          className="absolute top-4 left-4 text-label opacity-30"
          style={{ color: "#fff", fontFamily: designer.theme.fontMono }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {product.featured && (
          <span
            className="absolute top-4 right-4 text-label"
            style={{ color: cssVars["--d-accent"], fontFamily: designer.theme.fontMono }}
          >
            FEATURED
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-6" style={{ borderTop: `1px solid ${cssVars["--d-border"]}` }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-label mb-2"
              style={{ color: cssVars["--d-fg-dim"], fontFamily: designer.theme.fontMono }}
            >
              {product.category.toUpperCase()}
            </p>
            <h3
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(20px, 2.5vw, 32px)",
                fontWeight: 700,
                color: cssVars["--d-fg"],
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </h3>
          </div>
          <p
            style={{
              fontFamily: designer.theme.fontMono,
              fontSize: "clamp(14px, 1.5vw, 18px)",
              color: cssVars["--d-fg"],
              opacity: 0.7,
              whiteSpace: "nowrap",
            }}
          >
            {formatPrice(product.price)}
          </p>
        </div>
        <p
          className="mt-3 text-sm leading-relaxed line-clamp-2"
          style={{ color: cssVars["--d-fg-dim"], fontFamily: designer.theme.fontBody }}
        >
          {product.description}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="mt-4 w-full py-3 text-label flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            fontFamily: designer.theme.fontMono,
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            border: `1px solid ${cssVars["--d-fg"]}`,
            color: cssVars["--d-fg"],
            background: "transparent",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = cssVars["--d-fg"]; (e.currentTarget as HTMLElement).style.color = cssVars["--d-bg"]; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = cssVars["--d-fg"]; }}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}

// ── Shared product detail modal (reused by all designer pages) ──────────────
// Custom, made-to-order measurements take extra tailoring work, so they
// carry a surcharge over the standard S/M/L/XL price.
const MADE_TO_ORDER_SURCHARGE_RATE = 0.15;

export function ProductModal({
  product,
  designer,
  onClose,
}: {
  product: Product | null;
  designer: Designer;
  onClose: () => void;
}) {
  const { addItem, openCart } = useCartStore();
  const cssVars = designer.theme.cssVars as Record<string, string>;
  const [added, setAdded] = useState(false);
  const [measurements, setMeasurements] = useState({ chest: "", waist: "", hips: "", height: "", notes: "" });
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setMeasurements({ chest: "", waist: "", hips: "", height: "", notes: "" });
      setSelectedSize("");
      setError("");
    }
  }, [product?.id]);

  // Lock body scroll while modal is open without jumping to top
  useEffect(() => {
    if (product) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (top) window.scrollTo(0, -parseInt(top));
    }
    return () => {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (top) window.scrollTo(0, -parseInt(top));
    };
  }, [product]);

  const hasFullMeasurements = Boolean(
    measurements.chest && measurements.waist && measurements.hips && measurements.height
  );
  const hasAnyMeasurement = Boolean(
    measurements.chest || measurements.waist || measurements.hips || measurements.height
  );
  // Size and custom measurements are mutually exclusive — picking one locks
  // out the other so a customer can't submit both.
  const sizeLocked = hasAnyMeasurement;
  const measurementsLocked = Boolean(selectedSize);
  const madeToOrderPrice = product
    ? Math.round(product.price * (1 + MADE_TO_ORDER_SURCHARGE_RATE))
    : 0;
  const displayPrice = hasFullMeasurements ? madeToOrderPrice : (product?.price ?? 0);

  const handleAddToCart = () => {
    if (!product) return;
    const { chest, waist, hips, height, notes } = measurements;
    const hasSize = Boolean(selectedSize);

    // Either a standard size OR full made-to-order measurements satisfies
    // the requirement — not both.
    if (!hasSize && !hasFullMeasurements) {
      setError("Please select a size or enter your measurements to continue.");
      return;
    }
    setError("");
    addItem({
      id: `${product.id}_${selectedSize || "custom"}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      designerName: designer.name,
      designerSlug: designer.slug,
      price: hasFullMeasurements ? madeToOrderPrice : product.price,
      colorway: product.colorway,
      ...(hasSize ? { size: selectedSize } : {}),
      ...(hasFullMeasurements ? { measurements: { chest, waist, hips, height, notes } } : {}),
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      openCart();
    }, 800);
  };

  const mono = designer.theme.fontMono;
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    background: "transparent",
    border: `1px solid ${cssVars["--d-border"]}`,
    color: cssVars["--d-fg"],
    fontFamily: mono,
    fontSize: "14px",
    outline: "none",
  };

  return (
    <AnimatePresence>
      {product && (
        <Fragment key="product-modal">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.75)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg"
            style={{ background: cssVars["--d-bg"], display: "flex", flexDirection: "column" }}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 38 }}
          >
            {/* ── Fixed header ── */}
            <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${cssVars["--d-border"]}`, flexShrink: 0 }}>
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: cssVars["--d-accent"], marginBottom: 6 }}>
                    {designer.name} · {product.category}
                  </p>
                  <h2 style={{ fontFamily: designer.theme.fontDisplay, fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 700, color: cssVars["--d-fg"], letterSpacing: "-0.01em", lineHeight: 1.05 }}>
                    {product.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  style={{ fontFamily: mono, fontSize: "12px", color: cssVars["--d-fg"], opacity: 0.4, marginLeft: 16, cursor: "pointer", background: "none", border: "none", flexShrink: 0 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ── Scrollable content ── */}
            <div data-lenis-prevent style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>

              {/* Product image */}
              <div style={{ width: "100%", height: "clamp(260px, 40vw, 420px)", background: product.colorway, flexShrink: 0 }} />

              <div style={{ padding: "24px" }}>

              <p style={{ fontFamily: designer.theme.fontBody, fontSize: "14px", color: cssVars["--d-fg-dim"], lineHeight: 1.7, marginBottom: 20 }}>
                {product.description}
              </p>

              {product.material && (
                <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${cssVars["--d-border"]}` }}>
                  <p style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: cssVars["--d-fg-dim"], marginBottom: 4 }}>Material</p>
                  <p style={{ fontFamily: designer.theme.fontBody, fontSize: "13px", color: cssVars["--d-fg"] }}>{product.material}</p>
                </div>
              )}

              {/* Size */}
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${cssVars["--d-border"]}` }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <p style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: cssVars["--d-accent"] }}>
                    Size
                  </p>
                  <button
                    type="button"
                    disabled={sizeLocked}
                    onClick={() => setSizeChartOpen(true)}
                    style={{
                      fontFamily: mono,
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: cssVars["--d-fg-dim"],
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                      background: "none",
                      border: "none",
                      cursor: sizeLocked ? "not-allowed" : "pointer",
                      opacity: sizeLocked ? 0.35 : 1,
                      padding: 0,
                    }}
                  >
                    Size Chart ↗
                  </button>
                </div>
                <div className="flex" style={{ gap: 8 }}>
                  {["S", "M", "L", "XL"].map((s) => {
                    const active = selectedSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={sizeLocked}
                        onClick={() => setSelectedSize((prev) => (prev === s ? "" : s))}
                        style={{
                          flex: 1,
                          padding: "12px 0",
                          fontFamily: mono,
                          fontSize: "12px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: active ? cssVars["--d-bg"] : cssVars["--d-fg"],
                          background: active ? cssVars["--d-fg"] : "transparent",
                          border: `1px solid ${active ? cssVars["--d-fg"] : cssVars["--d-border"]}`,
                          cursor: sizeLocked ? "not-allowed" : "pointer",
                          opacity: sizeLocked ? 0.35 : 1,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {sizeLocked && (
                  <p style={{ fontFamily: mono, fontSize: "9px", color: cssVars["--d-fg-dim"], opacity: 0.7, marginTop: 8 }}>
                    Clear your measurements below to choose a standard size instead.
                  </p>
                )}
              </div>

              {/* Measurements */}
              <div style={{ paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <p style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: cssVars["--d-accent"] }}>
                    Your Measurements
                  </p>
                  <span style={{ fontFamily: mono, fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 8px", border: `1px solid ${cssVars["--d-accent"]}`, color: cssVars["--d-accent"] }}>
                    Made to Order
                  </span>
                  <span style={{ fontFamily: mono, fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: cssVars["--d-fg-dim"], opacity: 0.6 }}>
                    {measurementsLocked ? "Locked — size selected" : "Required if no size selected"}
                  </span>
                </div>
                <p style={{ fontFamily: mono, fontSize: "11px", color: cssVars["--d-fg-dim"], lineHeight: 1.6, marginBottom: 4 }}>
                  {measurementsLocked
                    ? "You've selected a standard size. Deselect it above to enter custom measurements instead."
                    : "No standard size selected — enter your measurements in cm and we'll cut to your exact dimensions."}
                </p>
                {!measurementsLocked && (
                  <p style={{ fontFamily: mono, fontSize: "9px", color: cssVars["--d-accent"], opacity: 0.85, marginBottom: 16 }}>
                    Custom measurements add +{Math.round(MADE_TO_ORDER_SURCHARGE_RATE * 100)}% for the extra tailoring work involved.
                  </p>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, marginTop: measurementsLocked ? 16 : 0, opacity: measurementsLocked ? 0.35 : 1, transition: "opacity 0.15s ease" }}>
                  {[
                    { key: "chest",  label: "Chest / Bust" },
                    { key: "waist",  label: "Waist" },
                    { key: "hips",   label: "Hips" },
                    { key: "height", label: "Height" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontFamily: mono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: cssVars["--d-fg-dim"], marginBottom: 6 }}>
                        {label} (cm)
                      </label>
                      <input
                        type="number"
                        disabled={measurementsLocked}
                        value={measurements[key as keyof typeof measurements]}
                        onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder="e.g. 88"
                        style={{ ...inputStyle, cursor: measurementsLocked ? "not-allowed" : "text" }}
                      />
                    </div>
                  ))}
                </div>

                <label style={{ display: "block", fontFamily: mono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: cssVars["--d-fg-dim"], marginBottom: 6, opacity: measurementsLocked ? 0.35 : 1 }}>
                  Special Notes (optional)
                </label>
                <textarea
                  disabled={measurementsLocked}
                  value={measurements.notes}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any fit preferences or special requests..."
                  rows={3}
                  style={{ ...inputStyle, resize: "none", opacity: measurementsLocked ? 0.35 : 1, cursor: measurementsLocked ? "not-allowed" : "text", transition: "opacity 0.15s ease" }}
                />
              </div>
              </div>{/* end padding div */}
            </div>{/* end scroll div */}

            {/* ── Fixed footer ── */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${cssVars["--d-border"]}`, flexShrink: 0, background: cssVars["--d-bg"] }}>
              {error && (
                <p style={{ color: "#ff4444", fontFamily: mono, fontSize: "9px", letterSpacing: "0.1em", marginBottom: 8 }}>
                  ↑ {error}
                </p>
              )}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline" style={{ gap: 8 }}>
                  <p style={{ fontFamily: designer.theme.fontDisplay, fontSize: "clamp(20px, 2.5vw, 30px)", color: cssVars["--d-fg"], fontWeight: 400 }}>
                    {formatPrice(displayPrice)}
                  </p>
                  {hasFullMeasurements && (
                    <p style={{ fontFamily: mono, fontSize: "9px", color: cssVars["--d-fg-dim"], textDecoration: "line-through", opacity: 0.6 }}>
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
                <p style={{ fontFamily: mono, fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: cssVars["--d-fg-dim"] }}>
                  Edition of 40
                </p>
              </div>
              {hasFullMeasurements && (
                <p style={{ fontFamily: mono, fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: cssVars["--d-accent"], marginBottom: 12, marginTop: -6 }}>
                  +{Math.round(MADE_TO_ORDER_SURCHARGE_RATE * 100)}% for made-to-order custom fit
                </p>
              )}
              <motion.button
                onClick={handleAddToCart}
                className="w-full py-4 flex items-center justify-center"
                style={{
                  background: added ? cssVars["--d-fg"] : "transparent",
                  color: added ? cssVars["--d-bg"] : cssVars["--d-fg"],
                  border: `1px solid ${cssVars["--d-fg"]}`,
                  fontFamily: mono,
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                whileHover={{ background: cssVars["--d-fg"], color: cssVars["--d-bg"] }}
                whileTap={{ scale: 0.98 }}
              >
                {added ? "Added to Cart ✓" : "Add to Cart →"}
              </motion.button>
            </div>
          </motion.div>
        </Fragment>
      )}
      {product && (
        <SizeChartModal
          key="size-chart-modal"
          open={sizeChartOpen}
          onClose={() => setSizeChartOpen(false)}
          designer={designer}
          selectedSize={selectedSize}
          onSelectSize={(s) => {
            setSelectedSize(s);
            setSizeChartOpen(false);
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ── Size chart modal ──────────────────────────────────────────────────────
const SIZE_CHART_ROWS: Array<{ size: string; chest: string; waist: string; hips: string }> = [
  { size: "S",  chest: "84–89",  waist: "66–71",   hips: "89–94" },
  { size: "M",  chest: "90–95",  waist: "72–77",   hips: "95–100" },
  { size: "L",  chest: "96–101", waist: "78–84",   hips: "101–107" },
  { size: "XL", chest: "102–108", waist: "85–92",  hips: "108–115" },
];

function SizeChartModal({
  open,
  onClose,
  designer,
  selectedSize,
  onSelectSize,
}: {
  open: boolean;
  onClose: () => void;
  designer: Designer;
  selectedSize: string;
  onSelectSize: (size: string) => void;
}) {
  const cssVars = designer.theme.cssVars as Record<string, string>;
  const mono = designer.theme.fontMono;
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  const toIn = (range: string) =>
    range
      .split("–")
      .map((n) => (parseFloat(n) / 2.54).toFixed(1))
      .join("–");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0"
            style={{ background: "rgba(0,0,0,0.8)", zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed"
            style={{
              left: "50%",
              top: "50%",
              width: "min(92vw, 480px)",
              maxHeight: "86vh",
              overflowY: "auto",
              background: cssVars["--d-bg"],
              border: `1px solid ${cssVars["--d-border"]}`,
              zIndex: 10000,
            }}
            initial={{ opacity: 0, x: "-50%", y: "-46%", scale: 0.96 }}
            animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: "-50%", y: "-46%", scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
          >
            <div style={{ padding: "22px 24px", borderBottom: `1px solid ${cssVars["--d-border"]}` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: cssVars["--d-accent"], marginBottom: 4 }}>
                    {designer.name}
                  </p>
                  <h3 style={{ fontFamily: designer.theme.fontDisplay, fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: cssVars["--d-fg"] }}>
                    Size Chart
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  style={{ fontFamily: mono, fontSize: "12px", color: cssVars["--d-fg"], opacity: 0.4, background: "none", border: "none", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              {/* Unit toggle */}
              <div className="flex" style={{ gap: 6, marginTop: 14 }}>
                {(["cm", "in"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    style={{
                      fontFamily: mono,
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      color: unit === u ? cssVars["--d-bg"] : cssVars["--d-fg-dim"],
                      background: unit === u ? cssVars["--d-fg"] : "transparent",
                      border: `1px solid ${unit === u ? cssVars["--d-fg"] : cssVars["--d-border"]}`,
                      cursor: "pointer",
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ padding: "18px 24px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr 1fr 1fr", gap: 0 }}>
                {["Size", "Chest", "Waist", "Hips"].map((h) => (
                  <div
                    key={h}
                    style={{
                      fontFamily: mono,
                      fontSize: "8px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: cssVars["--d-fg-dim"],
                      paddingBottom: 10,
                      borderBottom: `1px solid ${cssVars["--d-border"]}`,
                    }}
                  >
                    {h}
                  </div>
                ))}

                {SIZE_CHART_ROWS.map((row) => {
                  const active = selectedSize === row.size;
                  return (
                    <Fragment key={row.size}>
                      {(["size", "chest", "waist", "hips"] as const).map((col) => (
                        <button
                          key={col}
                          onClick={() => onSelectSize(row.size)}
                          style={{
                            textAlign: "left",
                            padding: "12px 4px 12px 0",
                            borderBottom: `1px solid ${cssVars["--d-border"]}`,
                            background: active ? `${cssVars["--d-accent"]}14` : "transparent",
                            border: "none",
                            borderBottomWidth: "1px",
                            borderBottomStyle: "solid",
                            borderBottomColor: cssVars["--d-border"],
                            cursor: "pointer",
                            fontFamily: mono,
                            fontSize: col === "size" ? "12px" : "11px",
                            fontWeight: col === "size" ? 700 : 400,
                            color: active ? cssVars["--d-accent"] : cssVars["--d-fg"],
                            transition: "background 0.15s ease",
                          }}
                        >
                          {col === "size" ? row.size : unit === "cm" ? row[col] : toIn(row[col])}
                        </button>
                      ))}
                    </Fragment>
                  );
                })}
              </div>

              <p style={{ fontFamily: mono, fontSize: "9px", color: cssVars["--d-fg-dim"], lineHeight: 1.7, marginTop: 16 }}>
                Measurements are body measurements, not garment dimensions. Click a row to select that size. Between sizes? We recommend sizing up — every piece is made to order and can be tailored to your exact measurements.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
