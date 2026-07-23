"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function AboutSection() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);

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
          Built for those who don&apos;t just wear fashion, they invest in
          the people who create it.
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
        <button
          onClick={() => setNewsletterOpen(true)}
          className="flex items-center gap-6 group w-full"
          style={{
            border: "1px solid var(--color-fg)",
            padding: "clamp(18px,2.5vw,32px) clamp(20px,3vw,40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            cursor: "pointer",
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
        </button>
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

      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </section>
  );
}

// ── Newsletter signup modal ───────────────────────────────────────────
function NewsletterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const close = () => {
    onClose();
    // reset after the close animation finishes
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            className="relative"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-fg)",
              width: "min(92vw, 480px)",
              padding: "clamp(28px,4vw,44px)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {!submitted ? (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-fg-mid)",
                    marginBottom: "12px",
                  }}
                >
                  Stay Connected
                </p>
                <h3
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: "clamp(24px, 3vw, 34px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    lineHeight: 1.05,
                    marginBottom: "24px",
                  }}
                >
                  Sign Up for Our Newsletter
                </h3>

                <form onSubmit={handleSubmit}>
                  <label style={{ display: "block", marginBottom: "24px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--color-fg-mid)",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Email
                    </span>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
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
                      }}
                    />
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1"
                      style={{
                        fontFamily: "'Barlow', system-ui, sans-serif",
                        fontSize: "13px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        color: "var(--color-bg)",
                        background: "var(--color-fg)",
                        padding: "14px 20px",
                        cursor: "pointer",
                      }}
                    >
                      Subscribe
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="flex-1"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--color-fg-mid)",
                        border: "1px solid var(--color-border)",
                        background: "none",
                        padding: "14px 20px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-fg-mid)",
                    marginBottom: "12px",
                  }}
                >
                  Confirmed
                </p>
                <h3
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: "clamp(24px, 3vw, 34px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    lineHeight: 1.05,
                    marginBottom: "16px",
                  }}
                >
                  You&apos;re on the list.
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    lineHeight: 1.7,
                    color: "var(--color-fg-mid)",
                    marginBottom: "24px",
                  }}
                >
                  We&apos;ll send new drops and designer news to {email}.
                </p>
                <button
                  onClick={close}
                  className="w-full"
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: "13px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    color: "var(--color-bg)",
                    background: "var(--color-fg)",
                    padding: "14px 20px",
                    cursor: "pointer",
                  }}
                >
                  Done
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
