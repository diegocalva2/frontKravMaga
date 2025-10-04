import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Page from "./components/pagina/page";
import DashboardPage from "./pages/DashboardPageDos";
import NavegationBarLayout from "./layouts/navegationBar";

function App() {
  return (
    <Routes>
      {/* Ruta pública de login */}
      <Route path="/login" element={<Login />} />

      {/* Layout SIN protección (temporalmente para pruebas) */}
      <Route path="/" element={<NavegationBarLayout />}>
        {/* Rutas hijas que se renderizan dentro del layout */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="page" element={<Page />} />
        <Route path="team" element={
          <div className="p-8">
            <h1 className="text-white text-2xl">Página de Equipo</h1>
          </div>
        } />
        <Route path="clases" element={
          <div className="p-8">
            <h1 className="text-white text-2xl">Página de Clases</h1>
          </div>
        } />
        <Route path="calendario" element={
          <div className="p-8">
            <h1 className="text-white text-2xl">Página de Calendario</h1>
          </div>
        } />
        <Route path="documentos" element={
          <div className="p-8">
            <h1 className="text-white text-2xl">Página de Documentos</h1>
          </div>
        } />
        <Route path="reportes" element={
          <div className="p-8">
            <h1 className="text-white text-2xl">Página de Reportes</h1>
          </div>
        } />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<h1>404 - No encontrado</h1>} />
    </Routes>
  );
}

export default App;