"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { designers } from "@/lib/designers";
import { useWorldTransition } from "@/components/ui/WorldTransition";

// Muted bold colors matching the reference aesthetic
const BLOCK_COLORS: Record<string, { bg: string; fg: string }> = {
  vesper:      { bg: "#0a0a0a", fg: "#ffffff" },
  "nova-aura": { bg: "#1e2d5a", fg: "#ffffff" },
  terra:       { bg: "#b84e28", fg: "#ffffff" },
  lumi:        { bg: "#3d5a28", fg: "#ffffff" },
  soleil:      { bg: "#8a1828", fg: "#ffffff" },
  ondo:        { bg: "#1a30a0", fg: "#ffffff" },
};

type Tile =
  | { type: "designer"; slug: string }
  | { type: "category"; label: string; bg: string; fg: string }
  | { type: "photo"; label?: string };

// Hand-crafted grid: 3 cols, varied spans
const GRID: Array<Tile & { col?: string; row?: string }> = [
  { type: "designer",  slug: "vesper",      col: "span 1", row: "span 2" },
  { type: "photo",                          col: "span 1", row: "span 1" },
  { type: "designer",  slug: "nova-aura",   col: "span 1", row: "span 1" },
  { type: "category",  label: "Outerwear",  bg: "#f2e4d0", fg: "#0a0a0a", col: "span 1", row: "span 1" },
  { type: "designer",  slug: "terra",       col: "span 1", row: "span 1" },
  { type: "designer",  slug: "lumi",        col: "span 1", row: "span 2" },
  { type: "photo",     label: "AW 2026",    col: "span 1", row: "span 1" },
  { type: "category",  label: "Couture",    bg: "#e4ddd4", fg: "#0a0a0a", col: "span 1", row: "span 1" },
  { type: "designer",  slug: "soleil",      col: "span 1", row: "span 1" },
  { type: "category",  label: "Jewellery",  bg: "#e8c8b4", fg: "#0a0a0a", col: "span 1", row: "span 1" },
  { type: "designer",  slug: "ondo",        col: "span 1", row: "span 1" },
];

const CELL_H = "clamp(180px, 22vw, 300px)";
const EASE = [0.16, 1, 0.3, 1] as const;

// Per-tile entrance direction (matches the "blocks sliding into place" choreography)
// index follows GRID order: vesper, photo, nova-aura, outerwear, terra, lumi,
//                           photoAW, couture, soleil, jewellery, ondo
// Large displacements so each block slides fully out of its slot, then returns
const ENTER: Array<{ x: number; y: number }> = [
  { x:  900, y:    0 }, // vesper      → slides fully right
  { x:    0, y:  760 }, // photo       ↓ slides fully down
  { x:    0, y: -760 }, // nova-aura   ↑ slides fully up
  { x:  900, y:    0 }, // outerwear   → slides fully right
  { x:    0, y:  760 }, // terra       ↓ slides fully down
  { x:    0, y: -760 }, // lumi        ↑ slides fully up
  { x:    0, y:  760 }, // photo AW    ↓ slides fully down
  { x: -900, y:    0 }, // couture     ← slides fully left
  { x:    0, y:  760 }, // soleil      ↓ slides fully down
  { x:  900, y:    0 }, // jewellery   → slides fully right
  { x: -900, y:    0 }, // ondo        ← slides fully left
];

export function FeaturedDesigners() {
  return (
    <section style={{ borderBottom: "1px solid var(--color-fg)" }}>
      {/* Section label */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "clamp(12px,1.5vw,18px) var(--content-pad)",
          borderBottom: "1px solid var(--color-fg)",
        }}
      >
        <span className="text-label" style={{ color: "var(--color-fg)" }}>
          The Designers
        </span>
        <Link href="/designers" className="text-label" style={{ color: "var(--color-fg-mid)" }}>
          View All →
        </Link>
      </div>

      {/* Bento grid */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
        {GRID.map((tile, i) => (
          <motion.div
            key={i}
            style={{
              gridColumn: tile.col,
              gridRow: tile.row,
              height: tile.row === "span 2" ? `calc(${CELL_H} * 2 + 1px)` : CELL_H,
              borderRight: "1px solid var(--color-fg)",
              borderBottom: "1px solid var(--color-fg)",
              position: "relative",
              overflow: "hidden",
            }}
            initial={{ x: 0, y: 0 }}
            whileInView={{
              x: [0, ENTER[i]?.x ?? 0, ENTER[i]?.x ?? 0, 0],
              y: [0, ENTER[i]?.y ?? -240, ENTER[i]?.y ?? -240, 0],
            }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.55,
              times: [0, 0.45, 0.55, 1],
              ease: [[0.6, 0, 0.4, 1], "linear", [0.6, 0, 0.4, 1]],
              delay: i * 0.02,
            }}
          >
            <TileContent tile={tile} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TileContent({ tile }: { tile: Tile }) {
  if (tile.type === "designer") return <DesignerTile slug={tile.slug} />;
  if (tile.type === "category") return <CategoryTile {...tile} />;
  return <PhotoTile label={tile.label} />;
}

// ── Designer tile ───────────────────────────────────────────────────
function DesignerTile({ slug }: { slug: string }) {
  const d = designers.find((x) => x.slug === slug);
  const { enterWorld } = useWorldTransition();
  if (!d) return null;
  const colors = BLOCK_COLORS[d.slug] ?? { bg: "#111", fg: "#fff" };
  const href = `/designers/${d.slug}`;

  const nameV: Variants = { rest: { y: 0, scale: 1 }, hover: { y: -6, scale: 1.05 } };
  const metaV: Variants = { rest: { opacity: 0.5, y: 0 }, hover: { opacity: 0, y: 6 } };
  const enterV: Variants = { rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } };
  const boxV: Variants = {
    rest:  { backgroundColor: "rgba(0,0,0,0)", rotate: 0, scale: 1 },
    hover: { backgroundColor: colors.fg, rotate: 45, scale: 1.1 },
  };
  const pathV: Variants = { rest: { stroke: colors.fg }, hover: { stroke: colors.bg } };
  const sheenV: Variants = { rest: { x: "-120%", opacity: 0 }, hover: { x: "120%", opacity: 1 } };

  return (
    <Link
      href={href}
      className="absolute inset-0"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        enterWorld(href, d.name);
      }}
    >
      <motion.div
        className="absolute inset-0 flex flex-col justify-between p-4"
        style={{ background: colors.bg, overflow: "hidden" }}
        initial="rest"
        animate="rest"
        whileHover="hover"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {/* Diagonal sheen sweep on hover */}
        <motion.div
          aria-hidden
          className="absolute inset-y-0 pointer-events-none"
          style={{
            width: "60%",
            left: 0,
            background: `linear-gradient(105deg, transparent, ${colors.fg}22, transparent)`,
            filter: "blur(2px)",
          }}
          variants={sheenV}
          transition={{ duration: 0.9, ease: EASE }}
        />

        <span
          style={{
            fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em",
            textTransform: "uppercase", color: colors.fg, opacity: 0.55, position: "relative",
          }}
        >
          {d.location}
        </span>

        <div style={{ position: "relative" }}>
          <motion.div
            variants={nameV}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              fontFamily: "'Barlow', system-ui, sans-serif",
              fontSize: "clamp(22px, 2.8vw, 40px)", fontWeight: 900, textTransform: "uppercase",
              color: colors.fg, lineHeight: 0.95, letterSpacing: "-0.01em", marginBottom: "8px",
              transformOrigin: "left bottom",
            }}
          >
            {d.name}
          </motion.div>

          <motion.div
            variants={metaV}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em",
              textTransform: "uppercase", color: colors.fg, position: "absolute",
            }}
          >
            {d.products.length} pieces · {d.founded}
          </motion.div>

          <motion.div
            variants={enterV}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em",
              textTransform: "uppercase", color: colors.fg,
            }}
          >
            Enter World →
          </motion.div>
        </div>

        {/* Arrow box — fills + rotates on hover */}
        <motion.div
          variants={boxV}
          transition={{ duration: 0.45, ease: EASE }}
          style={{
            position: "absolute", top: "12px", right: "12px", width: "22px", height: "22px",
            border: `1px solid ${colors.fg}`, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <motion.path
              d="M1 8L8 1M8 1H2M8 1V7"
              variants={pathV}
              transition={{ duration: 0.45, ease: EASE }}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </Link>
  );
}

// ── Category tile ───────────────────────────────────────────────────
function CategoryTile({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <Link href="/designers" className="absolute inset-0">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: bg, overflow: "hidden" }}
        initial="rest"
        animate="rest"
        whileHover="hover"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <motion.span
          variants={{ rest: { letterSpacing: "0.02em", scale: 1 }, hover: { letterSpacing: "0.16em", scale: 1.05 } }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(18px, 2.5vw, 34px)",
            fontWeight: 900, textTransform: "uppercase", color: fg, display: "inline-block",
          }}
        >
          {label}
        </motion.span>
        <motion.div
          aria-hidden
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            position: "absolute", bottom: "22%", height: "2px", width: "40%",
            background: fg, transformOrigin: "left center",
          }}
        />
      </motion.div>
    </Link>
  );
}

// ── Photo tile ──────────────────────────────────────────────────────
function PhotoTile({ label }: { label?: string }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-between p-4"
      style={{ background: "var(--color-bg-2)", overflow: "hidden" }}
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.5 }}
        style={{ background: "var(--color-bg-3)" }}
      />
      {label && (
        <span
          style={{
            fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--color-fg-mid)", position: "relative",
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          position: "absolute", top: "12px", right: "12px", width: "22px", height: "22px",
          border: "1px solid var(--color-fg)", opacity: 0.25,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </motion.div>
  );
}
