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
        primary_text : "#324d67"
      }, //fade00
    },
  },
  plugins: [],
}

