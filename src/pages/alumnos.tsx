// src/pages/AlumnosPage.tsx
import React, { useState, useMemo } from 'react';
import { Plus, CreditCard, Edit } from 'lucide-react';
import type { Alumno } from '../features/alumnos/types/alumnosTypes';
import { AlumnoDetailPanel } from '../features/alumnos/components/AlumnoDetailPanel';
import { MembresiasModal } from '../features/membresias/components/MembresiaModal';
import { AlumnoFormModal } from '../features/alumnos/components/AlumnoFormModal';
import { useDebounce } from '../hooks/useDebounce';
import { useAlumnos } from '../features/alumnos/hooks/useAlumnos';
import type { SortConfig, SortDirection } from '../features/alumnos/components/SortableHeader';
import { SortableHeader } from '../features/alumnos/components/SortableHeader';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const AlumnosPage: React.FC = () => {
  // ============================================
  // ESTADO LOCAL (UI)
  // ============================================
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  
  // Estados para el modal de membresías
  const [showMembresiasModal, setShowMembresiasModal] = useState(false);
  const [alumnoSeleccionadoMembresia, setAlumnoSeleccionadoMembresia] = useState<Alumno | null>(null);
  
  // 🆕 Estados para el modal de agregar/editar alumno
  const [showAlumnoFormModal, setShowAlumnoFormModal] = useState(false);
  const [alumnoParaEditar, setAlumnoParaEditar] = useState<Alumno | null>(null);
  
  const [mainSearch, setMainSearch] = useState('');
  const [filters, setFilters] = useState({
    nombre: '',
    estado: '',
    fecha: '',
    contacto: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ 
    key: 'nombre_completo', 
    direction: 'asc'
  });

  // ============================================
  // DATOS DEL BACKEND (via hook)
  // ============================================
  const { alumnos, loading, error, refetch, crearAlumno, actualizarAlumno } = useAlumnos();

  // ============================================
  // DEBOUNCE para optimizar búsqueda
  // ============================================
  const debouncedMainSearch = useDebounce(mainSearch, 300);

  // ============================================
  // LÓGICA DE FILTRADO Y ORDENAMIENTO
  // ============================================
  const filteredAndSortedAlumnos = useMemo(() => {
    let alumnosFiltrados = [...alumnos];

    // Búsqueda principal (nombre)
    if (debouncedMainSearch) {
      alumnosFiltrados = alumnosFiltrados.filter(a =>
        a.nombre_completo.toLowerCase().includes(debouncedMainSearch.toLowerCase())
      );
    }

    // Filtros individuales por columna
    alumnosFiltrados = alumnosFiltrados.filter(a => {
      const nombreMatch = !filters.nombre ||
        a.nombre_completo.toLowerCase().includes(filters.nombre.toLowerCase());
      const estadoMatch = !filters.estado || a.estado_membresia === filters.estado;
      const fechaMatch = !filters.fecha || a.fecha_ingreso === filters.fecha;
      const contactoMatch = !filters.contacto ||
        (a.celular && a.celular.includes(filters.contacto));
      
      return nombreMatch && estadoMatch && fechaMatch && contactoMatch;
    });

    // Ordenamiento
    if (sortConfig !== null) {
      alumnosFiltrados.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return alumnosFiltrados;
  }, [alumnos, debouncedMainSearch, filters, sortConfig]);

  // ============================================
  // MANEJADORES DE EVENTOS
  // ============================================
  
  // Manejador de ordenamiento
  const handleSort = (key: keyof Alumno) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Manejador de cambio de filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // 🆕 Manejador para abrir modal de crear alumno
  const handleOpenCreateModal = () => {
    setAlumnoParaEditar(null);
    setShowAlumnoFormModal(true);
  };

  // 🆕 Manejador para abrir modal de editar alumno
  const handleOpenEditModal = (alumno: Alumno) => {
    setAlumnoParaEditar(alumno);
    setShowAlumnoFormModal(true);
  };

  // 🆕 Manejador para cerrar modal de alumno
  const handleCloseAlumnoFormModal = () => {
    setShowAlumnoFormModal(false);
    setAlumnoParaEditar(null);
  };

  // 🆕 Manejador para guardar alumno (crear o actualizar)
  const handleSaveAlumno = async (data: any) => {
    try {
      if (alumnoParaEditar) {
        // Actualizar alumno existente
        await actualizarAlumno(alumnoParaEditar.alumno_id, data);
      } else {
        // Crear nuevo alumno
        await crearAlumno(data);
      }
      await refetch(); // Recargar la lista
    } catch (error) {
      console.error('Error al guardar alumno:', error);
      throw error;
    }
  };

  // Manejador para abrir modal de membresías
  const handleOpenMembresiasModal = (alumno: Alumno) => {
    setAlumnoSeleccionadoMembresia(alumno);
    setShowMembresiasModal(true);
  };

  // Manejador para cerrar modal de membresías
  const handleCloseMembresiasModal = () => {
    setShowMembresiasModal(false);
    setAlumnoSeleccionadoMembresia(null);
  };

  // Manejador para cuando se completa la acción de membresía
  const handleMembresiasSuccess = () => {
    refetch(); // Recargar la lista de alumnos para actualizar estados
  };

  // Obtener variante del badge según el estado
  const getEstadoBadgeVariant = (estado: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (estado) {
      case 'Activo': return 'success';
      case 'Por Vencer': return 'warning';
      case 'Vencido': return 'danger';
      case 'Sin Membresia': return 'info';
      default: return 'info';
    }
  };

  // ============================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-white text-xl">Cargando alumnos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error al cargar alumnos</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  return (
    <div className="p-4 md:p-8 font-sans text-white h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Gestión de Alumnos</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleOpenCreateModal}
          >
            Agregar Alumno
          </Button>
        </div>
      </div>

 

      {/* Tabla */}
<Table
  items={filteredAndSortedAlumnos}
  rowsPerPage={10}
  header={
    <TableHeader>
      <tr>
        <SortableHeader
          sortKey="nombre_completo"
          sortConfig={sortConfig}
          onSort={handleSort}
        >
          Nombre
        </SortableHeader>
        <SortableHeader
          sortKey="estado_membresia"
          sortConfig={sortConfig}
          onSort={handleSort}
        >
          Estado
        </SortableHeader>
        <SortableHeader
          sortKey="fecha_ingreso"
          sortConfig={sortConfig}
          onSort={handleSort}
        >
          Ingreso
        </SortableHeader>
        <th className="p-4 font-semibold">Contacto</th>
        <th className="p-4 font-semibold">Acciones</th>
      </tr>

      {/* Fila de filtros */}
      <tr className="bg-slate-900/50">
        <td className="p-2">
          <input
            type="text"
            name="nombre"
            placeholder="Filtrar nombre..."
            onChange={handleFilterChange}
            className="w-full bg-slate-700 text-sm p-1 rounded"
          />
        </td>
        <td className="p-2">
          <select
            name="estado"
            onChange={handleFilterChange}
            className="w-full bg-slate-700 text-sm p-1 rounded"
          >
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Por Vencer">Por Vencer</option>
            <option value="Vencido">Vencido</option>
            <option value="Sin Membresia">Sin Membresía</option>
          </select>
        </td>
        <td className="p-2">
          <input
            type="date"
            name="fecha"
            onChange={handleFilterChange}
            className="w-full bg-slate-700 text-sm p-1 rounded"
          />
        </td>
        <td className="p-2">
          <input
            type="text"
            name="contacto"
            placeholder="Filtrar celular..."
            onChange={handleFilterChange}
            className="w-full bg-slate-700 text-sm p-1 rounded"
          />
        </td>
        <td className="p-2"></td>
      </tr>
    </TableHeader>
  }
  renderRow={(alumno) => (
    <TableRow key={alumno.alumno_id}>
      <TableCell className="font-medium">
        {alumno.nombre_completo}
      </TableCell>
      <TableCell>
        <Badge variant={getEstadoBadgeVariant(alumno.estado_membresia)}>
          {alumno.estado_membresia}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-300">
        {alumno.fecha_ingreso}
      </TableCell>
      <TableCell className="text-gray-300">
        {alumno.celular || 'N/A'}
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-end flex-wrap">
          {/* Botón de Membresía */}
          <Button
            variant="primary"
            size="sm"
            icon={<CreditCard className="w-4 h-4" />}
            onClick={() => handleOpenMembresiasModal(alumno)}
            className="whitespace-nowrap"
          >
            Membresía
          </Button>

          {/* Botón de Editar */}
          <Button
            variant="secondary"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleOpenEditModal(alumno)}
            className="whitespace-nowrap"
          >
            Editar
          </Button>

          {/* Botón de Ver Detalles */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedAlumno(alumno)}
          >
            Ver Detalles
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )}
/>


      {/* Panel de detalles */}
      <AlumnoDetailPanel
        alumno={selectedAlumno}
        onClose={() => setSelectedAlumno(null)}
      />

      {/* Modal de Membresías */}
      {showMembresiasModal && (
        <MembresiasModal
          alumno={alumnoSeleccionadoMembresia}
          onClose={handleCloseMembresiasModal}
          onSuccess={handleMembresiasSuccess}
        />
      )}

      {/* 🆕 Modal de Agregar/Editar Alumno */}
      <AlumnoFormModal
        isOpen={showAlumnoFormModal}
        onClose={handleCloseAlumnoFormModal}
        onSubmit={handleSaveAlumno}
        alumno={alumnoParaEditar}
        alumnoIdActual={alumnoParaEditar?.alumno_id}
      />
    </div>
  );
};

export default AlumnosPage;