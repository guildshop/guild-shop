"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAllProducts, getDesigner } from "@/lib/designers";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const allProducts = getAllProducts();
  const product = allProducts.find((p) => p.id === params.slug);
  if (!product) notFound();

  const designer = getDesigner(product.designerId);
  if (!designer) notFound();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const { addItem, openCart } = useCartStore();

  const gallery = designer.lookbook.slice(0, 4);

  const handleAdd = () => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      designerName: designer.name,
      designerSlug: designer.slug,
      price: product.price,
      colorway: product.colorway,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  return (
    <div
      style={{
        background: "var(--color-bg)",
        minHeight: "100vh",
        paddingTop: "var(--nav-h)",
      }}
    >
      {/* Breadcrumb */}
      <motion.div
        className="flex items-center gap-3 flex-wrap"
        style={{
          padding: "clamp(20px,3vw,32px) var(--content-pad)",
          borderBottom: "1px solid var(--color-border)",
        }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/"
          className="text-label link-luxury"
          style={{ color: "var(--color-fg-dim)" }}
        >
          Guild Shop
        </Link>
        <span className="text-label" style={{ color: "var(--color-fg-subtle)" }}>
          /
        </span>
        <Link
          href={`/designers/${designer.slug}`}
          className="text-label link-luxury"
          style={{ color: "var(--color-fg-dim)" }}
        >
          {designer.name}
        </Link>
        <span className="text-label" style={{ color: "var(--color-fg-subtle)" }}>
          /
        </span>
        <span className="text-label" style={{ color: "var(--color-fg)" }}>
          {product.name}
        </span>
      </motion.div>

      {/* Main layout */}
      <div
        className="grid grid-cols-12"
        style={{ minHeight: "calc(100vh - var(--nav-h) - 53px)" }}
      >
        {/* Gallery — left 7 cols */}
        <div className="col-span-12 lg:col-span-7 relative">
          {/* Main image */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "clamp(400px, 65vh, 700px)",
              borderBottom: "1px solid var(--color-border)",
              cursor: "zoom-in",
            }}
            onClick={() => setFullscreen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={galleryIndex}
                className="absolute inset-0"
                style={{ background: gallery[galleryIndex]?.gradient ?? product.colorway }}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>

            {/* View label */}
            <div className="absolute top-4 right-4 z-10">
              <span className="text-label" style={{ color: "rgba(255,255,255,0.5)" }}>
                Click to expand
              </span>
            </div>

            {/* Product name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)" }}
            >
              <p
                className="font-display italic"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, color: "#fff" }}
              >
                {product.name}
              </p>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div
            className="flex gap-2 overflow-x-auto no-scrollbar"
            style={{ padding: "12px", background: "var(--color-bg-2)" }}
          >
            {gallery.map((img, i) => (
              <motion.button
                key={img.id}
                className="shrink-0 relative overflow-hidden"
                style={{
                  width: "72px",
                  height: "88px",
                  background: img.gradient,
                  border:
                    i === galleryIndex
                      ? "2px solid var(--color-fg)"
                      : "2px solid transparent",
                  outline: "none",
                }}
                onClick={() => setGalleryIndex(i)}
                whileHover={{ opacity: 0.85 }}
              />
            ))}
          </div>
        </div>

        {/* Product info — right 5 cols */}
        <motion.div
          className="col-span-12 lg:col-span-5"
          style={{
            padding: "clamp(32px,4vw,56px) var(--content-pad)",
            borderLeft: "1px solid var(--color-border)",
            position: "sticky",
            top: "var(--nav-h)",
            height: "fit-content",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Designer link */}
          <Link
            href={`/designers/${designer.slug}`}
            className="text-label link-luxury block mb-4"
            style={{ color: "var(--color-fg-mid)" }}
          >
            {designer.name}
          </Link>

          {/* Product name */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.1,
              color: "var(--color-fg)",
              marginBottom: "clamp(8px,1vw,12px)",
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(18px, 2vw, 24px)",
              fontWeight: 300,
              color: "var(--color-fg)",
              marginBottom: "clamp(24px,3vw,36px)",
            }}
          >
            {formatPrice(product.price)}
          </p>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{ background: "var(--color-border)" }}
          />

          {/* Description */}
          <p
            style={{
              fontSize: "14px",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "var(--color-fg-mid)",
              marginBottom: "clamp(24px,3vw,36px)",
            }}
          >
            {product.description}
          </p>

          {/* Material */}
          {product.material && (
            <div className="mb-6">
              <span
                className="text-label block mb-2"
                style={{ color: "var(--color-fg-dim)" }}
              >
                Material
              </span>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 300,
                  color: "var(--color-fg-mid)",
                  lineHeight: 1.6,
                }}
              >
                {product.material}
              </p>
            </div>
          )}

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{ background: "var(--color-border)" }}
          />

          {/* Size selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label" style={{ color: "var(--color-fg-dim)" }}>
                Size
              </span>
              <button
                className="text-label link-luxury"
                style={{ color: "var(--color-fg-mid)" }}
              >
                Size Guide
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((s) => (
                <motion.button
                  key={s}
                  className="text-label"
                  style={{
                    padding: "10px 14px",
                    border: `1px solid ${selectedSize === s ? "var(--color-fg)" : "var(--color-border)"}`,
                    color: selectedSize === s ? "var(--color-bg)" : "var(--color-fg-mid)",
                    background: selectedSize === s ? "var(--color-fg)" : "transparent",
                    transition: "all 0.25s var(--ease-luxury)",
                  }}
                  onClick={() => setSelectedSize(s)}
                  whileTap={{ scale: 0.96 }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Add to cart button */}
          <motion.button
            className="w-full text-label flex items-center justify-center gap-3"
            style={{
              padding: "clamp(14px,2vw,18px) 24px",
              background: "var(--color-fg)",
              color: "var(--color-bg)",
              transition: "background 0.3s var(--ease-luxury), opacity 0.3s",
              opacity: selectedSize ? 1 : 0.6,
            }}
            onClick={handleAdd}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  Added to Cart
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {selectedSize ? "Add to Cart" : "Select a Size"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Edition note */}
          <p
            className="text-label text-center mt-4"
            style={{ color: "var(--color-fg-dim)" }}
          >
            Edition of 40 — {product.category}
          </p>

          {/* Divider */}
          <div
            className="h-px mt-8 mb-6"
            style={{ background: "var(--color-border)" }}
          />

          {/* Designer story snippet */}
          <div>
            <span
              className="text-label block mb-3"
              style={{ color: "var(--color-fg-dim)" }}
            >
              About {designer.name}
            </span>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "var(--color-fg-mid)",
                marginBottom: "12px",
              }}
            >
              {designer.shortBio}
            </p>
            <Link
              href={`/designers/${designer.slug}`}
              className="text-label link-luxury"
              style={{ color: "var(--color-fg)" }}
            >
              Enter the World →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen gallery overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-[9990] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <motion.div
              className="relative"
              style={{
                width: "min(90vw, 900px)",
                height: "min(85vh, 680px)",
                background: gallery[galleryIndex]?.gradient ?? product.colorway,
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute top-6 right-6 text-label"
              style={{ color: "rgba(255,255,255,0.6)" }}
              onClick={() => setFullscreen(false)}
            >
              Close ✕
            </button>

            {/* Prev / Next */}
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 text-label"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onClick={(e) => { e.stopPropagation(); setGalleryIndex((g) => (g - 1 + gallery.length) % gallery.length); }}
            >
              ←
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-label"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onClick={(e) => { e.stopPropagation(); setGalleryIndex((g) => (g + 1) % gallery.length); }}
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
