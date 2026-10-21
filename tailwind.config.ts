import type { Config } from "tailwindcss";

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
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
          red: '#F87171',
          white: '#FFFFFF',
          black: '#000000',
          ground: 'var(--neo-ground)',
          surface: 'var(--neo-surface)',
          'surface-muted': 'var(--neo-surface-muted)',
          ink: 'var(--neo-ink)',
          'ink-muted': 'var(--neo-ink-muted)',
          shadow: 'var(--neo-shadow)',
          pill: 'var(--neo-pill)',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px var(--neo-shadow)',
        'hard-lg': '8px 8px 0px 0px var(--neo-shadow)',
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
