/** @type {import('tailwindcss').Config} */
/* eslint-env node */
// eslint-disable-next-line no-undef
const { heroui } = require("@heroui/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "90rem", // 96rem = 1536px
      },
      scale: {
        97: "0.97", // Add scale-98 for slightly smaller scale than default
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      gridTemplateColumns: {
        footer: "2fr 1fr 1fr 1fr", // use fr better than %
      },
      colors: {
        custom: "#09b6c8",
        customRed: "#ec0606",
        customHover: "#11bfd2",
      },
      height: {
        21: "5.25rem",
        22: "5.5rem",
      },
      width: {
        21: "5.25rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), heroui()], // eslint-disable-line no-undef
};
