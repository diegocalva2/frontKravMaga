import z from 'zod';
import apiClient from '../api/apiClient';
import type { Producto } from '../types/Products';

// Validación de id
const ProductoIdSchema = z.number().int().positive();

// Validación de producto (para crear/editar)
const ProductoSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().optional(),
    precio: z.number().nonnegative("El precio no puede ser negativo"),
    stock: z.number().int().nonnegative("El stock no puede ser negativo"),
});

export const getProductos = async (): Promise<Producto[]> => {
    try {
        const response = await apiClient.get<Producto[]>('/productos/listarproductos');
        return response.data;
    } catch (error) {
        throw new Error('No se pudieron cargar los productos.');
    }
};

export const addProducto = async (
    producto: Omit<Producto, 'producto_id'>
): Promise<Producto> => {
    try {
        // Validar con Zod antes de enviar
        ProductoSchema.parse(producto);

        const response = await apiClient.post<Producto>(
            '/productos/agregarproducto',
            producto
        );

        return response.data;
    } catch (error) {
        throw new Error('No se pudo agregar el producto.');
    }
};

export const updateProducto = async (
    producto_id: number,
    producto: Omit<Producto, 'producto_id'>
): Promise<Producto> => {
    try {
        ProductoIdSchema.parse(producto_id);
        ProductoSchema.parse(producto);

        const response = await apiClient.put<Producto>(
            `/productos/editarproducto/${producto_id}`,
            producto
        );

        return response.data;
    } catch (error) {
        throw new Error('No se pudo actualizar el producto.');
    }
};

export const deleteProducto = async (producto_id: number): Promise<void> => {
    const parsedId = ProductoIdSchema.parse(producto_id); // Validación simple
    try {
        await apiClient.patch(`/productos/eliminarproducto/${parsedId}`);
    } catch (error) {
        throw new Error("No se pudo eliminar el producto.");
    }
};

export const addProductoStock = async (
    producto_id: number,
    stock: number
): Promise<Producto> => {
    try {
        const { data } = await apiClient.put(`/productos/agregarstock/${producto_id}`, { stock });
        return data as Producto
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || "No se pudo agregar el stock al producto."
        );
    }
}