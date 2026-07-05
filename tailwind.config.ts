import type { Config } from "tailwindcss";

/**
 * Дизайн-система MULK.
 * Премиальная, тёплая, «дорогая» палитра: глубокий ink, тёплый золотой акцент,
 * изумруд для доверия/«проверено», спокойные off-white поверхности.
 * Все агенты и страницы используют ТОЛЬКО эти токены — это держит вид единым.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0C1116",
          soft: "#151C24",
          muted: "#1E2833",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          2: "#F7F5F1",
          3: "#EFEBE3",
        },
        line: {
          DEFAULT: "#E7E2D9",
          strong: "#D6CFC2",
          dark: "#28313B",
        },
        text: {
          DEFAULT: "#12171C",
          soft: "#4A515A",
          muted: "#828892",
          invert: "#F5F3EE",
        },
        gold: {
          DEFAULT: "#B98B3E",
          bright: "#C9A15A",
          soft: "#EBDCBB",
          wash: "#F6EFDE",
        },
        emerald: {
          DEFAULT: "#1F6E5A",
          bright: "#2E8C73",
          soft: "#DCEDE7",
        },
        danger: {
          DEFAULT: "#B4472B",
          soft: "#F4E1DA",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Georgia",
          "ui-serif",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(12,17,22,0.04), 0 8px 24px -12px rgba(12,17,22,0.10)",
        lift: "0 2px 6px rgba(12,17,22,0.05), 0 24px 48px -20px rgba(12,17,22,0.22)",
        glow: "0 0 0 1px rgba(185,139,62,0.25), 0 18px 48px -18px rgba(185,139,62,0.35)",
      },
      maxWidth: {
        prose: "68ch",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
