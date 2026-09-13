/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#7367F0",
          hover: "#6257DC",
          soft: "#EDEBFD",
          softDark: "#2A2650",
        },
        success: "#28C76F",
        warning: "#FF9F43",
        danger: "#EA5455",
        info: "#00CFE8",
        surface: {
          bg: "#F7F7FB",
          card: "#FFFFFF",
          sidebar: "#FFFFFF",
          border: "#E9E7F0",
          text: "#5E5873",
          textStrong: "#2B2942",
          muted: "#9CA3AF",
          hover: "#F4F3FA",
        },
        surfaceDark: {
          bg: "#111827",
          card: "#1C2330",
          sidebar: "#151A24",
          border: "#2D3544",
          text: "#E5E7EB",
          textStrong: "#F9FAFB",
          muted: "#8B93A7",
          hover: "#232B3A",
        },
      },
      borderRadius: {
        card: "14px",
        control: "10px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(16,15,40,0.04)",
      },
    },
  },
  plugins: [],
};
