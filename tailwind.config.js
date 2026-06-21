/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        edublue: {
          DEFAULT: "#0b4b8f"
        },
        edugold: {
          DEFAULT: "#f1c40f"
        }
      }
    }
  },
  plugins: []
};
