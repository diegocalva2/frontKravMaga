import type { ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";
import type { Alumno } from "../types/alumnosTypes";

export type SortDirection = "asc" | "desc";
export interface SortConfig {
  key: keyof Alumno;
  direction: SortDirection;
}
export interface SortableHeaderProps {
  children: ReactNode;
  sortKey: keyof Alumno;
  sortConfig: SortConfig | null;
  onSort: (key: keyof Alumno) => void;
}
export const SortableHeader: React.FC<SortableHeaderProps> = ({
  children,
  sortKey,
  sortConfig,
  onSort,
}) => {
  const isSorted = sortConfig?.key === sortKey;
  const directionIcon = sortConfig?.direction === "asc" ? "▲" : "▼";

  return (
    <th className="p-4 font-semibold">
      <button
        className="flex items-center gap-2"
        onClick={() => onSort(sortKey)}
      >
        {children}
        <span className="text-gray-400">
          {isSorted ? directionIcon : <ArrowUpDown size={14} />}
        </span>
      </button>
    </th>
  );
};
