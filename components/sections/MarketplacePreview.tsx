"use client";

import { useState } from "react";
import Link from "next/link";
import { getFeaturedProducts, getDesigner } from "@/lib/designers";
import { formatPrice } from "@/lib/utils";
import { useWorldTransition } from "@/components/ui/WorldTransition";

// Muted block colors matching bento aesthetic
const BLOCK_COLORS: Record<string, { bg: string; fg: string }> = {
  vesper:      { bg: "#0a0a0a", fg: "#ffffff" },
  "nova-aura": { bg: "#1e2d5a", fg: "#ffffff" },
  terra:       { bg: "#b84e28", fg: "#ffffff" },
  lumi:        { bg: "#3d5a28", fg: "#ffffff" },
  soleil:      { bg: "#8a1828", fg: "#ffffff" },
  ondo:        { bg: "#1a30a0", fg: "#ffffff" },
};

// Each row loops in the direction of the arrows: left, right, left
const ROW_DIRECTION: Array<"left" | "right"> = ["left", "right", "left"];

export function MarketplacePreview() {
  const products = getFeaturedProducts();
  const rows = [products.slice(0, 4), products.slice(4, 8), products.slice(8, 12)];

  return (
    <section style={{ borderBottom: "1px solid var(--color-fg)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "clamp(12px,1.5vw,18px) var(--content-pad)",
          borderBottom: "1px solid var(--color-fg)",
        }}
      >
        <span className="text-label" style={{ color: "var(--color-fg)" }}>
          New Drops
        </span>
        <Link href="/designers" className="text-label" style={{ color: "var(--color-fg-mid)" }}>
          Browse All Collections →
        </Link>
      </div>

      {/* Three looping marquee rows */}
      {rows.map((rowProducts, rowIdx) => (
        <div
          key={rowIdx}
          className="gs-marquee-mask"
          style={{ borderBottom: rowIdx < rows.length - 1 ? "1px solid var(--color-fg)" : "none" }}
        >
          <div
            className={`gs-marquee-track${ROW_DIRECTION[rowIdx] === "right" ? " reverse" : ""}`}
            style={{ ["--marquee-dur" as string]: "26s" }}
          >
            {/* 3 contiguous copies → seamless -33.33% loop */}
            {[0, 1, 2].map((copy) =>
              rowProducts.map((product, i) => {
                const designer = getDesigner(product.designerId)!;
                const colors = BLOCK_COLORS[designer.slug] ?? { bg: "#111", fg: "#fff" };
                return (
                  <ProductTile
                    key={`${copy}-${product.id}`}
                    product={product}
                    designer={designer}
                    colors={colors}
                    index={rowIdx * 4 + i}
                  />
                );
              })
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

function ProductTile({
  product,
  designer,
  colors,
  index,
}: {
  product: ReturnType<typeof getFeaturedProducts>[0];
  designer: NonNullable<ReturnType<typeof getDesigner>>;
  colors: { bg: string; fg: string };
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const { enterWorld } = useWorldTransition();
  // Deep-link straight to this product — the designer page opens its detail
  // modal automatically when it sees the `product` query param.
  const href = `/designers/${designer.slug}?product=${product.id}`;

  return (
    <Link
      href={href}
      className="block relative"
      style={{
        flex: "0 0 auto",
        width: "clamp(240px, 24vw, 340px)",
        borderRight: "1px solid var(--color-fg)",
        background: colors.bg,
        height: "clamp(200px, 26vw, 360px)",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        enterWorld(href, designer.name, e);
      }}
    >
      {/* Index + designer */}
      <div
        className="absolute top-3 left-3 right-3 flex items-start justify-between z-10"
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", color: colors.fg, opacity: 0.45 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", color: colors.fg, opacity: 0.45 }}>
          {designer.name}
        </span>
      </div>

      {/* Product name */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          padding: "12px",
          background: hovered ? colors.fg : "transparent",
          transition: "background 0.25s ease",
        }}
      >
        <p
          style={{
            fontFamily: "'Barlow', system-ui, sans-serif",
            fontSize: "clamp(13px, 1.4vw, 18px)",
            fontWeight: 900,
            textTransform: "uppercase",
            color: hovered ? colors.bg : colors.fg,
            lineHeight: 1.0,
            transition: "color 0.25s ease",
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: hovered ? colors.bg : colors.fg,
            opacity: 0.55,
            marginTop: "3px",
            transition: "color 0.25s ease",
          }}
        >
          {product.category} · {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
