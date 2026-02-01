import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        secondary: "var(--secondary)",
        background: {
          light: "var(--background)",
          dark: "#0F1115", // Keeping explicit for now or use var(--background) if mapped correctly in CSS for dark mode
        },
        surface: {
          light: "var(--surface)",
          dark: "var(--surface)", // The variable changes value in dark mode
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};
export default config;
