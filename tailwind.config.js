/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dcdcdc",
        second: "#f02d34",
        primary_text : "#262a2d"
      }, //fade00
    },
  },
  plugins: [],
}

