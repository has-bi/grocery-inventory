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
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary":          "#18181b",
          "primary-content":  "#fafafa",
          "secondary":        "#71717a",
          "secondary-content":"#fafafa",
          "accent":           "#18181b",
          "accent-content":   "#fafafa",
          "neutral":          "#3f3f46",
          "neutral-content":  "#fafafa",
          "base-100":         "#ffffff",
          "base-200":         "#f4f4f5",
          "base-300":         "#e4e4e7",
          "base-content":     "#18181b",
          "info":             "#0ea5e9",
          "info-content":     "#ffffff",
          "success":          "#22c55e",
          "success-content":  "#ffffff",
          "warning":          "#f59e0b",
          "warning-content":  "#000000",
          "error":            "#ef4444",
          "error-content":    "#ffffff",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
};
