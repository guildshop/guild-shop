"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface MeasurementsModalProps {
  product: Product | null;
  designerName: string;
  designerSlug: string;
  onClose: () => void;
  accent: string;
  bg: string;
  fg: string;
  border: string;
  fontMono?: string;
}

export function MeasurementsModal({
  product,
  designerName,
  designerSlug,
  onClose,
  accent,
  bg,
  fg,
  border,
  fontMono = "var(--font-mono)",
}: MeasurementsModalProps) {
  const { addItem, openCart } = useCartStore();
  const [measurements, setMeasurements] = useState({ chest: "", waist: "", hips: "", height: "", notes: "" });
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setMeasurements({ chest: "", waist: "", hips: "", height: "", notes: "" });
      setError("");
    }
  }, [product?.id]);

  const handleAdd = () => {
    if (!product) return;
    const { chest, waist, hips, height } = measurements;
    if (!chest || !waist || !hips || !height) {
      setError("Please fill in all measurements to continue.");
      return;
    }
    setError("");
    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      designerName,
      designerSlug,
      price: product.price,
      colorway: product.colorway,
      measurements: { chest, waist, hips, height, notes: measurements.notes },
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      openCart();
    }, 800);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    background: "transparent",
    border: `1px solid ${border}`,
    color: fg,
    fontFamily: fontMono,
    fontSize: "13px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: fontMono,
    fontSize: "9px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: accent,
    opacity: 0.7,
    marginBottom: "5px",
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg overflow-y-auto no-scrollbar"
            style={{ background: bg }}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 38 }}
          >
            {/* Color swatch */}
            <div style={{ height: "clamp(180px, 22vw, 280px)", background: product.colorway }} />

            <div style={{ padding: "clamp(24px, 3vw, 40px)" }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p style={{ fontFamily: fontMono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: accent, marginBottom: "6px" }}>
                    {product.category}
                  </p>
                  <h2 style={{ fontFamily: "var(--font-body, 'Barlow', system-ui, sans-serif)", fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 900, textTransform: "uppercase", color: fg, lineHeight: 1.05 }}>
                    {product.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "0.1em", color: fg, opacity: 0.4, flexShrink: 0, marginLeft: "12px" }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontFamily: fontMono, fontSize: "12px", lineHeight: 1.7, color: fg, opacity: 0.6, marginBottom: "20px" }}>
                {product.description}
              </p>

              {/* Made to order badge */}
              <div style={{ padding: "10px 14px", border: `1px solid ${accent}`, marginBottom: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: accent, fontSize: "12px" }}>✦</span>
                <p style={{ fontFamily: fontMono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: accent }}>
                  Made to Order — Crafted exclusively to your measurements
                </p>
              </div>

              {/* Measurements form */}
              <div style={{ marginBottom: "22px" }}>
                <p style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: accent, marginBottom: "14px" }}>
                  Your Measurements (cm)
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { key: "chest", label: "Chest / Bust" },
                    { key: "waist", label: "Waist" },
                    { key: "hips", label: "Hips" },
                    { key: "height", label: "Height" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        type="number"
                        value={measurements[key as keyof typeof measurements]}
                        onChange={(e) => setMeasurements((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder="cm"
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={labelStyle}>Special Notes (optional)</label>
                  <textarea
                    value={measurements.notes}
                    onChange={(e) => setMeasurements((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any fit preferences or special requests..."
                    rows={2}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>
                {error && (
                  <p style={{ color: "#ff4444", fontFamily: fontMono, fontSize: "9px", letterSpacing: "0.1em", marginTop: "8px" }}>
                    ↑ {error}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-5">
                <p style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 900, color: accent }}>
                  {formatPrice(product.price)}
                </p>
                <p style={{ fontFamily: fontMono, fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: fg, opacity: 0.4 }}>
                  Edition · Made to Order
                </p>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: added ? accent : "transparent",
                  color: added ? bg : fg,
                  border: `1px solid ${added ? accent : fg}`,
                  fontFamily: fontMono,
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
