"use client";

import * as React from "react";
import { Box, Slider, TextField, Button, Typography, Stack, Alert, Snackbar, AlertProps, Card, CardContent, Grid } from "@mui/material";
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


  const handleSliderChange1 = (event: Event, newValue: number | number[]) => {
    setDiasMenos(newValue as number);
  };

  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <Box p={3}>
      <Grid container direction="column" spacing={0}>
        <Grid item display={'flex'} direction={'column'} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h2" gutterBottom sx={{
            color: 'primary.main',
            fontWeight: 700,
            mb: 1,
            textAlign: 'center'
          }}>
            Ajustar Redução de Dias na Produção
          </Typography>

          {/* card 1 */}
          <Card
            sx={{ width: "50%", mb: 2, borderRadius: 2, boxShadow: 3 }}
          >
            <CardContent>

              <Typography variant="h3" color="primary.main" align="center" marginBottom={1}>
                Apenas para a tela de
              </Typography>
              <Typography variant="h5" color="primary.main" align="center" marginBottom={3}>
                Arte Final
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* Stack 1: Informativo */}
                <Stack spacing={1} sx={{ flex: 1, width: '30%' }}>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    Ajustar Produção
                  </Typography>
                  <Box display={'flex'} alignItems='center'>
                    <Typography variant="h6" marginRight={1}>
                      Dias a subtrair:
                    </Typography>
                    <Typography variant="h6">{diasMenos}</Typography>
                  </Box>
                </Stack>

                {/* Stack 2: Slider */}
                <Box sx={{ width: '65%', height: '100%' }}>
                  <Slider
                    value={diasMenos}
                    onChange={handleSliderChange1}
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
              </Box>
              <Grid item sx={{ mt: 4 }}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                  }}
                >
                  Salvar Ajuste
                </Button>
              </Grid>
            </CardContent>
          </Card>

          {/* card 2 */}
          <Card
            sx={{ width: "50%", mb: 2, borderRadius: 2, boxShadow: 3 }}
          >
            <CardContent>

              <Typography variant="h3" color="primary.main" align="center" marginBottom={1}>
                Apenas para a tela de
              </Typography>
              <Typography variant="h5" color="primary.main" align="center" marginBottom={3}>
                Impressão
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* Stack 1: Informativo */}
                <Stack spacing={1} sx={{ flex: 1, width: '30%' }}>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    Ajustar Produção
                  </Typography>
                  <Box display={'flex'} alignItems='center'>
                    <Typography variant="h6" marginRight={1}>
                      Dias a subtrair:
                    </Typography>
                    <Typography variant="h6">{diasMenos}</Typography>
                  </Box>
                </Stack>

                {/* Stack 2: Slider */}
                <Box sx={{ width: '65%', height: '100%' }}>
                  <Slider
                    value={diasMenos}
                    onChange={handleSliderChange1}
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
              </Box>
              <Grid item sx={{ mt: 4 }}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                  }}
                >
                  Salvar Ajuste
                </Button>
              </Grid>
            </CardContent>
          </Card>

          {/* card 3 */}
          <Card
            sx={{ width: "50%", mb: 2, borderRadius: 2, boxShadow: 3 }}
          >
            <CardContent>

              <Typography variant="h3" color="primary.main" align="center" marginBottom={1}>
                Apenas para a tela de
              </Typography>
              <Typography variant="h5" color="primary.main" align="center" marginBottom={3}>
                Confecção
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* Stack 1: Informativo */}
                <Stack spacing={1} sx={{ flex: 1, width: '30%' }}>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    Ajustar Produção
                  </Typography>
                  <Box display={'flex'} alignItems='center'>
                    <Typography variant="h6" marginRight={1}>
                      Dias a subtrair:
                    </Typography>
                    <Typography variant="h6">{diasMenos}</Typography>
                  </Box>
                </Stack>

                {/* Stack 2: Slider */}
                <Box sx={{ width: '65%', height: '100%' }}>
                  <Slider
                    value={diasMenos}
                    onChange={handleSliderChange1}
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
              </Box>
              <Grid item sx={{ mt: 4 }}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                  }}
                >
                  Salvar Ajuste
                </Button>
              </Grid>
            </CardContent>
          </Card>

          {/* card 4 */}
          <Card
            sx={{ width: "50%", mb: 2, borderRadius: 2, boxShadow: 3 }}
          >
            <CardContent>

              <Typography variant="h3" color="primary.main" align="center" marginBottom={1}>
                Apenas para a tela de
              </Typography>
              <Typography variant="h5" color="primary.main" align="center" marginBottom={3}>
                Expedição
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* Stack 1: Informativo */}
                <Stack spacing={1} sx={{ flex: 1, width: '30%' }}>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    Ajustar Produção
                  </Typography>
                  <Box display={'flex'} alignItems='center'>
                    <Typography variant="h6" marginRight={1}>
                      Dias a subtrair:
                    </Typography>
                    <Typography variant="h6">{diasMenos}</Typography>
                  </Box>
                </Stack>

                {/* Stack 2: Slider */}
                <Box sx={{ width: '65%', height: '100%' }}>
                  <Slider
                    value={diasMenos}
                    onChange={handleSliderChange1}
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
              </Box>
              <Grid item sx={{ mt: 4 }}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                  }}
                >
                  Salvar Ajuste
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </Box>
  );
};

export default SuperAdminTermTabSubTab;
