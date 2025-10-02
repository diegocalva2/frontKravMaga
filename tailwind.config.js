export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arimo', 'sans-serif'],  // <- Cambiado aquí
      },
    },
  },
  plugins: [],
};
