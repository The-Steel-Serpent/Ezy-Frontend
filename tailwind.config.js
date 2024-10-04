/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        garibato: ["Garibato", "sans-serif"], // thêm phông chữ "Garibato"
      },
      colors: {
        // primary: "#ee4d2d",
        // primary: "#66cce6",
        primary: "#658197",
        secondary: "#f3fcff",
      },
      backgroundImage: {
        // "custom-gradient": "linear-gradient(-180deg, #66cce6, #298ab4)",
        "custom-gradient": "linear-gradient(-180deg,#3f6a8a,#658197)",
        "background-Shop": "url('/src/assets/backgroundShop.jpg')",
        "background-Shop-2": "url('/src/assets/view-wild-goat.jpg')",
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
