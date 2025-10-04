import React, { useMemo } from 'react';
import { Users, Zap, DollarSign, Package } from 'lucide-react';
import type { Metrics } from '../features/dashboard/types/dashboardTypesDos';
import type { AlertItem } from '../features/dashboard/types/dashboardTypesDos';
import type { InventoryItem } from '../features/dashboard/types/dashboardTypesDos';
import type { OperationSummaryData } from '../features/dashboard/types/dashboardTypesDos';
import { StatCard } from '../features/dashboard/components/StatCard';
import { SectionCard } from '../features/dashboard/components/SectionCard';
import { AlertList } from '../features/dashboard/components/AlertList';
import { InventoryList } from '../features/dashboard/components/InventoryList';
import { OperationSummary } from '../features/dashboard/components/OperationSummary';
const DashboardPage: React.FC = () => {
  //  datos de ejemplo que reemplazarías con una llamada a tu API/servicio
  const metrics: Metrics = useMemo(() => ({
    alumnosActivos: 185, vencen7dias: 12, ventasHoy: 2500, stockBajo: 6,
  }), []);

  const alertasMock: AlertItem[] = useMemo(() => [
    { id: 'a1', nombre: 'Juan Pérez', plan: 'Mensual', diasParaVencer: 5 },
    { id: 'a2', nombre: 'Maria López', plan: 'Trimestral', diasParaVencer: 6 },
    { id: 'a3', nombre: 'Carlos Ruiz', plan: 'Semanal', diasParaVencer: 7 },
  ], []);

  const inventarioMock: InventoryItem[] = useMemo(() => [
    { id: 1, nombre: 'Guantes de Boxeo (16oz)', stock: 4 },
    { id: 2, nombre: 'Camiseta Krav Maga Talla M', stock: 2 },
    { id: 3, nombre: 'Botella de Agua (Logo)', stock: 5 },
  ], []);

  const operationSummaryMock: OperationSummaryData = useMemo(() => ({
    asistenciaPorcentaje: 85, claseMasConcurrida: 'Vespertino', oportunidadesVenta: 7,
  }), []);

  return (
     <div className="font-sans h-screen overflow-y-auto p-4 md:p-8" >
      <div className="container mx-auto">
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Dashboard de Krav Maga</h1>

          {/* 1. Tarjetas de Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Alumnos Activos" value={metrics.alumnosActivos} Icon={Users} color="blue" />
            <StatCard title="Vencen en 7 días" value={metrics.vencen7dias} Icon={Zap} color="red" />
            <StatCard title="Ventas Hoy (MXN)" value={`$${metrics.ventasHoy.toFixed(2)}`} Icon={DollarSign} color="green" />
            <StatCard title="Productos Stock Bajo" value={metrics.stockBajo} Icon={Package} color="yellow" />
          </div>

          {/* 2. Sección de Alertas e Inventario */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SectionCard
              title={`Alertas de Renovación (${alertasMock.length} Próximos)`}
              subtitle="Prioridad: contactar a estos alumnos inmediatamente para asegurar la continuidad."
              Icon={Zap}
              className="lg:col-span-2 border border-red-200"
            >
              <div className="max-h-37 overflow-y-auto">
                <AlertList items={alertasMock}/>
              </div>
              
            </SectionCard>
            <SectionCard
              title={`Inventario Crítico (${inventarioMock.length})`}
              subtitle="Productos que requieren reabastecimiento urgente."
              Icon={Package}
              className="border border-yellow-200"
            >
              <InventoryList items={inventarioMock} />
            </SectionCard>
          </div>
          
          {/* 3. Resumen de Operaciones */}
          <SectionCard title="Resumen de Operación y Ventas">
            <OperationSummary {...operationSummaryMock} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;