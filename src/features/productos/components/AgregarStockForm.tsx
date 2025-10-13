import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import { z } from "zod";
import type { DialogAgregarStockProps } from "../types/productosTypes";
import { useAlert } from "../../../components/Message-global/useAlert";

const cantidadSchema = z
    .number()
    .int("Debe ser un número entero")
    .min(1, "Debe ser mayor que 0");

export default function DialogAgregarStock({
    open,
    onClose,
    producto,
    onGuardar,
}: DialogAgregarStockProps) {
    const [cantidad, setCantidad] = useState("");
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (open) setCantidad("");
    }, [open]);

    const handleGuardar = async () => {
        if (!producto) return;

        const cantidadNum = Number(cantidad);
        const result = cantidadSchema.safeParse(cantidadNum);

        if (!result.success) {
            showAlert(result.error.issues[0].message, "error");
            return;
        }

        try {
            setLoading(true);
            await onGuardar(producto, cantidadNum); // llamar al padre
            showAlert(`Stock añadido correctamente a "${producto.nombre}".`, "success");
            handleClose();
        } catch (error: any) {
            showAlert(error.message || "Error al añadir stock", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setCantidad("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: "bold" }} textAlign="center">
                Añadir Stock
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Cantidad"
                    type="number"
                    fullWidth
                    inputProps={{ min: 1 }}
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    disabled={loading}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit" disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleGuardar}
                    color="success"
                    variant="contained"
                    disabled={!cantidad || loading}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
