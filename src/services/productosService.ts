import apiClient from '../api/apiClient';
import type { Producto } from '../types/Products';

export const getProductos = async (): Promise<Producto[]> => {
    try {
        const response = await apiClient.get<Producto[]>('/productos/listarproductos');
        return response.data;
    } catch (error) {
        throw new Error('No se pudieron cargar los productos.');
    }
};