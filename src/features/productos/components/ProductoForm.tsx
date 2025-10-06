import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import { useAlert } from "../../../components/Message-global/useAlert";
import type { ProductoFormProps } from "../types/productosTypes";

export const ProductoForm: React.FC<ProductoFormProps> = ({
    open,
    onClose,
    onSubmit,
    producto,
}) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState<number | "">("");
    const [stock, setStock] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        nombre?: string;
        descripcion?: string;
        precio?: string;
        stock?: string;
    }>({});

    const { showAlert } = useAlert();

    useEffect(() => {
        if (producto) {
            setNombre(producto.nombre ?? "");
            setDescripcion(producto.descripcion ?? "");
            // asegura que cuando venga undefined use '', y cuando venga number lo asigne
            setPrecio(typeof producto.precio === "number" ? producto.precio : "");
            setStock(typeof producto.stock === "number" ? producto.stock : "");
        } else {
            setNombre("");
            setDescripcion("");
            setPrecio("");
            setStock("");
        }
        setErrors({});
    }, [producto, open]);

    // onChange que preserva cadena vacía
    const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setPrecio(v === "" ? "" : Number(v));
        if (errors.precio) setErrors((p) => ({ ...p, precio: undefined }));
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setStock(v === "" ? "" : Number(v));
        if (errors.stock) setErrors((p) => ({ ...p, stock: undefined }));
    };

    // validadores auxiliares
    const isInvalidNumber = (v: number | "") =>
        v === "" || Number.isNaN(v) || !Number.isFinite(v) || v <= 0;

    const isInvalidInteger = (v: number | "") =>
        v === "" || Number.isNaN(v) || !Number.isFinite(v) || !Number.isInteger(v) || v <= 0;

    const validateForm = () => {
        const newErrors: { [k: string]: string } = {};

        if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria";

        if (isInvalidNumber(precio)) newErrors.precio = "El precio debe ser un número mayor a 0";
        if (isInvalidInteger(stock)) newErrors.stock = "El stock debe ser un entero y mayor a 0";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showAlert("Por favor completa todos los campos correctamente", "warning");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                producto_id: producto?.producto_id,
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                precio: Number(precio),
                stock: Number(stock),
            });

            // Después de ejecutar, cierras el diálogo y muestras alerta directamente
            showAlert(
                producto ? "Producto actualizado correctamente" : "Producto agregado correctamente",
                "success"
            );
            onClose();
        } catch (error) {
            showAlert("Error al guardar el producto", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold" }} textAlign={"center"}>{producto ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            if (errors.nombre) setErrors((p) => ({ ...p, nombre: undefined }));
                        }}
                        fullWidth
                        disabled={loading}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                    />
                    <TextField
                        label="Descripción"
                        value={descripcion}
                        onChange={(e) => {
                            setDescripcion(e.target.value);
                            if (errors.descripcion) setErrors((p) => ({ ...p, descripcion: undefined }));
                        }}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={loading}
                        error={!!errors.descripcion}
                        helperText={errors.descripcion}
                    />
                    <TextField
                        label="Precio"
                        type="number"
                        value={precio === "" ? "" : precio}
                        onChange={handlePrecioChange}
                        fullWidth
                        disabled={loading}
                        error={!!errors.precio}
                        helperText={errors.precio}
                        inputProps={{ min: 0, step: 0.01 }}
                    />
                    <TextField
                        label="Stock"
                        type="number"
                        value={stock === "" ? "" : stock}
                        onChange={handleStockChange}
                        fullWidth
                        disabled={loading}
                        error={!!errors.stock}
                        helperText={errors.stock}
                        inputProps={{ min: 0, step: 1 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {loading ? (producto ? "Guardando..." : "Guardando...") : producto ? "Actualizar" : "Agregar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
