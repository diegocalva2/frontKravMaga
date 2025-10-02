import React, { useState } from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";
import { AlertContext } from "./AlertContext";

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; type: AlertColor } | null>(null);

  const showAlert = (message: string, type: AlertColor = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
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