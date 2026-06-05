"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "var(--color-bg)", borderTop: "1px solid var(--color-fg)" }}>
      {/* ── Link grid ─────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:grid-cols-3"
        style={{ borderBottom: "1px solid var(--color-fg)" }}
      >
        {[
          { title: "The Guild",    links: [{ href: "/about", label: "About" }, { href: "/designers", label: "Designers" }, { href: "/join", label: "Join" }, { href: "/contact", label: "Contact" }] },
          { title: "Your Account", links: [{ href: "/login", label: "Login" }, { href: "#", label: "Orders" }, { href: "#", label: "Wishlist" }] },
          { title: "Fine Print",   links: [{ href: "/terms", label: "Terms & Conditions" }] },
        ].map((group, gi) => (
          <div
            key={group.title}
            style={{
              padding: "clamp(24px,3vw,40px) clamp(16px,2.5vw,32px)",
              borderRight: gi < 2 ? "1px solid var(--color-fg)" : "none",
            }}
          >
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--color-fg-dim)",
                marginBottom: "16px",
              }}
            >
              {group.title}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-fg-mid)",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Massive wordmark — full bleed, no side padding ── */}
      <div
        style={{
          padding: "clamp(12px,1.5vw,20px) 0",
          borderBottom: "1px solid var(--color-fg)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow', system-ui, sans-serif",
            fontSize: "clamp(72px, 27.5vw, 9999px)",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "var(--color-fg)",
            lineHeight: 0.88,
            letterSpacing: "-0.01em",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Guild
        </div>
        <div
          style={{
            fontFamily: "'Barlow', system-ui, sans-serif",
            fontSize: "clamp(72px, 27.5vw, 9999px)",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "var(--color-fg)",
            lineHeight: 0.88,
            letterSpacing: "-0.01em",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Shop.
        </div>
      </div>

      {/* ── Bottom strip ──────────────────────────── */}
      <div
        className="flex items-center justify-between flex-wrap gap-3"
        style={{ padding: "clamp(12px,1.5vw,18px) var(--content-pad)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-fg-dim)",
          }}
        >
          GuildShop© {new Date().getFullYear()} All Rights Reserved
        </span>
        <span
          style={{
            fontFamily: "'Barlow', system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--color-fg-dim)",
          }}
        >
          Guild Shop
        </span>
      </div>
    </footer>
  );
}
