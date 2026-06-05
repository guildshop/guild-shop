"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

const CHANNELS = [
  { n: "01", label: "General Inquiries", email: "founders@guildshop.co", when: "Within a day" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // ── Sent confirmation ─────────────────────────────────────────────
  if (sent) {
    return (
      <>
        <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: "var(--nav-h)" }}>
          <div className="flex flex-col items-start justify-center" style={{ minHeight: "80vh", padding: "0 var(--content-pad)" }}>
            <p style={mono10dim()}>Message Sent</p>
            <h1 style={display(64)}>
              Received.<br />
              <span style={{ color: "var(--color-fg-mid)" }}>We&apos;ll be in touch.</span>
            </h1>
            <p style={{ ...mono10dim(), color: "var(--color-fg-mid)", margin: "24px 0 32px", maxWidth: 440, lineHeight: 1.8, letterSpacing: "0.08em" }}>
              Thank you for reaching out to the Guild. Expect a reply at {form.email || "your email"} shortly.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/designers" style={btnSolid()}>Explore Designers →</Link>
              <Link href="/" style={btnOutline()}>Back to Guild Shop</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Contact ───────────────────────────────────────────────────────
  return (
    <>
      <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: "var(--nav-h)" }}>
        {/* Top info grid */}
        <section style={{ borderBottom: "1px solid var(--color-fg)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: "1px solid var(--color-fg)" }}>
            {[
              { label: "Section:", value: "Contact" },
              { label: "Reply:", value: "Within a Day" },
              { label: "Based In:", value: "India · France · Italy" },
            ].map((col, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(20px,3vw,36px) clamp(20px,3vw,40px)",
                  borderRight: i < 2 ? "1px solid var(--color-fg)" : "none",
                }}
              >
                <p style={mono10dim()}>{col.label}</p>
                <p style={{ ...barlowValue(), fontSize: i === 2 ? "clamp(13px, 1.4vw, 18px)" : "clamp(20px, 2.5vw, 32px)" }}>
                  {col.value}
                </p>
              </div>
            ))}
          </div>

          {/* Massive wordmark */}
          <div style={{ padding: "clamp(24px,4vw,56px) var(--content-pad)" }}>
            <p style={{ ...mono10dim(), marginBottom: "clamp(12px,2vw,20px)" }}>Write to Us</p>
            <h1
              style={{
                fontFamily: "'Barlow', system-ui, sans-serif",
                fontSize: "clamp(44px, 9vw, 140px)",
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 0.88,
                color: "var(--color-fg)",
                letterSpacing: "-0.01em",
              }}
            >
              Get in Touch.
            </h1>
          </div>
        </section>

        {/* Channels + form */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "1px solid var(--color-fg)" }}>
          {/* Left: channels */}
          <div style={{ borderRight: "1px solid var(--color-fg)" }}>
            <div style={{ padding: "clamp(12px,1.5vw,18px) var(--content-pad)", borderBottom: "1px solid var(--color-fg)" }}>
              <span style={{ ...mono10dim(), color: "var(--color-fg)" }}>Direct Channels</span>
            </div>
            {CHANNELS.map((c, i) => (
              <a
                key={c.n}
                href={`mailto:${c.email}`}
                className="block"
                style={{
                  padding: "clamp(20px,2.5vw,32px) var(--content-pad)",
                  borderBottom: i < CHANNELS.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span style={{ ...mono10dim(), color: "var(--color-fg-subtle)" }}>{c.n}</span>
                  <span style={{ ...mono10dim(), color: "var(--color-fg-dim)", letterSpacing: "0.1em" }}>{c.when}</span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: "clamp(18px, 2vw, 28px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    margin: "10px 0 6px",
                    lineHeight: 1.1,
                  }}
                >
                  {c.label}
                </h3>
                <p style={{ ...mono10dim(), color: "var(--color-fg-mid)", letterSpacing: "0.08em", textTransform: "none" }}>
                  {c.email}
                </p>
              </a>
            ))}
          </div>

          {/* Right: form */}
          <div>
            <div style={{ padding: "clamp(12px,1.5vw,18px) var(--content-pad)", borderBottom: "1px solid var(--color-fg)" }}>
              <span style={{ ...mono10dim(), color: "var(--color-fg)" }}>Send a Message</span>
            </div>
            <form
              className="flex flex-col"
              style={{ gap: "clamp(20px,2.5vw,28px)", padding: "clamp(24px,3.5vw,44px) var(--content-pad)" }}
              onSubmit={(e) => { e.preventDefault(); setSent(true); window.scrollTo(0, 0); }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "clamp(20px,2.5vw,28px)" }}>
                <Field label="Your Name" value={form.name} onChange={(v) => update("name", v)} placeholder="Anonymous" required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@example.com" required />
              </div>
              <Field label="Subject" value={form.subject} onChange={(v) => update("subject", v)} placeholder="A thought, an object, a dream" />
              <label className="flex flex-col">
                <span style={{ ...mono10dim(), marginBottom: "8px", color: "var(--color-fg-mid)" }}>Message</span>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={6}
                  required
                  placeholder="Say everything."
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--color-border)",
                    color: "var(--color-fg)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "15px",
                    outline: "none",
                    resize: "none",
                    lineHeight: 1.6,
                  }}
                />
              </label>
              <button
                type="submit"
                className="w-full flex items-center justify-between"
                style={{
                  fontFamily: "'Barlow', system-ui, sans-serif",
                  fontSize: "16px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  padding: "clamp(14px,1.8vw,18px) 22px",
                  background: "var(--color-fg)",
                  color: "var(--color-bg)",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
              >
                <span>Send Message</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ padding: "clamp(16px,2vw,22px) var(--content-pad)" }}>
          <Link href="/designers" style={{ ...mono10dim(), color: "var(--color-fg)" }}>Explore Designers →</Link>
          <Link href="/join" style={{ ...mono10dim(), color: "var(--color-fg-mid)" }}>Apply to Join</Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

// ── Field ───────────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = "text", placeholder, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="flex flex-col">
      <span style={{ ...mono10dim(), marginBottom: "8px", color: focused ? "var(--color-fg)" : "var(--color-fg-mid)" }}>
        {label} {required && <span style={{ color: "var(--color-fg-subtle)" }}>*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 0",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${focused ? "var(--color-fg)" : "var(--color-border)"}`,
          color: "var(--color-fg)",
          fontFamily: "var(--font-mono)",
          fontSize: "15px",
          outline: "none",
          transition: "border-color 0.2s",
        }}
      />
    </label>
  );
}

// ── Style helpers ───────────────────────────────────────────────────
function mono10dim(): React.CSSProperties {
  return { fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)" };
}
function barlowValue(): React.CSSProperties {
  return { fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 900, textTransform: "uppercase", color: "var(--color-fg)", marginTop: "10px" };
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
function btnSolid(): React.CSSProperties {
  return {
    fontFamily: "'Barlow', system-ui, sans-serif",
    fontSize: 14,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "16px 22px",
    background: "var(--color-fg)",
    color: "var(--color-bg)",
    display: "inline-flex",
    alignItems: "center",
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
