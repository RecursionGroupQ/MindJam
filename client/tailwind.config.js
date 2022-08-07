/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
      serif: ["Nunito", "serif"],
      body: ["Nunito", "sans-serif"],
    },
    extend: {
      zIndex: {
        "-10": "-10",
        "-9": "-9",
      },
    },
  },
  plugins: [],
});
