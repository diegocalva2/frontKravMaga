import { useState } from 'react';
import type { EliminarProductoProps } from '../types/productosTypes';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useAlert } from '../../../components/Message-global/useAlert';

export default function EliminarProducto({
    open,
    onClose,
    onConfirm,
    nombre,
}: EliminarProductoProps) {
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    // En EliminarProducto.tsx
    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            showAlert(`Producto "${nombre}" eliminado correctamente.`, "success");
            onClose();
        } catch (error) {
            showAlert("Ocurrió un error al eliminar el producto.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={!loading ? onClose : undefined}
            fullWidth
            maxWidth="xs"
            sx={{ "& .MuiPaper-root": { backgroundColor: "#e7e7e7ff" } }}
        >
            <DialogTitle
                id="dialog-title"
                sx={{ fontWeight: "bold", textAlign: "center" }}
            >
                Confirmar eliminación
            </DialogTitle>

            <DialogContent>
                <Typography align="center">
                    ¿Estás seguro de que deseas eliminar{" "}
                    <strong>{nombre}</strong>? Esta acción no se puede deshacer.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    startIcon={
                        loading ? <CircularProgress size={18} color="inherit" /> : null
                    }
                >
                    {loading ? "Eliminando..." : "Eliminar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};