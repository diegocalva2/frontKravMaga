import { UserPlus } from "lucide-react";
import type { OperationSummaryData } from "../types/dashboardTypesDos";

export const OperationSummary: React.FC<OperationSummaryData> = ({
  asistenciaPorcentaje,
  claseMasConcurrida,
  oportunidadesVenta,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t pt-4">
      <div className="p-3 border rounded-lg ">
        <p className="text-4xl font-bold text-blue-500">{`${Math.round(asistenciaPorcentaje)}%`}</p>
        <p className="text-sm text-gray-100 mt-1">Tasa de Asistencia Hoy</p>
      </div>
      <div className="p-3 border rounded-lg">
        <p className="text-4xl text-blue-500 font-bold">
          {claseMasConcurrida}
        </p>

        <p className="text-sm text-gray-100 mt-1">Clase Más Concurrida</p>
      </div>
      <div className="p-3 border rounded-lg">
        <p className="text-4xl font-bold text-green-400 flex items-center justify-center">
          {oportunidadesVenta}
          <UserPlus className="w-8 h-8 ml-2" />
        </p>
        <p className="text-sm text-gray-100">
          Oportunidades de Venta (Prueba)
        </p>
      </div>
    </div>
  );
};
