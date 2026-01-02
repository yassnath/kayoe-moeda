// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        km: {
          forest: "#0B2A22",
          wood: "#0B2A22",
          moss: "#0F3A2C",
          brass: "#C2A15A",
          caramel: "#A7833B",
          cream: "#F4EAD2",
          sand: "#E6D1A0",
          clay: "#9E7A39",
          paper: "#F6EED8",
          ink: "#1B1A14",
          muted: "#6A5A3D",
          line: "rgba(194,161,90,0.35)",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17, 24, 39, 0.08)",
        lift: "0 14px 40px rgba(17, 24, 39, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
