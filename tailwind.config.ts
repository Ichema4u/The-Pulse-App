import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calm, muted color palette
        sage: {
          50: "#fafbf9",
          100: "#f0f3ee",
          200: "#e6ede5",
          300: "#d9e4d8",
          400: "#c7d7c5",
          500: "#a8c8a4",
          600: "#8fae8a",
          700: "#738f73",
          800: "#5c7460",
          900: "#4a5d4d",
        },
        slate: {
          50: "#f9f9fa",
          100: "#f1f1f3",
          200: "#e5e5e8",
          300: "#d1d1d8",
          400: "#b5b5be",
          500: "#8e8e9a",
          600: "#6f6f7e",
          700: "#50505a",
          800: "#3a3a44",
          900: "#25252d",
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a89e99",
          500: "#78716c",
          600: "#57534e",
          700: "#45403c",
          800: "#38322f",
          900: "#27211d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
