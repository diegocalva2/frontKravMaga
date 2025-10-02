import { createContext } from "react";
import { type AlertColor } from "@mui/material";

type AlertContextType = {
    showAlert: (message: string, type?: AlertColor) => void;
};

export const AlertContext = createContext<AlertContextType | undefined>(undefined);