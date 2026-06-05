"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

const BLOCK_COLORS: Record<string, string> = {
  vesper:      "#0a0a0a",
  "nova-aura": "#1e2d5a",
  terra:       "#b84e28",
  lumi:        "#3d5a28",
  soleil:      "#8a1828",
  ondo:        "#1a30a0",
};

const SHIPPING = 0; // made-to-order, white-glove included

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const subtotal = total();
  const grandTotal = subtotal + SHIPPING;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", apt: "", city: "", state: "", zip: "", country: "",
    notes: "",
  });
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState(() => "GS-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const required = ["firstName", "lastName", "email", "address", "city", "zip", "country"];
  const isValid = required.every((k) => form[k as keyof typeof form].trim() !== "");

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setPlaced(true);
    clearCart();
    window.scrollTo(0, 0);
  };

  // ── Empty cart guard ──────────────────────────────────────────────
  if (items.length === 0 && !placed) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: "var(--nav-h)" }}>
        <div
          className="flex flex-col items-start justify-center"
          style={{ minHeight: "70vh", padding: "0 var(--content-pad)" }}
        >
          <p style={label()}>Checkout</p>
          <h1 style={display(48)}>Nothing to<br />check out.</h1>
          <p style={{ ...mono(12), color: "var(--color-fg-mid)", margin: "20px 0 28px", maxWidth: 360, lineHeight: 1.7 }}>
            Your cart is empty. Explore the guild and commission a made-to-order piece.
          </p>
          <Link href="/designers" style={btnOutline()}>
            Browse Designers →
          </Link>
        </div>
      </div>
    );
  }

  // ── Order confirmation ────────────────────────────────────────────
  if (placed) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: "var(--nav-h)" }}>
        <div
          className="flex flex-col items-start justify-center"
          style={{ minHeight: "80vh", padding: "0 var(--content-pad)" }}
        >
          <p style={label()}>Order Confirmed · {orderId}</p>
          <h1 style={display(56)}>
            Thank you.<br />
            <span style={{ color: "var(--color-fg-mid)" }}>We&apos;re on it.</span>
          </h1>
          <p style={{ ...mono(12), color: "var(--color-fg-mid)", margin: "24px 0 8px", maxWidth: 460, lineHeight: 1.8 }}>
            Each piece is made to order. Our designers will confirm your measurements
            by email within 48 hours, then begin production. Expect 3–6 weeks for
            crafting and white-glove delivery.
          </p>
          <p style={{ ...mono(11), color: "var(--color-fg-subtle)", marginBottom: 32 }}>
            A confirmation has been sent to {form.email || "your email"}.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/designers" style={btnSolid()}>Continue Browsing →</Link>
            <Link href="/" style={btnOutline()}>Back to Guild Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout ──────────────────────────────────────────────────────
  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: "var(--nav-h)" }}>
      {/* Header */}
      <div style={{ padding: "clamp(24px,4vw,48px) var(--content-pad)", borderBottom: "1px solid var(--color-fg)" }}>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p style={label()}>Checkout</p>
            <h1 style={display(64)}>Commission.</h1>
          </div>
          <Link href="/designers" style={{ ...mono(10), color: "var(--color-fg-mid)" }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12" style={{ borderBottom: "1px solid var(--color-fg)" }}>
        {/* ── Left: form ─────────────────────────────────────────── */}
        <form
          onSubmit={handlePlaceOrder}
          className="lg:col-span-7"
          style={{ padding: "clamp(24px,3.5vw,48px) var(--content-pad)", borderRight: "1px solid var(--color-fg)" }}
        >
          {/* Contact */}
          <SectionTitle n="01" title="Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            <Field label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} required />
            <Field label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
            <Field label="Phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} />
          </div>

          {/* Shipping */}
          <SectionTitle n="02" title="Shipping Address" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            <div className="sm:col-span-2">
              <Field label="Street Address" value={form.address} onChange={(v) => update("address", v)} required />
            </div>
            <Field label="Apt / Suite (optional)" value={form.apt} onChange={(v) => update("apt", v)} />
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
            <Field label="State / Province" value={form.state} onChange={(v) => update("state", v)} />
            <Field label="ZIP / Postal Code" value={form.zip} onChange={(v) => update("zip", v)} required />
            <div className="sm:col-span-2">
              <Field label="Country" value={form.country} onChange={(v) => update("country", v)} required />
            </div>
          </div>

          {/* Notes */}
          <SectionTitle n="03" title="Order Notes" />
          <div className="mb-10">
            <label style={fieldLabel()}>Anything we should know? (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="Delivery instructions, gift notes, fit preferences..."
              style={{ ...inputStyle(), resize: "none" }}
            />
          </div>

          {/* Mobile submit */}
          <button type="submit" disabled={!isValid} style={btnSolid(!isValid)} className="w-full lg:hidden">
            {isValid ? `Place Order · ${formatPrice(grandTotal)}` : "Complete Required Fields"}
          </button>
        </form>

        {/* ── Right: order summary ───────────────────────────────── */}
        <aside className="lg:col-span-5" style={{ background: "var(--color-bg-2)" }}>
          <div style={{ padding: "clamp(24px,3.5vw,40px) clamp(20px,3vw,36px)", position: "sticky", top: "var(--nav-h)" }}>
            <SectionTitle n="—" title={`Your Order · ${items.length} ${items.length === 1 ? "Piece" : "Pieces"}`} />

            {/* Items */}
            <div className="flex flex-col" style={{ marginBottom: 24 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4"
                  style={{ padding: "16px 0", borderBottom: "1px solid var(--color-border)" }}
                >
                  <div
                    style={{
                      width: 56, height: 68, flexShrink: 0,
                      background: BLOCK_COLORS[item.designerSlug] ?? "#111",
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p style={{ ...mono(8), color: "var(--color-fg-dim)", marginBottom: 3 }}>
                          {item.designerName}
                        </p>
                        <p style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 14, fontWeight: 900, textTransform: "uppercase", color: "var(--color-fg)", lineHeight: 1.1 }}>
                          {item.name}
                        </p>
                      </div>
                      <p style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 14, fontWeight: 900, color: "var(--color-fg)", whiteSpace: "nowrap" }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    {item.measurements && (
                      <div style={{ marginTop: 6 }}>
                        <p style={{ ...mono(8), color: "var(--color-fg-mid)", letterSpacing: "0.1em" }}>
                          ✦ Made to Order · Qty {item.quantity}
                        </p>
                        <p style={{ ...mono(8), color: "var(--color-fg-subtle)", lineHeight: 1.6, marginTop: 2 }}>
                          C {item.measurements.chest} · W {item.measurements.waist} · H {item.measurements.hips} · Ht {item.measurements.height} (cm)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Made-to-Order Crafting" value="Included" />
            <Row label="White-Glove Shipping" value={SHIPPING === 0 ? "Complimentary" : formatPrice(SHIPPING)} />
            <div className="flex items-center justify-between" style={{ padding: "16px 0 0", marginTop: 12, borderTop: "1px solid var(--color-fg)" }}>
              <span style={{ ...mono(10), color: "var(--color-fg-mid)" }}>Total</span>
              <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, color: "var(--color-fg)" }}>
                {formatPrice(grandTotal)}
              </span>
            </div>

            {/* Made to order note */}
            <p style={{ ...mono(9), color: "var(--color-fg-subtle)", lineHeight: 1.7, margin: "16px 0 20px" }}>
              All pieces are made to order. Measurements are confirmed via email before
              production begins. Crafting takes 3–6 weeks.
            </p>

            {/* Desktop submit */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!isValid}
              style={btnSolid(!isValid)}
              className="hidden lg:flex w-full"
            >
              {isValid ? "Place Order →" : "Complete Required Fields"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────
function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
      <span style={{ ...mono(10), color: "var(--color-fg-subtle)" }}>{n}</span>
      <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 16, fontWeight: 900, textTransform: "uppercase", color: "var(--color-fg)", letterSpacing: "0.02em" }}>
        {title}
      </span>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="flex flex-col">
      <span style={fieldLabel()}>
        {label} {required && <span style={{ color: "var(--color-fg-subtle)" }}>*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle(),
          borderColor: focused ? "var(--color-fg)" : "var(--color-border)",
        }}
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: "6px 0" }}>
      <span style={{ ...mono(10), color: "var(--color-fg-mid)" }}>{label}</span>
      <span style={{ ...mono(10), color: "var(--color-fg)" }}>{value}</span>
    </div>
  );
}

// ── Style helpers ───────────────────────────────────────────────────
function mono(size: number): React.CSSProperties {
  return { fontFamily: "var(--font-mono)", fontSize: size, letterSpacing: "0.1em", textTransform: "uppercase" };
}
function label(): React.CSSProperties {
  return { ...mono(10), color: "var(--color-fg-mid)", marginBottom: 12, letterSpacing: "0.14em" };
}
function display(size: number): React.CSSProperties {
  return {
    fontFamily: "'Barlow', system-ui, sans-serif",
    fontSize: `clamp(${size * 0.55}px, ${size / 11}vw, ${size}px)`,
    fontWeight: 900,
    textTransform: "uppercase",
    lineHeight: 0.92,
    color: "var(--color-fg)",
    letterSpacing: "-0.01em",
  };
}
function fieldLabel(): React.CSSProperties {
  return { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)", marginBottom: 8 };
}
function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "11px 13px",
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    color: "var(--color-fg)",
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    outline: "none",
    transition: "border-color 0.2s",
  };
}
function btnSolid(disabled = false): React.CSSProperties {
  return {
    fontFamily: "'Barlow', system-ui, sans-serif",
    fontSize: 14,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "16px 22px",
    background: disabled ? "var(--color-fg-subtle)" : "var(--color-fg)",
    color: "var(--color-bg)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };
}
function btnOutline(): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "13px 22px",
    border: "1px solid var(--color-fg)",
    color: "var(--color-fg)",
    display: "inline-block",
  };
}
