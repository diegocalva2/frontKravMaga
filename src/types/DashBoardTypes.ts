// Tipos de datos para una membresía a punto de vencer
export interface MembresiaVencimiento {
    alumno_id: string;
    nombre_completo: string;
    plan_nombre: string;
    fecha_fin: string; // Formato de fecha para mostrar
    dias_restantes: number;
}

// Tipos de datos para el resumen del Dashboard
export interface DashboardSummary {
    // 🔹 Membresías
    totalAlumnosActivos: number;
    alumnosVencimiento7Dias: number;
    alumnosSinMembresia: number;
    membresiasVencimientoProximo: MembresiaVencimiento[];

    // 🔹 Inventario
    totalProductosStockBajo: number;
    productosStockBajo: { nombre: string; stock: number; }[];

    // 🔹 Ventas
    ventasTotalesHoy: number;
    totalVentasHoy: number;
    
    // 🔹 Asistencia
    tasaAsistenciaHoy: number; // Porcentaje, ej: 0.85 (85%)
    claseMasConcurrida: string; // Ej: "Vespertino"
}
