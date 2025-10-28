// src/features/membresias/services/planesService.ts
import apiClient from '../../../api/apiClient';
import type { PlanMembresiaResponse } from '../../membresias/types/membresiasTypes';

const PLANES_ENDPOINT = '/membresias/planes';

export const planesService = {
  /**
   * Obtener todos los planes de membresía
   */
  obtenerTodos: async (): Promise<PlanMembresiaResponse[]> => {
    try {
      const response = await apiClient.get<PlanMembresiaResponse[]>(PLANES_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error al obtener planes:', error);
      throw error;
    }
  },

  /**
   * Obtener un plan por ID
   */
  obtenerPorId: async (id: string): Promise<PlanMembresiaResponse> => {
    try {
      const response = await apiClient.get<PlanMembresiaResponse>(
        `${PLANES_ENDPOINT}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener plan ${id}:`, error);
      throw error;
    }
  }
};

export default planesService;