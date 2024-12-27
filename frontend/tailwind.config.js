/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // colors
      colors:{
        primary: "#00afb9",
        secondary: "#EF863E",
        error: "#FF0000",
        mainbg: "#464646",
        cardbg: "#333",
        formInput: "#414141"
      }
    },
  },
  plugins: [],
}