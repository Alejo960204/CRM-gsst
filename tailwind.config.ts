import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#101826",
          light: "#1B2636",
        },
        paper: "#F6F7F9",
        surface: "#FFFFFF",
        line: "#E4E7EC",
        muted: "#5B6472",
        amber: {
          DEFAULT: "#F5A524",
          dark: "#C97C0A",
          light: "#FDECD1",
        },
        semaphore: {
          green: "#1D9A6C",
          greenBg: "#E4F5EE",
          amber: "#E1A100",
          amberBg: "#FCF1D6",
          red: "#D5484B",
          redBg: "#FBE7E7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 38, 0.06), 0 1px 8px rgba(16, 24, 38, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
