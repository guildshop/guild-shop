"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import type { Designer, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductModal } from "./VesperPage";

const TerraCanvas = dynamic(() => import("./TerraCanvas"), {
  ssr: false,
  loading: () => null,
});

// TERRA — Earthy warmth · Lora serif · Terracotta & cream · Soft organic motion
// Theme: #f2ece4 bg (light!), #2c1f17 fg, #c17f52 accent

export function TerraPage({ designer }: { designer: Designer }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const cv = designer.theme.cssVars as Record<string, string>;

  return (
    <div
      className="designer-world"
      style={{ ...Object.fromEntries(Object.entries(cv)) as React.CSSProperties }}
    >
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end overflow-hidden"
        style={{ background: cv["--d-bg"] }}
      >
        {/* Organic background shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "clamp(400px, 60vw, 900px)",
              height: "clamp(400px, 60vw, 900px)",
              top: "-20%",
              right: "-15%",
              background: `radial-gradient(circle, ${cv["--d-accent"]}15 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 8, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "clamp(300px, 40vw, 600px)",
              height: "clamp(300px, 40vw, 600px)",
              bottom: "-10%",
              left: "-10%",
              background: `radial-gradient(circle, ${cv["--d-accent-2"]}10 0%, transparent 70%)`,
            }}
            animate={{ scale: [1.05, 1, 1.05], rotate: [0, -10, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Weave pattern overlay */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="terra-hero-weave" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 Q10 10 20 20 Q30 30 40 20" stroke={cv["--d-accent"]} strokeWidth="0.6" fill="none" opacity="0.15" />
                <path d="M0 0 Q10 10 20 0 Q30 -10 40 0" stroke={cv["--d-accent"]} strokeWidth="0.6" fill="none" opacity="0.08" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#terra-hero-weave)" />
          </svg>
        </div>

        {/* ── 3D Clay-Vessel Canvas — earthy organic scene ─────── */}
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ y: heroY }}
        >
          <TerraCanvas />
        </motion.div>

        {/* Cream vignette so text stays legible over the warm scene */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[55%] z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(242,236,228,0.85) 0%, rgba(242,236,228,0.35) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[45%] z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(242,236,228,0.85) 0%, transparent 100%)",
          }}
        />

        {/* Floating background type — ghost layer */}
        <motion.div
          className="absolute inset-0 z-[3] flex items-center justify-start px-8 md:px-16 select-none pointer-events-none"
          style={{ y: heroY }}
        >
          <span
            className="font-display"
            style={{
              fontFamily: designer.theme.fontDisplay,
              fontSize: "clamp(160px, 28vw, 380px)",
              fontWeight: 600,
              color: `${cv["--d-accent"]}10`,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            TERRA
          </span>
        </motion.div>

        {/* ── HANDWRITTEN MARGINALIA — top right ─────────────────── */}
        <motion.div
          className="absolute top-[calc(var(--nav-h)+24px)] right-8 z-[4] text-right pointer-events-none max-w-[200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          <p
            style={{
              fontFamily: designer.theme.fontDisplay,
              fontStyle: "italic",
              fontSize: "13px",
              color: cv["--d-fg-dim"],
              lineHeight: 1.6,
            }}
          >
            “The hands remember
            <br />
            what the mind forgets.”
          </p>
          <p
            style={{
              fontFamily: designer.theme.fontBody,
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: cv["--d-accent"],
              marginTop: 8,
              textTransform: "uppercase",
            }}
          >
            — Studio Notebook, 2024
          </p>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 pt-[calc(var(--nav-h)+80px)] pb-20">
          <motion.p
            className="text-label mb-8"
            style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontBody, letterSpacing: "0.15em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Oaxaca, Mexico · Est. {designer.founded}
          </motion.p>

          <div className="overflow-hidden mb-3">
            <motion.h1
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(56px, 10vw, 140px)",
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                color: cv["--d-fg"],
                fontStyle: "italic",
              }}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.45, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              From the earth,
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(56px, 10vw, 140px)",
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                color: cv["--d-accent"],
              }}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.58, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              for the body.
            </motion.h1>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.9 }}
          >
            <p
              className="max-w-xs leading-relaxed text-sm"
              style={{ color: cv["--d-fg-dim"], fontFamily: designer.theme.fontBody }}
            >
              {designer.tagline}
            </p>
            <a
              href="#collection"
              className="shrink-0 px-7 py-4 text-label border transition-all duration-400 hover:opacity-70"
              style={{
                color: cv["--d-fg"],
                borderColor: cv["--d-accent"],
                fontFamily: designer.theme.fontBody,
                letterSpacing: "0.1em",
              }}
            >
              View Collection
            </a>
          </motion.div>
        </div>

        {/* Bottom flourish */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${cv["--d-accent"]}60, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1.5 }}
        />
      </section>

      {/* ── STORY ─────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-8 md:px-16"
        style={{ background: cv["--d-bg-2"] }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <motion.p
              className="text-label mb-6"
              style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontBody, letterSpacing: "0.15em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Story
            </motion.p>
            {/* Decorative element */}
            <motion.div
              className="w-16 h-px mb-6"
              style={{ background: cv["--d-accent"] }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              className="relative overflow-hidden rounded-sm"
              style={{
                height: "200px",
                background: `linear-gradient(135deg, ${cv["--d-bg"]} 0%, ${cv["--d-accent"]}20 100%)`,
                border: `1px solid ${cv["--d-border"]}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {/* Weave texture */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <defs>
                  <pattern id="weave-detail" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M0 10 Q5 5 10 10 Q15 15 20 10" stroke={cv["--d-accent"]} strokeWidth="1" fill="none" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#weave-detail)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display italic text-4xl"
                  style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontDisplay, opacity: 0.4 }}
                >
                  TERRA
                </span>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-8">
            {designer.story.map((para, i) => (
              <motion.p
                key={i}
                className="leading-relaxed"
                style={{
                  color: i === 0 ? cv["--d-fg"] : cv["--d-fg-dim"],
                  fontFamily: designer.theme.fontBody,
                  fontSize: i === 0 ? "clamp(17px, 1.6vw, 22px)" : "15px",
                  fontStyle: i === designer.story.length - 1 ? "italic" : "normal",
                  borderLeft: i === designer.story.length - 1 ? `2px solid ${cv["--d-accent"]}` : "none",
                  paddingLeft: i === designer.story.length - 1 ? "20px" : "0",
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.9 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-8 md:px-16 overflow-hidden"
        style={{ background: cv["--d-bg-2"], borderTop: `1px solid ${cv["--d-border"]}` }}
      >
        {/* Hand-drawn weave decoration */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="terra-process-weave" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40 Q20 20 40 40 Q60 60 80 40" stroke={cv["--d-accent"]} strokeWidth="0.8" fill="none" opacity="0.12" />
              <path d="M0 0 Q20 20 40 0 Q60 -20 80 0" stroke={cv["--d-accent-2"]} strokeWidth="0.8" fill="none" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#terra-process-weave)" />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <p
                className="text-label mb-3"
                style={{
                  color: cv["--d-accent"],
                  fontFamily: designer.theme.fontBody,
                  letterSpacing: "0.22em",
                }}
              >
                The Process
              </p>
              <h2
                style={{
                  fontFamily: designer.theme.fontDisplay,
                  fontSize: "clamp(36px, 5.5vw, 80px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: cv["--d-fg"],
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                }}
              >
                From earth to thread,
                <br />
                <span style={{ fontStyle: "normal", color: cv["--d-accent"] }}>
                  by hand, by season.
                </span>
              </h2>
            </div>
            <p
              className="max-w-xs"
              style={{
                fontFamily: designer.theme.fontBody,
                color: cv["--d-fg-dim"],
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Every piece passes through four rhythms — gathered, prepared, woven, blessed. The seasons set our pace.
            </p>
          </div>

          {/* Process steps — staggered, hand-numbered */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                n: "i.",
                month: "Spring",
                title: "Gather",
                body: "Cotton from the Oaxaca valley, alpaca wool from Andean cooperatives, indigo from local growers.",
                stain: "#c17f52",
              },
              {
                n: "ii.",
                month: "Summer",
                title: "Prepare",
                body: "Fibers are sun-bleached on stone, dyed in copper vats with mineral pigments, dried in shade.",
                stain: "#a86234",
              },
              {
                n: "iii.",
                month: "Autumn",
                title: "Weave",
                body: "Backstrap looms set in the studio courtyard. Each piece is the rhythm of one weaver, one season.",
                stain: "#7a4628",
              },
              {
                n: "iv.",
                month: "Winter",
                title: "Bless",
                body: "Finished pieces rest on cedar racks for one full moon. Hand-stitched signature on the inside hem.",
                stain: "#d6b896",
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                className="relative p-6 md:p-7"
                style={{
                  background: cv["--d-bg"],
                  border: `1px solid ${cv["--d-border"]}`,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
                {/* Pigment stain — top right corner */}
                <span
                  className="absolute top-0 right-0 block rounded-full"
                  style={{
                    width: 18,
                    height: 18,
                    background: step.stain,
                    transform: "translate(8px, -8px)",
                    boxShadow: `0 0 16px ${step.stain}80`,
                  }}
                />

                <p
                  style={{
                    fontFamily: designer.theme.fontDisplay,
                    fontStyle: "italic",
                    fontSize: "clamp(36px, 4vw, 56px)",
                    fontWeight: 400,
                    color: step.stain,
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {step.n}
                </p>
                <p
                  className="text-label mb-2"
                  style={{
                    fontFamily: designer.theme.fontBody,
                    color: cv["--d-fg-dim"],
                    letterSpacing: "0.18em",
                  }}
                >
                  {step.month}
                </p>
                <h3
                  style={{
                    fontFamily: designer.theme.fontDisplay,
                    fontSize: "clamp(22px, 2vw, 30px)",
                    fontWeight: 500,
                    color: cv["--d-fg"],
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: designer.theme.fontBody,
                    fontSize: "13px",
                    color: cv["--d-fg-dim"],
                    lineHeight: 1.7,
                  }}
                >
                  {step.body}
                </p>

                {/* Hand-stitch line */}
                <svg
                  className="block mt-5"
                  width="100%"
                  height="6"
                  viewBox="0 0 200 6"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 3 Q10 0 20 3 T40 3 T60 3 T80 3 T100 3 T120 3 T140 3 T160 3 T180 3 T200 3"
                    stroke={step.stain}
                    strokeWidth="1"
                    fill="none"
                    opacity="0.7"
                    strokeDasharray="3 3"
                  />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-8 md:px-16"
        style={{ background: cv["--d-bg"] }}
      >
        <p className="text-label mb-12" style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontBody, letterSpacing: "0.15em" }}>
          Field Studies · SS25
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {designer.lookbook.map((img, i) => {
            const isWide = img.span === "wide";
            const isTall = img.span === "tall";
            return (
              <motion.div
                key={img.id}
                className={`relative overflow-hidden rounded-sm ${isWide ? "col-span-2" : ""}`}
                style={{
                  height: isTall ? "clamp(320px, 35vw, 500px)" : isWide ? "clamp(200px, 20vw, 280px)" : "clamp(180px, 18vw, 260px)",
                  background: img.gradient,
                  gridRow: isTall ? "span 2" : "span 1",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.015 }}
              >
                <div className="absolute bottom-3 left-3">
                  <p
                    className="text-label opacity-50"
                    style={{ color: cv["--d-fg"], fontFamily: designer.theme.fontBody, fontSize: "10px" }}
                  >
                    {img.alt.split("—")[0].trim()}
                  </p>
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
        style={{ background: cv["--d-bg-2"] }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-label mb-3" style={{ color: cv["--d-accent"], fontFamily: designer.theme.fontBody, letterSpacing: "0.15em" }}>
              Current Collection
            </p>
            <h2
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(40px, 6vw, 80px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: cv["--d-fg"],
                letterSpacing: "-0.02em",
              }}
            >
              Earth, Dye & Time
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {designer.products.map((product, i) => (
              <TerraProductCard
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

      {/* ── FOOTER STRIP ─────────────────────────────────────────────────── */}
      <div
        className="py-10 px-8 md:px-16 flex items-center justify-between border-t"
        style={{ background: cv["--d-bg"], borderColor: cv["--d-border"] }}
      >
        <Link
          href="/"
          className="text-label flex items-center gap-3 hover:opacity-60 transition-opacity"
          style={{ color: cv["--d-fg-dim"], fontFamily: designer.theme.fontBody, letterSpacing: "0.1em" }}
        >
          ← Guild Shop
        </Link>
        <Link href="/designers" className="text-label" style={{ color: cv["--d-fg-dim"] }}>
          Other Designers →
        </Link>
      </div>

      <ProductModal product={selectedProduct} designer={designer} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}

function TerraProductCard({
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
      className="relative cursor-pointer group overflow-hidden"
      style={{
        background: cv["--d-bg"],
        border: `1px solid ${cv["--d-border"]}`,
        borderRadius: "2px",
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      whileHover={{ y: -4 }}
    >
      {/* Visual */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(260px, 26vw, 380px)", background: product.colorway }}
      >
        {/* Hover label */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `${cv["--d-bg"]}90` }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="text-label italic px-6 py-3 border"
            style={{
              color: cv["--d-fg"],
              borderColor: cv["--d-accent"],
              fontFamily: designer.theme.fontDisplay,
              fontSize: "14px",
            }}
          >
            View Details
          </span>
        </motion.div>

        {product.featured && (
          <div
            className="absolute top-4 left-4 text-label px-3 py-1"
            style={{
              color: cv["--d-bg"],
              background: cv["--d-accent"],
              fontFamily: designer.theme.fontBody,
              letterSpacing: "0.12em",
              fontSize: "10px",
            }}
          >
            Selected Work
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p
              className="text-label mb-2"
              style={{ color: cv["--d-fg-dim"], fontFamily: designer.theme.fontBody, letterSpacing: "0.12em" }}
            >
              {product.category}
            </p>
            <h3
              style={{
                fontFamily: designer.theme.fontDisplay,
                fontSize: "clamp(20px, 2.2vw, 28px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: cv["--d-fg"],
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </h3>
          </div>
          <p
            className="shrink-0"
            style={{
              fontFamily: designer.theme.fontDisplay,
              fontSize: "clamp(16px, 1.6vw, 20px)",
              color: cv["--d-accent"],
              fontWeight: 400,
            }}
          >
            {formatPrice(product.price)}
          </p>
        </div>
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: cv["--d-fg-dim"], fontFamily: designer.theme.fontBody }}
        >
          {product.description}
        </p>
        {product.material && (
          <p
            className="text-label mt-3 opacity-60"
            style={{ color: cv["--d-fg-dim"], fontFamily: designer.theme.fontBody, fontSize: "10px" }}
          >
            {product.material.split(",")[0]}
          </p>
        )}
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
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = cv["--d-bg"]; }}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
