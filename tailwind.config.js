/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        edublue: {
          DEFAULT: "#0b4b8f",
        },
        edugold: {
          DEFAULT: "#f1c40f",
        },
      },
    },
  },
  plugins: [],
};
