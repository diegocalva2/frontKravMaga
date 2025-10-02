export default {
  // ✅ La parte más importante: Asegúrate de que esta ruta cubra
  // todos los archivos donde escribes clases de Tailwind (HTML, JS, JSX, TS, TSX).
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Opcional: Para que la fuente por defecto coincida con tu HTML de referencia.
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};