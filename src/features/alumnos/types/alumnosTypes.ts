
// Estado calculado para la membresía del alumno
export type EstadoMembresia = 'Activo' | 'Por Vencer' | 'Vencido';

// Tipo principal basado en tu tabla `alumnos`
export interface Alumno {
  alumno_id: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  fecha_ingreso: string;
  celular?: string;
  correo?: string;
  estado_membresia: EstadoMembresia;
  // Campos adicionales para la vista de detalle
  contacto_emergencia?: string;
  condiciones_medicas?: string;
}

// Tipo para el historial de membresías
export interface MembresiaHistorial {
    membresia_id: string;
    plan_nombre: string;
    fecha_inicio: string;
    fecha_fin:string;
    esta_activa: boolean;
}

// Tipo para el historial de asistencias
export interface AsistenciaHistorial {
    asistencia_id: string;
    clase_nombre: string;
    fecha_asistencia: string;
}
