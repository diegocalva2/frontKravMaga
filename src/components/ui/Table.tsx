// src/components/ui/Table.tsx
import React, { useState } from 'react';
import type { ReactNode } from 'react';

interface TableProps<T> {
  /** Lista de items a mostrar */
  items?: T[];
  /** Función para renderizar cada fila */
  renderRow?: (item: T, index: number) => ReactNode;
  /** Filas por página */
  rowsPerPage?: number;
  /** Cabecera de la tabla */
  header?: ReactNode;
  /** Clases extra */
  className?: string;
}

export const Table = <T,>({
  items,
  renderRow,
  rowsPerPage = 10,
  header,
  className = '',
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!items || !renderRow) {
    return (
      <div className={`bg-slate-800/60 rounded-xl shadow-xl shadow-black/20 overflow-x-auto ${className}`}>
        <table className="w-full text-center min-w-[800px]">{header}</table>
      </div>
    );
  }

  const totalPages = Math.ceil(items.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className={`bg-slate-800/60 rounded-xl shadow-xl shadow-black/20 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-center min-w-[800px]">
          {header}
          <tbody className="divide-y divide-slate-700">
            {currentItems.map((item, i) => renderRow(item, i))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN TAILWIND */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
        {/* Vista móvil */}
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>

        {/* Vista escritorio */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-300">
              Mostrando{' '}
              <span className="font-medium">{startIndex + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(endIndex, items.length)}
              </span>{' '}
              de <span className="font-medium">{items.length}</span> resultados
            </p>
          </div>

          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-40"
              >
                <span className="sr-only">Anterior</span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    num === currentPage
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline-indigo-500'
                      : 'text-gray-200 ring-1 ring-inset ring-gray-700 hover:bg-white/5'
                  }`}
                >
                  {num}
                </button>
              ))}

              {totalPages > getPageNumbers().slice(-1)[0] && (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-700">
                  ...
                </span>
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-40"
              >
                <span className="sr-only">Siguiente</span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================
// Subcomponentes reutilizables
// =============================================
interface TableHeaderProps { children: ReactNode; }
export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => (
  <thead className="bg-slate-900/80">{children}</thead>
);

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
export const TableRow: React.FC<TableRowProps> = ({ children, className = '', onClick }) => (
  <tr
    className={`hover:bg-slate-700/40 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

interface TableCellProps {
  children: ReactNode;
  className?: string;
}
export const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => (
  <td className={`p-4 ${className}`}>{children}</td>
);
