/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#ee4d2d",
        primary: "#66cce6",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(-180deg, #66cce6, #298ab4)",
      },
    },
  },
  plugins: [],
};
