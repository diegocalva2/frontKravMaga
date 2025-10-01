import type { OperationSummaryProps } from "../types/dashboardTypes";
import Grid from "@mui/material/Grid";
import { Typography, Paper } from "@mui/material";

export const OperationSummary: React.FC<OperationSummaryProps> = ({
  asistenciaPorcentaje,
  claseMasConcurrida,
  oportunidadesVenta,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#1976d2" }}>
            {Math.round(asistenciaPorcentaje)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tasa de Asistencia Hoy
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {claseMasConcurrida}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clase Más Concurrida
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {oportunidadesVenta}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Oportunidades de Venta
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};
