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
          base: "#1e1e2e",
          mantle: "#181825",
          crust: "#11111b",
          
          // Text
          text: "#cdd6f4",
          subtext1: "#bac2de",
          subtext0: "#a6adc8",
          
          // Overlay
          overlay2: "#9399b2",
          overlay1: "#7f849c",
          overlay0: "#6c7086",
          
          // Surface
          surface2: "#585b70",
          surface1: "#45475a",
          surface0: "#313244",
          
          // Accents
          blue: "#89b4fa",
          lavender: "#b4befe",
          sapphire: "#74c7ec",
          sky: "#89dceb",
          teal: "#94e2d5",
          green: "#a6e3a1",
          yellow: "#f9e2af",
          peach: "#fab387",
          maroon: "#eba0ac",
          red: "#f38ba8",
          mauve: "#cba6f7",
          pink: "#f5c2e7",
          flamingo: "#f2cdcd",
          rosewater: "#f5e0dc",
          
          // Catppuccin Latte (light) theme
          latte: {
            // Base
            base: "#eff1f5",
            mantle: "#e6e9ef",
            crust: "#dce0e8",
            
            // Text
            text: "#4c4f69",
            subtext1: "#5c5f77",
            subtext0: "#6c6f85",
            
            // Overlay
            overlay2: "#7c7f93",
            overlay1: "#8c8fa1",
            overlay0: "#9ca0b0",
            
            // Surface
            surface2: "#acb0be",
            surface1: "#bcc0cc",
            surface0: "#ccd0da",
            
            // Accents
            blue: "#1e66f5",
            lavender: "#7287fd",
            sapphire: "#209fb5",
            sky: "#04a5e5",
            teal: "#179299",
            green: "#40a02b",
            yellow: "#df8e1d",
            peach: "#fe640b",
            maroon: "#e64553",
            red: "#d20f39",
            mauve: "#8839ef",
            pink: "#ea76cb",
            flamingo: "#dd7878",
            rosewater: "#dc8a78",
          }
        },
        
        // Map theme colors to functional names
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
