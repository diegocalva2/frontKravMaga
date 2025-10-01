import type { InventoryItem } from "../types/dashboardTypes";
import {
List,
ListItem,
ListItemText,
Chip,

} from "@mui/material";

export const InventoryList: React.FC<{ items: InventoryItem[] }> = ({ items }) => {
return (
<List>
{items.map((it) => (
<ListItem key={String(it.id)} sx={{ py: 0.5 }}>
<ListItemText primary={it.nombre} />
<Chip
label={`Stock: ${it.stock}`}
size="small"
color={it.stock <= 2 ? "error" : it.stock <= 5 ? "warning" : "default"}
/>
</ListItem>
))}
</List>
);
};