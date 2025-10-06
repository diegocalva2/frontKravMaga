import React from 'react';
import type { Producto } from '../types/Products';
import { addProducto, deleteProducto, getProductos, updateProducto } from '../services/productosService';
import EliminarProducto from '../features/productos/components/EliminarProducto';
import { Box, Button, Paper, useMediaQuery, useTheme, Typography } from '@mui/material';
import { Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { ProductoForm } from '../features/productos/components/ProductoForm';

const Productos = () => {
    const [productos, setProductos] = React.useState<Producto[]>([]);
    const [loading, setLoading] = React.useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [openDialog, setOpenDialog] = React.useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = React.useState<Producto | null>(null);

    const [openForm, setOpenForm] = React.useState(false);

    React.useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const handleAgregar = () => {
        setProductoSeleccionado(null);
        setOpenForm(true);
    };

    const handleEditar = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setOpenForm(true);
    };

    const handleSubmit = async (
        producto: Omit<Producto, "producto_id"> & Partial<Pick<Producto, "producto_id">>
    ) => {
        try {
            if (producto.producto_id) {
                // Editar producto
                await updateProducto(producto.producto_id, producto);
                setProductos(prev =>
                    prev.map(p =>
                        p.producto_id === producto.producto_id ? { ...p, ...producto } : p
                    )
                );
                return { success: true, message: "Producto actualizado correctamente" };
            } else {
                // Agregar producto
                const nuevo = await addProducto(producto);
                setProductos(prev => [...prev, nuevo]);
                return { success: true, message: "Producto agregado correctamente" };
            }
        } catch (error) {
            console.error("Error guardando producto", error);
            return { success: false, message: "Error guardando producto" };
        }
    };

    const handleOpenDialog = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => setOpenDialog(false);

    const handleConfirmDelete = async () => {
        if (!productoSeleccionado) return;
        try {
            await deleteProducto(productoSeleccionado.producto_id);
            setProductos(prev => prev.filter(p => p.producto_id !== productoSeleccionado.producto_id));
            setOpenDialog(false);
        } catch (error) {
            console.error("Error eliminando producto", error);
        }
    };

    const columns: GridColDef[] = [
        { field: 'producto_id', headerName: 'ID', width: 70 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        {
            field: 'precio',
            headerName: 'Precio',
            type: 'number',
            headerAlign: 'right',
            align: 'right',
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number',
            headerAlign: 'right',
            align: 'right',
        },
        { field: 'descripcion', headerName: 'Descripción', flex: 1 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 160,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<Producto>) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,        // espacio entre botones
                        flexWrap: 'wrap', // permite que los botones se muevan a otra línea si no caben
                        width: '100%',    // asegura que el Box ocupe toda la celda
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEditar(params.row)}
                        startIcon={isMobile ? <EditIcon size={16} /> : undefined}
                        sx={{
                            minWidth: isMobile ? 36 : 70,  // ancho mínimo ajustado
                            fontSize: isMobile ? '0.65rem' : '0.75rem',
                            px: 1,
                        }}
                    >
                        {!isMobile && 'Editar'}
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDialog(params.row)}
                        startIcon={isMobile ? <DeleteIcon size={16} /> : undefined}
                        sx={{
                            minWidth: isMobile ? 36 : 70,  // ancho mínimo igual al anterior
                            fontSize: isMobile ? '0.65rem' : '0.75rem',
                            px: 1,
                        }}
                    >
                        {!isMobile && 'Eliminar'}
                    </Button>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#111827', p: { xs: 2, md: 4 } }}>
            <Box sx={{ maxWidth: '95%', mx: 'auto' }}>
                <Typography variant="h4" fontWeight="bold" color="#F9FAFB" mb={3}>
                    Productos
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleAgregar}
                    >
                        Agregar Producto
                    </Button>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        height: 500,
                        width: '100%',
                        bgcolor: '#e7e7e7ff', // Fondo filas
                        p: 2,
                    }}
                >
                    <DataGrid
                        rows={productos}
                        columns={columns}
                        getRowId={row => row.producto_id}
                        loading={loading}
                        pageSizeOptions={[5, 10, 25, 50]}
                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                        getRowHeight={() => 'auto'}
                        sx={{
                            bgcolor: '#e7e7e7ff', // Fondo filas
                            border: 0,
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#000000', // <- color de fondo del header
                                color: '#000000',           // <- color del texto del header
                                fontWeight: 'bold',
                                bgcolor: '#000000',
                            },
                            '& .MuiDataGrid-cell': {
                                color: '#000000', // Texto normal
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#B4BACF', // Hover azul oscuro
                                color: '#F9FAFB',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                backgroundColor: '#b9bdc4ff', // Paginación gris claro
                                color: '#000000',
                            },
                        }}
                    />
                </Paper>

                <EliminarProducto
                    open={openDialog}
                    onClose={handleCloseDialog}
                    onConfirm={handleConfirmDelete}
                    nombre={productoSeleccionado?.nombre || ""}
                />

                <ProductoForm
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    onSubmit={handleSubmit}
                    producto={productoSeleccionado}
                />
            </Box>
        </Box>
    );
};

export default Productos;