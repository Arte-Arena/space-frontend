'use client';
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import ProdutoPacoteUniforme from './types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus, IconEdit, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Grid,
  Stack,
  Button,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/useAuth';

interface UniformMedida {
  id: number;
  genero: string;
  tamanho_camisa: string;
  tamanho_calcao: string;
  largura_camisa: number;
  altura_camisa: number;
  largura_calcao: number;
  altura_calcao: number;
}

const ProdutosPacotesUniformesScreen = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [expandedMedidas, setExpandedMedidas] = useState(false);

  const isLoggedIn = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  const { data: pacotesUniforme, isLoading: isLoadingPacotesUniforme, isError: isErrorPacotesUniforme } = useQuery<ProdutoPacoteUniforme[]>({
    queryKey: ['pacotes-uniforme'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/produto/pacote/uniforme/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  const { data: medidasUniforme, isLoading: isLoadingMedidas } = useQuery<UniformMedida[]>({
    queryKey: ['medidas-uniforme'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes-medidas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  const handleAddNovoPacote = () => {
    setIsAdding(true);
    router.push('/apps/produtos/pacotes-uniformes/add/');
  };

  const handleDetails = (pacote: ProdutoPacoteUniforme) => {
    const pacoteId = String(pacote.id);

    setLoadingStates((prev) => ({
      ...prev,
      [pacoteId]: { ...(prev[pacoteId] ?? { editing: false, detailing: false }), detailing: true },
    }));

    router.push(`/apps/produtos/pacotes-uniformes/${pacote.id}/`);
  };


  const handleEdit = (pacote: ProdutoPacoteUniforme) => {
    const pacoteId = String(pacote.id);

    setLoadingStates((prev) => ({
      ...prev,
      [pacoteId]: { ...(prev[pacoteId] ?? { editing: false, detailing: false }), editing: true },
    }));

    router.push(`/apps/produtos/pacotes-uniformes/edit/${pacote.id}/`);
  };

  const handleExpandMedidas = () => {
    setExpandedMedidas(!expandedMedidas);
  };

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/apps/produtos/",
      title: "Produtos",
    },
    {
      to: "/apps/produtos/pacotes-uniformes",
      title: "Pacotes de Uniformes",
    },
  ];

  const groupMedidasByGenero = (medidas: UniformMedida[] | undefined) => {
    if (!medidas) return {};
    
    return medidas.reduce((acc: Record<string, UniformMedida[]>, medida) => {
      if (!acc[medida.genero]) {
        acc[medida.genero] = [];
      }
      acc[medida.genero].push(medida);
      return acc;
    }, {});
  };

  const medidasByGenero = groupMedidasByGenero(medidasUniforme);

  return (
    <PageContainer title="Produtos / Pacotes de Uniformes" description="Pacotes de Uniformes da Arte Arena">
      <Breadcrumb title="Produtos / Pacotes de Uniformes" items={BCrumb} />
      
      <Box sx={{ mb: 3 }}>
        <Accordion 
          expanded={expandedMedidas} 
          onChange={handleExpandMedidas}
          sx={{ 
            backgroundColor: 'background.default',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
            '&:before': { display: 'none' },
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.01)',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<IconChevronDown />}
            aria-controls="tabela-medidas-uniforme"
            id="tabela-medidas-uniforme-header"
            sx={{ background: 'rgba(0, 0, 0, 0.02)' }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h5">Medidas de Uniformes</Typography>
              <Typography 
                variant="subtitle2" 
                color="primary" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  ml: 2,
                  fontSize: '0.85rem',
                }}
              >
                (Clique para {expandedMedidas ? 'ocultar' : 'visualizar'} as medidas mais atualizadas)
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Estas são as medidas mais atualizadas no banco de dados. Utilize estas informações como referência para garantir o ajuste ideal dos uniformes.
              </Typography>
            </Box>
            {isLoadingMedidas ? (
              <Box display="flex" justifyContent="center" sx={{ p: 3 }}>
                <CircularProgress />
              </Box>
            ) : !medidasUniforme || medidasUniforme.length === 0 ? (
              <Typography variant="body1">Nenhuma medida de uniforme disponível.</Typography>
            ) : (
              <Box>
                {Object.entries(medidasByGenero).map(([genero, medidas]) => (
                  <Box key={genero} sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {genero === 'MASCULINO' ? 'Masculino' : genero === 'FEMININO' ? 'Feminino' : 'Infantil'}
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Tamanho</TableCell>
                            <TableCell align="center">Largura Camisa (cm)</TableCell>
                            <TableCell align="center">Altura Camisa (cm)</TableCell>
                            <TableCell align="center">Largura Calção (cm)</TableCell>
                            <TableCell align="center">Altura Calção (cm)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {medidas.map((medida) => (
                            <TableRow key={medida.id}>
                              <TableCell component="th" scope="row">
                                {medida.tamanho_camisa}
                              </TableCell>
                              <TableCell align="center">{medida.largura_camisa}</TableCell>
                              <TableCell align="center">{medida.altura_camisa}</TableCell>
                              <TableCell align="center">{medida.largura_calcao}</TableCell>
                              <TableCell align="center">{medida.altura_calcao}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <ParentCard title="Pacotes de Uniformes">
        <>

          <Stack direction="row" spacing={1} sx={{ marginBottom: '1em', height: '3em', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={isAdding ? <CircularProgress size={20} /> : <IconPlus />}
              sx={{ height: '100%' }}
              onClick={handleAddNovoPacote}
              disabled={isAdding}
            >
              {isAdding ? 'Adicionando...' : 'Adicionar Novo Pacote'}
            </Button>
          </Stack>

          {isErrorPacotesUniforme ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <Typography variant="body1" color="error">Erro ao carregar pacotes de uniformes.</Typography>
            </Stack>
          ) : isLoadingPacotesUniforme ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 1 }}>Carregando pacotes de uniformes...</Typography>
            </Stack>
          ) : (
            <Grid container spacing={2} style={{ display: 'flex' }}>
              {pacotesUniforme?.map((pacote) => (
                <Grid item xs={12} sm={6} md={4} key={pacote.id} style={{ display: 'flex' }}>
                  <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardContent>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          onClick={() => handleDetails(pacote)}
                          sx={{ cursor: 'pointer' }}
                        >
                          {pacote.nome}
                        </Typography>

                        {loadingStates[String(pacote.id)]?.editing ? (
                          <CircularProgress size={24} sx={{ mt: 2 }} />
                        ) : (
                          <Button onClick={() => handleEdit(pacote)}>
                            <IconEdit />
                          </Button>
                        )}

                      </Box>

                      <List dense={true}>
                        <ListItem>
                          <ListItemText
                            primary="Tecido da Camisa"
                            secondary={pacote.tipo_de_tecido_camisa}
                          />
                          <ListItemText
                            primary="Tecido do Calção"
                            secondary={pacote.tipo_de_tecido_calcao}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Tipo de Gola"
                            secondary={Array.isArray(pacote.tipo_gola) ? pacote.tipo_gola.join(", ") : pacote.tipo_gola}
                          />
                          <ListItemText
                            primary="Tipo de Escudo na Camisa"
                            secondary={pacote.tipo_de_escudo_na_camisa}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Tamanhos"
                            secondary={Array.isArray(pacote.tamanhos_permitidos) ? pacote.tamanhos_permitidos.join(", ") : "Não especificado"}
                          />
                        </ListItem>
                      </List>
                      {loadingStates[String(pacote.id)]?.detailing ? (
                        <CircularProgress size={24} sx={{ mt: 2}} />
                      ) : (
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => handleDetails(pacote)}
                          sx={{ mt: 2 }}
                        >
                          Ver detalhes completos
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

        </>
      </ParentCard>
    </PageContainer>
  );
};

export default ProdutosPacotesUniformesScreen;