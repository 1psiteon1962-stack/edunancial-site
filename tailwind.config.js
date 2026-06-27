import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        edunancial: {
          background: "#08101f",
          card: "#151b2d",
          red: "#dc2626",
          white: "#f8fafc",
          blue: "#2563eb",
        },
      },
    },
  },
  plugins: [],
};

export default config;
