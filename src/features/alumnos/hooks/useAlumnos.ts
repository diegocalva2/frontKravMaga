import { useState, useEffect, useCallback } from 'react';
import alumnosService from '../services/alumnosServices';
import type { Alumno, AlumnoFormData } from '../types/alumnosTypes';

interface UseAlumnosReturn {
    alumnos: Alumno[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    crearAlumno: (data: AlumnoFormData) => Promise<Alumno>;
    actualizarAlumno: (id: string, data: Partial<AlumnoFormData>) => Promise<Alumno>;
}

export const useAlumnos = (): UseAlumnosReturn => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlumnos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await alumnosService.obtenerTodos();
            setAlumnos(data);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar alumnos';
            setError(errorMessage);
            console.error('error en useAlumnos:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlumnos();
    }, [fetchAlumnos]);

    const crearAlumno = async (data: AlumnoFormData): Promise<Alumno> => {
        try {
            const nuevoAlumno = await alumnosService.crear(data);
            setAlumnos(prev => [...prev, nuevoAlumno]);
            return nuevoAlumno;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear alumno';
            setError(errorMessage);
            throw error;
        }
    }

    const actualizarAlumno = async (id: string, data: Partial<AlumnoFormData>): Promise<Alumno> => {
        try {
            const alumnoActualizado = await alumnosService.actualizar(id, data);
            setAlumnos(prev =>
                prev.map(alumno => alumno.alumno_id === id ? alumnoActualizado : alumno)
            );
            return alumnoActualizado;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar alumno';
            setError(errorMessage)
            throw error;
        }
    };
    return {
        alumnos,
        loading,
        error,
        refetch: fetchAlumnos,
        crearAlumno,
        actualizarAlumno
    };
};

