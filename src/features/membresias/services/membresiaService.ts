// src/features/membresias/services/membresiaService.ts - ACTUALIZADO
import apiClient from "../../../api/apiClient";
import type { 
  MembresiaActivaResponse, 
  MembresiaHistorial,
  RenovarMembresiaFormData
} from '../types/membresiasTypes';

const MEMBRESIAS_ENDPOINT = '/membresias';

export const membresiasService = {
  /**
   * Obtener las membresías activas
   */
  obtenerActivas: async (): Promise<MembresiaActivaResponse[]> => {
    try {
      const response = await apiClient.get<MembresiaActivaResponse[]>(
        `${MEMBRESIAS_ENDPOINT}/activas`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener membresías activas', error);
      throw error;
    }
  },

  /**
   * Obtener todas las membresías de un alumno (su historial)
   */
  obtenerPorAlumno: async (alumnoId: string): Promise<MembresiaHistorial[]> => {
    try {
      const response = await apiClient.get<MembresiaHistorial[]>(
        `${MEMBRESIAS_ENDPOINT}/alumno/${alumnoId}`
      );
      return response.data.map(m => ({
        membresia_id: m.membresia_id,
        plan_nombre: m.plan.nombre,
        fecha_inicio: m.fecha_inicio,
        fecha_fin: m.fecha_fin,
        esta_activa: m.esta_activa,
        plan: m.plan
      }));
    } catch (error) {
      console.error(`Error al obtener el historial de membresías del alumno ${alumnoId}`, error);
      throw error;
    }
  },

  /**
   * Obtener la membresía activa de un alumno
   */
  obtenerActivaPorAlumno: async (alumnoId: string): Promise<MembresiaActivaResponse | null> => {
    try {
      const response = await apiClient.get<MembresiaActivaResponse>(
        `${MEMBRESIAS_ENDPOINT}/alumno/${alumnoId}/activa`
      );
      return response.data;
    } catch (error: any) {
      // Si retorna 404, el alumno no tiene membresía activa
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`Error al obtener membresía activa del alumno ${alumnoId}:`, error);
      throw error;
    }
  },

  /**
   * Obtener membresías próximas a vencer
   */
  obtenerProximasVencer: async (): Promise<MembresiaActivaResponse[]> => {
    try {
      const response = await apiClient.get<MembresiaActivaResponse[]>(
        `${MEMBRESIAS_ENDPOINT}/proximas-vencer`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener membresías próximas a vencer:', error);
      throw error;
    }
  },

  /**
   * Renovar o asignar una membresía (con lógica corregida en el backend)
   */
  renovar: async (data: RenovarMembresiaFormData): Promise<MembresiaActivaResponse> => {
    try {
      const response = await apiClient.post<{
        message: string;
        membresia: MembresiaActivaResponse;
        esProgramada: boolean;
        tipoOperacion: string;
      }>(
        `${MEMBRESIAS_ENDPOINT}/renovar`,
        data
      );
      return response.data.membresia;
    } catch (error) {
      console.error('Error al renovar membresía:', error);
      throw error;
    }
  }
};

export default membresiasService;