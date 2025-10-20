import React, { useState, useEffect, useRef } from "react";
import { X, User, ShieldCheck, History } from "lucide-react";
import type { Alumno, AsistenciaHistorial } from "../types/alumnosTypes";
import type { MembresiaHistorial } from "../../membresias/types/membresiasTypes";
import { estadoColors } from "./AlumnosEstadosMembresia";
import membresiasService from "../../membresias/services/membresiaService";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

interface AlumnoDetailPanelProps {
  alumno: Alumno | null;
  onClose: () => void;
}

export const AlumnoDetailPanel: React.FC<AlumnoDetailPanelProps> = ({
  alumno,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [membresias, setMembresias] = useState<MembresiaHistorial[]>([]);
  const [loadingMembresias, setLoadingMembresias] = useState(false);
  
  // Ref para detectar clicks fuera del panel
  const panelRef = useRef<HTMLDivElement>(null);

  // Mock data para asistencias (por ahora)
  const mockAsistencias: AsistenciaHistorial[] = [
    {
      asistencia_id: "a1",
      fecha_asistencia: "2024-10-02 19:00",
      clase_nombre: "Krav Maga Vespertino",
    },
    {
      asistencia_id: "a2",
      fecha_asistencia: "2024-09-30 19:00",
      clase_nombre: "Krav Maga Vespertino",
    },
    {
      asistencia_id: "a3",
      fecha_asistencia: "2024-09-28 10:00",
      clase_nombre: "Acondicionamiento Físico",
    },
  ];

  // Cargar membresías cuando se abre el panel
  useEffect(() => {
    if (alumno && activeTab === "membresias") {
      fetchMembresias();
    }
  }, [alumno, activeTab]);

  // Detectar clicks fuera del panel para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el panel está abierto Y el click fue fuera del panel
      if (alumno && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Agregar el event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [alumno, onClose]);

  const fetchMembresias = async () => {
    if (!alumno) return;
    
    try {
      setLoadingMembresias(true);
      const data = await membresiasService.obtenerPorAlumno(alumno.alumno_id);
      setMembresias(data);
    } catch (error) {
      console.error("Error al cargar membresías:", error);
      setMembresias([]);
    } finally {
      setLoadingMembresias(false);
    }
  };

  const panelClasses = alumno ? "translate-x-0" : "translate-x-full";

  return (
    <div
      ref={panelRef}
      className={`fixed inset-y-0 right-0 z-30 w-full md:w-1/2 lg:w-2/6 bg-slate-800 shadow-2xl shadow-black/50 transform transition-transform duration-300 ease-in-out ${panelClasses}`}
    >
      {alumno && (
        <div className="flex flex-col h-full text-white text-left">
          {/* Encabezado del Panel */}
          <div className="p-6 bg-slate-900/50 border-b border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{alumno.nombre_completo}</h2>
                <div className="mt-2">
                  <span className="text-gray-300 text-sm">Estado Membresía: </span>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${estadoColors[alumno.estado_membresia]}`}
                  >
                       {alumno.estado_membresia}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Pestañas (Tabs) */}
          <div className="border-b border-slate-700 px-6">
            <nav className="flex gap-6 -mb-px">
              <button
                onClick={() => setActiveTab("general")}
                className={`py-4 px-1 border-b-2 font-medium flex items-center gap-2 ${activeTab === "general" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
              >
                <User size={16} /> General
              </button>
              <button
                onClick={() => setActiveTab("membresias")}
                className={`py-4 px-1 border-b-2 font-medium flex items-center gap-2 ${activeTab === "membresias" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
              >
                <ShieldCheck size={16} /> Membresías
              </button>
              <button
                onClick={() => setActiveTab("asistencias")}
                className={`py-4 px-1 border-b-2 font-medium flex items-center gap-2 ${activeTab === "asistencias" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
              >
                <History size={16} /> Asistencias
              </button>
            </nav>
          </div>

          {/* Contenido de las Pestañas */}
          <div className="p-6 overflow-y-auto flex-grow">
            {activeTab === "general" && (
              <div className="space-y-4 text-gray-300">
                <h3 className="text-lg font-semibold text-gray-100 border-b border-slate-700 pb-2">
                  Datos Personales
                </h3>
                <p>
                  <strong>Fecha de Nacimiento:</strong>{" "}
                  {alumno.fecha_nacimiento || "N/A"}
                </p>
                <p>
                  <strong>Fecha de Ingreso:</strong> {alumno.fecha_ingreso}
                </p>
                <h3 className="text-lg font-semibold text-gray-100 border-b border-slate-700 pb-2 mt-6">
                  Contacto
                </h3>
                <p>
                  <strong>Celular:</strong> {alumno.celular || "N/A"}
                </p>
                <p>
                  <strong>Correo:</strong> {alumno.correo || "N/A"}
                </p>
                <h3 className="text-lg font-semibold text-gray-100 border-b border-slate-700 pb-2 mt-6">
                  Información Médica y de Emergencia
                </h3>
                <p>
                  <strong>Contacto de Emergencia:</strong>{" "}
                  {alumno.contacto_emergencia || "N/A"}
                </p>
                <p>
                  <strong>Condiciones Médicas:</strong>{" "}
                  {alumno.condiciones_medicas || "Ninguna"}
                </p>
                {alumno.notas_instructor && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-100 border-b border-slate-700 pb-2 mt-6">
                      Notas del Instructor
                    </h3>
                    <p>{alumno.notas_instructor}</p>
                  </>
                )}
              </div>
            )}

            {activeTab === "membresias" && (
              <div>
                {loadingMembresias ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : membresias.length > 0 ? (
                  <ul className="divide-y divide-slate-700">
                    {membresias.map((m) => (
                      <li key={m.membresia_id} className="py-3">
                        <p className="font-semibold">{m.plan_nombre}</p>
                        <p className="text-sm text-gray-400">
                          {m.fecha_inicio} al {m.fecha_fin} -{" "}
                          <span
                            className={
                              m.esta_activa ? "text-green-400" : "text-gray-500"
                            }
                          >
                            {m.esta_activa ? "Activa" : "Finalizada"}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-400 py-8">
                    No hay membresías registradas
                  </p>
                )}
              </div>
            )}

            {activeTab === "asistencias" && (
              <div>
                {mockAsistencias.length > 0 ? (
                  <ul className="divide-y divide-slate-700">
                    {mockAsistencias.map((a) => (
                      <li key={a.asistencia_id} className="py-3">
                        <p className="font-semibold">{a.clase_nombre}</p>
                        <p className="text-sm text-gray-400">
                          {a.fecha_asistencia}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-400 py-8">
                    No hay asistencias registradas
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};