"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";

export function Navigation() {
  const { toggleCart } = useCartStore();
  const count = useCartStore((s) => s.itemCount());
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: "var(--nav-h)",
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-fg)",
        }}
      >
        <div
          className="h-full flex items-center justify-between"
          style={{ padding: "0 var(--content-pad)" }}
        >
          {/* Left: wordmark */}
          <Link
            href="/"
            style={{
              fontFamily: "'Barlow', system-ui, sans-serif",
              fontSize: "15px",
              fontWeight: 900,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-fg)",
            }}
          >
            Guild Shop
          </Link>

          {/* Right: descriptor + actions */}
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              {[
                { href: "/designers", label: "Designers" },
                { href: "/about", label: "About" },
                { href: "/join", label: "Join" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-fg-mid)",
                  }}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={toggleCart}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-fg-mid)",
                }}
              >
                {count > 0 ? `Cart (${count})` : "Cart"}
              </button>
              <Link
                href="/login"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-bg)",
                  background: "var(--color-fg)",
                  padding: "8px 16px",
                }}
              >
                Login
              </Link>
            </nav>

            <Link
              href="/designers"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                color: "var(--color-fg)",
                textTransform: "uppercase",
              }}
            >
              Independent Designers / Artists
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center items-start md:hidden"
            style={{ background: "var(--color-bg)", padding: "0 var(--content-pad)", paddingTop: "var(--nav-h)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {[
              { href: "/designers", label: "Designers" },
              { href: "/about", label: "About" },
              { href: "/join", label: "Join" },
              { href: "/login", label: "Login" },
            ].map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: "clamp(40px, 10vw, 64px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    display: "block",
                    lineHeight: 1.1,
                    marginBottom: "8px",
                  }}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
