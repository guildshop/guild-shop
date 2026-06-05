"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const BLOCK_COLORS: Record<string, string> = {
  vesper:      "#0a0a0a",
  "nova-aura": "#1e2d5a",
  terra:       "#b84e28",
  lumi:        "#3d5a28",
  soleil:      "#8a1828",
  ondo:        "#1a30a0",
};

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();
  const cartTotal = total();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const goToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: "var(--color-bg)", borderLeft: "1px solid var(--color-fg)" }}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            {/* ── Header ─────────────────────────────── */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "clamp(16px,2vw,22px) clamp(20px,3vw,28px)",
                borderBottom: "1px solid var(--color-fg)",
              }}
            >
              <div className="flex items-center gap-6">
                <h2
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: "clamp(22px, 2.5vw, 30px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    lineHeight: 1,
                  }}
                >
                  Cart
                </h2>
                {itemCount > 0 && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      border: "1px solid var(--color-fg)",
                      color: "var(--color-fg-mid)",
                    }}
                  >
                    {itemCount} {itemCount === 1 ? "piece" : "pieces"}
                  </span>
                )}
              </div>

              <button
                onClick={closeCart}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-fg-mid)",
                }}
              >
                Close ×
              </button>
            </div>

            {/* ── Items ──────────────────────────────── */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    className="flex flex-col items-start justify-center h-full"
                    style={{ padding: "clamp(32px,5vw,56px) clamp(20px,3vw,28px)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p
                      style={{
                        fontFamily: "'Barlow', system-ui, sans-serif",
                        fontSize: "clamp(24px, 3vw, 36px)",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        color: "var(--color-fg)",
                        marginBottom: "16px",
                        lineHeight: 1.0,
                      }}
                    >
                      Your Cart<br />Is Empty.
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        lineHeight: 1.7,
                        color: "var(--color-fg-mid)",
                        marginBottom: "28px",
                      }}
                    >
                      Explore the guild to find something extraordinary.
                    </p>
                    <Link
                      href="/designers"
                      onClick={closeCart}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "12px 20px",
                        border: "1px solid var(--color-fg)",
                        color: "var(--color-fg)",
                        display: "inline-block",
                      }}
                    >
                      Browse Designers →
                    </Link>
                  </motion.div>
                ) : (
                  <div>
                    {items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        className="flex gap-4"
                        style={{
                          padding: "clamp(16px,2vw,22px) clamp(20px,3vw,28px)",
                          borderBottom: "1px solid var(--color-fg)",
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        layout
                      >
                        {/* Color swatch */}
                        <div
                          style={{
                            width: "60px",
                            height: "72px",
                            background: BLOCK_COLORS[item.designerSlug] ?? "#111",
                            flexShrink: 0,
                          }}
                        />

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "9px",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "var(--color-fg-dim)",
                                marginBottom: "4px",
                              }}
                            >
                              {item.designerName}
                            </p>
                            <p
                              style={{
                                fontFamily: "'Barlow', system-ui, sans-serif",
                                fontSize: "15px",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                color: "var(--color-fg)",
                                lineHeight: 1.1,
                              }}
                            >
                              {item.name}
                            </p>
                            {item.measurements && (
                              <div style={{ marginTop: "6px" }}>
                                <p
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "8px",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "var(--color-fg-dim)",
                                    lineHeight: 1.6,
                                  }}
                                >
                                  ✦ Made to Order
                                </p>
                                <p
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "8px",
                                    letterSpacing: "0.08em",
                                    color: "var(--color-fg-subtle)",
                                    lineHeight: 1.6,
                                  }}
                                >
                                  Chest {item.measurements.chest}cm · Waist {item.measurements.waist}cm · Hips {item.measurements.hips}cm · Height {item.measurements.height}cm
                                </p>
                                {item.measurements.notes && (
                                  <p
                                    style={{
                                      fontFamily: "var(--font-mono)",
                                      fontSize: "8px",
                                      color: "var(--color-fg-subtle)",
                                      opacity: 0.6,
                                      marginTop: "2px",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {item.measurements.notes}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Qty controls */}
                            <div
                              className="flex items-center"
                              style={{ border: "1px solid var(--color-fg)" }}
                            >
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "13px",
                                  color: "var(--color-fg-mid)",
                                  borderRight: "1px solid var(--color-fg)",
                                }}
                              >
                                −
                              </button>
                              <span
                                style={{
                                  width: "28px",
                                  textAlign: "center",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "11px",
                                  color: "var(--color-fg)",
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "13px",
                                  color: "var(--color-fg-mid)",
                                  borderLeft: "1px solid var(--color-fg)",
                                }}
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <span
                                style={{
                                  fontFamily: "'Barlow', system-ui, sans-serif",
                                  fontSize: "15px",
                                  fontWeight: 900,
                                  color: "var(--color-fg)",
                                }}
                              >
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "9px",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  color: "var(--color-fg-subtle)",
                                }}
                                aria-label="Remove"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Checkout footer ─────────────────────── */}
            {items.length > 0 && (
              <div style={{ borderTop: "1px solid var(--color-fg)" }}>
                {/* Total */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: "clamp(14px,1.8vw,20px) clamp(20px,3vw,28px)",
                    borderBottom: "1px solid var(--color-fg)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-fg-mid)",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontFamily: "'Barlow', system-ui, sans-serif",
                      fontSize: "clamp(20px, 2.5vw, 28px)",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      color: "var(--color-fg)",
                    }}
                  >
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {/* Note */}
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    lineHeight: 1.7,
                    color: "var(--color-fg-subtle)",
                    padding: "12px clamp(20px,3vw,28px)",
                    borderBottom: "1px solid var(--color-fg)",
                  }}
                >
                  All pieces are made to order. Production begins after checkout. Your measurements will be confirmed via email before we begin.
                </p>

                {/* CTA */}
                <div style={{ padding: "clamp(14px,1.8vw,20px) clamp(20px,3vw,28px)" }}>
                  <button
                    onClick={goToCheckout}
                    className="w-full flex items-center justify-between"
                    style={{
                      fontFamily: "'Barlow', system-ui, sans-serif",
                      fontSize: "16px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      padding: "clamp(14px,1.8vw,18px) 20px",
                      background: "var(--color-fg)",
                      color: "var(--color-bg)",
                      cursor: "pointer",
                    }}
                  >
                    <span>Proceed to Checkout</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
