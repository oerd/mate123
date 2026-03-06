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
        neo: {
          yellow: '#FFDE00', // Nano Banana
          blue: '#38BDF8',
          pink: '#F472B6',
          green: '#4ADE80',
          orange: '#FB923C',
          white: '#FFFFFF',
          black: '#000000'
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px rgba(0,0,0,1)',
        'hard-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
      borderRadius: {
        neo: '56px',
      },
      fontFamily: {
        sans: ['var(--font-fredoka)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;
