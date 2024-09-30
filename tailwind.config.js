/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#ee4d2d",
        primary: "#66cce6",
        secondary: "#f3fcff",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(-180deg, #66cce6, #298ab4)",
        "background-Shop": "url('/src/assets/backgroundShop.jpg')",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};
