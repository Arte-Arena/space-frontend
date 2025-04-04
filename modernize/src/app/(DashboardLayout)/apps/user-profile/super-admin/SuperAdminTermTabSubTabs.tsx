"use client";

import * as React from "react";
import { Button, Typography, AlertProps, Box} from "@mui/material";
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

const SuperAdminTermTabSubTab = () => {

  // fazer o get das configs


  const [diasMenosArteFinal, setDiasMenosArteFinal] = React.useState<number | null>(3);
  const [diasMenosImpressao, setDiasMenosImpressao] = React.useState<number | null>(2);
  const [diasMenosConfeccaoCostura, setDiasMenosConfeccaoCostura] = React.useState<number | null>(1);
  const [diasMenosConfeccaoSublimacao, setDiasMenosConfeccaoSublimacao] = React.useState<number | null>(1);
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

  const handleSliderConfeccaoSublimacaoChange = (event: Event, newValue: number | number[]) => {
    setDiasMenosConfeccaoSublimacao(newValue as number);
  };

  const handleSliderConfeccaoCosturaChange = (event: Event, newValue: number | number[]) => {
    setDiasMenosConfeccaoCostura(newValue as number);
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
        dias_antecipa_producao_arte_final: diasMenosArteFinal,
        dias_antecipa_producao_impressao: diasMenosImpressao,
        dias_antecipa_producao_confeccao_sublimacao: diasMenosConfeccaoSublimacao,
        dias_antecipa_producao_confeccao_costura: diasMenosConfeccaoCostura
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
            id="arte-final"
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
            id="impressao"
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
            Dias a menos Prazo de Confecção Sublimação
          </CustomFormLabel>
          <CustomTextField
            id="confeccao-sublimacao"
            variant="outlined"
            fullWidth
            value={diasMenosConfeccaoSublimacao}
            onChange={handleSliderConfeccaoSublimacaoChange}
          />

          <CustomFormLabel
            sx={{
              mt: 0,
            }}
          >
            Dias a menos Prazo de Confecção Costura
          </CustomFormLabel>
          <CustomTextField
            id="conefccao-costura"
            variant="outlined"
            fullWidth
            value={diasMenosConfeccaoCostura}
            onChange={handleSliderConfeccaoCosturaChange}
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
