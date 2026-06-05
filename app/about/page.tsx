import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "About" };

const TEAM = [
  {
    n: "01",
    name: "Ashfaq Ali Baig Muzavar",
    role: "Co-founder · Business Development",
    note: "Driven by a strong inclination toward the startup ecosystem, Ashfaq is focused on building the Guild as a forward-thinking and globally connected platform. He combines a founder's vision with a sharp, execution-driven mindset — bringing structure, clarity, and momentum to every stage of growth. He leads business development, designer onboarding, and cross-border logistics, ensuring the Guild scales with intention and precision.",
  },
  {
    n: "02",
    name: "Shreesh Vivek Pal",
    role: "Co-founder · Fashion & Network",
    note: "With roots inside a working atelier and close collaboration with leading designers, Shreesh offers an insider's perspective on the fashion industry. His strong network across designers, models, and creatives is paired with a refined editorial eye. He leads designer relationships, creative direction, and the visual identity of the Guild, shaping how it is seen and experienced.",
  },
];

export default function AboutPage() {
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
              { label: "Section:", value: "About" },
              { label: "Est.:", value: "MMXXVI" },
              { label: "Designers:", value: "6 Active" },
            ].map((col, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(20px,3vw,36px) clamp(20px,3vw,40px)",
                  borderRight: i < 2 ? "1px solid var(--color-fg)" : "none",
                }}
              >
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)", marginBottom: "10px" }}>
                  {col.label}
                </p>
                <p style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 900, textTransform: "uppercase", color: "var(--color-fg)" }}>
                  {col.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ padding: "clamp(24px,4vw,56px) clamp(20px,3vw,40px)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)", marginBottom: "clamp(12px,2vw,20px)" }}>
              Our Manifesto
            </p>
            <h1
              style={{
                fontFamily: "'Barlow', system-ui, sans-serif",
                fontSize: "clamp(40px, 7vw, 100px)",
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 0.9,
                color: "var(--color-fg)",
                maxWidth: "800px",
              }}
            >
              A Different Kind of Guild.
            </h1>
          </div>
        </section>

        {/* ── Team ───────────────────────────────────── */}
        <section style={{ borderBottom: "1px solid var(--color-fg)" }}>
          <div
            style={{
              padding: "clamp(12px,1.5vw,18px) clamp(20px,3vw,40px)",
              borderBottom: "1px solid var(--color-fg)",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg)" }}>
              The Founders
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {TEAM.map((t, i) => (
              <div
                key={t.name}
                style={{
                  padding: "clamp(24px,3.5vw,48px) clamp(20px,3vw,40px)",
                  borderRight: i % 2 === 0 ? "1px solid var(--color-fg)" : "none",
                  borderBottom: "1px solid var(--color-fg)",
                }}
              >
                {/* Portrait placeholder */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    background: "var(--color-bg-2)",
                    marginBottom: "24px",
                    border: "1px solid var(--color-fg)",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    padding: "12px",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-fg-dim)" }}>
                    {t.n}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-fg-dim)" }}>
                    Co-founder
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)", display: "block", marginBottom: "8px" }}>
                  {t.role}
                </span>
                <h3
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: "clamp(22px, 2.4vw, 34px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    marginBottom: "16px",
                    lineHeight: 1.05,
                  }}
                >
                  {t.name}
                </h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.8, color: "var(--color-fg-mid)" }}>
                  {t.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA row ────────────────────────────────── */}
        <div
          className="flex items-center justify-between flex-wrap gap-4"
          style={{ padding: "clamp(16px,2vw,22px) clamp(20px,3vw,40px)" }}
        >
          <Link
            href="/designers"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg)" }}
          >
            Explore Designers →
          </Link>
          <Link
            href="/join"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)" }}
          >
            Apply to Join
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
