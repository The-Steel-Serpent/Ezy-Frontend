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
        // primary: "#658197",
        primary: "#327bb3",
        secondary: "#5fa0be",
      },
      backgroundImage: {
        // "custom-gradient": "linear-gradient(-180deg, #66cce6, #298ab4)",
        // "custom-gradient": "linear-gradient(-180deg,#169afc,#658197)",
        "custom-gradient":
          "radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,84,166,1) 0%, rgba(132,189,201,1) 90% )",
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
