import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Alumno } from '../features/alumnos/types/alumnosTypes';
import { AlumnoDetailPanel } from '../features/alumnos/components/AlumnoDetailPanel';
import { useDebounce } from '../hooks/useDebounce';
import type { SortConfig } from '../features/alumnos/components/SortableHeader';
import type { SortDirection } from '../features/alumnos/components/SortableHeader';
import { SortableHeader } from '../features/alumnos/components/SortableHeader';
import { estadoColors } from '../features/alumnos/components/AlumnosEstadosMembresia';


 export const AlumnosPage: React.FC = () => {
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  
  // --- Estados para filtros y ordenamiento ---
  const [mainSearch, setMainSearch] = useState('');
  const [filters, setFilters] = useState({
      nombre: '',
      estado: '',
      fecha: '',
      contacto: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'nombre_completo', direction: 'asc' });

  // Debounce para la búsqueda principal para mejorar el rendimiento
  const debouncedMainSearch = useDebounce(mainSearch, 300);

  const mockAlumnos: Alumno[] = useMemo(() => [
    { alumno_id: '1', nombre_completo: 'Diego Armando Pérez', fecha_ingreso: '2024-01-15', celular: '811-123-4567', correo: 'diego.perez@email.com', estado_membresia: 'Activo', fecha_nacimiento: '1995-05-20' },
    { alumno_id: '2', nombre_completo: 'Mariana López García', fecha_ingreso: '2023-11-20', celular: '811-987-6543', correo: 'mariana.lopez@email.com', estado_membresia: 'Por Vencer', fecha_nacimiento: '1998-02-10' },
    { alumno_id: '3', nombre_completo: 'Carlos Alberto Ruiz', fecha_ingreso: '2022-05-10', celular: '811-555-8888', correo: 'carlos.ruiz@email.com', estado_membresia: 'Vencido', fecha_nacimiento: '1990-12-01' },
    { alumno_id: '4', nombre_completo: 'Ana Sofía Garza', fecha_ingreso: '2024-08-01', celular: '811-222-3333', correo: 'ana.garza@email.com', estado_membresia: 'Activo', fecha_nacimiento: '2001-07-30' },
  ], []);

  // --- Lógica de filtrado y ordenamiento ---
  const filteredAndSortedAlumnos = useMemo(() => {
    let alumnos = [...mockAlumnos];

    // 1. Búsqueda principal (debounced)
    if (debouncedMainSearch) {
        alumnos = alumnos.filter(a => a.nombre_completo.toLowerCase().includes(debouncedMainSearch.toLowerCase()));
    }

    // 2. Filtros de columna
    alumnos = alumnos.filter(a => {
        const nombreMatch = !filters.nombre || a.nombre_completo.toLowerCase().includes(filters.nombre.toLowerCase());
        const estadoMatch = !filters.estado || a.estado_membresia === filters.estado;
        const fechaMatch = !filters.fecha || a.fecha_ingreso === filters.fecha;
        const contactoMatch = !filters.contacto || (a.celular && a.celular.includes(filters.contacto)) || (a.correo && a.correo.toLowerCase().includes(filters.contacto.toLowerCase()));
        return nombreMatch && estadoMatch && fechaMatch && contactoMatch;
    });

    // 3. Ordenamiento
    if (sortConfig !== null) {
      alumnos.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return alumnos;
  }, [mockAlumnos, debouncedMainSearch, filters, sortConfig]);

  const handleSort = (key: keyof Alumno) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="p-4 md:p-8 font-sans text-white h-screen overflow-y-auto">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Gestión de Alumnos</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={mainSearch}
              onChange={(e) => setMainSearch(e.target.value)}
              className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap">
            <Plus className="w-5 h-5" />
            Agregar Alumno
          </button>
        </div>
      </div>

      {/* Tabla de Alumnos con Filtros */}
      <div className="bg-slate-800/60 rounded-xl shadow-xl shadow-black/20 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-slate-900/80">
            <tr>
              <SortableHeader sortKey="nombre_completo" sortConfig={sortConfig} onSort={handleSort}>Nombre</SortableHeader>
              <SortableHeader sortKey="estado_membresia" sortConfig={sortConfig} onSort={handleSort}>Estado</SortableHeader>
              <SortableHeader sortKey="fecha_ingreso" sortConfig={sortConfig} onSort={handleSort}>Ingreso</SortableHeader>
              <th className="p-4 font-semibold">Contacto</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
            {/* Fila de Filtros de Columna */}
            <tr className="bg-slate-900/50">
                <td className="p-2"><input type="text" name="nombre" placeholder="Filtrar nombre..." onChange={handleFilterChange} className="w-full bg-slate-700 text-sm p-1 rounded"/></td>
                <td className="p-2">
                    <select name="estado" onChange={handleFilterChange} className="w-full bg-slate-700 text-sm p-1 rounded">
                        <option value="">Todos</option>
                        <option value="Activo">Activo</option>
                        <option value="Por Vencer">Por Vencer</option>
                        <option value="Vencido">Vencido</option>
                    </select>
                </td>
                <td className="p-2"><input type="date" name="fecha" onChange={handleFilterChange} className="w-full bg-slate-700 text-sm p-1 rounded"/></td>
                <td className="p-2"><input type="text" name="contacto" placeholder="Filtrar contacto..." onChange={handleFilterChange} className="w-full bg-slate-700 text-sm p-1 rounded"/></td>
                <td className="p-2"></td>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredAndSortedAlumnos.map((alumno) => (
              <tr key={alumno.alumno_id} className="hover:bg-slate-700/40 transition-colors">
                <td className="p-4 font-medium">{alumno.nombre_completo}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${estadoColors[alumno.estado_membresia]}`}>
                    {alumno.estado_membresia}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{alumno.fecha_ingreso}</td>
                <td className="p-4 text-gray-300">{alumno.celular}</td>
                <td className="p-4 text-right">
                  <button onClick={() => setSelectedAlumno(alumno)} className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlumnoDetailPanel alumno={selectedAlumno} onClose={() => setSelectedAlumno(null)} />
    </div>
  );
};
export default AlumnosPage;