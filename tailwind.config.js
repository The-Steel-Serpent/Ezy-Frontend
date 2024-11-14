/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      clipPath: {
        "vertical-sawtooth":
          "polygon(0% 0%, 10% 10%, 0% 20%, 10% 30%, 0% 40%, 10% 50%, 0% 60%, 10% 70%, 0% 80%, 10% 90%, 0% 100%, 100% 100%, 100% 0%)",
      },
      fontFamily: {
        garibato: ["Garibato", "sans-serif"], // thêm phông chữ "Garibato"
      },
      colors: {
        // primary: "#ee4d2d",
        // primary: "#66cce6",
        // primary: "#658197",
        primary: "#327bb3",
        secondary: "#5fa0be",
        third: "#E1F5FE",
      },
      backgroundImage: {
        // "custom-gradient": "linear-gradient(-180deg, #66cce6, #298ab4)",
        // "custom-gradient": "linear-gradient(-180deg,#169afc,#658197)",
        "custom-gradient":
          "radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,84,166,1) 0%, rgba(132,189,201,1) 90% )",
        "background-Shop": "url('/src/assets/backgroundShop.jpg')",
        "background-Shop-2": "url('/src/assets/view-wild-goat.jpg')",
        "custom-gradient-2": "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
        "custom-gradient-3": "linear-gradient(90deg, #FAD961 0%, #F76B1C 100%)",
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
  variants: {
    clipPath: ["responsive"],
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".clip-vertical-sawtooth": {
          "clip-path":
            "polygon(0% 0%, 10% 10%, 0% 20%, 10% 30%, 0% 40%, 10% 50%, 0% 60%, 10% 70%, 0% 80%, 10% 90%, 0% 100%, 100% 100%, 100% 0%)",
        },
      };
      addUtilities(newUtilities, ["responsive"]);
    },
  ],
};
