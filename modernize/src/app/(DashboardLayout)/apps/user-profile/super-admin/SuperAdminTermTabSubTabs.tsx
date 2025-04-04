"use client";

import * as React from "react";
import { Box, Slider, TextField, Button, Typography, Stack, Alert, Snackbar, AlertProps, Card, CardContent, Grid } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';

const SuperAdminTermTabSubTab = () => {

  // fazer o get das configs


  const [diasMenosArteFinal, setDiasMenosArteFinal] = React.useState<number | null>(3);
  const [diasMenosImpressao, setDiasMenosImpressao] = React.useState<number | null>(2);
  const [diasMenosConfeccao, setDiasMenosConfeccao] = React.useState<number | null>(1);
  const [diasMenosExpedicao, setDiasMenosExpedicao] = React.useState<number | null>(0);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const handleSliderArteFinalChange = (event: Event, newValue: number | number[]) => {
    setDiasMenosArteFinal(newValue as number);
  };

  const handleSliderImpressaoChange = (event: Event, newValue: number | number[]) => {
    setDiasMenosImpressao(newValue as number);
  };

  const handleSliderConfeccaoChange = (event: Event, newValue: number | number[]) => {
    setDiasMenosConfeccao(newValue as number);
  };

  const handleSliderExpedicaoChange = (event: Event, newValue: number | number[]) => {
    setDiasMenosExpedicao(newValue as number);
  };

  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    console.log(`Reduzindo ${diasMenosArteFinal ?? 0} dias das datas de produção.`);
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
            dias_antecipa: diasMenosArteFinal
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
    <Box px={3}>
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

          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" p={3} mb={4}>
                <Box boxShadow={3} width={'60%'}>
                  <Typography variant="h4" color="primary.main" align="center" mb={1}>
                    Apenas para a tela de
                  </Typography>
                  <Typography variant="h5" color="primary.main" align="center" mb={3}>
                    Arte Final
                  </Typography>

                  <Grid container spacing={3} justifyContent="center" pb={3}>
                    <Grid item xs={12} sm={8}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexWrap="wrap"
                        textAlign="center"
                      >
                        <Stack spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: '40%' } }}>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6" mr={1}>
                              Dias a subtrair:
                            </Typography>
                            <Typography variant="h6">{diasMenosArteFinal ?? 0}</Typography>
                          </Box>
                        </Stack>
                        <Box
                          sx={{
                            width: { xs: '100%', sm: '65%' },
                            mt: { xs: 3, sm: 0 },
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Slider
                            value={diasMenosArteFinal ?? 0}
                            onChange={handleSliderArteFinalChange}
                            min={0}
                            max={15}
                            step={1}
                            marks
                            sx={{
                              width: '100%',
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
                                mt: 1,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {/* impressão */}
              <Box display="flex" flexDirection="column" alignItems="center" p={3} my={4}>
                <Box boxShadow={3} width={'60%'}>
                  <Typography variant="h4" color="primary.main" align="center" mb={1}>
                    Apenas para a tela de
                  </Typography>
                  <Typography variant="h5" color="primary.main" align="center" mb={3}>
                    Impressão
                  </Typography>
                  <Grid container spacing={3} justifyContent="center" pb={3}>
                    <Grid item xs={12} sm={8}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexWrap="wrap"
                        textAlign="center"
                      >
                        <Stack spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: '40%' } }}>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6" mr={1}>
                              Dias a subtrair:
                            </Typography>
                            <Typography variant="h6">{diasMenosImpressao ?? 0}</Typography>
                          </Box>
                        </Stack>

                        <Box
                          sx={{
                            width: { xs: '100%', sm: '65%' },
                            mt: { xs: 3, sm: 0 },
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Slider
                            value={diasMenosImpressao ?? 0}
                            onChange={handleSliderImpressaoChange}
                            min={0}
                            max={15}
                            step={1}
                            marks
                            sx={{
                              width: '100%',
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
                                mt: 1,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              {/* Confeçção */}
              <Box display="flex" flexDirection="column" alignItems="center" p={3} my={4}>
                <Box boxShadow={3} width={'60%'}>
                  <Typography variant="h4" color="primary.main" align="center" mb={1}>
                    Apenas para a tela de
                  </Typography>
                  <Typography variant="h5" color="primary.main" align="center" mb={3}>
                    Confecção
                  </Typography>
                  <Grid container spacing={3} justifyContent="center" pb={3}>
                    <Grid item xs={12} sm={8}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexWrap="wrap"
                        textAlign="center"
                      >
                        <Stack spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: '40%' } }}>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6" mr={1}>
                              Dias a subtrair:
                            </Typography>
                            <Typography variant="h6">{diasMenosConfeccao ?? 0}</Typography>
                          </Box>
                        </Stack>
                        <Box
                          sx={{
                            width: { xs: '100%', sm: '65%' },
                            mt: { xs: 3, sm: 0 },
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Slider
                            value={diasMenosConfeccao ?? 0}
                            onChange={handleSliderConfeccaoChange}
                            min={0}
                            max={15}
                            step={1}
                            marks
                            sx={{
                              width: '100%',
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
                                mt: 1,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              {/* Expedição */}
              <Box display="flex" flexDirection="column" alignItems="center" p={3} my={4}>
                <Box boxShadow={3} width={'60%'}>
                  <Typography variant="h4" color="primary.main" align="center" mb={1}>
                    Apenas para a tela de
                  </Typography>
                  <Typography variant="h5" color="primary.main" align="center" mb={3}>
                    Expedição
                  </Typography>
                  <Grid container spacing={3} justifyContent="center" pb={3}>
                    <Grid item xs={12} sm={8}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexWrap="wrap"
                        textAlign="center"
                      >
                        <Stack spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: '40%' } }}>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6" mr={1}>
                              Dias a subtrair:
                            </Typography>
                            <Typography variant="h6">{diasMenosExpedicao ?? 0}</Typography>
                          </Box>
                        </Stack>
                        <Box
                          sx={{
                            width: { xs: '100%', sm: '65%' },
                            mt: { xs: 3, sm: 0 },
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Slider
                            value={diasMenosExpedicao ?? 0}
                            onChange={handleSliderExpedicaoChange}
                            min={0}
                            max={15}
                            step={1}
                            marks
                            sx={{
                              width: '100%',
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
                                mt: 1,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Grid item xs={12} mt={3} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    width: '50%',
                    px: 2,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}
                >
                  Salvar Ajustes
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
