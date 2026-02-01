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
          DEFAULT: "#2D6CF6",
          dark: "#1E4ED8",
        },
        secondary: "#6C7593",
        background: {
          light: "#F7F9FC",
          dark: "#0F1115",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1B1E24",
        },
        text: {
          light: "#11181C",
          dark: "#ECEDEE",
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
