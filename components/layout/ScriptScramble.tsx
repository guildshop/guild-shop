"use client";

/**
 * ScriptScramble — renders a word where each letter rapidly cycles through
 * glyphs from many world scripts, then resolves to the real Latin letter after
 * ~7 seconds. Re-runs every time it scrolls into view.
 *
 * Layout is locked to the Latin word (each slot reserves its Latin letter's
 * width and centers the scrambling glyph inside) so nothing shifts.
 */

import { useEffect, useRef, useState } from "react";
import { armAudioUnlock, playFlip } from "@/lib/sfx";

const SCRIPTS: string[] = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",          // Latin
  "БГДЖЗИЙЛПФЦЧШЩЫЮЯДËЄ",                 // Cyrillic
  "ΑΒΓΔΕΖΗΘΛΞΠΣΦΨΩΘΦ",                    // Greek
  "ابتثجحخدذرزسشصضطظعغفق",               // Arabic
  "אבגדהוזחטיכלמנסעפצקרש",               // Hebrew
  "अआइईउऊकखगघचछजझञटठडढ",                  // Devanagari
  "অআইঈউঊকখগঘচছজঝঞটঠড",                   // Bengali
  "ੳਅੲਸਹਕਖਗਘਙਚਛਜਝਞਟਠਡ",                   // Gurmukhi
  "અઆઇઈઉઊકખગઘઙચછજઝઞટઠ",                   // Gujarati
  "அஆஇஈஉஊகஙசஞடணதநபமயர",                  // Tamil
  "అఆఇఈఉఊకఖగఘఙచఛజఝఞటఠ",                   // Telugu
  "ಅಆಇಈಉಊಕಖಗಘಙಚಛಜಝಞಟಠ",                   // Kannada
  "അആഇഈഉഊകഖഗഘങചഛജഝഞടഠ",                   // Malayalam
  "กขคฆงจฉชซฌญฎฏฐฑฒณด",                   // Thai
  "山水火風雨雲花月日木林森川空海光星夜",   // Hanzi
  "あいうえおかきくけこさしすせそたちつ",   // Hiragana
  "アイウエオカキクケコサシスセソタチツ",   // Katakana
  "가나다라마바사아자차카타파하거너더",     // Hangul
];

const SCRAMBLE_MS = 2000; // stop after 2 seconds
const TICK_MS = 70;       // glyph swap interval

function randomGlyph(): string {
  const s = SCRIPTS[(Math.random() * SCRIPTS.length) | 0];
  return s[(Math.random() * s.length) | 0];
}

export function ScriptScramble({ text, style }: { text: string; style?: React.CSSProperties }) {
  const letters = text.split("");
  // Start on the real Latin letters so server and client render identically
  // (no hydration mismatch); the scramble only begins once mounted.
  const [glyphs, setGlyphs] = useState<string[]>(() => letters);
  const ref = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    armAudioUnlock();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      const start = performance.now();
      // each non-space letter locks to Latin at a slightly staggered moment
      // near the end, so the word resolves organically by ~7s.
      const lockAt = letters.map((ch) =>
        ch.trim() === "" ? 0 : SCRAMBLE_MS - 700 + Math.random() * 700
      );

      const id = window.setInterval(() => {
        const t = performance.now() - start;
        let anyStillFlipping = false;
        setGlyphs(
          letters.map((ch, i) => {
            if (ch.trim() === "") return ch;
            if (t >= lockAt[i]) return ch; // resolved to real Latin letter
            anyStillFlipping = true;
            return randomGlyph();
          })
        );
        if (anyStillFlipping) playFlip();
        if (t >= SCRAMBLE_MS) {
          window.clearInterval(id);
          setGlyphs(letters); // ensure final Latin
          runningRef.current = false;
        }
      }, TICK_MS);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) run();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} style={style} aria-label={text}>
      {letters.map((ch, i) => (
        <span key={i} style={{ position: "relative", display: "inline-block" }} aria-hidden>
          {/* reserve the Latin letter's width so layout never shifts */}
          <span style={{ visibility: "hidden" }}>{ch === " " ? " " : ch}</span>
          <span
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            {glyphs[i] === " " ? " " : glyphs[i]}
          </span>
        </span>
      ))}
    </div>
  );
}
