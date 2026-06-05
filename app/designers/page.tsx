import { Metadata } from "next";
import { FeaturedDesigners } from "@/components/designers/FeaturedDesigners";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Designers" };

export default function DesignersPage() {
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
              { label: "Section:", value: "Designers" },
              { label: "Active:", value: "6 Studios" },
              { label: "Based in:", value: "India · France · Italy" },
            ].map((col, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(20px,3vw,36px) clamp(20px,3vw,40px)",
                  borderRight: i < 2 ? "1px solid var(--color-fg)" : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-fg-mid)",
                    marginBottom: "10px",
                  }}
                >
                  {col.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: i === 2 ? "clamp(13px, 1.4vw, 18px)" : "clamp(20px, 2.5vw, 32px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    lineHeight: 1.2,
                  }}
                >
                  {col.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ padding: "clamp(24px,4vw,56px) clamp(20px,3vw,40px)" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-fg-mid)",
                marginBottom: "clamp(12px,2vw,20px)",
              }}
            >
              The Gallery
            </p>
            <h1
              style={{
                fontFamily: "'Barlow', system-ui, sans-serif",
                fontSize: "clamp(40px, 7vw, 100px)",
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 0.9,
                color: "var(--color-fg)",
              }}
            >
              Artists<br />In Residence.
            </h1>
          </div>
        </section>

        <FeaturedDesigners />
      </div>
      <Footer />
    </>
  );
}
