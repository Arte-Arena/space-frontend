'use client';
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import ProdutoPacoteUniforme from './types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus, IconEdit } from '@tabler/icons-react';
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
} from "@mui/material";
import { useRouter } from 'next/navigation';

const ProdutosPacotesUniformesScreen = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});

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

  return (
    <PageContainer title="Produtos / Pacotes de Uniformes" description="Pacotes de Uniformes da Arte Arena">
      <Breadcrumb title="Produtos / Pacotes de Uniformes" items={BCrumb} />
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