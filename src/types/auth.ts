// 1. Interfaz para los datos que recibes del servidor al hacer login
export interface LoginResponse {
    msg: string;
    // Podrías incluir otros datos si los devuelves, ej: userId: number;
}

// 2. Interfaz para los datos de sesión devueltos por /validate-token
export interface UserSessionData {
    IdUsuario: number;
    IdRol: number;
}

export interface AuthState {
    // Los datos básicos que vienen de verifySession
    user: UserSessionData | null;
    // Bandera para saber si el usuario está logueado
    isAuthenticated: boolean;
    // Bandera para saber si se está cargando el estado (ej: al iniciar la app)
    isLoading: boolean;
    // Mensaje de error (ej: si login falla)
    error: string | null;
    // Función para manejar el inicio de sesión
    login: (correo: string, password: string) => Promise<boolean>;
    // Función para cerrar sesión
    logout: () => void;
}