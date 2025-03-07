'use client';
import React, { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal } from './types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus, IconEdit, IconEye } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridActionsCellItem, GridPaginationModel, GridRowClassNameParams } from '@mui/x-data-grid';

const ArteFinalScreen = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  const { data: pedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, isFetching } = useQuery<ArteFinal[]>({
    queryKey: ['pedidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/pedido-arte-final`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  const handleNovoPedido = () => {
    setIsAdding(true);
    router.push('/apps/producao/arte-final/add/');
  };

  const handleDetails = (pedido: ArteFinal) => {
    const pedidoId = String(pedido.id);

    setLoadingStates((prev) => ({
      ...prev,
      [pedidoId]: { ...(prev[pedidoId] ?? { editing: false, detailing: false }), detailing: true },
    }));

    router.push(`/apps/produção/arte-final/${pedido.id}/`);
  };

  const handleEdit = (pedido: ArteFinal) => {
    const pedidoId = String(pedido.id);

    setLoadingStates((prev) => ({
      ...prev,
      [pedidoId]: { ...(prev[pedidoId] ?? { editing: false, detailing: false }), editing: true },
    }));

    router.push(`/apps/produção/arte-final/edit/${pedido.id}/`);
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'numero_pedido', headerName: 'Número do Pedido', width: 150 },
    {
      field: 'data_prevista',
      headerName: 'Data Prevista',
      width: 120,
      renderCell: (params) => {
        const date = params.row.data_prevista;
        return date ? new Date(date).toLocaleDateString('pt-BR') : 'N/A';
      },
    },
    { field: 'situacao', headerName: 'Situação', width: 120 },
    { field: 'prioridade', headerName: 'Prioridade', width: 100 },
    {
      field: 'actions',
      headerName: 'Ações',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<IconEye />}
          label="Detalhes"
          onClick={() => handleDetails(params.row)}
        />,
        <GridActionsCellItem
          icon={<IconEdit />}
          label="Editar"
          onClick={() => handleEdit(params.row)}
        />,
      ],
    },
  ];

  return (
    <PageContainer title="Produção / Arte - Final" description="Tela de Produção da Arte - Final | Arte Arena">
      <Breadcrumb title="Produção / Arte - Final" items={BCrumb} />
      <ParentCard title="Arte - Final">
        <>
          <Stack direction="row" spacing={1} sx={{ marginBottom: '1em', height: '3em', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={isAdding ? <CircularProgress size={20} /> : <IconPlus />}
              sx={{ height: '100%' }}
              onClick={handleNovoPedido}
              disabled={isAdding}
            >
              {isAdding ? 'Adicionando...' : 'Adicionar Novo pedido'}
            </Button>
          </Stack>

          {isErrorPedidos ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <Typography variant="body1" color="error">Erro ao carregar pedidos.</Typography>
            </Stack>
          ) : isLoadingPedidos ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 1 }}>Carregando pedidos...</Typography>
            </Stack>
          ) : (
            <Grid container spacing={2} style={{ display: 'flex' }}>
              <div style={{ height: 400, width: '100%', marginTop: '3em' }}>
                <DataGrid
                  sx={{
                    '& .linha-vermelha': { backgroundColor: 'rgba(255, 0, 0, 0.2)' },
                  }}
                  autoHeight
                  rows={pedidos}
                  columns={columns}
                  getRowId={(row) => row.id}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[5, 10, 25]}
                  loading={isFetching}
                  disableRowSelectionOnClick
                  getRowClassName={(params: GridRowClassNameParams) =>
                    params.row.situacao === 'antecipacao' || params.row.prioridade === 'antecipacao'
                      ? 'linha-vermelha'
                      : ''
                  }
                  initialState={{
                    sorting: {
                      sortModel: [{ field: 'data_prevista', sort: 'asc' }], //tem que ver se é desc ou asc
                    },
                  }}
                />
              </div>
            </Grid>
          )}
        </>
      </ParentCard>
    </PageContainer>
  );
};

export default ArteFinalScreen;