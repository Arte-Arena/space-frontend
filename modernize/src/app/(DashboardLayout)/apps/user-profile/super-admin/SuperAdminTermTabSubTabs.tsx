"use client";

import * as React from "react";
import { Box, Slider, TextField, Button, Typography, Stack, Alert, Snackbar, AlertProps } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';

const SuperAdminTermTabSubTab = () => {
  const [diasMenos, setDiasMenos] = React.useState(5);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });


  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setDiasMenos(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(Number(event.target.value), 1), 30);
    setDiasMenos(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    console.log(`Reduzindo ${diasMenos} dias das datas de produção.`);
    try {

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Usuário não autenticado.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/super-admin/update-dias-antecipa-producao`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            dias_antecipa: diasMenos
          }),
        }
      );

      if (res.ok) {
        setSnackbar({
          open: true,
          message: 'Dias de antecipação atualizados com sucesso!',
          severity: 'success'
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao atualizar dias de antecipação');
      }

    } catch (err) {
      console.log(err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Ocorreu um erro inesperado',
        severity: 'error'
      });
    }
  };

  return (
    <>
      <ChildCard>
        <Box p={3} sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <Typography variant="h5" gutterBottom sx={{
            color: 'primary.main',
            fontWeight: 600,
            mb: 1,
            textAlign: 'center'
          }}>
            Ajustar Redução de Dias na Produção
          </Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 0 }}>
            Apenas para as telas de
          </Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            Arte-Final | Impressão | Confecção
          </Typography>


          <Stack spacing={3}>
            <Box sx={{ px: 2 }}>
              <Slider
                value={diasMenos}
                onChange={handleSliderChange}
                min={1}
                max={15}
                step={1}
                marks
                sx={{
                  color: 'primary.main',
                  height: 8,
                  '& .MuiSlider-thumb': {
                    width: 24,
                    height: 24,
                    backgroundColor: '#fff',
                    border: '3px solid currentColor',
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(100, 108, 255, 0.16)',
                    },
                  },
                  '& .MuiSlider-valueLabel': {
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'common.white',
                    backgroundColor: 'primary.main',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    '&:before': {
                      display: 'none',
                    },
                  },
                  '& .MuiSlider-markLabel': {
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    mt: 1
                  }
                }}
              />
            </Box>

            <CustomTextField
              label="Dias a Subtrair"
              type="number"
              value={diasMenos}
              onChange={handleInputChange}
              inputProps={{
                min: 0,
                max: 15,
                step: 1,
                style: { textAlign: 'center' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 2
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'secondary.main'
                },
                MozAppearance: 'textfield'
              }}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                backgroundColor: 'primary.main',
                color: 'common.white',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: '0 4px 12px rgba(100, 108, 255, 0.3)'
                }
              }}
            >
              Salvar Ajuste
            </Button>
          </Stack>
        </Box>
      </ChildCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            alignItems: 'center',
            fontSize: '0.875rem',
            fontWeight: 500,
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SuperAdminTermTabSubTab;
