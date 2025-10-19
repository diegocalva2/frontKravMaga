import apiClient from "../../../api/apiClient";
import type { AlumnoResponse, AlumnoFormData, Alumno, EstadoMembresia } from "../types/alumnosTypes";

const ALUMNOS_ENDPOINT = 'alumnos'

/**
 * calcula el estado de una membresia basado en la fecha fin 
 * esta es una funcion temporal hasta que implementes la logica completa con membresias
 */

const CalcularEstadoMembresia = (alumno: AlumnoResponse): EstadoMembresia => {
    //implementar logica real consultando membresias
    //por ahora retorna un valor por defecto 
    return 'Activo';
};

/**
 * transforma la respuesta del backend agregando el estado de membresia
 */
const transformarAlumno = (alumno: AlumnoResponse): Alumno => {
    return {
        ...alumno,
        estado_membresia: CalcularEstadoMembresia(alumno)
    };
};

export const alumnosService = {
    /**
     * obtener todos los alumnos 
     */
    obtenerTodos: async (): Promise<Alumno[]> => {
        try {
            const response = await apiClient.get<AlumnoResponse[]>(ALUMNOS_ENDPOINT);
            return response.data.map(transformarAlumno);

        } catch (error) {
            console.error('error al obtener alumnos:', error)
            throw error;
        }
    },
    /**
     * obtener un alumno por ID
     */
    obtenerPorId: async (id: string): Promise<Alumno> => {
        try {
            const response = await apiClient.get<AlumnoResponse>(`${ALUMNOS_ENDPOINT}/${id}`);
            return transformarAlumno(response.data)
        }
        catch (error) {
            console.error('error al obtener alumno en especifico', error)
            throw error;
        }

    },
    /**
     * crear un nuevo alumno 
     */
    crear: async (alumnData: AlumnoFormData): Promise<Alumno> => {
        try {
            const response = await apiClient.post<{ msg: string; alumno: AlumnoResponse }>(ALUMNOS_ENDPOINT, alumnData);
            return transformarAlumno(response.data.alumno);
        }
        catch (error) {
            console.error('Error al crear alumno:', error);
            throw error;
        }
    },
    /**
     * actualizar un alumno existente 
     */
    actualizar: async (id: string, alumnoData: Partial<AlumnoFormData>): Promise<Alumno> => {
        try {
            const response = await apiClient.put<{ msg: string; alumno: AlumnoResponse }>(`${ALUMNOS_ENDPOINT}/${id}`, alumnoData);
            return transformarAlumno(response.data.alumno);
        }
        catch (error) {
            console.error('error al actualizar un alumno, ', error);
            throw error;
        }
    }
};

export default alumnosService;