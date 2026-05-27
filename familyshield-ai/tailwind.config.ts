import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dcfd",
          300: "#7cc0fb",
          400: "#36a0f6",
          500: "#0c84e8",
          600: "#0068c6",
          700: "#0153a1",
          800: "#064785",
          900: "#0b3c6e",
        },
        family: {
          mint: "#d1fae5",
          peach: "#ffedd5",
          lavender: "#ede9fe",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
