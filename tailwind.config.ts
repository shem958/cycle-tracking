import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Enable dark mode using class strategy to match the implementation
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom colors using CSS variables
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Adding specific color palette based on the CSS variables
        light: {
          bg: "#FFF0F3",
          text: "#2D3748",
        },
        dark: {
          bg: "#1A1523",
          text: "#E2E8F0",
        },
      },
      // Add transition utilities to match the CSS transitions
      transitionProperty: {
        'colors': 'background-color, color',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease': 'ease',
      },
    },
  },
  plugins: [],
};

export default config;