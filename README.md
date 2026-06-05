# Guild Shop

A curated digital marketplace for independent fashion designers and jewellery artists.
**An art-gallery-meets-luxury-fashion platform.**

---

## Quick Start

```bash
# 1. Install Node.js (if not installed)
#    → https://nodejs.org  (LTS version recommended)
#    OR via Homebrew: brew install node

# 2. Navigate to the project
cd guild-shop

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

---

## Project Structure

```
guild-shop/
├── app/
│   ├── layout.tsx              # Root layout, providers, navigation
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Design tokens, CSS variables, keyframes
│   ├── about/page.tsx          # Brand manifesto
│   ├── contact/page.tsx        # Contact form
│   ├── join/page.tsx           # Designer application (multi-step)
│   ├── login/page.tsx          # Auth UI
│   └── designers/
│       ├── page.tsx            # Designers listing
│       └── [slug]/
│           ├── page.tsx        # Dynamic designer world router
│           └── not-found.tsx
│
├── components/
│   ├── navigation/
│   │   └── Navigation.tsx      # Sticky nav, dark/light toggle, cart button
│   ├── hero/
│   │   ├── HeroSection.tsx     # Main hero with parallax
│   │   └── HeroCanvas.tsx      # Three.js floating jewelry scene
│   ├── designers/
│   │   ├── DesignerCard.tsx    # 3D tilt portal cards
│   │   ├── FeaturedDesigners.tsx
│   │   ├── VesperPage.tsx      # VESPER brutalist world
│   │   ├── NovaAuraPage.tsx    # NOVA AURA futuristic world
│   │   ├── NovaAuraCanvas.tsx  # Three.js neon rings scene
│   │   └── TerraPage.tsx       # TERRA earthy world
│   ├── cart/
│   │   └── CartDrawer.tsx      # Slide-out cart with animations
│   ├── sections/
│   │   ├── MarketplacePreview.tsx  # Editorial product grid
│   │   └── AboutSection.tsx        # Guild philosophy
│   ├── layout/
│   │   └── Footer.tsx
│   └── ui/
│       ├── LoadingScreen.tsx   # Animated entry screen
│       ├── PageTransition.tsx
│       └── ThemeToggle.tsx
│
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── designers.ts            # All designer/product data
│   ├── cart-store.ts           # Zustand cart state
│   └── utils.ts                # Helpers (cn, formatPrice, lerp)
│
└── providers/
    └── Providers.tsx           # ThemeProvider + AnimatePresence
```

---

## Designer Theme System

Each designer has a `DesignerTheme` object that defines their complete visual world.
The theme is applied via CSS custom properties (`cssVars`) injected on the designer page root:

```typescript
// lib/types.ts
interface DesignerTheme {
  bg: string;           // background colour
  fg: string;           // foreground/text colour  
  accent: string;       // primary accent
  accentSecondary?: string;
  fontDisplay: string;  // display/headline font stack
  fontBody: string;     // body font stack
  mood: "brutalist" | "futuristic" | "earthy" | ...;
  motionSpeed: "slow" | "medium" | "fast";
  cssVars: Record<string, string>; // applied to wrapper div
}
```

### Current Designers

| Designer | Mood | Palette | Font |
|----------|------|---------|------|
| **VESPER** | Brutalist monochrome | `#080808` / `#f0f0f0` / white | Playfair Display + Space Mono |
| **NOVA AURA** | Futuristic cyber | `#04040f` / `#00f0ff` / `#ff00aa` | Space Grotesk |
| **TERRA** | Earthy warmth | `#f2ece4` / `#2c1f17` / `#c17f52` | Lora (serif) |

### Adding a New Designer

1. Add entry to `lib/designers.ts` (follow existing pattern)
2. Create `components/designers/YourDesignerPage.tsx`
3. Register in `app/designers/[slug]/page.tsx`

---

## Feature Overview

| Feature | Implementation |
|---------|----------------|
| 3D Hero | `@react-three/fiber` — floating jewelry rings + particles |
| Designer 3D | NOVA AURA: neon electroformed ring sculpture |
| Page transitions | Framer Motion `AnimatePresence` |
| Mouse parallax | Hero camera rig reacts to cursor |
| 3D tilt cards | `useMotionValue` + `useSpring` on designer cards |
| Cart | Zustand + `persist` middleware (localStorage) |
| Dark/light mode | `next-themes` with CSS variable system |
| Loading screen | SVG path animation on entry |
| Editorial grid | Asymmetric CSS grid with span controls |
| Scroll animations | `whileInView` with staggered delays |
| Designer portals | Unique CSS vars + font + layout per designer |

---

## Fonts

All fonts loaded from Google Fonts:

- **Cormorant Garamond** — Main Guild brand (display, editorial)
- **Inter** — UI text, labels, body
- **Playfair Display** — VESPER designer (bold serif)
- **Space Grotesk** — NOVA AURA designer (geometric sans)
- **Space Mono** — VESPER body / mono labels
- **Lora** — TERRA designer (warm serif)

---

## Motion Timing

```css
--ease-luxury:    cubic-bezier(0.16, 1, 0.3, 1)   /* primary — overshoots gently */
--ease-out:       cubic-bezier(0.0, 0, 0.2, 1)    /* element exits */
--ease-in:        cubic-bezier(0.4, 0, 1, 1)       /* element entries */

--duration-fast:  200ms
--duration-mid:   500ms
--duration-slow:  900ms
--duration-cinematic: 1400ms
```

Motion guidelines:
- Hero reveals: 1.1–1.3s with `--ease-luxury`
- Card hovers: 300–400ms
- Page transitions: 650ms
- 3D camera tracking: `lerp` at 3–5% per frame

---

## Scalability Notes

- **New designer**: 1 data entry + 1 page component + 1 route registration
- **New product**: add to `designer.products[]` in `lib/designers.ts`
- **Real images**: replace `gradient` strings in product/lookbook data with `src` URLs; update components to use `next/image`
- **Auth**: wire `/app/login` to your auth provider (Next-Auth, Clerk, Supabase, etc.)
- **Checkout**: replace the cart drawer's "Proceed to Checkout" button with Stripe, Shopify Storefront API, or similar
- **CMS**: move `lib/designers.ts` data to Sanity, Contentful, or similar — the component layer stays the same
- **Performance**: all 3D canvases are dynamically imported (`ssr: false`), DPR-capped at 1.5x

---

## Image Direction (for real photography)

- **VESPER**: high-contrast black/white, studio shots, hard shadows, architectural framing
- **NOVA AURA**: dark backgrounds, UV/neon lighting, reflective surfaces, macro metal detail
- **TERRA**: natural outdoor light, earth/stone textures, warm golden hour, artisan process shots

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Animation | Framer Motion |
| 3D | React Three Fiber + Drei |
| State | Zustand (cart) + next-themes (dark mode) |
| Fonts | Google Fonts |
