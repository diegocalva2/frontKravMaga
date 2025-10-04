import type { Producto } from '../types/Products';
import { getProductos } from '../services/productosService';
import React from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

const Productos = () => {
    const [productos, setProductos] = React.useState<Producto[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (producto: Producto) => {
        console.log('Editar producto:', producto);
        // Aquí puedes abrir un modal o navegar a otra página de edición
    };

    const handleDelete = (producto: Producto) => {
        console.log('Eliminar producto:', producto);
        // Aquí puedes mostrar un diálogo de confirmación antes de eliminar
    };

    if (loading) return <div className="text-white p-4">Cargando productos...</div>;

    return (
        <div className="font-sans h-screen overflow-y-auto p-4 md:p-8 bg-gray-900">
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-50 mb-6">Productos</h1>

                <div className="overflow-x-auto">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="tabla productos">
                                <TableHead><TableRow>
                                    {['ID', 'Nombre', 'Precio', 'Stock', 'Acciones'].map((header) => (
                                        <TableCell
                                            key={header}
                                            align={
                                                header === 'Precio' || header === 'Stock'
                                                    ? 'right'
                                                    : header === 'Acciones'
                                                        ? 'center' // alineamos Acciones al centro
                                                        : 'left'
                                            }
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                backgroundColor: '#1F2937',
                                                color: '#F9FAFB',
                                                ...(header === 'Acciones' && { px: 3 }) // agrega un poco de padding horizontal extra
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                </TableHead>

                                <TableBody>
                                    {productos
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((producto) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={producto.producto_id}
                                                sx={{
                                                    backgroundColor: '#e7e7e7ff',
                                                    '&:hover': { backgroundColor: '#1E40AF' },
                                                }}
                                            >
                                                <TableCell>{producto.producto_id}</TableCell>
                                                <TableCell>{producto.nombre}</TableCell>
                                                <TableCell align="right">${producto.precio}</TableCell>
                                                <TableCell align="right">{producto.stock}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                        onClick={() => handleEdit(producto)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDelete(producto)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={productos.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                backgroundColor: '#b9bdc4ff',
                                color: '#000000ff',
                            }}
                        />
                    </Paper>
                </div>
            </div>
        </div>
    );
};

export default Productos;