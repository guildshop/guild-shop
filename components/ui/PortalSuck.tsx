"use client";

/**
 * PortalSuck — a small portal opens at the click point; the page's individual
 * letters (headings/labels/buttons) and the coloured panels/buttons detach and
 * spiral into it, accelerating as they approach. Once everything is consumed,
 * the portal collapses and the GS monogram ERUPTS out of the singularity,
 * scaling up on a dark disc until it covers the whole screen — the route swaps
 * behind it, then the logo zooms through and fades to reveal the new world.
 *
 * Technique: clone live elements into a fixed overlay (Range API for true
 * per-letter positions), hide the real page (no layout shift), drive it all
 * with GSAP.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { armAudioUnlock, playVoidSuction, playVoidThump } from "@/lib/sfx";

type Origin = { x: number; y: number };

function parseColor(str: string): { r: number; g: number; b: number; a: number } {
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) return { r: 0, g: 0, b: 0, a: 0 };
  const p = m[1].split(",").map((s) => parseFloat(s));
  return { r: p[0] || 0, g: p[1] || 0, b: p[2] || 0, a: p[3] ?? 1 };
}

interface Props {
  origin: Origin;
  contentRef: React.RefObject<HTMLElement>;
  onNavigate: () => void;
  onDone: () => void;
}

// ── GS monogram (brand SVG, currentColor-able) ──────────────────────
function GuildMark({ size = 260, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none" aria-hidden>
      <g fill={color}>
        <g transform="translate(195.269745, 360.834031)">
          <path d="M 129.234375 -72 C 129.742188 -72.019531 130.003906 -71.769531 130.015625 -71.25 C 130.023438 -70.726562 129.773438 -70.457031 129.265625 -70.4375 C 128.085938 -70.40625 127.117188 -69.988281 126.359375 -69.1875 C 125.597656 -68.394531 125.234375 -67.414062 125.265625 -66.25 L 126.890625 -3.28125 C 126.898438 -3.019531 126.78125 -2.820312 126.53125 -2.6875 C 126.394531 -2.550781 126.265625 -2.476562 126.140625 -2.46875 C 126.140625 -2.46875 126.070312 -2.46875 125.9375 -2.46875 L 103.203125 -6.765625 C 95.097656 -3.296875 86.753906 -1.453125 78.171875 -1.234375 C 68.953125 -0.992188 60.140625 -2.488281 51.734375 -5.71875 C 43.328125 -8.957031 35.789062 -13.742188 29.125 -20.078125 C 22.195312 -26.640625 16.96875 -34.070312 13.4375 -42.375 C 9.914062 -50.675781 8.039062 -59.273438 7.8125 -68.171875 C 7.582031 -77.078125 9.015625 -85.734375 12.109375 -94.140625 C 15.203125 -102.546875 20.039062 -110.210938 26.625 -117.140625 C 32.957031 -123.804688 40.238281 -128.96875 48.46875 -132.625 C 56.695312 -136.28125 65.421875 -138.226562 74.640625 -138.46875 C 83.742188 -138.707031 92.53125 -137.210938 101 -133.984375 C 109.46875 -130.753906 117.035156 -125.972656 123.703125 -119.640625 C 123.828125 -119.523438 123.894531 -119.335938 123.90625 -119.078125 C 123.90625 -118.953125 123.847656 -118.753906 123.734375 -118.484375 L 107.78125 -101.875 C 107.394531 -101.46875 107.066406 -101.460938 106.796875 -101.859375 C 100.273438 -108.054688 93.253906 -113.171875 85.734375 -117.203125 C 78.210938 -121.234375 70.734375 -123.867188 63.296875 -125.109375 C 47.867188 -127.828125 35.976562 -124.796875 27.625 -116.015625 C 23.445312 -111.609375 20.789062 -106.296875 19.65625 -100.078125 C 18.519531 -93.867188 18.789062 -87.179688 20.46875 -80.015625 C 22.144531 -72.847656 25.125 -65.609375 29.40625 -58.296875 C 33.6875 -50.992188 39.226562 -44.179688 46.03125 -37.859375 C 54.832031 -29.503906 64.191406 -23.273438 74.109375 -19.171875 C 84.035156 -15.066406 93.351562 -13.257812 102.0625 -13.75 L 100.71875 -65.609375 C 100.6875 -66.773438 100.269531 -67.738281 99.46875 -68.5 C 98.664062 -69.257812 97.679688 -69.625 96.515625 -69.59375 C 95.992188 -69.582031 95.726562 -69.835938 95.71875 -70.359375 C 95.707031 -70.878906 95.960938 -71.144531 96.484375 -71.15625 Z M 129.234375 -72" />
        </g>
        <g transform="translate(293.570731, 365.11332)">
          <path d="M 88.796875 -66.40625 C 94.265625 -63.070312 98.5 -58.671875 101.5 -53.203125 C 104.5 -47.734375 106 -41.800781 106 -35.40625 C 106 -29 104.5 -23.160156 101.5 -17.890625 C 98.5 -12.628906 94.429688 -8.332031 89.296875 -5 C 84.160156 -1.664062 78.460938 0.195312 72.203125 0.59375 C 71.398438 0.726562 70.597656 0.796875 69.796875 0.796875 L 42.40625 0.796875 C 30.132812 0.796875 19.398438 -3.132812 10.203125 -11 C 10.066406 -11.132812 10 -11.332031 10 -11.59375 C 10 -11.863281 10.132812 -12.066406 10.40625 -12.203125 L 21.796875 -20 C 22.066406 -20.132812 22.332031 -20.203125 22.59375 -20.203125 C 22.726562 -20.066406 22.863281 -19.863281 23 -19.59375 C 25.269531 -13.726562 28.101562 -9.128906 31.5 -5.796875 C 34.894531 -2.460938 38.53125 -0.796875 42.40625 -0.796875 L 69.796875 -0.796875 C 70.203125 -0.796875 70.570312 -0.796875 70.90625 -0.796875 C 71.238281 -0.796875 71.601562 -0.796875 72 -0.796875 C 77.601562 -1.460938 82.300781 -3.863281 86.09375 -8 C 89.894531 -12.132812 91.796875 -17.066406 91.796875 -22.796875 C 91.796875 -31.066406 88.265625 -37.332031 81.203125 -41.59375 L 27.203125 -72.796875 C 21.867188 -76.128906 17.664062 -80.53125 14.59375 -86 C 11.53125 -91.46875 10 -97.398438 10 -103.796875 C 10 -110.460938 11.628906 -116.53125 14.890625 -122 C 18.160156 -127.46875 22.53125 -131.832031 28 -135.09375 C 33.46875 -138.363281 39.535156 -140 46.203125 -140 L 73.796875 -140 C 85.929688 -140 96.597656 -136.066406 105.796875 -128.203125 C 105.929688 -128.066406 106 -127.863281 106 -127.59375 C 106 -127.332031 105.929688 -127.132812 105.796875 -127 L 94.203125 -119.203125 C 94.066406 -119.066406 93.929688 -119 93.796875 -119 C 93.660156 -119 93.59375 -119 93.59375 -119 C 93.332031 -119.132812 93.132812 -119.332031 93 -119.59375 C 90.726562 -125.46875 87.894531 -130.070312 84.5 -133.40625 C 81.101562 -136.738281 77.535156 -138.40625 73.796875 -138.40625 L 46.203125 -138.40625 C 45.929688 -138.40625 45.59375 -138.40625 45.1875 -138.40625 C 44.789062 -138.40625 44.394531 -138.40625 44 -138.40625 C 38.53125 -137.738281 33.863281 -135.335938 30 -131.203125 C 26.132812 -127.066406 24.203125 -122.132812 24.203125 -116.40625 C 24.203125 -108.132812 27.734375 -101.863281 34.796875 -97.59375 Z M 88.796875 -66.40625" />
        </g>
      </g>
    </svg>
  );
}

export function PortalSuck({ origin, contentRef, onNavigate, onDone }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    armAudioUnlock();
    const layer = layerRef.current;
    const container = contentRef.current;
    const portal = portalRef.current;
    const cover = coverRef.current;
    const logo = logoRef.current;
    if (!layer || !container || !portal || !cover || !logo) {
      onNavigate();
      onDone();
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const inView = (r: DOMRect) => r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;

    const pieces: HTMLElement[] = [];
    const LETTER_CAP = 520;

    // ── 1. Explode prominent text into per-letter spans ──────────────
    const textEls = Array.from(
      container.querySelectorAll<HTMLElement>(
        "h1, h2, h3, h4, button, a, p, [class*='text-label'], [class*='text-hero'], span"
      )
    );
    let letterCount = 0;
    for (const el of textEls) {
      if (letterCount >= LETTER_CAP) break;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2 || !inView(rect)) continue;
      if (el.querySelector("h1,h2,h3,h4,p,span,a,button")) continue;
      const cs = getComputedStyle(el);
      const node = el.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) continue;
      const text = node.textContent ?? "";
      for (let i = 0; i < text.length && letterCount < LETTER_CAP; i++) {
        const ch = text[i];
        if (!ch.trim()) continue;
        const range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        if (r.width === 0 || !inView(r)) continue;
        const span = document.createElement("span");
        span.textContent = ch;
        Object.assign(span.style, {
          position: "fixed", left: r.left + "px", top: r.top + "px", margin: "0",
          color: cs.color, fontFamily: cs.fontFamily, fontSize: cs.fontSize,
          fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, letterSpacing: cs.letterSpacing,
          lineHeight: "1", whiteSpace: "pre", willChange: "transform, opacity", pointerEvents: "none",
        } as CSSStyleDeclaration);
        layer.appendChild(span);
        pieces.push(span);
        letterCount++;
      }
    }

    // ── 2. Clone every solid-coloured panel (designer tiles, buttons,
    //       images) as a chunk that flies into the hole. We scan broadly
    //       for any element with a solid background that isn't the page
    //       colour, and skip nested duplicates. ─────────────────────────
    const captured = new Set<Element>();
    const blockEls = Array.from(container.querySelectorAll<HTMLElement>("a, div, button, img, video")).slice(0, 600);
    let blockCount = 0;
    for (const el of blockEls) {
      if (blockCount >= 90) break;
      const rect = el.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40 || !inView(rect)) continue;
      // skip the whole-page containers
      if (rect.width > W * 0.96 && rect.height > H * 0.9) continue;
      // skip if an ancestor was already captured (avoid double panels)
      let anc: Element | null = el.parentElement;
      let nested = false;
      while (anc) { if (captured.has(anc)) { nested = true; break; } anc = anc.parentElement; }
      if (nested) continue;

      const cs = getComputedStyle(el);
      const isMedia = el.tagName === "IMG" || el.tagName === "VIDEO";
      const col = parseColor(cs.backgroundColor);
      const solid = col.a > 0.55;
      const nearWhite = col.r > 238 && col.g > 238 && col.b > 238;
      if (!isMedia && (!solid || nearWhite)) continue;

      const div = document.createElement("div");
      Object.assign(div.style, {
        position: "fixed", left: rect.left + "px", top: rect.top + "px",
        width: rect.width + "px", height: rect.height + "px",
        background: isMedia ? "#111" : cs.backgroundColor,
        borderRadius: cs.borderRadius, willChange: "transform, opacity", pointerEvents: "none",
      } as CSSStyleDeclaration);
      layer.appendChild(div);
      pieces.push(div);
      captured.add(el);
      blockCount++;
    }

    // Hide the real page instantly — clones stand in (no layout shift)
    container.style.visibility = "hidden";

    // ── 3. Portal opens ──────────────────────────────────────────────
    gsap.set(portal, { left: origin.x, top: origin.y, scale: 0, opacity: 0 });
    gsap.to(portal, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" });
    const portalSpin = gsap.to(portal, { rotation: 360, duration: 2.2, ease: "none", repeat: -1 });

    // ── 4. Suck every piece into the portal ──────────────────────────
    // Void-suction whoosh, rising in pitch/intensity as everything is pulled
    // in — duration matched to how long the suck takes below.
    let maxEnd = 0;
    for (const el of pieces) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const toX = origin.x - cx;
      const toY = origin.y - cy;
      const dist = Math.hypot(toX, toY);
      const delay = Math.random() * 0.5 + (dist / Math.hypot(W, H)) * 0.3;
      const dur = 0.7 + Math.random() * 0.5;
      maxEnd = Math.max(maxEnd, delay + dur);
      const perp = { x: -toY, y: toX };
      const swirl = (Math.random() - 0.5) * 0.6;
      gsap.to(el, {
        keyframes: {
          x: [0, toX * 0.45 + perp.x * swirl, toX],
          y: [0, toY * 0.45 + perp.y * swirl, toY],
        },
        rotation: (Math.random() - 0.5) * 720,
        scale: 0, opacity: 0, duration: dur, delay, ease: "power2.in",
      });
    }
    playVoidSuction(maxEnd + 0.1);

    // ── 5. Logo erupts from the hole and covers the screen ───────────
    // distance from the singularity to the farthest corner
    const maxR = Math.max(
      Math.hypot(origin.x, origin.y),
      Math.hypot(W - origin.x, origin.y),
      Math.hypot(origin.x, H - origin.y),
      Math.hypot(W - origin.x, H - origin.y)
    ) + 40;

    // dark disc that expands from the portal point
    gsap.set(cover, {
      left: origin.x - maxR, top: origin.y - maxR,
      width: maxR * 2, height: maxR * 2, scale: 0, opacity: 1,
    });
    // logo starts tiny at the portal point
    const logoTarget = (H * 0.78) / 260; // scale so the mark fills most of the screen
    gsap.set(logo, { left: origin.x, top: origin.y, xPercent: -50, yPercent: -50, scale: 0, opacity: 0, rotate: -25 });

    const tl = gsap.timeline({ delay: maxEnd + 0.1 });
    // portal collapse pulse, with a deep impact thump
    tl.call(() => playVoidThump(), undefined, 0)
      .to(portal, { scale: 1.7, duration: 0.12, ease: "power2.out" }, 0)
      .to(portal, { scale: 0, opacity: 0, duration: 0.16, ease: "power2.in", onComplete: () => portalSpin.kill() }, 0.12);

    // disc bursts out to cover the whole screen
    tl.to(cover, { scale: 1, duration: 0.6, ease: "power3.out" }, 0.18);
    // GS logo erupts, growing from the singularity to fill the screen
    tl.to(logo, { scale: logoTarget, opacity: 1, rotate: 0, duration: 0.75, ease: "power3.out" }, 0.2);
    // a couple of cosmic glints on the logo
    tl.to(logo, { filter: "drop-shadow(0 0 40px rgba(154,123,255,0.9))", duration: 0.3, yoyo: true, repeat: 1 }, 0.45);

    // fully covered → swap the route behind the logo
    tl.call(() => onNavigate(), undefined, 1.05);

    // reveal: logo zooms through the viewer and fades; disc fades to the world
    tl.call(() => {
      container.style.visibility = "visible";
      gsap.fromTo(
        container,
        { scale: 1.04, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out", onComplete: () => gsap.set(container, { clearProps: "all" }) }
      );
    }, undefined, 1.35);
    tl.to(logo, { scale: logoTarget * 2.1, opacity: 0, duration: 0.6, ease: "power2.in" }, 1.3);
    tl.to(cover, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 1.45);
    tl.call(() => onDone(), undefined, 2.0);

    return () => {
      gsap.killTweensOf(pieces);
      portalSpin.kill();
      if (container) {
        container.style.visibility = "visible";
        gsap.set(container, { clearProps: "all" });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={layerRef} className="fixed inset-0 z-[10000] pointer-events-none" aria-hidden>
      {/* Portal / singularity — large, centered */}
      <div
        ref={portalRef}
        style={{
          position: "fixed", width: 220, height: 220, marginLeft: -110, marginTop: -110, borderRadius: "50%",
          background:
            "radial-gradient(circle, #000 30%, rgba(154,123,255,0.6) 48%, rgba(0,240,255,0.4) 62%, rgba(0,0,0,0) 74%)",
          boxShadow: "0 0 90px 20px rgba(154,123,255,0.6), inset 0 0 60px rgba(0,0,0,0.95)",
        }}
      >
        <div
          style={{
            position: "absolute", inset: -16, borderRadius: "50%",
            border: "2px solid rgba(0,240,255,0.6)", borderTopColor: "transparent", borderLeftColor: "transparent",
          }}
        />
      </div>

      {/* Dark disc that expands from the hole to cover the screen */}
      <div ref={coverRef} style={{ position: "fixed", borderRadius: "50%", background: "#0a0a0a", transformOrigin: "center center" }} />

      {/* GS monogram that erupts out and fills the screen */}
      <div ref={logoRef} style={{ position: "fixed", transformOrigin: "center center" }}>
        <GuildMark size={260} color="#ffffff" />
      </div>
    </div>
  );
}
