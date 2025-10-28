import type { EstadoMembresia } from "../features/alumnos/types/alumnosTypes";
import type { MembresiaActivaResponse } from "../features/membresias/types/membresiasTypes";

/**
 * 🔧 Parsea una fecha desde string ISO SIN aplicar conversión de zona horaria
 */
const parsearFechaUTC = (fechaISO: string): Date => {
  const [year, month, day] = fechaISO.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

/**
 * Calcular el estado de membresía de un alumno
 * Estados posibles:
 * - "Sin Membresia": No tiene ninguna membresía activa
 * - "Activo": Tiene membresía activa con más de 7 días
 * - "Por Vencer": Tiene membresía activa con 7 días o menos
 * - "Vencido": Todas las membresías han finalizado
 */
export const calcularEstadoMembresia = (
    alumnoId: string,
    membresias: MembresiaActivaResponse[]
): EstadoMembresia => {
    const membresiaAlumno = membresias.find(m => m.alumno_id === alumnoId);

    if (!membresiaAlumno) {
        return 'Sin Membresia';
    }
    
    if (!membresiaAlumno.esta_activa) {
        return 'Vencido';
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaFin = parsearFechaUTC(membresiaAlumno.fecha_fin);
    const diferenciaMs = fechaFin.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    if (diasRestantes <= 0) {
        return 'Vencido';
    }

    if (diasRestantes <= 7) {
        return 'Por Vencer';
    }

    return 'Activo';
};

/**
 * 🆕 Calcular el estado de una membresía individual para el historial
 * Estados:
 * - "Activa": esta_activa = true && fecha_fin >= hoy
 * - "Próxima": esta_activa = false && fecha_inicio > hoy
 * - "Finalizada": esta_activa = false && fecha_fin < hoy
 */
export const calcularEstadoMembresiaIndividual = (
  fechaInicio: string,
  fechaFin: string,
  estaActiva: boolean
): 'Activa' | 'Próxima' | 'Finalizada' => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaInicioDate = parsearFechaUTC(fechaInicio);
  const fechaFinDate = parsearFechaUTC(fechaFin);

  if (estaActiva) {
    return 'Activa';
  }

  // Si la fecha de inicio es futura, es una renovación programada
  if (fechaInicioDate > hoy) {
    return 'Próxima';
  }

  // Si llegamos aquí, la membresía ya finalizó
  return 'Finalizada';
};

/**
 * Calcular días restantes hasta que venza la membresía
 */
export const calcularDiasRestantes = (fechaFin: string): number => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaFinDate = parsearFechaUTC(fechaFin);
    const diferenciaMs = fechaFinDate.getTime() - hoy.getTime();
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
};

/**
 * Formatear fecha ISO a formato DD/MM/YYYY
 */
export const formatearFecha = (fechaISO: string): string => {
    const fecha = parsearFechaUTC(fechaISO);
    
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    
    return `${dia}/${mes}/${anio}`;
};

/**
 * Formatear fecha para mostrar en formato largo (ej: "27 de octubre de 2025")
 */
export const formatearFechaLarga = (fechaISO: string): string => {
    const fecha = parsearFechaUTC(fechaISO);
    
    return fecha.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

/**
 * 🆕 Obtener clase CSS del badge según el estado de la membresía individual
 */
export const obtenerColorEstadoMembresia = (estado: 'Activa' | 'Próxima' | 'Finalizada'): string => {
  switch (estado) {
    case 'Activa':
      return 'text-green-400';
    case 'Próxima':
      return 'text-blue-400';
    case 'Finalizada':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};