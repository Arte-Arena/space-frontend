'use client';
import React, { useEffect, useState } from 'react';
import {
  Box, TextField, MenuItem, FormControlLabel, Checkbox, Typography, Grid, Select, InputLabel, FormControl,
  Button,
  AlertProps,
  Alert,
  Snackbar,
  LinearProgress,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { IconFileTypePng } from '@tabler/icons-react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import esbocoFormatarPNG from './components/esbocoFormatarPNG';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import FormBandeira from './components/forms/Bandeiras/formBandeiraOfficial';
import { FormState } from './components/types';
import FormBandeiraCarro from './components/forms/Bandeiras/formBandeiraCarro';
import FormAlmofada from './components/forms/Bandeiras/formAlmofada';
import FormAlmofadaPescoco from './components/forms/Bandeiras/formAlmofadaPescoco';
import FormBandana from './components/forms/Bandeiras/formBandana';
import FormBandeiraMesa from './components/forms/Bandeiras/formBandeiraMesa';
import FormBandeiraPolitica from './components/forms/Bandeiras/formBandeiraPolitica';
import FormBolacao from './components/forms/Bandeiras/FormBolacao';
import FormBracadeirasCap from './components/forms/Bandeiras/FormBracadeirasCap';
import FormCachecol from './components/forms/Bandeiras/FormCachecol';
import FormularioTresAtributos from './components/forms/Bandeiras/Form3Atributos';
import FormularioQuatroAtributos from './components/forms/Bandeiras/Form4Atributos';
import FormChineloShorts from './components/forms/Bandeiras/FormChineloShorts';

const produtos = [
  "Almofada", "Almofada de pescoço", "Balaclava*", "Bandana", "Bandeira",
  "Bandeira de Carro", "Bandeira de Mesa", "Bandeira Oficial", "Bandeira Política", "Bandeira de Mão",
  "Bolachão", "Braçadeira", "Cachecol", "Camisão*", "Caneca Alumínio*", "Caneca Porcelana*",
  "Canga*", "Capa de Barbeiro", "Chinelo de Dedo", "Chinelo Slide", "Chaveiro", "Estandarte",
  "Faixa de Campeão*", "Faixa de Mão", "Flâmula", "Mouse Pad*", "Sacochila", "Shorts Praia",
  "Shorts Doll", "Tirante", "Toalha", "Windbanner"
];

const GeradorDeEsbocoScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [form, setForm] = useState<FormState>({
    id: '',
    produto: '',
    dimensao: '',
    altura: '',
    largura: '',
    material: '',
    ilhoses: false,
    qtdIlhoses: '',
    bordaMastro: false,
    composicao: '',
    duplaFace: false,
    materialHaste: '',
    qntHastes: '',
    modelo: '',
    haste: '',
    franja: '',
    estampa: '',
    fechamento: '',
    corSolado: '',
    corTira: '',
    cordao: '',
    opcao: '',
  });

  const isTresAtributosForm =
    form.produto.toLowerCase().includes('canga') ||
    form.produto.toLowerCase() === 'sacochila' ||
    form.produto.toLowerCase() === 'toalha' ||
    form.produto.toLowerCase() === 'windbanner' ||
    form.produto.toLowerCase().includes('faixa');


  const is4AtributosForm =
    form.produto.toLowerCase() === ('estandarte') ||
    form.produto.toLowerCase() === 'flâmula';

  const isChineloShortsForm =
    form.produto.toLowerCase().includes('shorts') ||
    form.produto.toLowerCase().includes('chinelo');


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleExportToPNG = async () => {
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
    try {
      setLoading(true); // <<-- mostra o loading
      await esbocoFormatarPNG(form); // <<-- espera a criação do PNG
      setSnackbar({
        open: true,
        message: 'PNG gerado com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erro ao gerar o PNG!',
        severity: 'error'
      });
    } finally {
      setLoading(false); // <<-- termina o loading
    }
  };

  // useEffect pra limpar automaticamenete o form mudando o tipo de produto
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      id: '',
      opcao: '',
      dimensao: '',
      haste: '',
      franja: '',
      qntHastes: '',
      materialHaste: '',
      estampa: '',
      modelo: '',
      fechamento: '',
      ilhoses: false,
      qtdIlhoses: '',
      bordaMastro: false,
      composicao: '',
      duplaFace: false,
      corSolado: '',
      corTira: '',
      cordao: '',
      largura: '',
      altura: '',
    }));
  }, [form.produto]);

  useEffect(() => {
    if (form.produto.toLowerCase().includes("almofada de pescoço") ||
      form.produto.toLowerCase().includes("shorts") ||
      form.produto.toLowerCase().includes("chinelo")) {
      setForm((prev) => ({
        ...prev,
        largura: '',
        altura: '',
      }));
    }
  }, [form.produto]);


  useEffect(() => {
    if (form.produto.includes('Braçadeira')) {
      setForm(prev => ({ ...prev, fechamento: 'VELCRO' }));
    }
    if (form.produto === 'Bolachão') {
      setForm(prev => ({ ...prev, estampa: 'SUBLIMADA' }));
    }
    if (form.produto === 'Cachecol') {
      setForm(prev => ({ ...prev, altura: '130', largura: '18' }));
    }
    if (form.produto === "Bandeira de Mesa") {
      setForm((prev) => ({ ...prev, haste: '30' }));
    }
  }, [form.produto]);

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

  const disableDimensao =
    form.produto.toLowerCase().includes("almofada de pescoço") ||
    form.produto.toLowerCase().includes("bolachão") ||
    form.produto.toLowerCase().includes("sacochila") ||
    form.produto.toLowerCase().includes("chinelo") ||
    form.produto.toLowerCase().includes("short") ||
    form.produto.toLowerCase().includes("faixa");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <PageContainer title="Esboço / Produtos" description="Tela de Esboço dos Produtos | Design">
      <Breadcrumb title="Design / Esboço - Produtos" items={BCrumb} />
      <ParentCard title="Esboço">
        <Box p={4} maxWidth={'85%'} mx="auto">

          <Typography sx={{ mb: "2em" }} variant="h4" fontWeight="bold" color="orange" gutterBottom>
            ESBOÇO <span style={{ color: 'white' }}>PROFISSIONAL</span>
          </Typography>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={1.5}>
              <TextField
                label="ID"
                name="id"
                fullWidth
                value={form.id}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={1.5}>
              <TextField
                label="Opção"
                name="opcao"
                fullWidth
                value={form.opcao}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
              <TextField
                label="Altura (m)"
                name="altura"
                type="number"
                fullWidth
                value={form.altura}
                onChange={handleChange}
                disabled={disableDimensao}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Largura (m)"
                name="largura"
                type="number"
                fullWidth
                value={form.largura}
                onChange={handleChange}
                disabled={disableDimensao}
              />
            </Grid>
          </Grid>

          {form.produto.toLowerCase() === 'almofada' && (
            <FormAlmofada
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase() === 'almofada de pescoço' && (
            <FormAlmofadaPescoco
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase().includes('bandana') && (
            <FormBandana
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase().includes('bandeira de mesa') && (
            <FormBandeiraMesa
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase().includes('bandeira oficial') && (
            <FormBandeira
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase().includes('bandeira de carro') && (
            <FormBandeiraCarro
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase().includes('bandeira política') && (
            <FormBandeiraPolitica
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase().includes('bolachão') && (
            <FormBolacao
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase().includes('braçadeira') && (
            <FormBracadeirasCap
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {form.produto.toLowerCase().includes('cachecol') && (
            <FormCachecol
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {isTresAtributosForm && (
            <FormularioTresAtributos
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {is4AtributosForm && (
            <FormularioQuatroAtributos
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          {isChineloShortsForm && (
            <FormChineloShorts
              form={form}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              setForm={setForm}
            />
          )}

          <Box display="flex" alignItems="center" gap={2} mt={3}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleExportToPNG}
              startIcon={<IconFileTypePng />}
              disabled={loading}
            >
              {loading ? 'Gerando...' : 'Exportar para PNG'}
            </Button>
          </Box>

          {/* Barra de progresso no topo */}
          {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }} />}

          {/* OU se preferir um backdrop com spinner */}
          {/* <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop> */}

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


// "4_atributos": ["Estandarte", "Flâmula"],
// "3_atributos": ["Canga", "Faixa de Campeão", "Faixa de Mão", "Sacochila", "Toalha", "Windbanner"],
// "2_atributos_estampa": ["Chinelo de Dedo", "Chinelo Slide", "Shorts Praia/Doll"],
// "2_atributos_material": ["Mousepad", "Cordão de Chaveiro", "Tirante"]


// ALMOFADA:#
// DIMENSÕES (...)
// TECIDO (TACTEL)
// FACES (UMA OU DUPLA FACE)
// ESTAMPA (SUBLIMADA)

// ALMOFADA DE PESCOÇO:#
// TECIDO (TACTEL, HELASTANO)
// FACES (UMA OU DUPLA FACE)
// ESTAMPA (SUBLIMADA)

// BALACLAVA:

// BANDANA:#
// DIMENSÕES (...)
// TECIDO (TACTEL, STAR LISO, OXFORD)
// ESTAMPA (SUBLIMADA)

// BANDEIRA DE CARRO#
// DIMENSÕES (...)
// DUPLA FACE (NÃO, SIM)
// TECIDO (BEMBER, TACTEL)
// HASTE (42CM)

// BANDEIRA DE MESA#
// DIMENSÕES (...)
// DUPLA FACE (NÃO, SIM)
// TECIDO (TACTEL)
// N° DE HASTES (1, 2, 3)
// MATERIAL DA HASTE (PLÁSTICO, MADEIRA)
// TAMANHO DA HASTE (30CM)

// BANDEIRA OFICIAL#
// DIMENSÕES (...)
// DUPLA FACE (NÃO, SIM)
// TECIDO (TACTEL, OXFORD, CETIM)
// ILHÓSES (NECESSÁRIO DISCUTIR*)
// PARTES (CALCULO BASEADO EM 1,5M*)

// BANDEIRA POLÍTICA#
// DIMENSÕES (TAMANHOS FIXOS*)// pergnutar pra ele quais são os tamanhos fixos.
// TECIDO (BEMBER)
// DUPLA FACE (NÃO, SIM)
// HASTE (TAMANHOS FIXOS*)// perguntar pra ele quais são os tamanhos fixos. 

// BOLACHÃO#
// DIMENSÕES (1X1; 1,5X1,5; 2X2,3X3)
// TECIDO (TACTEL)
// ILHOSES (TAMANHOS FIXOS*)

// BRAÇADEIRA DE CAPITÃO#
// DIMENSÕES (ADULTO 38X7CM, INFANTIL 30X7CM, PERSONALIZÁVEL)
// MATERIAL (NEOPRENE)
// FECHAMENTO (VELCRO)

// CACHECOL#
// DIMENSÕES (130 X 18CM)
// TECIDO (CHIMPA)
// DUPLA FACE (NÃO, SIM)
// FRANJAS (...*)

// CANGA
// DIMENSÕES (...)
// TECIDO (STAR LISO, TACTEL)
// ESTAMPA (SUBLIMADA)

// CHINELO DE DEDO
// COR DO SOLADO (BRANCO, PRETO, AZUL MARINHO, AZUL CLARO, ROSA, ROXO, VERMELHO, VERDE, AMARELO)
// COR DA TIRA (IGUAL AO SOLADO OBRIGATORIAMENTE)
// ESTAMPA (SUBLIMADA)

// CHINELO SLIDE
// COR DO SOLADO (BRANCO, PRETO, ROSA, AZUL, VERMELHO)
// ESTAMPA (SUBLIMADA)

// CORDÃO DE CHAVEIRO
// DIMENSÕES APÓS A DOBRA (45CM)
// LARGURA (2CM)
// MATERIAL (FITA NÃO ALVEJADA)

// FAIXA DE CAMPEÃO
// DIMENSÕES (155 X 15CM)
// TECIDO (TACTEL, CETIM, OXFORD)
// ESTAMPA (SUBLIMADA)

// FAIXA DE MÃO
// DIMENSÕES (70 X 20CM, 100 X 25CM)
// MATERIAL (TACTEL)
// ESTAMPA (SUBLIMADA)

// ESTANDARTE
// DIMENSÕES (...)
// TECIDO (TACTEL, CETIM, OXFORD)
// DUPLA FACE (NÃO, SIM)
// FRANJA (...*)

// FLÂMULA
// DIMENSÕES (...)
// TECIDO (CETIM, TACTEL, OXFORD)
// DUPLA FACE (NÃO, SIM)
// FRANJA (...*)

// MOUSEPAD
// DIMENSÕES (...)
// MATERIAL (NEOPLEX)

// SACOCHILA
// DIMENSÕES (40 X 30CM)
// TECIDO (MICROFIBRA)
// ESTAMPA (SUBLIMADA)
// FRENTE E VERSO (NÃO, SIM)

// SHORTS PRAIA | SHORTS DOLL
// TECIDO (TACTEL)
// CORDÃO (NÃO, PRETO, BRANCO)
// BOLSOS (NÃO, SIM)
// ESTAMPA (SUBLIMADA)

// TIRANTE
// COMPRIMENTO (140CM)
// LARGURA (3, 4, 5CM)
// MATERIAL (FITA NÃO ALVEJADA)

// TOALHA
// DIMENSÕES (140 X 70CM)
// TECIDO (ATOALHADO)
// ESTAMPA (SUBLIMADA)

// WINDBANNER
// DIMENSÃO (2M, 3M, 4M)
// TECIDO (MICROFIBRA)
// MODELO (FACA, VELA, GOTA, PENA)
// ESTAMPA (SUBLIMADA)
// BASE (NÃO, SIM)