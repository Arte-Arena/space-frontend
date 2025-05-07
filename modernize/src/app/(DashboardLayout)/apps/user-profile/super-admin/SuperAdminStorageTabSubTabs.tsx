"use client";
import React, { useEffect } from "react";
import {
  Button,
  Typography,
  AlertProps,
  Box,
  Alert,
  Snackbar,
  FormControlLabel,
  Divider,
  Stack,
} from "@mui/material";
import CustomStyledSwitch from "@/app/components/switch/switch";

const SuperAdminStorageTabSubTab = () => {
  const [subtrairAutomaticamente, setSubtrairAutomaticamente] =
    React.useState<boolean>(false);

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps["severity"];
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/super-admin/get-config-estoque`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          }
        );

        if (!response.ok)
          throw new Error(`Erro ao buscar configurações: ${response.status}`);

        const data = await response.json();
        console.log(data);
        setSubtrairAutomaticamente(
          data.estoque &&
            Object.prototype.hasOwnProperty.call(
              data.estoque,
              "subtrairAutomaticamente"
            )
            ? data.estoque.subtrairAutomaticamente === true
            : false
        );
      } catch (error) {
        console.error("Error:", (error as Error).message);
      }
    };

    fetchConfig();
  }, []);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleSave = async () => {
    const bodyData = {
      estoque: { subtrairAutomaticamente },
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Usuário não autenticado.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/super-admin/upsert-config-estoque`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Configurações salvas com sucesso!",
          severity: "success",
        });
      } else {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Erro ao salvar configurações (1)"
        );
      }
    } catch (err) {
      console.log(err);
      setSnackbar({
        open: true,
        message:
          err instanceof Error ? err.message : "Erro inesperado ao salvar (1)",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "0 auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "text.main", fontWeight: 600, m: 4, textAlign: "center" }}
      >
        Subtrair estoque automaticamente na impressão
      </Typography>
      <Divider sx={{ margin: "20px 200px" }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <FormControlLabel
          control={
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography>Desligado</Typography>
              <CustomStyledSwitch
                checked={subtrairAutomaticamente}
                onChange={(e) => {
                  setSubtrairAutomaticamente(e.target.checked);
                  // console.log(e.target.checked)
                }}
              />
              <Typography>Ligado</Typography>
            </Stack>
          }
          label=""
        />

        <Box sx={{ marginTop: "20px" }}>
          <Button variant="contained" onClick={handleSave}>
            Salvar Configurações
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(4px)",
            backgroundColor:
              snackbar.severity === "success"
                ? "rgba(46, 125, 50, 0.9)"
                : "rgba(211, 47, 47, 0.9)",
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={false}
          sx={{
            width: "100%",
            alignItems: "center",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "common.white",
            "& .MuiAlert-message": {
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuperAdminStorageTabSubTab;
