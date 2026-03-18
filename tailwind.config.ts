import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F1A",
        card: "#111827",
        elevated: "#1F2937",
        primary: "#6366F1",
        xp: "#22C55E",
        streak: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        text: {
          primary: "#F9FAFB",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },
      },
      boxShadow: {
        xp: "0 0 0 1px rgba(34,197,94,0.18), 0 0 24px rgba(34,197,94,0.18)",
        streak: "0 0 0 1px rgba(245,158,11,0.18), 0 0 24px rgba(245,158,11,0.22)",
        panel: "0 20px 50px rgba(0, 0, 0, 0.32)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-fade": "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
