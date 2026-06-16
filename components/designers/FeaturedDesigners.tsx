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

// Bento layout — explicit placement on a 4-col grid so the panels tile
// perfectly with mixed shapes: tall rectangles, wide rectangles & squares.
//   gc = grid-column (start / span), gr = grid-row (start / span)
const GRID: Array<{ slug: string; gc: string; gr: string; dir: "left" | "right" }> = [
  { slug: "vesper",    gc: "1 / span 1", gr: "1 / span 2", dir: "left"  }, // tall rectangle
  { slug: "nova-aura", gc: "2 / span 2", gr: "1 / span 1", dir: "left"  }, // wide rectangle
  { slug: "terra",     gc: "4 / span 1", gr: "1 / span 1", dir: "right" }, // square
  { slug: "ondo",      gc: "2 / span 2", gr: "2 / span 2", dir: "right" }, // big square
  { slug: "soleil",    gc: "4 / span 1", gr: "2 / span 2", dir: "right" }, // tall rectangle
  { slug: "lumi",      gc: "1 / span 1", gr: "3 / span 1", dir: "left"  }, // square
];

const CELL_H = "clamp(160px, 19vw, 270px)";
const EASE = [0.16, 1, 0.3, 1] as const;

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
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: CELL_H, gap: 0, overflow: "hidden" }}>
        {GRID.map((tile, i) => (
          <div
            key={i}
            style={{
              gridColumn: tile.gc,
              gridRow: tile.gr,
              borderRight: "1px solid var(--color-fg)",
              borderBottom: "1px solid var(--color-fg)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <DesignerTile slug={tile.slug} />
          </div>
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
