/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          200: "#b3deff",
          300: "#80c9ff",
          400: "#45adff",
          500: "#0f8fff",
          600: "#006fe0",
        },
        peach: {
          50: "#fff8f1",
          100: "#ffe8d5",
          200: "#ffc79b",
        },
        mint: {
          50: "#ecfff8",
          100: "#cefce7",
          200: "#8ef1c5",
        },
        surface: {
          950: "#050816",
          900: "#0b1120",
          850: "#11192d",
          800: "#172137",
          700: "#23304a",
          600: "#31415f",
        },
        accent: {
          50: "#effeff",
          100: "#cffcff",
          200: "#9ef5ff",
          300: "#63e7ff",
          400: "#22d3ee",
          500: "#0ea5c6",
          600: "#0c7f98",
        },
        gold: {
          100: "#fff2c2",
          200: "#f5d66e",
          300: "#e6b93e",
        },
        success: {
          100: "#d8ffe7",
          200: "#6ee7a8",
          300: "#22c55e",
        },
      },
      boxShadow: {
        soft: "0 14px 36px rgba(3, 7, 18, 0.18)",
        panel: "0 24px 80px rgba(2, 6, 23, 0.48)",
        glow: "0 0 0 1px rgba(34, 211, 238, 0.12), 0 20px 60px rgba(8, 145, 178, 0.18)",
      },
      fontFamily: {
        sans: ["Sora", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Clash Display", "Sora", "Poppins", "ui-sans-serif", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "shell-gradient":
          "radial-gradient(circle at 0% 0%, rgba(34,211,238,0.14), transparent 32%), radial-gradient(circle at 100% 0%, rgba(245,214,110,0.12), transparent 24%), linear-gradient(180deg, rgba(11,17,32,0.96) 0%, rgba(5,8,22,1) 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.45s ease-out",
      },
    },
  },
  plugins: [],
};
