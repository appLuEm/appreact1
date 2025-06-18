/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fireBackground: "#0F0F0F",
        fireCard: "#1F1F1F",
        fireHighlight: "#E50914",
      },
    },
  },
  plugins: [],
};
