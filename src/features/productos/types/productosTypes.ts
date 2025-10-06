import type { Producto } from "../../../types/Products";

export interface EliminarProductoProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;  // ✅ sin params
    nombre: string;
}

export interface ProductoFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (nombre: Omit<Producto, 'producto_id'> & Partial<Pick<Producto, 'producto_id'>>) => void;
    producto?: Producto | null; // Si viene, es edición; si no, es creación
}