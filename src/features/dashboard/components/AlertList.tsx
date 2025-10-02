import type { AlertItem } from "../types/dashboardTypesDos";

export const AlertList: React.FC<{ items: AlertItem[] }> = ({ items }) => {
  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item) => (
        <li key={item.id} className="py-3 flex justify-between items-center hover:bg-red-50 px-2 rounded-lg transition-colors">
          <div>
            <p className="font-medium text-gray-800">{item.nombre}</p>
            <p className="text-xs text-gray-500">Plan: {item.plan}</p>
          </div>
          <span className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">
            Vence en {item.diasParaVencer} días
          </span>
        </li>
      ))}
    </ul>
  );
};