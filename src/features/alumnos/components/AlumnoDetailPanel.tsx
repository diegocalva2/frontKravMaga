import React, { useState } from "react";
import { X, User, ShieldCheck, History } from "lucide-react";
import type { EstadoMembresia } from "../types/alumnosTypes";
import type { Alumno } from "../types/alumnosTypes";
import type { MembresiaHistorial } from "../types/alumnosTypes";
import type { AsistenciaHistorial } from "../types/alumnosTypes";

interface AlumnoDetailPanelProps {
  alumno: Alumno | null;
  onClose: () => void;
}

// ✅ CORRECCIÓN: Se mueve 'estadoColors' a un scope compartido
// para que tanto AlumnoDetailPanel como AlumnosPage puedan usarlo.
const estadoColors: Record<EstadoMembresia, string> = {
  Activo: "bg-green-500/20 text-green-400 border border-green-500/30",
  "Por Vencer": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Vencido: "bg-red-500/20 text-red-400 border border-red-500/30",
};

// Mock data para las pestañas del panel
const mockMembresias: MembresiaHistorial[] = [
  {
    membresia_id: "m1",
    plan_nombre: "Plan Mensual",
    fecha_inicio: "2024-09-15",
    fecha_fin: "2024-10-15",
    esta_activa: true,
  },
  {
    membresia_id: "m2",
    plan_nombre: "Plan Mensual",
    fecha_inicio: "2024-08-15",
    fecha_fin: "2024-09-15",
    esta_activa: false,
  },
  {
    membresia_id: "m3",
    plan_nombre: "Plan Trimestral",
    fecha_inicio: "2024-05-15",
    fecha_fin: "2024-08-15",
    esta_activa: false,
  },
];

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

export const AlumnoDetailPanel: React.FC<AlumnoDetailPanelProps> = ({
  alumno,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("general");

  const panelClasses = alumno ? "translate-x-0" : "translate-x-full";

  return (
    <div
      className={`fixed inset-y-0 right-0 z-30 w-full md:w-1/2 lg:w-2/6 bg-slate-800 shadow-2xl shadow-black/50 transform transition-transform duration-300 ease-in-out ${panelClasses}`}
    >
      {alumno && (
        // ✅ CORRECCIÓN: Se añade 'text-left' para forzar la alineación a la izquierda y anular cualquier estilo global.
        <div className="flex flex-col h-full text-white text-left">
          {/* Encabezado del Panel */}
          <div className="p-6 bg-slate-900/50 border-b border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{alumno.nombre_completo}</h2>
                <span
                  className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${estadoColors[alumno.estado_membresia]}`}
                >
                  Membresía {alumno.estado_membresia}
                </span>
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
              </div>
            )}

            {activeTab === "membresias" && (
              <ul className="divide-y divide-slate-700">
                {mockMembresias.map((m) => (
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
            )}

            {activeTab === "asistencias" && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};
