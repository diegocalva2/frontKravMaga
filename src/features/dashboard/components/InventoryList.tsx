import type { InventoryItem } from "../types/dashboardTypesDos";
export const InventoryList: React.FC<{ items: InventoryItem[] }> = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm py-1 border-b last:border-b-0">
          <span className="text-gray-800">{item.nombre}</span>
          <span className="font-bold text-yellow-600">Stock: {item.stock}</span>
        </div>
      ))}
    </div>
  );
};