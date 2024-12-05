/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "3rem",
          xl: "7rem",
          "2xl": "8rem",
        },
      },
      extend: {
        colors: {
          primary: {
            50: "#FFE5E9",
            100: "#FFCCD2",
            200: "#FF99A5",
            300: "#FF6678",
            400: "#FF334A",
            500: "#FF002E",
            600: "#CC0024",
            700: "#99001A",
            800: "#660010",
            900: "#330008",
          },
          secondary: {
            50: "#EAF6F7",
            100: "#D3ECEF",
            200: "#A8D8DE",
            300: "#7CC4CE",
            400: "#50B0BD",
            500: "#5C9AA9",
            600: "#467A88",
            700: "#335966",
            800: "#223B44",
            900: "#111C22",
          },
          light: "#FFFFFF",
          dark: "#222222",
        },
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
        },
      },
      screens: {
        xs: "480px",
        ss: "620px",
        sm: "768px",
        md: "1060px",
        lg: "1200px",
        xl: "1700px",
      },
    },
    plugins: [],
  };
  
  
  