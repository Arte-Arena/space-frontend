'use client';
import React, { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Data } from './types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus, IconEdit, IconEye, IconTrash, IconLink, IconTiltShift, IconPencilDown, IconShirt, IconEyeCheck, IconBrush } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Grid,
  Stack,
  Button,
  Tooltip,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridActionsCellItem, GridPaginationModel, GridRowClassNameParams } from '@mui/x-data-grid';
import { IconPrinter } from '@tabler/icons-react';
import { IconBrandTrello } from '@tabler/icons-react';

const ArteFinalScreen = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });


  const pedidosFalsos = [
    {
      id: 1,
      numero_pedido: '12345',
      data_prevista: '2025-03-20T00:00:00Z',
      situacao: 'antecipacao',
      prioridade: 'Alta',
    },
    {
      id: 2,
      numero_pedido: '67890',
      data_prevista: '2025-04-15T00:00:00Z',
      situacao: 'Aguardando Aprovação',
      prioridade: 'Média',
    },
    {
      id: 3,
      numero_pedido: '11223',
      data_prevista: '2025-05-01T00:00:00Z',
      situacao: 'Finalizado',
      prioridade: 'Baixa',
    },
    {
      id: 4,
      numero_pedido: '44556',
      data_prevista: '2025-06-10T00:00:00Z',
      situacao: 'Em Produção',
      prioridade: 'Alta',
    },
    {
      id: 5,
      numero_pedido: '78901',
      data_prevista: '2025-07-05T00:00:00Z',
      situacao: 'Aguardando Aprovação',
      prioridade: 'Média',
    },
  ];


  const { data: pedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, isFetching } = useQuery<Data>({
    queryKey: ['pedidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  console.log(pedidos);

  // handles

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

  const handleDelete = (row: ArteFinal) => {
    console.log("Deletar pedido", row);
  };

  const handleLinkTrello = (row: ArteFinal) => {
    console.log("Deletar pedido", row);
  };
  const handleListaUniformes = (row: ArteFinal) => {
    console.log("Deletar pedido", row);
  };

  const handleAtribuirDesigner = (row: ArteFinal) => {
    console.log("handleAtribuirDesigner pedido", row);
  };

  const handleVerTiny = (row: ArteFinal) => {
    console.log("handleVerTiny pedido", row);
  };

  const handleEnviarImpressora = (row: ArteFinal) => {
    console.log("handleEnviarImpressora pedido", row);
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
      field: 'prazo_arte_final',
      headerName: 'Prazo Arte Final',
      width: 120,
      renderCell: (params) => {
        const date = params.row.prazo_arte_final;
        return date ? new Date(date).toLocaleDateString('pt-BR') : 'N/A';
      },
    },
    {
      field: 'prazo_confeccao',
      headerName: 'Prazo confecção',
      width: 120,
      renderCell: (params) => {
        const date = params.row.prazo_confeccao;
        return date ? new Date(date).toLocaleDateString('pt-BR') : 'N/A';
      },
    },
    { field: 'situacao', headerName: 'Situação', width: 120 },
    { field: 'prioridade', headerName: 'Prioridade', width: 100 },
    {
      field: 'actions',
      headerName: 'Ações',
      type: 'actions',
      width: 400,
      getActions: (params) => [
        <Tooltip title="Ver Detalhes">
          <GridActionsCellItem
            icon={<IconEye />}
            label="Detalhes"
            onClick={() => handleDetails(params.row)}
          />
        </Tooltip>,

        <Tooltip title="Ver Tiny">
          <GridActionsCellItem
            icon={<IconEyeCheck />}
            label="Ver Tiny"
            onClick={() => handleVerTiny(params.row)}
          />
        </Tooltip>,

        <Tooltip title="Link Trello">
          <GridActionsCellItem
            icon={<IconBrandTrello />}
            label="Link Trello"
            onClick={() => handleLinkTrello(params.row)}
          />
        </Tooltip>,

        <Tooltip title="Lista de Uniformes">
          <GridActionsCellItem
            icon={<IconShirt />}
            label="Lista Uniformes"
            onClick={() => handleListaUniformes(params.row)}
          />
        </Tooltip>,

        <Tooltip title="Atribuir Designer">
          <GridActionsCellItem
            icon={<IconBrush />}
            label="Atribuir Designer"
            onClick={() => handleAtribuirDesigner(params.row)}
          />
        </Tooltip>,

        <Tooltip title="Enviar para Impressão!">
          <GridActionsCellItem
            icon={<IconPrinter />}
            label="Enviar Impressora"
            onClick={() => handleEnviarImpressora(params.row)}
          />
        </Tooltip>,

        <Tooltip title="Editar">
          <GridActionsCellItem
            icon={<IconEdit />}
            label="Editar"
            onClick={() => handleEdit(params.row)}
          />
        </Tooltip>,

        <Tooltip title="Excluir">
          <GridActionsCellItem
            icon={<IconTrash />}
            label="Deletar"
            onClick={() => handleDelete(params.row)}
          />
        </Tooltip>,
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
                  rows={pedidos?.data}
                  // rows={pedidosFalsos}
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
                      sortModel: [{ field: 'prazo_arte_final', sort: 'asc' }], //tem que ver se é desc ou asc
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