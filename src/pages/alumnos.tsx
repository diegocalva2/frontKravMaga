// src/pages/AlumnosPage.tsx
import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Alumno } from '../features/alumnos/types/alumnosTypes';
import { AlumnoDetailPanel } from '../features/alumnos/components/AlumnoDetailPanel';
import { useDebounce } from '../hooks/useDebounce';
import { useAlumnos } from '../features/alumnos/hooks/useAlumnos';
import type { SortConfig, SortDirection } from '../features/alumnos/components/SortableHeader';
import { SortableHeader } from '../features/alumnos/components/SortableHeader';
import { estadoColors } from '../features/alumnos/components/AlumnosEstadosMembresia';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const AlumnosPage: React.FC = () => {
    const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
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

    // Hook personalizado para obtener datos del backend
    const { alumnos, loading, error } = useAlumnos();

    const debouncedMainSearch = useDebounce(mainSearch, 300);

    const filteredAndSortedAlumnos = useMemo(() => {
        let alumnosFiltrados = [...alumnos];

        // Búsqueda principal
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

    const getEstadoBadgeVariant = (estado: string) => {
        switch (estado) {
            case 'Activo': return 'success';
            case 'Por Vencer': return 'warning';
            case 'Vencido': return 'danger';
            default: return 'info';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" />
                <p className="ml-4 text-white text-xl">Cargando alumnos...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">Error al cargar alumnos</p>
                    
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 font-sans text-white h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold">Gestión de Alumnos</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={mainSearch}
                        onChange={(e) => setMainSearch(e.target.value)}
                        icon={<Search className="w-5 h-5" />}
                    />
                    <Button
                        variant="primary"
                        icon={<Plus className="w-5 h-5" />}
                        onClick={() => {/* TODO: Abrir modal de crear alumno */}}
                    >
                        Agregar Alumno
                    </Button>
                </div>
            </div>

            {/* Tabla */}
            <Table>
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
                <TableBody>
                    {filteredAndSortedAlumnos.length > 0 ? (
                        filteredAndSortedAlumnos.map((alumno) => (
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
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedAlumno(alumno)}
                                    >
                                        Ver Detalles
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center p-8 text-gray-400">
                                No se encontraron coincidencias
                            </td>
                        </tr>
                    )}
                </TableBody>
            </Table>

            {/* Panel de detalles */}
            <AlumnoDetailPanel
                alumno={selectedAlumno}
                onClose={() => setSelectedAlumno(null)}
            />
        </div>
    );
};

export default AlumnosPage;