import React, { useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { FiUsers, FiZap, FiDollarSign, FiPackage } from "react-icons/fi";
import type {
  AlertItem,
  InventoryItem,
  Metrics,
  OperationSummaryProps,
} from "../features/dashboard/types/dashboardTypes";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusCard } from "../components/ui/StatusCard";
import { AlertsList } from "../features/dashboard/components/ListaAlerta";
import { InventoryList } from "../features/dashboard/components/ListaInventario";
import { OperationSummary } from "../features/dashboard/components/ResumenOPeraciones";

const DashboardPage: React.FC = () => {
  const metrics: Metrics = useMemo(
    () => ({
      alumnosActivos: 185,
      vencen7dias: 12,
      ventasHoy: 2500,
      stockBajo: 6,
    }),
    [],
  );
  const alertasMock: AlertItem[] = useMemo(
    () => [
      { id: "a1", nombre: "Juan Pérez", plan: "Mensual", diasParaVencer: 5 },
      {
        id: "a2",
        nombre: "Maria López",
        plan: "Trimestral",
        diasParaVencer: 6,
      },
      { id: "a3", nombre: "Carlos Ruiz", plan: "Semanal", diasParaVencer: 7 },
    ],
    [],
  );

  const inventarioMock: InventoryItem[] = useMemo(
    () => [
      { id: 1, nombre: "Guantes de Boxeo (16oz)", stock: 4 },
      { id: 2, nombre: "Camiseta Krav Maga Talla M", stock: 2 },
      { id: 3, nombre: "Botella de Agua (Logo)", stock: 5 },
    ],
    [],
  );

  const operationSummaryMock: OperationSummaryProps = useMemo(
    () => ({
      asistenciaPorcentaje: 85,
      claseMasConcurrida: "Vespertino",
      oportunidadesVenta: 7,
    }),
    [],
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Dashboard de Krav Maga
      </Typography>

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Alumnos Activos"
            value={metrics.alumnosActivos}
            Icon={FiUsers}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Vencen en 7 días"
            value={metrics.vencen7dias}
            Icon={FiZap}
            color="#dc2626"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Ventas Hoy (MXN)"
            value={`$ ${metrics.ventasHoy.toFixed(2)}`}
            Icon={FiDollarSign}
            color="#16a34a"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Productos Stock Bajo"
            value={metrics.stockBajo}
            Icon={FiPackage}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      {/* Alerts + Inventory */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <SectionCard
            title={`Alertas de Renovación (${alertasMock.length} Próximos)`}
            subtitle="Prioridad: contactar a estos alumnos inmediatamente para asegurar la continuidad."
            Icon={FiZap}
          >
            <AlertsList items={alertasMock} />
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <SectionCard
            title={`Inventario Crítico (${inventarioMock.length})`}
            subtitle="Productos que requieren reabastecimiento urgente."
            Icon={FiPackage}
          >
            <InventoryList items={inventarioMock} />
          </SectionCard>
        </Grid>
      </Grid>

      {/* Operation summary */}
      <Box sx={{ mb: 2 }}>
        <SectionCard title="Resumen de Operación y Ventas">
          <OperationSummary {...operationSummaryMock} />
        </SectionCard>
      </Box>
    </Box>
  );
};

export default DashboardPage;
