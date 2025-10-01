import type { AlertItem } from "../types/dashboardTypes";
import {
Box,
Typography,
List,
ListItem,
ListItemText,
Chip
} from "@mui/material";

export const AlertsList: React.FC<{ items: AlertItem[] }> = ({ items }) => {
const renderChip = (dias: number) => {
if (dias < 0) return <Chip label="Vencido" color="error" size="small" />;
if (dias <= 3) return <Chip label={`Vence en ${dias} d`} color="error" size="small" />;
if (dias <= 7) return <Chip label={`Vence en ${dias} d`} color="warning" size="small" />;
return <Chip label={`Vence en ${dias} d`} color="primary" size="small" />;
};


return (
<List>
{items.map((it) => (
<ListItem key={it.id} sx={{ py: 1 }}>


<ListItemText
primary={<Typography sx={{ fontWeight: 700 }}>{it.nombre}</Typography>}
secondary={<Typography variant="caption">Plan: {it.plan}</Typography>}
/>
<Box sx={{ ml: 2 }}>{renderChip(it.diasParaVencer)}</Box>
</ListItem>
))}
</List>
);
};