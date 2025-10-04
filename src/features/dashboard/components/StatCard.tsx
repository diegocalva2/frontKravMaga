import React from "react";
import type { ElementType } from "react";

// 1. Se importa el OBJETO `colorVariants`.
// 2. Se importa el TIPO `CardColor`usando la sintaxis `import type`.
// 3. Se usa la ruta relativa correcta para encontrar el archivo de colores.
import {
  colorVariants,
  type CardColor,
} from "../../../components/ui/ColoresCard";

// Hacemos el componente exportable para que pueda ser usado en DashboardPage.tsx
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  Icon: ElementType;
  color: CardColor;
}> = ({ title, value, Icon, color }) => {
  // Ahora 'colorVariants' es un objeto que existe y podemos usarlo sin errores.
  const variants = colorVariants[color];

  return (
    <div
  className={`p-6 rounded-xl shadow-xl shadow-black/40 bg-slate-800/60 border-l-4 ${variants.border} ${variants.bg} transition-shadow duration-300 hover:shadow-2xl`}
>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-300">{title}</p>
          <p className="text-3xl font-bold text-gray-100 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${variants.bg} ${variants.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
