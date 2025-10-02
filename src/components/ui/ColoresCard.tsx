export type CardColor = 'blue' | 'red' | 'green' | 'yellow';

// Mapeo de colores a clases de Tailwind para StatCard
export const  colorVariants = {
  blue: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
  red: { border: 'border-red-500', bg: 'bg-red-100', text: 'text-red-600' },
  green: { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-600' },
  yellow: { border: 'border-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-600' },
};
