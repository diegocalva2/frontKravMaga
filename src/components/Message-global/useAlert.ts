import { useContext } from "react";
import { AlertContext } from "./AlertContext";

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert debe usarse dentro de un AlertProvider");
    }
    return context;
};