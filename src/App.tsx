import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Page from './components/pagina/page';
import ProtectedRoute from './router/ProtectedRoute';
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/page" element={
        <ProtectedRoute>
          <Page />
        </ProtectedRoute>
      } />
      <Route path="/dashboard"
        element={
            <DashboardPage/>
        }
      />
      <Route path="*" element={<h1>404 - No encontrado</h1>} />

    </Routes>
  );
}

export default App;