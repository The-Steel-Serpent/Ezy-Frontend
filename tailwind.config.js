/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ee4d2d",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(-180deg, #f53d2d, #f63)",
      },
    },
  },
  plugins: [],
};
