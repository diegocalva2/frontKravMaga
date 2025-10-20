/**
 * TIPOS DE PLANES DE MEMBRESÍA
 */

// Lo que devuelve el backend para un plan
export interface PlanMembresiaResponse {
    plan_id: string;
    nombre: string;
    descripcion: string | null;
    precio: number;
    duracion_dias: number;
    fecha_registro: string;
}

// Para crear/actualizar planes
export interface PlanMembresiaFormData {
    nombre: string;
    descripcion?: string;
    precio: number;
    duracion_dias: number;
}

/**
 * TIPOS DE MEMBRESÍAS DE ALUMNOS
 */

// Lo que devuelve el backend para una membresía activa
// Este tipo incluye las relaciones (alumno y plan)
export interface MembresiaActivaResponse {
    membresia_id: string;
    alumno_id: string;
    plan_id: string;
    fecha_inicio: string;
    fecha_fin: string;
    esta_activa: boolean;
    plan: {
        plan_id: string;
        nombre: string;
        precio: number;
        duracion_dias: number;
    };
    alumno: {
        alumno_id: string;
        nombre_completo: string;
        celular: string | null;
        correo: string | null;
    };
}

// Versión simplificada para historial (sin relaciones completas)
export interface MembresiaHistorial {
    membresia_id: string;
    plan_nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    esta_activa: boolean;
    plan?: {
        plan_id: string;
        nombre: string;
        precio: number;
        duracion_dias: number;
    };
}

// Para crear una nueva membresía
export interface CrearMembresiaFormData {
    alumno_id: string;
    plan_id: string;
    fecha_inicio: string;
}

// Para renovar una membresía
export interface RenovarMembresiaFormData {
    alumno_id: string;
    plan_id: string;
}

/**
 * RESPUESTAS DE LA API
 */
export interface MembresiaApiResponse {
    message: string;
    membresia?: MembresiaActivaResponse;
}

export interface PlanApiResponse {
    message: string;
    plan?: PlanMembresiaResponse;
}