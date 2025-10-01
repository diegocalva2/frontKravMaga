
import {
Box,
Card,
CardContent,
Typography,
} from "@mui/material";

export const StatusCard: React.FC<{
title: string;
value: string | number | React.ReactNode;
Icon?: React.ElementType;
color?: string; // color para borde izquierdo
}> = ({ title, value, Icon, color = "#1976d2" }) => {
return (
<Card
elevation={3}
sx={{ borderLeft: `4px solid ${color}`, minHeight: 110 }}
>
<CardContent sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
<Box>
<Typography variant="caption" color="text.secondary">
{title}
</Typography>
<Typography variant="h4" component="div" sx={{ mt: 0.5, fontWeight: 700 }}>
{value}
</Typography>
</Box>
<Box sx={{ display: "flex", alignItems: "center" }}>
{Icon ? <Icon size={28} /> : null}
</Box>
</CardContent>
</Card>
);
};