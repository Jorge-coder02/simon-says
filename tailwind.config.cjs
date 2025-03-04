/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(31 41 55)",
        primary: "rgb(250 204 21)",
        secondary: "rgb(23 18 18)",
        wrong: "rgba(193, 60, 60, 0.704)",
        win: "rgba(67, 229, 46, 0.518)",
      },
    },
  },
  plugins: [
    require("daisyui"), // Agrega DaisyUI aquí
  ],
  daisyui: {
    themes: ["light", "dark", "forest"],
  },
};
