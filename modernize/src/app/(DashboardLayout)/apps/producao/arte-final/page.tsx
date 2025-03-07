'use client';
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Produto, Material } from './types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import { useRouter } from 'next/navigation';

const ArteFinalScreen = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});

  const { data: pacotesUniforme, isLoading: isLoadingPacotesUniforme, isError: isErrorPacotesUniforme } = useQuery<ArteFinal[]>({
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
    router.push('/apps/producao/arte-final/add/');
  };

  const handleDetails = (pacote: ArteFinal) => {
    const pacoteId = String(pacote.id);

    setLoadingStates((prev) => ({
      ...prev,
      [pacoteId]: { ...(prev[pacoteId] ?? { editing: false, detailing: false }), detailing: true },
    }));

    router.push(`/apps/producao/arte-final/${pacote.id}/`);
  };


  const handleEdit = (pacote: ArteFinal) => {
    const pacoteId = String(pacote.id);

    setLoadingStates((prev) => ({
      ...prev,
      [pacoteId]: { ...(prev[pacoteId] ?? { editing: false, detailing: false }), editing: true },
    }));

    router.push(`/apps/producao/arte-final/edit/${pacote.id}/`);
  };

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/apps/producao/",
      title: "Produção",
    },
    {
      to: "/apps/producao/arte-final",
      title: "Arte Final",
    },
  ];

  return (
    <PageContainer title="Produção / Arte Final" description="Arte Final da Arte Arena">
      <Breadcrumb title="Produção / Arte Final" items={BCrumb} />
      <ParentCard title="Arte Final">
        <>

          <Stack direction="row" spacing={1} sx={{ marginBottom: '1em', height: '3em', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={isAdding ? <CircularProgress size={20} /> : <IconPlus />}
              sx={{ height: '100%' }}
              onClick={handleAddNovoPacote}
              disabled={isAdding}
            >
              {isAdding ? 'Adicionando...' : 'Adicionar Novo Pedido com Arte Final'}
            </Button>
          </Stack>

          {isErrorPacotesUniforme ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <Typography variant="body1" color="error">Erro ao carregar Pedidos com Arte Final.</Typography>
            </Stack>
          ) : isLoadingPacotesUniforme ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 1 }}>Carregando Pedidos com Arte Final...</Typography>
            </Stack>
          ) : (
            <Grid container spacing={2} style={{ display: 'flex' }}>
              {pacotesUniforme?.map((pacote) => (
                <Grid item xs={12} sm={6} md={4} key={pacote.id} style={{ display: 'flex' }}>



                </Grid>
              ))}
            </Grid>
          )}

        </>
      </ParentCard>
    </PageContainer>
  );
};

export default ArteFinalScreen;