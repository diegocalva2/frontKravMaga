import type { AlertItem } from "../types/dashboardTypesDos";

export const AlertList: React.FC<{ items: AlertItem[] }> = ({ items }) => {
  return (
    <div className="bg-slate-700/70 rounded-xl p-4 shadow-lg"> {/* <-- Aquí está el card */}
      <h2 className="text-lg font-semibold text-gray-100 mb-1">Alertas</h2>
      <ul className="divide-y divide-gray-400">
        {items.map((item) => (
          <li
            key={item.id}
            className="py-3 flex justify-between items-center hover:bg-red-500/10 px-3 rounded-md transition-colors"
          >
            <div>
              <p className="font-medium text-gray-100">{item.nombre}</p>
              <p className="text-xs text-gray-200">Plan: {item.plan}</p>
            </div>
            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-3 py-1 rounded-full">
              Vence en {item.diasParaVencer} días
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
