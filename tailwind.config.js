/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dashboard: {
          50:  "#EEF0FB", // más claro
          100: "#D4D9F4",
          200: "#ABB6EA",
          300: "#8697E0",
          400: "#617DB6",
          500: "#4562BC",
          600: "#344B94",
          700: "#24366E",
          800: "#14214A",
          900: "#0E1A41", 
          950: "#071135", // más oscuro
          
        }
      },
      fontFamily: {
        sans: ['Arimo', 'sans-serif'],  // <- aquí va junto con extend
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
