import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 주 색상: 따뜻한 파랑 (#1F77D2 = 500)
        brand: {
          50: "#eef5fc",
          100: "#d6e7f8",
          200: "#b0d0f1",
          300: "#7fb2e7",
          400: "#4a92dc",
          500: "#1f77d2",
          600: "#1a60ab",
          700: "#174e8a",
          800: "#163f6f",
          900: "#14365c",
        },
        // 강조: 주황 (#FF6B35 = 500)
        accent: {
          50: "#fff3ee",
          100: "#ffe1d4",
          200: "#ffc3a9",
          300: "#ff9d73",
          400: "#ff8453",
          500: "#ff6b35",
          600: "#ed4f15",
          700: "#c43c0f",
          800: "#9c3210",
          900: "#7e2c12",
        },
        // 배경: 따뜻한 오프화이트
        warm: {
          50: "#fdfbf9",
          100: "#f9f6f3",
          200: "#f1ebe4",
          300: "#e7ddd2",
          400: "#d8c9b8",
        },
        ink: "#2c2c2c",
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "warm-rise": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
        "warm-rise": "warm-rise 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        warm: "0 10px 30px -12px rgba(31, 119, 210, 0.18), 0 4px 10px -6px rgba(255, 107, 53, 0.12)",
        "warm-lg":
          "0 20px 45px -18px rgba(31, 119, 210, 0.25), 0 8px 18px -10px rgba(255, 107, 53, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
