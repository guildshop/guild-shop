"use client";

import { useState } from "react";
import { Footer } from "@/components/layout/Footer";

const STEPS = [
  { id: "identity", label: "01 Identity" },
  { id: "practice", label: "02 Practice" },
  { id: "portfolio", label: "03 Portfolio" },
  { id: "vision",   label: "04 Vision" },
];

export default function JoinPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", brandName: "", location: "", founded: "", category: "",
    description: "", portfolioUrl: "", instagramUrl: "", vision: "", email: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <>
        <div style={{ background: "var(--color-bg)", paddingTop: "var(--nav-h)", minHeight: "100vh" }}>
          <div style={{ borderBottom: "1px solid var(--color-fg)", padding: "clamp(24px,4vw,56px) clamp(20px,3vw,40px)" }}>
            <p style={MONO_SM}>Status: Received</p>
            <h1 style={HERO_TYPE}>Application<br />Received.</h1>
          </div>
          <div style={{ padding: "clamp(32px,5vw,64px) clamp(20px,3vw,40px)", maxWidth: "600px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.9, color: "var(--color-fg-mid)", marginBottom: "32px" }}>
              We review every application personally. If your work aligns with the Guild&apos;s vision,
              you will hear from us within 3–6 weeks. We do not send automated responses.
            </p>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-subtle)" }}>
              — The Guild
            </span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div style={{ background: "var(--color-bg)", paddingTop: "var(--nav-h)" }}>

        {/* ── Header ─────────────────────────────────── */}
        <section style={{ borderBottom: "1px solid var(--color-fg)" }}>
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ borderBottom: "1px solid var(--color-fg)" }}
          >
            {[
              { label: "Section:", value: "Apply" },
              { label: "Applications:", value: "Open" },
              { label: "Response:", value: "1 Week" },
            ].map((col, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(20px,3vw,36px) clamp(20px,3vw,40px)",
                  borderRight: i < 2 ? "1px solid var(--color-fg)" : "none",
                }}
              >
                <p style={MONO_SM}>{col.label}</p>
                <p style={COL_VAL}>{col.value}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: "clamp(24px,4vw,56px) clamp(20px,3vw,40px)" }}>
            <p style={MONO_SM}>Application Protocol</p>
            <h1 style={HERO_TYPE}>Join<br />The Guild.</h1>
          </div>
        </section>

        {/* ── Step tabs ──────────────────────────────── */}
        <div
          className="flex overflow-x-auto no-scrollbar"
          style={{ borderBottom: "1px solid var(--color-fg)" }}
        >
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i <= step && setStep(i)}
              disabled={i > step}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "clamp(12px,1.5vw,18px) clamp(16px,2.5vw,32px)",
                borderRight: "1px solid var(--color-fg)",
                background: i === step ? "var(--color-fg)" : "var(--color-bg)",
                color: i === step ? "var(--color-bg)" : i < step ? "var(--color-fg)" : "var(--color-fg-subtle)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                cursor: i <= step ? "pointer" : "default",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Form ───────────────────────────────────── */}
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          style={{ padding: "clamp(24px,4vw,48px) clamp(20px,3vw,40px)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "0", maxWidth: "900px" }}>
            {step === 0 && <>
              <Field label="Full Name" required><Input value={form.name} onChange={(v) => update("name", v)} placeholder="Mira Hoffmann" /></Field>
              <Field label="Brand / Studio Name" required><Input value={form.brandName} onChange={(v) => update("brandName", v)} placeholder="VESPER Studio" /></Field>
              <Field label="Location"><Input value={form.location} onChange={(v) => update("location", v)} placeholder="Berlin, Germany" /></Field>
              <Field label="Year Founded"><Input value={form.founded} onChange={(v) => update("founded", v)} placeholder="2021" /></Field>
              <Field label="Contact Email" required span2><Input type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="studio@yourname.com" /></Field>
            </>}

            {step === 1 && <>
              <Field label="Primary Category" required>
                <Select value={form.category} onChange={(v) => update("category", v)} options={["Fashion / Garments", "Jewellery", "Both / Mixed", "Accessories", "Other"]} />
              </Field>
              <Field label="Describe your practice" sublabel="Materials, process, philosophy. Be specific." required span2>
                <Textarea value={form.description} onChange={(v) => update("description", v)} placeholder="We work with hand-fermented natural indigo dyes..." rows={6} />
              </Field>
            </>}

            {step === 2 && <>
              <Field label="Portfolio / Website URL" required><Input value={form.portfolioUrl} onChange={(v) => update("portfolioUrl", v)} placeholder="https://yourportfolio.com" /></Field>
              <Field label="Instagram URL"><Input value={form.instagramUrl} onChange={(v) => update("instagramUrl", v)} placeholder="https://instagram.com/yourhandle" /></Field>
              <Field label="" span2>
                <div style={{ padding: "16px 20px", border: "1px solid var(--color-fg)", background: "var(--color-bg-2)" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-dim)", marginBottom: "8px" }}>Note</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", lineHeight: 1.7, color: "var(--color-fg-mid)" }}>
                    A single extraordinary piece can be sufficient. We are looking for a distinct point of view.
                  </p>
                </div>
              </Field>
            </>}

            {step === 3 && <>
              <Field label="Your vision for a Guild Shop world" sublabel="If we gave you your own page — what would it look and feel like?" required span2>
                <Textarea value={form.vision} onChange={(v) => update("vision", v)} placeholder="It would feel like walking into a half-lit room in a building you've never visited before..." rows={9} />
              </Field>
            </>}
          </div>

          {/* ── Nav buttons ──────────────────────────── */}
          <div
            className="flex items-center justify-between"
            style={{
              marginTop: "32px",
              paddingTop: "20px",
              borderTop: "1px solid var(--color-fg)",
              maxWidth: "900px",
            }}
          >
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)" }}
              >
                ← Back
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                style={{
                  fontFamily: "'Barlow', system-ui, sans-serif",
                  fontSize: "14px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "14px 32px",
                  background: "var(--color-fg)",
                  color: "var(--color-bg)",
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                style={{
                  fontFamily: "'Barlow', system-ui, sans-serif",
                  fontSize: "14px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "14px 32px",
                  background: "var(--color-fg)",
                  color: "var(--color-bg)",
                }}
              >
                Submit Application →
              </button>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
}

// ─── Style tokens ──────────────────────────────────────────────────────────────

const MONO_SM: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--color-fg-mid)",
  marginBottom: "10px",
};

const HERO_TYPE: React.CSSProperties = {
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontSize: "clamp(40px, 7vw, 100px)",
  fontWeight: 900,
  textTransform: "uppercase",
  lineHeight: 0.9,
  color: "var(--color-fg)",
};

const COL_VAL: React.CSSProperties = {
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontSize: "clamp(20px, 2.5vw, 32px)",
  fontWeight: 900,
  textTransform: "uppercase",
  color: "var(--color-fg)",
};

// ─── Form primitives ───────────────────────────────────────────────────────────

function Field({
  label, sublabel, required, span2, children,
}: {
  label: string; sublabel?: string; required?: boolean; span2?: boolean; children: React.ReactNode;
}) {
  return (
    <div
      style={{
        gridColumn: span2 ? "1 / -1" : undefined,
        padding: "clamp(16px,2vw,24px) 0",
        borderBottom: "1px solid var(--color-fg)",
        marginRight: !span2 ? "clamp(20px,3vw,40px)" : undefined,
      }}
    >
      {label && (
        <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)", display: "block", marginBottom: sublabel ? "6px" : "10px" }}>
          {label}{required && <span style={{ color: "var(--color-fg)" }}> *</span>}
        </label>
      )}
      {sublabel && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", lineHeight: 1.6, color: "var(--color-fg-subtle)", marginBottom: "10px" }}>
          {sublabel}
        </p>
      )}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%",
        fontFamily: "'Barlow', system-ui, sans-serif",
        fontSize: "16px",
        fontWeight: 700,
        textTransform: "uppercase",
        background: "transparent",
        border: "none",
        borderBottom: "2px solid var(--color-fg)",
        padding: "8px 0",
        color: "var(--color-fg)",
        outline: "none",
        letterSpacing: "0.02em",
      }}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        fontFamily: "'Barlow', system-ui, sans-serif",
        fontSize: "16px",
        fontWeight: 700,
        textTransform: "uppercase",
        background: "transparent",
        border: "none",
        borderBottom: "2px solid var(--color-fg)",
        padding: "8px 0",
        color: value ? "var(--color-fg)" : "var(--color-fg-subtle)",
        outline: "none",
        appearance: "none",
        cursor: "pointer",
      }}
    >
      <option value="" disabled>Select a category</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{
        width: "100%",
        fontFamily: "'Barlow', system-ui, sans-serif",
        fontSize: "15px",
        fontWeight: 400,
        background: "transparent",
        border: "none",
        borderBottom: "2px solid var(--color-fg)",
        padding: "8px 0",
        color: "var(--color-fg)",
        outline: "none",
        resize: "none",
        lineHeight: 1.6,
      }}
    />
  );
}
