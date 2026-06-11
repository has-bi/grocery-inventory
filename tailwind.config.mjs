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
  darkMode: "class",
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",      // blue-500
          "secondary": "#64748b",    // gray-500
          "accent": "#f59e0b",       // amber-500
          "neutral": "#1f2937",      // gray-800
          "base-100": "#ffffff",     // white
          "base-200": "#f9fafb",     // gray-50
          "base-300": "#f3f4f6",     // gray-100
          "info": "#3b82f6",         // blue-500
          "success": "#10b981",      // green-500
          "warning": "#f59e0b",      // amber-500
          "error": "#ef4444",        // red-500
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
};
