import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        /** H1 marketing — Bebas */
        display: [
          "clamp(2.75rem,8vw,5.5rem)",
          { lineHeight: "0.92", letterSpacing: "0.02em" },
        ],
        /** Lead paragraphs — calm, readable */
        lead: [
          "clamp(1.125rem,2.2vw,1.375rem)",
          { lineHeight: "1.35", letterSpacing: "0.01em" },
        ],
        /** Body default — ~65ch friendly when paired with max-w-prose */
        body: ["1rem", { lineHeight: "1.65" }],
        /** Legal / captions */
        legal: ["0.75rem", { lineHeight: "1.5" }],
      },
      fontFamily: {
        display: ["var(--font-bebas)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm)", "system-ui", "sans-serif"],
      },
      colors: {
        smash: {
          black: "#0a0a0a",
          ink: "#050505",
          yellow: "#FFE600",
          pink: "#FF3D9A",
          purple: "#A358DF",
          lime: "#D4FF4D",
          vanilla: "#C4A574",
        },
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.75" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        float: "float 7s ease-in-out infinite",
        "pulse-slow": "pulseSoft 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
