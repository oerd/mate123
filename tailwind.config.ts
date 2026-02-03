import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Catppuccin Mocha theme
        ctp: {
          // Base
          base: "var(--ctp-base)",
          mantle: "var(--ctp-mantle)",
          crust: "var(--ctp-crust)",
          
          // Text
          text: "var(--ctp-text)",
          subtext1: "var(--ctp-subtext1)",
          subtext0: "var(--ctp-subtext0)",
          
          // Overlay
          overlay2: "var(--ctp-overlay2)",
          overlay1: "var(--ctp-overlay1)",
          overlay0: "var(--ctp-overlay0)",
          
          // Surface
          surface2: "var(--ctp-surface2)",
          surface1: "var(--ctp-surface1)",
          surface0: "var(--ctp-surface0)",
          
          // Accents
          blue: "var(--ctp-blue)",
          lavender: "var(--ctp-lavender)",
          sapphire: "var(--ctp-sapphire)",
          sky: "var(--ctp-sky)",
          teal: "var(--ctp-teal)",
          green: "var(--ctp-green)",
          yellow: "var(--ctp-yellow)",
          peach: "var(--ctp-peach)",
          maroon: "var(--ctp-maroon)",
          red: "var(--ctp-red)",
          mauve: "var(--ctp-mauve)",
          pink: "var(--ctp-pink)",
          flamingo: "var(--ctp-flamingo)",
          rosewater: "var(--ctp-rosewater)",
        },
        
        // Map theme colors to functional names
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
