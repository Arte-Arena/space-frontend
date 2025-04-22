'use client';
import React, { useState } from 'react';
import {
  Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Button,
  SelectChangeEvent,
  TextField,
  AlertProps,
  Alert,
  Snackbar
} from '@mui/material';
import { IconFileTypePng, IconFileTypePdf } from '@tabler/icons-react';
import esbocoUniformeFormatarPNG from './components/uniformeFormatarPNG';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

const GeradorUniformeScreen = () => {
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [form, setForm] = useState({
    id: '',
    gola: '',
    composicao: '',
    logoTotem: '',
    estampa: '',
    escudo: '',
    opcao: '',
  });

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleExportPNG = () => {
    const camposObrigatorios = [
      { nome: 'id', label: 'ID' },
      { nome: 'opcao', label: 'Opção' },
      { nome: 'gola', label: 'Gola' },
      { nome: 'composicao', label: 'Composição' },
      { nome: 'logoTotem', label: 'Logo Totem' },
      { nome: 'estampa', label: 'Estampa' },
      { nome: 'escudo', label: 'Escudo' },
    ];
    for (const campo of camposObrigatorios) {
      if (!form[campo.nome as keyof typeof form]) {
        setSnackbar({
          open: true,
          message: `Preencha o campo ${campo.label}`,
          severity: 'error',
        });
        return;
      }
    }

    esbocoUniformeFormatarPNG(form);

    setSnackbar({
      open: true,
      message: 'PNG gerado com sucesso!',
      severity: 'success',
    });

  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/apps/produção/",
      title: "produção",
    },
    {
      to: "/apps/produção/pedidos",
      title: "Pedidos",
    },
  ];

  return (
    <PageContainer title="Esboço / Uniforme" description="Tela de Esboço dos Uniformes | Design">
      <Breadcrumb title="Design / Esboço - Uniforme" items={BCrumb} />
      <ParentCard title="Uniforme" >
        <Box p={4} maxWidth={'85%'} mx="auto">

          <Typography variant="h4" fontWeight="bold" color="orange" gutterBottom>
            UNIFORME <span style={{ color: 'white' }}>PROFISSIONAL</span>
          </Typography>

          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                onChange={handleTextFieldChange}
                label="ID"
                name="id"
                fullWidth
                value={form.id}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Opção"
                name="opcao"
                fullWidth
                value={form.opcao}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>Gola</InputLabel>
                <Select name="gola" value={form.gola} onChange={handleChange} label="Gola">
                  <MenuItem value="Bayard">Bayard</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Composição</InputLabel>
                <Select name="composicao" value={form.composicao} onChange={handleChange} label="Composição">
                  <MenuItem value="Dry SP">Dry SP</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Logo Totem</InputLabel>
                <Select name="logoTotem" value={form.logoTotem} onChange={handleChange} label="Logo Totem">
                  <MenuItem value="Patch 3D">Patch 3D</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estampa</InputLabel>
                <Select name="estampa" value={form.estampa} onChange={handleChange} label="Estampa">
                  <MenuItem value="Sublimada">Sublimada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Escudo</InputLabel>
                <Select name="escudo" value={form.escudo} onChange={handleChange} label="Escudo">
                  <MenuItem value="Patch 3D">Patch 3D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box display="flex" gap={2} mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExportPNG}
              startIcon={<IconFileTypePng />}
            >
              Exportar PNG
            </Button>
          </Box>

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
        </Box >
      </ParentCard>
    </PageContainer>
  );
};

export default GeradorUniformeScreen;