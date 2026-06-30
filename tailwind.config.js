/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        beige: {
          50:  "#FDFAF4",
          100: "#F5F0E8",
          200: "#EDE5D5",
          300: "#E0D5C0",
          400: "#D0C5A8",
          500: "#B8A888",
          600: "#9A8A68",
          700: "#7A6A50",
          800: "#5A4E3A",
          900: "#3A3228",
        },
        mint: {
          50:  "#f2fbf6",
          100: "#e0f7ea",
          200: "#bbedd0",
          300: "#86dca9",
          400: "#4dc47e",
          500: "#28a85d",
          600: "#1b8a49",
          700: "#176e3b",
          800: "#145730",
          900: "#114829",
        },
        forest: {
          50:  "#f0f7f0",
          100: "#dceede",
          200: "#b8ddb9",
          300: "#8ac48c",
          400: "#5aa65d",
          500: "#3a8a3d",
          600: "#2d6e30",
          700: "#235726",
          800: "#1a421c",
          900: "#112e13",
          950: "#0a1e0b",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans:    ["'DM Sans'", "system-ui", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      animation: {
        marquee:  "marquee 25s linear infinite",
        "fade-up": "fadeUp 0.5s ease forwards",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};