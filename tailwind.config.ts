import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Luxury Swiss Watch Palette
        ivory: {
          50: "#FAF9F6",
          100: "#F7F5F0",
          200: "#EFECE4",
          300: "#E2DDD2",
          400: "#CFC7B7",
        },
        graphite: {
          700: "#2B3137",
          800: "#1E2226",
          900: "#14171A",
          950: "#0D1013",
        },
        gold: {
          100: "#F8F4EC",
          200: "#EADBBD",
          300: "#D8C08E",
          400: "#C3A875",
          500: "#B89B65",
          600: "#9E824F",
          700: "#7F673B",
        },
        surface: {
          light: "#FFFFFF",
          lightMuted: "#F7F5F0",
          dark: "#161B1F",
          darkMuted: "#0D1013",
          darkCard: "#1B2228",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: [
          "Outfit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        luxury: "16px",
        "luxury-sm": "12px",
        "luxury-lg": "24px",
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        "luxury-hover": "0 20px 40px -15px rgba(184, 155, 101, 0.15)",
        "luxury-dark": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 2.5s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
