export interface Metrics {
  alumnosActivos: number;
  vencen7dias: number;
  ventasHoy: number;
  stockBajo: number;
}

export interface AlertItem {
  id: string;
  nombre: string;
  plan: string;
  diasParaVencer: number; // negativo = vencido
}

export interface InventoryItem {
  id: string | number;
  nombre: string;
  stock: number;
}

export interface OperationSummaryData {
  asistenciaPorcentaje: number; // 0-100
  claseMasConcurrida: string;
  oportunidadesVenta: number;
}