import type { EstadoMembresia } from "../features/alumnos/types/alumnosTypes";
import type { MembresiaActivaResponse } from "../features/membresias/types/membresiasTypes";

/**
 * calcular el estado de membresia de un alumno 
 * - sin membresia activa => "sin membresia"
 * - membresia activa y vence en 7 dias o menos => "Por vencer"
 * - membresia activa y vence en mas de 7 dias => "Activo"
 * - membresia no activa => "vencido"
 */

export const calcularEstadoMembresia = (
    alumndoId: string,
    membresias: MembresiaActivaResponse[]
): EstadoMembresia => {
    const membresiaAlumno = membresias.find(m =>m.alumno_id === alumndoId);

    if(!membresiaAlumno)
    {
        return 'Sin Membresia';
    }
    if(!membresiaAlumno.esta_activa){
        return 'Vencido';
    }

    const hoy = new Date();
    hoy.setHours(0,0,0,0); //normalizamos a inicio del dia 

    const fechaFin = new Date(membresiaAlumno.fecha_fin)
    fechaFin.setHours(0,0,0,0);

    // Calcular diferencia en milisegundos y convertir a días
    const diferenciaMs = fechaFin.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    // Si ya venció o vence hoy
    if (diasRestantes <= 0) {
        return 'Vencido';
    }

    // Si vence en 7 días o menos
    if (diasRestantes <= 7) {
        return 'Por Vencer';
    }

    // Si vence en más de 7 días
    return 'Activo';
};
export const calcularDiasRestantes = (fechaFin: string): number => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaFinDate = new Date(fechaFin);
    fechaFinDate.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaFinDate.getTime() - hoy.getTime();
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
};

export const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
};