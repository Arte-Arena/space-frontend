"use client";

import React, { useEffect } from "react";
import { Button, Typography, AlertProps, Box, Alert, Snackbar } from "@mui/material";
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

const SuperAdminTermTabSubTab = () => {

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
  
  // fazer o get das configs
  // /super-admin/get-dias-antecipa-producao

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-config-prazos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching configurations: ${response.status}`);
        }

        const data = await response.json();
        setDiasMenosArteFinal(data.dias_antecipa_producao_arte_final);
        setDiasMenosImpressao(data.dias_antecipa_producao_impressao);
        setDiasMenosConfeccaoSublimacao(data.dias_antecipa_producao_confeccao_sublimacao);
        setDiasMenosConfeccaoCostura(data.dias_antecipa_producao_confeccao_costura);

      } catch (error) {
        console.error('Error:', (error as Error).message);
        alert('Falha ao buscar as configurações. (1)');
      }
    };

    fetchConfig();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {

    const bodyData = {
      'dias_antecipa_producao_arte_final': diasMenosArteFinal,
      'dias_antecipa_producao_impressao': diasMenosImpressao,
      'dias_antecipa_producao_confeccao_sublimacao': diasMenosConfeccaoSublimacao,
      'dias_antecipa_producao_confeccao_costura': diasMenosConfeccaoCostura,
    };

    console.log('bodyData: ', bodyData);

    try {

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Usuário não autenticado.");
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/super-admin/upsert-config-prazos`,
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
          message: 'Dias de antecipação atualizados com sucesso!',
          severity: 'success'
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao atualizar dias de antecipação (1)');
      }

    } catch (err) {
      console.log(err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Ocorreu um erro inesperado (1)',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ width: "80%", margin: '0 auto' }}>
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
            onChange={(e: { target: { value: Number; }; }) => setDiasMenosArteFinal(Number(e.target.value))}
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
            onChange={(e: { target: { value: Number; }; }) => setDiasMenosImpressao(Number(e.target.value))}
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
            onChange={(e: { target: { value: Number; }; }) => setDiasMenosConfeccaoSublimacao(Number(e.target.value))}
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
            onChange={(e: { target: { value: Number; }; }) => setDiasMenosConfeccaoCostura(Number(e.target.value))}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button variant="contained" onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(4px)',
            backgroundColor: snackbar.severity === 'success'
              ? 'rgba(46, 125, 50, 0.9)'
              : 'rgba(211, 47, 47, 0.9)'
          }
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={false}
          sx={{
            width: '100%',
            alignItems: 'center',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'common.white',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
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
