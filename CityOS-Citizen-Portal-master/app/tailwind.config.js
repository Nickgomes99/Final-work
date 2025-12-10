/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Dystopian surveillance system colors
        void: "#000000", // Pure black base
        steel: "#0a0a0a", // Near-black panels
        "steel-light": "#1a1a1a", // Slightly lighter panels

        // Threat states
        threat: "#ff0000", // Harsh red (authority/danger)
        "threat-dim": "#cc0000", // Dimmer red
        terminal: "#00ff00", // Terminal green (machine vision)
        "terminal-dim": "#00cc00", // Dimmer green
        data: "#00ff41", // Matrix green (data streams)

        // System alerts
        alert: "#ff0000", // Red alert state
        caution: "#ffff00", // Yellow warning
        accent: "#ffff00", // Yellow primary action

        // Text hierarchy
        "text-bright": "#ffffff", // Pure white for primary
        "text-dim": "#999999", // Gray for secondary
        "text-ghost": "#666666", // Dark gray for subtle
        "text-terminal": "#00ff00", // Green for machine text
      },
      fontFamily: {
        display: ["Courier New", "monospace"],
        sans: ["Courier New", "Consolas", "monospace"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
