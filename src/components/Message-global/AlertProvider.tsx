import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";

type AlertContextType = {
  showAlert: (message: string, type?: AlertColor) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe usarse dentro de un AlertProvider");
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; type: AlertColor } | null>(null);

  const showAlert = (message: string, type: AlertColor = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Snackbar global */}
      {alert && (
        <Snackbar
          open={!!alert}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={5000}
          onClose={() => setAlert(null)}
        >
          <Alert onClose={() => setAlert(null)} severity={alert.type} variant="filled">
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </AlertContext.Provider>
  );
};