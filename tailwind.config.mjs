/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Every tint clears WCAG AA (4.5:1) against all three surfaces, so any
        // text token can sit on any background without a contrast check.
        ink: {
          DEFAULT: "#18181b", // 16.1:1 worst case
          soft: "#3f3f46", //  9.5:1
          muted: "#52525b", //  7.0:1
          faint: "#64646d", //  5.3:1
        },
        surface: {
          DEFAULT: "#ffffff",
          sunken: "#fafafa",
          raised: "#f4f4f5",
        },
        line: {
          DEFAULT: "#e4e4e7",
          strong: "#d4d4d8",
        },
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.24s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in": "fade-in 0.18s ease-out",
        "pop-in": "pop-in 0.18s cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
