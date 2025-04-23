'use client';
import React, { useEffect, useState } from 'react';
import {
  Box, TextField, MenuItem, FormControlLabel, Checkbox, Typography, Grid, Select, InputLabel, FormControl,
  ListItemText,
  Button,
  AlertProps,
  Alert,
  Snackbar
} from '@mui/material';
import { IconFileTypePng } from '@tabler/icons-react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import esbocoFormatarPNG from './components/esbocoFormatarPNG';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

const produtos = [
  "Almofada", "Almofada de pescoço", "Balaclava*", "Bandana", "Bandeira",
  "Bandeira de Carro", "Bandeira de Mesa", "Bandeira Oficial", "Bandeira Política", "Bandeira de Mão",
  "Bolachão", "Braçadeira", "Cachecol", "Camisão*", "Caneca Alumínio*", "Caneca Porcelana*",
  "Canga*", "Capa de Barbeiro", "Chinelo de Dedo", "Chinelo Slide", "Chaveiro", "Estandarte",
  "Faixa de Campeão*", "Faixa de Mão", "Flâmula", "Mouse Pad*", "Sacochila", "Shorts Praia",
  "Shorts Doll", "Tirante", "Toalha", "Windbanner"
];

const GeradorDeEsbocoScreen = () => {
  const [allMateriais, setAllMateriais] = useState<string[]>([]);
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
    produto: '',
    altura: '',
    largura: '',
    ilhoses: false,
    qtdIlhoses: '',
    bordaMastro: false,
    composicao: '',
    duplaFace: false,
    material: '',
    opcao: '',
  });

  const materiais = localStorage.getItem('materiais');

  useEffect(() => {
    if (materiais) {
      try {
        const materiaisArray = JSON.parse(materiais);
        if (Array.isArray(materiaisArray)) {
          const materialNames = materiaisArray.map((material) => material.descricao);
          setAllMateriais(materialNames);
        } else {
          console.error('Dados inválidos recebidos de materiais:', materiaisArray);
        }
      } catch (error) {
        console.error('Erro ao analisar JSON de materiais:', error);
      }
    } else {
      console.warn('Os dados de materiais não foram encontrados.');
    }
  }, [materiais]);

  useEffect(() => {
    const alturaM = parseFloat(form.altura || '0');
    const larguraM = parseFloat(form.largura || '0');
  
    const maior = Math.max(alturaM, larguraM);
    const menor = Math.min(alturaM, larguraM);
  
    if (form.ilhoses && alturaM && larguraM) {
      const ilhosesMaior = (Math.ceil(maior) + 1) * 2;
      const ilhosesMenor = Math.max(0, (Math.ceil(menor) - 2)) * 2;
      const totalIlhoses = ilhosesMaior + ilhosesMenor + 2;
  
      setForm(prev => ({ ...prev, qtdIlhoses: totalIlhoses.toString() }));
    }
  }, [form.altura, form.largura, form.ilhoses]);


  useEffect(() => {
    const alturaM = parseFloat(form.altura || '0');
    const larguraM = parseFloat(form.largura || '0');
  
    const maior = Math.max(alturaM, larguraM);
    const menor = Math.min(alturaM, larguraM);
  
    // Cálculo da composição
    if (menor >= 1.5) {
      const partes = Math.ceil(menor / 1.5);
      setForm(prev => ({ ...prev, composicao: `${partes} Partes` }));
    } else {
      setForm(prev => ({ ...prev, composicao: '' }));
    }
  }, [form.altura, form.largura]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleExportToPNG = () => {
    if (!form.id.trim()) {
      setSnackbar({
        open: true,
        message: 'Informe o ID do pedido',
        severity: 'error'
      });
      return;
    }

    if (!form.produto.trim()) {
      setSnackbar({
        open: true,
        message: 'Informe o produto',
        severity: 'error'
      });
      return;
    }

    if (!form.altura.trim()) {
      setSnackbar({
        open: true,
        message: 'Informe a altura',
        severity: 'error'
      });
      return;
    }

    if (!form.largura.trim()) {
      setSnackbar({
        open: true,
        message: 'Informe a largura',
        severity: 'error'
      });
      return;
    }

    if (form.ilhoses && !form.qtdIlhoses.trim()) {
      setSnackbar({
        open: true,
        message: 'Informe a quantidade de ilhoses',
        severity: 'error'
      });
      return;
    }

    if (!form.material.trim()) {
      setSnackbar({
        open: true,
        message: 'Informe o material',
        severity: 'error'
      });
      return;
    }

    // ✅ Se tudo estiver certo: gera o PNG e exibe snackbar de sucesso
    esbocoFormatarPNG(form);
    setSnackbar({
      open: true,
      message: 'PNG gerado com sucesso!',
      severity: 'success'
    });
  };

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/apps/producao/arte-final",
      title: "produção",
    },
    {
      to: "/apps/producao/pedidos",
      title: "Pedidos",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const isBandeira = form.produto.toLowerCase().includes('bandeira');

  return (
    <PageContainer title="Esboço / Produtos" description="Tela de Esboço dos Produtos | Design">
      <Breadcrumb title="Design / Esboço - Produtos" items={BCrumb} />
      <ParentCard title="Esboço">
        <Box p={4} maxWidth={'85%'} mx="auto">

          <Typography sx={{ mb: "2em" }} variant="h4" fontWeight="bold" color="orange" gutterBottom>
            ESBOÇO <span style={{ color: 'white' }}>PROFISSIONAL</span>
          </Typography>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="ID"
                name="id"
                fullWidth
                value={form.id}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Produto</InputLabel>
                <Select
                  name="produto"
                  value={form.produto}
                  onChange={(e) => setForm(prev => ({ ...prev, produto: e.target.value }))}
                  label="Produto"
                >
                  {produtos.map((produto, index) => (
                    <MenuItem key={index} value={produto}>
                      {produto}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Material</InputLabel>
                <Select
                  name="material"
                  value={form.material}
                  label="Material"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, material: e.target.value }))
                  }
                >
                  {allMateriais.map((material) => (
                    <MenuItem key={material} value={material}>
                      <ListItemText primary={material} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Linha 2 */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Altura (m)"
                name="altura"
                type="number"
                fullWidth
                value={form.altura}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Largura (m)"
                name="largura"
                type="number"
                fullWidth
                value={form.largura}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Composição"
                name="composicao"
                fullWidth
                value={form.composicao}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Linha 3 */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Opção"
                name="opcao"
                fullWidth
                value={form.opcao}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="bordaMastro"
                    checked={form.bordaMastro}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Borda Mastro"
              />
            </Grid>

            {isBandeira && (
              <Grid item xs={12} sm={3}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="ilhoses"
                        checked={form.ilhoses}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Ilhóses"
                  />
                  {form.ilhoses && (
                    <TextField
                      label="Quantidade"
                      name="qtdIlhoses"
                      type="number"
                      size="small"
                      sx={{
                        width: '100px',
                        marginLeft: '10px',
                        'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0
                        },
                        'input[type=number]': {
                          MozAppearance: 'textfield'
                        }
                      }}
                      InputProps={{ inputProps: { min: 0, step: 1 } }}
                      value={form.qtdIlhoses}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </Grid>
            )}

            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="duplaFace"
                    checked={form.duplaFace}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Dupla Face"
              />
            </Grid>
          </Grid>
          <Box display="flex" alignItems="center" gap={2} mt={3}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleExportToPNG}
              startIcon={<IconFileTypePng />}
            >
              Exportar para PNG
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
        </Box>
      </ParentCard>
    </PageContainer>
  );
}

export default GeradorDeEsbocoScreen;