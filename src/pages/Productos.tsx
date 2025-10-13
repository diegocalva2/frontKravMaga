import React from 'react';
import type { Producto } from '../types/Products';
import { addProducto, addProductoStock, deleteProducto, getProductos, updateProducto } from '../services/productosService';
import EliminarProducto from '../features/productos/components/EliminarProducto';
import { Box, Button, Paper, useMediaQuery, useTheme, Typography } from '@mui/material';
import { Edit as EditIcon, Trash2 as DeleteIcon, Plus as AddIcon } from 'lucide-react';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { ProductoForm } from '../features/productos/components/ProductoForm';
import AgregarStockForm from '../features/productos/components/AgregarStockForm';

const Productos = () => {
    const [productos, setProductos] = React.useState<Producto[]>([]);
    const [loading, setLoading] = React.useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Estados separados
    const [openForm, setOpenForm] = React.useState(false);  // Crear / Editar
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false); // Eliminar
    const [openStockDialog, setOpenStockDialog] = React.useState(false); // Agregar stock

    const [productoSeleccionado, setProductoSeleccionado] = React.useState<Producto | null>(null);

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

    // Eliminar producto
    const handleOpenDelete = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setOpenDeleteDialog(true);
    };
    const handleCloseDelete = () => setOpenDeleteDialog(false);

    const handleConfirmDelete = async () => {
        if (!productoSeleccionado) return;
        try {
            await deleteProducto(productoSeleccionado.producto_id);
            setProductos(prev => prev.filter(p => p.producto_id !== productoSeleccionado.producto_id));
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error("Error eliminando producto", error);
        }
    };

    // Agregar stock
    const handleAgregarStock = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setOpenStockDialog(true);
    };
    const handleCloseStock = () => setOpenStockDialog(false);

    const onAgregarStock = async (productoParcial: { producto_id: number; nombre?: string }, cantidad: number) => {
        await addProductoStock(productoParcial.producto_id, cantidad);
        setProductos((prev) =>
            prev.map((p) =>
                p.producto_id === productoParcial.producto_id
                    ? { ...p, stock: p.stock + cantidad }
                    : p
            )
        );
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
            width: 200,
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
                        gap: 1,
                        flexWrap: 'wrap',
                        width: '100%',
                    }}
                >
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAgregarStock(params.row)}
                        startIcon={isMobile ? <AddIcon size={16} /> : undefined}
                        sx={{
                            minWidth: isMobile ? 36 : 70,
                            fontSize: isMobile ? '0.65rem' : '0.75rem',
                            px: 1,
                        }}
                    >
                        {!isMobile && 'Añadir'}
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEditar(params.row)}
                        startIcon={isMobile ? <EditIcon size={16} /> : undefined}
                        sx={{
                            minWidth: isMobile ? 36 : 70,
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
                        onClick={() => handleOpenDelete(params.row)}
                        startIcon={isMobile ? <DeleteIcon size={16} /> : undefined}
                        sx={{
                            minWidth: isMobile ? 36 : 70,
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
                        bgcolor: '#e7e7e7ff',
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
                            bgcolor: '#e7e7e7ff',
                            border: 0,
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#000000', // <- color de fondo del header
                                color: '#000000',           // <- color del texto del header
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-cell': {
                                color: '#000000',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#B4BACF',
                                color: '#F9FAFB',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                backgroundColor: '#b9bdc4ff',
                                color: '#000000',
                            },
                        }}
                    />
                </Paper>

                {/* ✅ Diálogo Eliminar */}
                <EliminarProducto
                    open={openDeleteDialog}
                    onClose={handleCloseDelete}
                    onConfirm={handleConfirmDelete}
                    nombre={productoSeleccionado?.nombre || ""}
                />

                {/* ✅ Formulario Crear/Editar */}
                <ProductoForm
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    onSubmit={handleSubmit}
                    producto={productoSeleccionado}
                />

                {/* ✅ Formulario Agregar Stock */}
                <AgregarStockForm
                    open={openStockDialog}
                    onClose={handleCloseStock}
                    producto={productoSeleccionado}
                    onGuardar={onAgregarStock}
                />
            </Box>
        </Box>
    );
};

export default Productos;