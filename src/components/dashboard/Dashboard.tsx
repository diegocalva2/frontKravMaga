import React, { useState, useEffect } from 'react';
import { DollarSign, Zap, Package, Users, UserPlus } from 'lucide-react';
import { getDashboardSummary } from '../services/DashboardService';
import { DashboardSummary } from '../types/DashboardTypes';

// Valores iniciales para evitar errores mientras carga el componente
const initialSummary: DashboardSummary = {
    totalAlumnosActivos: 0,
    alumnosVencimiento7Dias: 0,
    alumnosSinMembresia: 0,
    membresiasVencimientoProximo: [],
    totalProductosStockBajo: 0,
    productosStockBajo: [],
    ventasTotalesHoy: 0,
    totalVentasHoy: 0,
    tasaAsistenciaHoy: 0,
    claseMasConcurrida: 'N/A',
};

// Componente reutlizable Card para mostrar métricas clave
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-xl shadow-lg bg-white border-l-4 border-${color}-500 transition-shadow duration-300 hover:shadow-xl`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            {/* Usamos switch para asegurar que Tailwind genere todas las clases de color */}
            <div className={`p-3 rounded-full ${
                color === 'red' ? 'bg-red-100 text-red-600' :
                color === 'blue' ? 'bg-blue-100 text-blue-600' :
                color === 'green' ? 'bg-green-100 text-green-600' :
                'bg-yellow-100 text-yellow-600'
            }`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [summary, setSummary] = useState<DashboardSummary>(initialSummary);
    const [loading, setLoading] = useState(true);

    // 🔹 Hook useEffect para cargar datos al montar el componente
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // Simulación: Comentar esta línea para usar el servicio real una vez creado el backend
                // const data = await getDashboardSummary();
                // setSummary(data);

                // ⬇️ Datos de Simulación para la UI mientras el backend está en desarrollo ⬇️
                const mockData: DashboardSummary = {
                    totalAlumnosActivos: 185,
                    alumnosVencimiento7Dias: 12,
                    alumnosSinMembresia: 7,
                    membresiasVencimientoProximo: [
                        { alumno_id: 'a1', nombre_completo: 'Juan Pérez', plan_nombre: 'Mensual', fecha_fin: '01/10/2025', dias_restantes: 5 },
                        { alumno_id: 'a2', nombre_completo: 'Maria López', plan_nombre: 'Trimestral', fecha_fin: '02/10/2025', dias_restantes: 6 },
                        { alumno_id: 'a3', nombre_completo: 'Carlos Ruiz', plan_nombre: 'Semanal', fecha_fin: '03/10/2025', dias_restantes: 7 },
                    ],
                    totalProductosStockBajo: 6,
                    productosStockBajo: [
                        { nombre: 'Guantes de Boxeo (16oz)', stock: 4 },
                        { nombre: 'Camiseta Krav Maga Talla M', stock: 2 },
                        { nombre: 'Botella de Agua (Logo)', stock: 5 },
                    ],
                    ventasTotalesHoy: 5,
                    totalVentasHoy: 2500,
                    tasaAsistenciaHoy: 0.85,
                    claseMasConcurrida: 'Vespertino',
                };
                setSummary(mockData);
                // ⬆️ Fin de Simulación ⬆️
            } catch (error) {
                console.error("No se pudo cargar el resumen.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []); 

    // Formateo de datos
    const tasaAsistencia = `${Math.round(summary.tasaAsistenciaHoy * 100)}%`;
    const ventasHoy = `$${summary.totalVentasHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

    // 🔹 Renderizado condicional de carga
    if (loading) {
        return (
            <div className="text-center p-20">
                <p className="text-lg text-gray-600">Cargando métricas clave...</p>
            </div>
        );
    }

    // Datos para las tarjetas principales
    const stats = [
        { title: 'Alumnos Activos', value: summary.totalAlumnosActivos, icon: Users, color: 'blue' },
        { title: 'Vencen en 7 días', value: summary.alumnosVencimiento7Dias, icon: Zap, color: 'red' }, // CRÍTICO
        { title: 'Ventas Hoy (MXN)', value: ventasHoy, icon: DollarSign, color: 'green' },
        { title: 'Productos Stock Bajo', value: summary.totalProductosStockBajo, icon: Package, color: 'yellow' }, // Alerta de Inventario
    ];


    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Dashboard de Krav Maga</h1>

            {/* 1. Tarjetas de Resumen (Métricas Clave) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} color={stat.color} /> 
                ))}
            </div>

            {/* 2. Sección de Alertas y Enfoque (Membresías Críticas) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Alertas de Vencimiento Crítico (Máxima Prioridad) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-red-200">
                    <h2 className="text-xl font-semibold text-red-700 flex items-center mb-4">
                        <Zap className="w-5 h-5 mr-2" />
                        Alertas de Renovación ({summary.alumnosVencimiento7Dias} Próximos)
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">Prioridad: Contactar a estos alumnos inmediatamente para asegurar la continuidad.</p>
                    
                    <ul className="divide-y divide-gray-100">
                        {summary.membresiasVencimientoProximo.length > 0 ? (
                            summary.membresiasVencimientoProximo.map((member) => (
                                <li key={member.alumno_id} className="py-3 flex justify-between items-center hover:bg-red-50 px-2 rounded-lg transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">{member.nombre_completo}</p>
                                        <p className="text-xs text-gray-500">Plan: {member.plan_nombre}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                                        Vence en {member.dias_restantes} días
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="py-3 text-center text-gray-500">¡Ninguna membresía crítica pronto!</li>
                        )}
                    </ul>
                </div>
                
                {/* Productos con Stock Bajo */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-yellow-700 flex items-center mb-4">
                        <Package className="w-5 h-5 mr-2" />
                        Inventario Crítico ({summary.totalProductosStockBajo})
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">Productos que requieren reabastecimiento urgente.</p>
                    <div className="space-y-3">
                        {summary.productosStockBajo.length > 0 ? (
                            summary.productosStockBajo.map((p, index) => (
                                <div key={index} className="flex justify-between text-sm py-1 border-b last:border-b-0">
                                    <span className="text-gray-800">{p.nombre}</span>
                                    <span className="font-bold text-yellow-600">Stock: {p.stock}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-sm">Todo el inventario está en buen estado.</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* 3. Resumen de Asistencia y Oportunidades */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Operación y Ventas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t pt-4">
                    <div className="p-3 border rounded-lg">
                        <p className="text-4xl font-bold text-blue-600">{tasaAsistencia}</p>
                        <p className="text-sm text-gray-500">Tasa de Asistencia Hoy</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <p className="text-4xl font-bold text-gray-800">{summary.claseMasConcurrida}</p>
                        <p className="text-sm text-gray-500">Clase Más Concurrida</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                         <p className="text-4xl font-bold text-green-600 flex items-center justify-center">
                            {summary.alumnosSinMembresia} <UserPlus className="w-6 h-6 ml-2" />
                        </p>
                        <p className="text-sm text-gray-500">Oportunidades de Venta (Prueba)</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;
