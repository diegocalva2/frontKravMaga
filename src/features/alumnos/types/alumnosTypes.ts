// Estado calculado para la membresía del alumno
export type EstadoMembresia = 'Activo' | 'Por Vencer' | 'Vencido' |'Sin Membresia';

// Tipo principal basado en tu tabla `alumnos` (lo que viene del backend)
/**
 * representa exactamente lo que viene del backend, es la forma cruda de los datos
 */
export interface AlumnoResponse {
    alumno_id: string;
    nombre_completo: string;
    fecha_nacimiento: string;
    fecha_ingreso: string;
    celular: string | null;
    correo: string | null;
    estado_alumno_id: number;
    notas_instructor: string | null;
    contacto_emergencia: string | null;
    parentezco_contacto_emergencia: string | null;
    condiciones_medicas: string | null;
    fecha_registro: string;
    fecha_actualizacion: string | null;
}

// Tipo para la vista (con estado de membresía calculado)
/**
 * el backend no sabe aun calcular el estado_membresia, solo devuelve los campos de la tabla
 * se usa esta extencion de propiedad para poder asignarle los datos de prueba de EstadoMembresia
 * 
 * Extends significa "hereda todos los campos de AlumnoResponse",
 */
export interface Alumno extends AlumnoResponse {
    estado_membresia: EstadoMembresia;
}

// Tipo para crear/actualizar alumno
export interface AlumnoFormData {
    nombre_completo: string;
    fecha_nacimiento: string;
    fecha_ingreso: string;
    celular?: string;
    correo?: string;
    estado_alumno_id: number;
    notas_instructor?: string;
    contacto_emergencia?: string;
    parentezco_contacto_emergencia?: string;
    condiciones_medicas?: string;
}
/**
 * TIPOS PARA EL HISTORIAL DE ASISTENCIAS
 * (Cuando implementes esta feature, moverás esto a su propio archivo)
 */
export interface AsistenciaHistorial {
    asistencia_id: string;
    clase_nombre: string;
    fecha_asistencia: string;
}

// Respuestas del API
export interface AlumnosApiResponse {
    alumnos?: Alumno[];
    alumno?: Alumno;
    msg?: string;
    error?: string;
}