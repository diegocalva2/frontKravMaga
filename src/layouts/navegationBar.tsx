import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, FolderOpen, Calendar, FileText, PieChart, ChevronRight, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userAvatar from '../assets/25225973_7085130.svg';
import estrella from '../assets/Estrella.svg';

// Datos de ejemplo para el menú
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: '5', path: '/dashboard' },
  { id: 'team', label: 'Equipo', icon: Users, path: '/team' },
  { id: 'projects', label: 'Clases', icon: FolderOpen, badge: '12', path: '/clases' },
  { id: 'calendar', label: 'Calendario', icon: Calendar, badge: '20+', path: '/calendario' },
  { id: 'documents', label: 'Documentos', icon: FileText, path: '/documentos' },
  { id: 'reports', label: 'Reportes', icon: PieChart, path: '/reportes' },
  { id: 'products', label: 'Productos', icon: PieChart, path: '/productos' },
];

const teams = [
  { id: 'heroicons', label: 'Instructores', initial: 'I' },
  { id: 'tailwind', label: 'Alumnos Activos', initial: 'A' },
  { id: 'workcation', label: 'Membresías', initial: 'M' },
];

const NavegationBarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTeam, setActiveTeam] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useAuth();

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determina el item activo basado en la ruta actual
  const activeItem = menuItems.find(item => location.pathname === item.path)?.id || 'dashboard';

  const handleNavigation = (itemId, path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleTeamClick = (teamId) => {
    setActiveTeam(teamId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Overlay para móvil */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Botón de menú flotante para móvil */}
      {isMobile && !isMobileMenuOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 bg-slate-800/90 backdrop-blur-xl rounded-lg border border-slate-700/50 text-white hover:bg-slate-700/90 transition-all duration-200 lg:hidden shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 flex flex-col transition-all duration-300 ease-in-out z-50
          ${isMobile
            ? `fixed top-0 left-0 h-full ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72`
            : `relative ${isCollapsed ? 'w-20' : 'w-72'}`
          }`}
      >
        {/* Logo y Toggle Button */}
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed && !isMobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="w-10 h-10 bg-gradient-to-br bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={estrella}
              />
            </div>
            <span className="text-white font-semibold text-lg whitespace-nowrap">Krav Maga</span>
          </div>
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg hover:bg-slate-800/40 transition-all duration-200 text-slate-400 hover:text-white flex-shrink-0 ${isCollapsed && !isMobile ? 'mx-auto' : ''
              }`}
          >
            {(isMobile && isMobileMenuOpen) || (!isMobile && !isCollapsed) ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id, item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-slate-800/80 text-white shadow-lg shadow-slate-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                title={isCollapsed && !isMobile ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Teams Section Expandido */}
        {(!isCollapsed || isMobile) && (
          <div className="px-4 py-4 border-t border-slate-700/50">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
              Tus secciones
            </h3>
            <div className="space-y-1">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamClick(team.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTeam === team.id
                    ? 'bg-slate-800/80 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                >
                  <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center text-xs font-semibold text-slate-300">
                    {team.initial}
                  </div>
                  <span className="flex-1 text-left">{team.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Teams Section Colapsado (solo desktop) */}
        {isCollapsed && !isMobile && (
          <div className="px-4 py-4 border-t border-slate-700/50 space-y-2">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className={`w-full flex items-center justify-center p-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTeam === team.id
                  ? 'bg-slate-800/80 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                title={team.label}
              >
                <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center text-xs font-semibold text-slate-300">
                  {team.initial}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/40 transition-all duration-200 ${isCollapsed && !isMobile ? 'justify-center' : ''
              }`}
            title={isCollapsed && !isMobile ? 'Tom Cook - Administrador' : ''}
          >
            <img
              src={userAvatar}
              alt="Usuario"
              className="w-9 h-9 rounded-full border-2 border-slate-700 flex-shrink-0"
            />
            {(!isCollapsed || isMobile) && (
              <>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">{user?.userName || 'Usuario'}</div>
                  <div className="text-xs text-slate-400">{user?.rolName || 'Rol'}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default NavegationBarLayout;