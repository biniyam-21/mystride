export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono", "ui-monospace", "monospace"],
        display: ["JetBrains Mono", "ui-monospace", "monospace"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "rgb(var(--ink-950) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
          850: "rgb(var(--ink-850) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          750: "rgb(var(--ink-750) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          650: "rgb(var(--ink-650) / <alpha-value>)",
        },
        // Dynamic accent — driven by CSS custom properties, supports opacity modifiers
        accent: {
          200: "rgb(var(--accent-200) / <alpha-value>)",
          300: "rgb(var(--accent-300) / <alpha-value>)",
          400: "rgb(var(--accent-400) / <alpha-value>)",
          500: "rgb(var(--accent-500) / <alpha-value>)",
          600: "rgb(var(--accent-600) / <alpha-value>)",
          700: "rgb(var(--accent-700) / <alpha-value>)",
        },
      },
      boxShadow: {
        glow:  "0 0 42px rgb(var(--accent-500) / 0.18)",
        panel: "0 18px 70px rgba(0, 0, 0, 0.38)",
      },
      backgroundImage: {
        "metal-flow":
          "radial-gradient(circle at 20% 20%, rgba(168,85,247,.38), transparent 28%), radial-gradient(circle at 82% 12%, rgba(99,102,241,.28), transparent 25%), linear-gradient(135deg, #2a2a30 0%, #17171b 42%, #08080a 100%)",
      },
    },
  },
  plugins: [],
};
