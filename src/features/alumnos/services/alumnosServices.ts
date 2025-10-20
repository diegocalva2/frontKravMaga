// src/features/alumnos/services/alumnosService.ts
import apiClient from '../../../api/apiClient';
import type { AlumnoResponse, AlumnoFormData } from '../types/alumnosTypes';

const ALUMNOS_ENDPOINT = '/alumnos';

export const alumnosService = {
    /**
     * Obtener todos los alumnos SIN calcular estado
     * El cálculo se hace en el hook después de obtener las membresías
     */
    obtenerTodos: async (): Promise<AlumnoResponse[]> => {
        try {
            const response = await apiClient.get<AlumnoResponse[]>(ALUMNOS_ENDPOINT);
            return response.data;
        } catch (error) {
            console.error('Error al obtener alumnos:', error);
            throw error;
        }
    },

    /**
     * Obtener un alumno por ID SIN calcular estado
     */
    obtenerPorId: async (id: string): Promise<AlumnoResponse> => {
        try {
            const response = await apiClient.get<AlumnoResponse>(`${ALUMNOS_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener alumno ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crear un nuevo alumno
     */
    crear: async (alumnoData: AlumnoFormData): Promise<AlumnoResponse> => {
        try {
            const response = await apiClient.post<{ msg: string; alumno: AlumnoResponse }>(
                ALUMNOS_ENDPOINT,
                alumnoData
            );
            return response.data.alumno;
        } catch (error) {
            console.error('Error al crear alumno:', error);
            throw error;
        }
    },

    /**
     * Actualizar un alumno existente
     */
    actualizar: async (id: string, alumnoData: Partial<AlumnoFormData>): Promise<AlumnoResponse> => {
        try {
            const response = await apiClient.put<{ msg: string; alumno: AlumnoResponse }>(
                `${ALUMNOS_ENDPOINT}/${id}`,
                alumnoData
            );
            return response.data.alumno;
        } catch (error) {
            console.error(`Error al actualizar alumno ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar un alumno
     */
    eliminar: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`${ALUMNOS_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error al eliminar alumno ${id}:`, error);
            throw error;
        }
    }
};

export default alumnosService;