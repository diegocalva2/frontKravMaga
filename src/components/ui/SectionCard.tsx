
import {
Box,
Paper,
Divider,
Typography,
} from "@mui/material";

export const SectionCard: React.FC<{
title: string;
subtitle?: string;
Icon?: React.ElementType;
children?: React.ReactNode;
}> = ({ title, subtitle, Icon, children }) => {
return (
<Paper elevation={2} sx={{ p: 2 }}>
<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
{Icon ? <Icon size={18} /> : null}
<Typography variant="h6" sx={{ fontWeight: 700 }}>
{title}
</Typography>
</Box>
{subtitle && (
<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
{subtitle}
</Typography>
)}
<Divider sx={{ mb: 1 }} />
<Box>{children}</Box>
</Paper>
);
};