import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
