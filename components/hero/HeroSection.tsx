"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section
      style={{
        background: "var(--color-bg)",
        paddingTop: "var(--nav-h)",
        borderBottom: "1px solid var(--color-fg)",
      }}
    >
      {/* ── Massive wordmark ─────────────────────── */}
      <div
        style={{
          padding: "clamp(16px,2vw,24px) var(--content-pad)",
          borderBottom: "1px solid var(--color-fg)",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.14em",
            color: "var(--color-fg-mid)",
            textTransform: "uppercase",
            marginBottom: "clamp(8px,1.5vw,16px)",
          }}
        >
          A Wearable Statements Platform
        </p>

        <Link href="/designers" className="block">
          <div
            className="text-hero"
            style={{ color: "var(--color-fg)", lineHeight: 0.88 }}
          >
            Guild
          </div>
          <div
            className="text-hero"
            style={{ color: "var(--color-fg)", lineHeight: 0.88 }}
          >
            Shop.
          </div>
        </Link>

        <div
          className="flex items-center justify-between flex-wrap gap-4 mt-6"
          style={{
            paddingTop: "clamp(16px,2vw,24px)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-fg-mid)",
            }}
          >
            Six independent designers. One platform.
          </p>
          <Link
            href="/designers"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-fg)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "14px",
                height: "14px",
                border: "1px solid var(--color-fg)",
                position: "relative",
              }}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                }}
              >
                <path d="M1 7L7 1M7 1H2M7 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </span>
            Explore Designers
          </Link>
        </div>
      </div>
    </section>
  );
}
