"use client";

import * as React from "react";
import { Button, Typography, AlertProps, Box} from "@mui/material";
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

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

      const payload = {
        dias_antecipa_arte_final: diasMenosArteFinal,
        dias_antecipa_impressao: diasMenosImpressao,
        dias_antecipa_confeccao: diasMenosConfeccao,
        dias_antecipa_expedicao: diasMenosExpedicao
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/super-admin/update-dias-antecipa-producao`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            payload
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
    <Box sx={{width:"80%", margin: '0 auto'}}>
      <div style={{ marginTop: '20px' }}>

        <Typography variant="h4" gutterBottom sx={{
          color: 'text.main',
          fontWeight: 600,
          m: 4,
          textAlign: 'center'
        }}>
          Ajustar Redução de Dias na Produção
        </Typography>

        <div>
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            >
            Dias a menos Prazo de Arte Final
          </CustomFormLabel>
          <CustomTextField
            autoFocus
            id="custo-tecido"
            variant="outlined"
            fullWidth
            value={diasMenosArteFinal}
            onChange={handleSliderArteFinalChange}
          />

          <CustomFormLabel
            sx={{
              mt: 0,
            }}
          >
            Dias a menos Prazo de Impressao
          </CustomFormLabel>
          <CustomTextField
            id="custo-papel"
            variant="outlined"
            fullWidth
            value={diasMenosImpressao}
            onChange={handleSliderImpressaoChange}
          />

          <CustomFormLabel
            sx={{
              mt: 0,
            }}
          >
            Dias a menos Prazo de Confecção
          </CustomFormLabel>
          <CustomTextField
            id="custo-imposto"
            variant="outlined"
            fullWidth
            value={diasMenosConfeccao}
            onChange={handleSliderConfeccaoChange}
          />

          <CustomFormLabel
            sx={{
              mt: 0,
            }}
          >
            Dias a menos Prazo de Expedição
          </CustomFormLabel>
          <CustomTextField
            id="custo-imposto"
            variant="outlined"
            fullWidth
            value={diasMenosExpedicao}
            onChange={handleSliderExpedicaoChange}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button variant="contained" onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>
    </Box>
  );
};

export default SuperAdminTermTabSubTab;
