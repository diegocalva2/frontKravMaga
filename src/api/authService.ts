import apiClient from "./apiClient";
import type { UserSessionData, LoginResponse } from '../types/auth';

export const loginUser = async (correo: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>(
            `/login`,
            { correo, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
    }
};

export const verifySession = async (): Promise<UserSessionData> => {
    try {
        const response = await apiClient.get<UserSessionData>(`/validate-token`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error('Sesión no válida o expirada.');
    }
};