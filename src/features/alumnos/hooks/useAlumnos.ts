// src/features/alumnos/hooks/useAlumnos.ts
import { useState, useEffect, useCallback } from 'react';
import alumnosService from '../services/alumnosServices';
import membresiasService from '../../membresias/services/membresiaService';
import { calcularEstadoMembresia } from '../../../lib/membresiasUtils';
import type { Alumno, AlumnoFormData, AlumnoResponse } from '../types/alumnosTypes';
import type { MembresiaActivaResponse } from '../../membresias/types/membresiasTypes';

interface UseAlumnosReturn {
    alumnos: Alumno[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    crearAlumno: (data: AlumnoFormData) => Promise<Alumno>;
    actualizarAlumno: (id: string, data: Partial<AlumnoFormData>) => Promise<Alumno>;
    eliminarAlumno: (id: string) => Promise<void>;
}

export const useAlumnos = (): UseAlumnosReturn => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [membresiasActivas, setMembresiasActivas] = useState<MembresiaActivaResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Transforma AlumnoResponse[] a Alumno[] agregando estado_membresia
     */
    const transformarAlumnos = (
        alumnosResponse: AlumnoResponse[],
        membresias: MembresiaActivaResponse[]
    ): Alumno[] => {
        return alumnosResponse.map(alumno => ({
            ...alumno,
            estado_membresia: calcularEstadoMembresia(alumno.alumno_id, membresias)
        }));
    };

    const fetchAlumnos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener AMBOS datos en paralelo
            const [membresiasData, alumnosData] = await Promise.all([
                membresiasService.obtenerActivas(),
                alumnosService.obtenerTodos()
            ]);

            console.log('Membresías obtenidas:', membresiasData);
            console.log('Alumnos obtenidos:', alumnosData);

            // Guardar membresías para reutilizar
            setMembresiasActivas(membresiasData);

            // Transformar alumnos agregando estado_membresia
            const alumnosConEstado = transformarAlumnos(alumnosData, membresiasData);
            
            console.log('Alumnos con estado:', alumnosConEstado);

            setAlumnos(alumnosConEstado);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar alumnos';
            setError(errorMessage);
            console.error('Error en useAlumnos:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlumnos();
    }, [fetchAlumnos]);

    const crearAlumno = async (data: AlumnoFormData): Promise<Alumno> => {
        try {
            const nuevoAlumnoResponse = await alumnosService.crear(data);

            // Calcular estado usando membresías en memoria
            const nuevoAlumno: Alumno = {
                ...nuevoAlumnoResponse,
                estado_membresia: calcularEstadoMembresia(
                    nuevoAlumnoResponse.alumno_id,
                    membresiasActivas
                )
            };

            setAlumnos(prev => [...prev, nuevoAlumno]);
            return nuevoAlumno;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear alumno';
            setError(errorMessage);
            throw err;
        }
    };

    const actualizarAlumno = async (id: string, data: Partial<AlumnoFormData>): Promise<Alumno> => {
        try {
            const alumnoActualizadoResponse = await alumnosService.actualizar(id, data);

            const alumnoActualizado: Alumno = {
                ...alumnoActualizadoResponse,
                estado_membresia: calcularEstadoMembresia(
                    alumnoActualizadoResponse.alumno_id,
                    membresiasActivas
                )
            };

            setAlumnos(prev =>
                prev.map(alumno => alumno.alumno_id === id ? alumnoActualizado : alumno)
            );

            return alumnoActualizado;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar alumno';
            setError(errorMessage);
            throw err;
        }
    };

    const eliminarAlumno = async (id: string): Promise<void> => {
        try {
            await alumnosService.eliminar(id);
            setAlumnos(prev => prev.filter(alumno => alumno.alumno_id !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar alumno';
            setError(errorMessage);
            throw err;
        }
    };

    return {
        alumnos,
        loading,
        error,
        refetch: fetchAlumnos,
        crearAlumno,
        actualizarAlumno,
        eliminarAlumno
    };
};