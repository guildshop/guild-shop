"use client";

import { useState } from "react";
import Link from "next/link";
import { getFeaturedProducts, getDesigner } from "@/lib/designers";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

// Muted block colors matching bento aesthetic
const BLOCK_COLORS: Record<string, { bg: string; fg: string }> = {
  vesper:      { bg: "#0a0a0a", fg: "#ffffff" },
  "nova-aura": { bg: "#1e2d5a", fg: "#ffffff" },
  terra:       { bg: "#b84e28", fg: "#ffffff" },
  lumi:        { bg: "#3d5a28", fg: "#ffffff" },
  soleil:      { bg: "#8a1828", fg: "#ffffff" },
  ondo:        { bg: "#1a30a0", fg: "#ffffff" },
};

export function MarketplacePreview() {
  const products = getFeaturedProducts();

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

      {/* 4-column product grid */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}
      >
        {products.map((product, i) => {
          const designer = getDesigner(product.designerId)!;
          const colors = BLOCK_COLORS[designer.slug] ?? { bg: "#111", fg: "#fff" };
          return (
            <ProductTile
              key={product.id}
              product={product}
              designer={designer}
              colors={colors}
              index={i}
            />
          );
        })}
      </div>
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
  const { addItem, openCart } = useCartStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      designerName: designer.name,
      designerSlug: designer.slug,
      price: product.price,
      colorway: product.colorway,
    });
    openCart();
  };

  return (
    <Link
      href={`/designers/${designer.slug}`}
      className="block relative"
      style={{
        borderRight: index % 4 < 3 ? "1px solid var(--color-fg)" : "none",
        borderBottom: "1px solid var(--color-fg)",
        background: colors.bg,
        height: "clamp(200px, 26vw, 360px)",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        {hovered && (
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-between mb-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.bg,
            }}
          >
            <span>Add to Cart</span>
            <span>{formatPrice(product.price)}</span>
          </button>
        )}
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
