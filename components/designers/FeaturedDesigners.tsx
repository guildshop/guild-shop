"use client";

import Link from "next/link";
import { designers } from "@/lib/designers";

// Muted bold colors matching the reference aesthetic
const BLOCK_COLORS: Record<string, { bg: string; fg: string }> = {
  vesper:      { bg: "#0a0a0a", fg: "#ffffff" },
  "nova-aura": { bg: "#1e2d5a", fg: "#ffffff" },
  terra:       { bg: "#b84e28", fg: "#ffffff" },
  lumi:        { bg: "#3d5a28", fg: "#ffffff" },
  soleil:      { bg: "#8a1828", fg: "#ffffff" },
  ondo:        { bg: "#1a30a0", fg: "#ffffff" },
};

// Muted category tiles
const CATEGORY_TILES = [
  { label: "Outerwear",   bg: "#f2e4d0", fg: "#0a0a0a" },
  { label: "Couture",     bg: "#e4ddd4", fg: "#0a0a0a" },
  { label: "Jewellery",   bg: "#e8c8b4", fg: "#0a0a0a" },
  { label: "Textiles",    bg: "#d8e0c8", fg: "#0a0a0a" },
];

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
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
        }}
      >
        {GRID.map((tile, i) => (
          <div
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
          >
            <TileContent tile={tile} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TileContent({ tile }: { tile: Tile }) {
  if (tile.type === "designer") {
    const d = designers.find((x) => x.slug === tile.slug);
    if (!d) return null;
    const colors = BLOCK_COLORS[d.slug] ?? { bg: "#111", fg: "#fff" };

    return (
      <Link
        href={`/designers/${d.slug}`}
        className="absolute inset-0 flex flex-col justify-between p-4 group"
        style={{ background: colors.bg }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: colors.fg,
            opacity: 0.55,
          }}
        >
          {d.location}
        </span>

        <div>
          <div
            style={{
              fontFamily: "'Barlow', system-ui, sans-serif",
              fontSize: "clamp(22px, 2.8vw, 40px)",
              fontWeight: 900,
              textTransform: "uppercase",
              color: colors.fg,
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              marginBottom: "8px",
            }}
          >
            {d.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: colors.fg,
              opacity: 0.5,
            }}
          >
            {d.products.length} pieces · {d.founded}
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "22px",
            height: "22px",
            border: `1px solid ${colors.fg}`,
            opacity: 0.4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1 8L8 1M8 1H2M8 1V7" stroke={colors.fg} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </Link>
    );
  }

  if (tile.type === "category") {
    const cat = tile as { type: "category"; label: string; bg: string; fg: string };
    return (
      <Link
        href="/designers"
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: cat.bg }}
      >
        <span
          style={{
            fontFamily: "'Barlow', system-ui, sans-serif",
            fontSize: "clamp(18px, 2.5vw, 34px)",
            fontWeight: 900,
            textTransform: "uppercase",
            color: cat.fg,
            letterSpacing: "0.02em",
          }}
        >
          {cat.label}
        </span>
      </Link>
    );
  }

  // Photo placeholder
  const photo = tile as { type: "photo"; label?: string };
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-4"
      style={{ background: "var(--color-bg-2)" }}
    >
      {photo.label && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-fg-mid)",
          }}
        >
          {photo.label}
        </span>
      )}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "22px",
          height: "22px",
          border: "1px solid var(--color-fg)",
          opacity: 0.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
