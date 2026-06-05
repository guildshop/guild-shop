import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"],
      },
      colors: {
        guild: {
          black: "#080808",
          "deep": "#0e0d0c",
          cream: "#f5f0e8",
          "warm-white": "#faf8f4",
          gold: "#c9a96e",
          "gold-light": "#e4c88a",
          "gold-dark": "#8b6030",
          charcoal: "#1a1916",
          muted: "#6b6560",
        },
        vesper: {
          bg: "#080808",
          fg: "#f0f0f0",
          accent: "#e8e8e8",
          dim: "#404040",
        },
        nova: {
          bg: "#04040f",
          fg: "#e0e8ff",
          cyan: "#00f0ff",
          magenta: "#ff00aa",
          dim: "#1a1a3a",
        },
        terra: {
          bg: "#f2ece4",
          fg: "#2c1f17",
          terracotta: "#c17f52",
          clay: "#8b5e42",
          sand: "#e8ddd0",
        },
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "drift": "drift 12s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "reveal": "reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        drift: {
          "0%, 100%": { transform: "translateX(0px) translateY(0px)" },
          "33%": { transform: "translateX(15px) translateY(-10px)" },
          "66%": { transform: "translateX(-10px) translateY(8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        reveal: {
          "0%": { clipPath: "inset(0 100% 0 0)", opacity: "0" },
          "100%": { clipPath: "inset(0 0% 0 0)", opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,169,110,0.3)" },
          "50%": { boxShadow: "0 0 50px rgba(201,169,110,0.6)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.16, 1, 0.3, 1)",
        "cinematic": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
