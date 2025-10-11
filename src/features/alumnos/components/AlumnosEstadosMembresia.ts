// src/features/alumnos/alumnos.constants.ts

import type { EstadoMembresia } from "../types/alumnosTypes";
export const estadoColors: Record<EstadoMembresia, string> = {
    'Activo': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'Por Vencer': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'Vencido': 'bg-red-500/20 text-red-400 border border-red-500/30',
};