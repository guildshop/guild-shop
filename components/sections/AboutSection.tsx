"use client";

import Link from "next/link";

export function AboutSection() {
  return (
    <section style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-fg)" }}>
      {/* ── Manifesto ──────────────────────────────── */}
      <div
        style={{
          padding: "clamp(40px,6vw,80px) var(--content-pad)",
          borderBottom: "1px solid var(--color-fg)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-fg-mid)",
            marginBottom: "clamp(16px,2vw,28px)",
          }}
        >
          Our Principles
        </p>
        <h2
          style={{
            fontFamily: "'Barlow', system-ui, sans-serif",
            fontSize: "clamp(36px, 5.5vw, 80px)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 1.0,
            color: "var(--color-fg)",
            maxWidth: "900px",
          }}
        >
          It&apos;s built for individuals who don&apos;t just buy clothes —
          they seek out work where craft and collaboration matter.
        </h2>
      </div>

      {/* ── Principles grid ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {[
          { n: "01", title: "Curation over volume",       body: "Hand picked talented designers. We do not trade in abundance." },
          { n: "02", title: "Craft as language",           body: "Every material decision is intentional. Every seam is a sentence." },
          { n: "03", title: "Exclusivity by principle",    body: "Limited editions are commitment, not marketing." },
          { n: "04", title: "Worlds, not brands",          body: "Each designer is a reality. Enter their page, enter their universe." },
        ].map((p, i) => (
          <div
            key={p.n}
            style={{
              padding: "clamp(24px,3.5vw,44px) var(--content-pad)",
              borderRight: i % 2 === 0 ? "1px solid var(--color-fg)" : "none",
              borderBottom: i < 2 ? "1px solid var(--color-fg)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                color: "var(--color-fg-subtle)",
                display: "block",
                marginBottom: "12px",
              }}
            >
              {p.n}
            </span>
            <h3
              style={{
                fontFamily: "'Barlow', system-ui, sans-serif",
                fontSize: "clamp(18px, 2vw, 28px)",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--color-fg)",
                marginBottom: "10px",
                lineHeight: 1.1,
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                lineHeight: 1.7,
                color: "var(--color-fg-mid)",
              }}
            >
              {p.body}
            </p>
          </div>
        ))}
      </div>

      {/* ── Newsletter CTA ─────────────────────────── */}
      <div style={{ padding: "clamp(24px,3vw,40px) var(--content-pad)" }}>
        <a
          href="mailto:hello@guildshop.com"
          className="flex items-center gap-6 group"
          style={{
            border: "1px solid var(--color-fg)",
            padding: "clamp(18px,2.5vw,32px) clamp(20px,3vw,40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid var(--color-fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Barlow', system-ui, sans-serif",
              fontSize: "clamp(16px, 2vw, 28px)",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "var(--color-fg)",
              letterSpacing: "0.02em",
            }}
          >
            Sign Up for Our Newsletter
          </span>
          <div style={{ width: "40px" }} />
        </a>
      </div>

      {/* ── Manifesto link ─────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "clamp(16px,2vw,22px) var(--content-pad)",
          borderTop: "1px solid var(--color-fg)",
        }}
      >
        <Link
          href="/about"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-fg)",
          }}
        >
          Read Our Manifesto →
        </Link>
        <Link
          href="/join"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-fg-mid)",
          }}
        >
          Apply to Join
        </Link>
      </div>
    </section>
  );
}
