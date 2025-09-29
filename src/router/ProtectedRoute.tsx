import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Mientras verifica sesión, evita parpadeos o redirecciones falsas
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    // Si NO está autenticado, lo mandas al login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Si sí está autenticado, renderiza lo que corresponde
    return children;
};

export default ProtectedRoute;