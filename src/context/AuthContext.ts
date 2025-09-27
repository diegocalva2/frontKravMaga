import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AuthState, UserSessionData } from "../types/auth";
import { loginUser, verifySession } from "../api/authService";
import React from "react";

// 1. Tipo para los datos del usuario autenticado

// 2. Valores iniciales por defecto del contexto
const initialAuthState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false, // Empezamos en true para verificar la sesión inicial
    error: null,
    login: async () => false, // Función vacía por defecto
    logout: () => { }, // Función vacía por defecto
};

// 3. Creación del Contexto
export const AuthContext = createContext<AuthState>(initialAuthState);

// 4. Hook personalizado para usar el contexto (más limpio en componentes)
export const useAuth = () => useContext(AuthContext);

// 5. El Provider que maneja toda la lógica
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const navigate = useNavigate(); // Descomentar si usas navegación

    const [user, setUser] = useState<UserSessionData | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- Lógica del Login (Usando el servicio) ---
    const login = useCallback(async (correo: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await loginUser(correo, password);
            const userData = await verifySession();
            setUser(userData);
            setIsAuthenticated(true);
            return true;  // 🔹 ÉXITO
        } catch (err: any) {
            setError(err.message || "Credenciales incorrectas");
            setUser(null);
            setIsAuthenticated(false);
            return false; // 🔹 FALLO
        } finally {
            setIsLoading(false);
        }
    }, []);


    // --- Lógica de Cierre de Sesión ---
    const logout = useCallback(() => {
        // En una aplicación real, harías una llamada al backend para borrar la cookie
        // Por ahora, solo limpiamos el estado local
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        // navigate('/login');
    }, []);

    // --- Lógica de Verificación de Sesión Inicial (Al cargar la app) ---
    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const userData = await verifySession();
                setUser(userData);
                setIsAuthenticated(true);
            } catch {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // Valores que se pasan a todos los consumidores del Contexto
    const value = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout
    };

    return React.createElement(
        AuthContext.Provider,
        { value },
        children
    );
};