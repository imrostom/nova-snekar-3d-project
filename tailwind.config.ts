import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070908",
        coal: "#0e1210",
        panel: "#141a16",
        volt: "#D6FF4D",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: { marquee: { to: { transform: "translateX(-50%)" } } },
      animation: { marquee: "marquee 38s linear infinite" },
      boxShadow: {
        volt: "0 0 40px -8px rgba(214,255,77,.55)",
      },
    },
  },
  plugins: [],
};
export default config;
