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
        kuwait: {
          green: "#007A3D",
          red: "#CE1126",
          black: "#000000",
          white: "#FFFFFF",
          gold: "#C9A84C",
          sand: "#F5E6C8",
          "green-light": "#00A651",
          "green-dark": "#005C2D",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "sans-serif"],
      },
      backgroundImage: {
        "flag-gradient":
          "linear-gradient(to right, #007A3D 25%, #FFFFFF 25% 50%, #CE1126 50% 75%, #000000 75%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "70%": { transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
