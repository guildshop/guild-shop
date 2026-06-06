"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "", portfolio: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: "var(--nav-h)" }}>
      {/* ── Top info grid (mirrors the hero) ─────────────────────── */}
      <section style={{ borderBottom: "1px solid var(--color-fg)" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ borderBottom: "1px solid var(--color-fg)" }}
        >
          {[
            { label: "Section:", value: mode === "login" ? "Returning" : "New Member" },
            { label: "Access:", value: "Members Only" },
            { label: "Guild:", value: "4 Active Studios" },
          ].map((col, i) => (
            <div
              key={i}
              style={{
                padding: "clamp(20px,3vw,36px) clamp(20px,3vw,40px)",
                borderRight: i < 2 ? "1px solid var(--color-fg)" : "none",
              }}
            >
              <p style={mono10dim()}>{col.label}</p>
              <p style={barlowValue()}>{col.value}</p>
            </div>
          ))}
        </div>

        {/* ── Massive wordmark ─────────────────────────────────── */}
        <div style={{ padding: "clamp(24px,4vw,56px) var(--content-pad)" }}>
          <p style={{ ...mono10dim(), marginBottom: "clamp(12px,2vw,20px)" }}>
            {mode === "login" ? "Welcome Back" : "Join the Guild"}
          </p>
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
            {mode === "login" ? "Sign In." : "Sign Up."}
          </h1>
        </div>
      </section>

      {/* ── Form + side panel ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "1px solid var(--color-fg)" }}>
        {/* Left: the form */}
        <div style={{ padding: "clamp(28px,4vw,56px) var(--content-pad)", borderRight: "1px solid var(--color-fg)" }}>
          {/* Mode toggle */}
          <div className="flex items-center gap-8" style={{ marginBottom: "clamp(28px,3vw,44px)" }}>
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: mode === m ? "var(--color-fg)" : "var(--color-fg-subtle)",
                  borderBottom: mode === m ? "1px solid var(--color-fg)" : "1px solid transparent",
                  paddingBottom: "6px",
                  cursor: "pointer",
                  background: "none",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form
            className="flex flex-col"
            style={{ gap: "clamp(20px,2.5vw,28px)", maxWidth: 460 }}
            onSubmit={(e) => { e.preventDefault(); alert(`${mode} flow — demo only.`); }}
          >
            <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@example.com" />
            <Field label="Password" type="password" value={form.password} onChange={(v) => update("password", v)} placeholder="••••••••" />
            {mode === "signup" && (
              <Field label="Portfolio URL" type="url" value={form.portfolio} onChange={(v) => update("portfolio", v)} placeholder="https://" />
            )}

            {mode === "login" && (
              <button
                type="button"
                style={{ ...mono10dim(), alignSelf: "flex-start", cursor: "pointer", background: "none", letterSpacing: "0.1em" }}
              >
                Forgot your password? →
              </button>
            )}

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
              <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
              <span>→</span>
            </button>
          </form>
        </div>

        {/* Right: editorial panel */}
        <div
          className="flex flex-col justify-between"
          style={{ padding: "clamp(28px,4vw,56px) var(--content-pad)", background: "var(--color-bg-2)", minHeight: "clamp(280px, 40vh, 480px)" }}
        >
          <div>
            <p style={mono10dim()}>Members Receive</p>
            <ul className="flex flex-col" style={{ gap: "clamp(14px,2vw,22px)", marginTop: "clamp(20px,3vw,32px)" }}>
              {[
                { n: "01", t: "Early access to limited editions" },
                { n: "02", t: "Saved measurements for made-to-order" },
                { n: "03", t: "Order history & atelier updates" },
                { n: "04", t: "Private designer drops" },
              ].map((item) => (
                <li key={item.n} className="flex items-baseline gap-4">
                  <span style={{ ...mono10dim(), color: "var(--color-fg-subtle)" }}>{item.n}</span>
                  <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(16px, 1.6vw, 22px)", fontWeight: 900, textTransform: "uppercase", color: "var(--color-fg)", lineHeight: 1.15 }}>
                    {item.t}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p style={{ ...mono10dim(), marginTop: "clamp(24px,3vw,40px)", color: "var(--color-fg-mid)", lineHeight: 1.8, letterSpacing: "0.08em" }}>
            Entry is earned, not bought. Membership grants access to the worlds of emerging independent designers.
          </p>
        </div>
      </div>

      {/* ── Bottom strip ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between flex-wrap gap-4"
        style={{ padding: "clamp(16px,2vw,22px) var(--content-pad)" }}
      >
        <Link href="/" style={{ ...mono10dim(), color: "var(--color-fg)" }}>
          ← Back to Guild Shop
        </Link>
        <Link href="/join" style={{ ...mono10dim(), color: "var(--color-fg-mid)" }}>
          Apply as a Designer →
        </Link>
      </div>
    </div>
  );
}

// ── Field ───────────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="flex flex-col">
      <span style={{ ...mono10dim(), marginBottom: "8px", color: focused ? "var(--color-fg)" : "var(--color-fg-mid)" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
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
  return {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--color-fg-mid)",
  };
}
function barlowValue(): React.CSSProperties {
  return {
    fontFamily: "'Barlow', system-ui, sans-serif",
    fontSize: "clamp(20px, 2.5vw, 32px)",
    fontWeight: 900,
    textTransform: "uppercase",
    color: "var(--color-fg)",
    marginTop: "10px",
  };
}
