/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Include the new app directory
    "./styles/**/*.css",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        twitter: "#844ed9",
        liked: "#CD1D5F",
        retweet: "#00FF00"
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar")],
};
