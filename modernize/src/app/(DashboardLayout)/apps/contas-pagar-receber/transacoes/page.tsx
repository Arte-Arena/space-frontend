'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AlertProps, Box, Button, Chip, IconButton, LinearProgress, Link, Tooltip, Typography, useTheme } from '@mui/material';
import { Transaction } from './components/types';
import TransactionDetails from './components/transacaoDetails';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { IconEye, IconRefresh } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import CustomStyledSwitch from '@/app/components/switch/switch';
import { format, parse } from 'date-fns';
import NotificationSnackbar from '@/utils/snackbar';

const formatDate = (dateString: string) => {
  try {
    const parsedDate = parse(dateString, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSSSS\'Z\'', new Date());
    return format(parsedDate, 'dd/MM/yyyy HH:mm');
  } catch (error) {
    console.error('Erro ao fazer o parse da data:', error);
    return 'Data inválida';
  }
};

// Estilos profissionais para a tabela
const tableStyles = {
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  '& .MuiDataGrid-virtualScroller': {
    minHeight: '200px',
  },
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid #f0f0f0',
  },
};

const TransactionTable = () => {
  const theme = useTheme();
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    router.push('/login');
    return null;
  }

  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFiltroAtivo, setStatusFiltroAtivo] = useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchTransacoes = async () => {
    setLoading(true);
    try {
      const statusParam = statusFiltroAtivo ? `&status=approved` : '';
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/transacoes-bancarias?page=${page + 1}&per_page=${rowsPerPage}${statusParam}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error('Erro ao buscar transações');
      const data = await res.json();
      setRows(data.data);
      setTotal(data.total);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: `${'Erro ao buscar extratos!'}`,
        severity: 'error'
      });
      setError(err.message || 'Erro desconhecido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, [page, rowsPerPage, statusFiltroAtivo]);

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  const updateLastResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/extrato/mercadopago`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Erro ao atualizar os extratos');
      const data = await res.json();
      console.log(data);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      setSnackbar({
        open: true,
        message: `${'Erro ao atualizar os extratos!'}`,
        severity: 'error'
      });
      console.error(err);
    } finally {
      setSnackbar({
        open: true,
        message: `✅ ${'Sucesso ao atualizar os extratos!'}`,
        severity: 'success'
      });
      setLoading(false);
    }
    fetchTransacoes();
  };

  const columns: GridColDef<Transaction>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/apps/contas-pagar-receber/transacoes/detalhes/${params.value}`}>
          <a>{params.value}</a>
        </Link>
      ),
    },
    {
      field: 'id_transacao_externa',
      headerName: 'ID Externo',
      width: 150,
    },
    {
      field: 'data_transacao',
      headerName: 'Data Transação',
      width: 150,
      valueFormatter: (params: string) => {
        return formatDate(params);
      },
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'valor',
      headerName: 'Valor (R$)',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams<Transaction>) => {
        const value = Number(params.value);
        const color =
          params.row.tipo_operacao === 'saida'
            ? theme.palette.error.main
            : params.row.tipo_operacao === 'entrada'
              ? theme.palette.success.main
              : theme.palette.text.primary;

        return (
          <span style={{ color }}>
            {isNaN(value)
              ? `R$ ${params.value}`
              : value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
          </span>
        );
      },
    },
    {
      field: 'valor_taxas',
      headerName: 'Taxas (R$)',
      width: 100,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams<Transaction>) => {
        const value = Number(params.value);
        const color =
          params.row.tipo_operacao === 'saida'
            ? theme.palette.error.main
            : params.row.tipo_operacao === 'entrada'
              ? theme.palette.success.main
              : theme.palette.text.primary;

        return (
          <span style={{ color }}>
            {isNaN(value)
              ? `R$ ${params.value}`
              : value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
          </span>
        );
      },
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 130,
      renderCell: (params: GridRenderCellParams<Transaction>) => (
        <Typography
          variant="caption"
          fontWeight="bold"
        >
          {params.value.toUpperCase()}
        </Typography>
      ),
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      width: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams<Transaction>) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor:
              params.value === 'pendente'
                ? theme.palette.warning.light
                : params.value === 'cancelado'
                  ? theme.palette.error.light
                  : theme.palette.success.light,
            color:
              params.value === 'pendente'
                ? theme.palette.warning.main
                : params.value === 'cancelado'
                  ? theme.palette.error.main
                  : theme.palette.success.main,
          }}
        />
      ),
    },
    {
      field: 'plataforma',
      headerName: 'Plataforma',
      width: 130,
      renderCell: (params: GridRenderCellParams<Transaction>) => (
        params.value === 'mercado_pago' ? (
          <Box
            component="img"
            src="/images/logos/mercado-pago/SVGs/MP_RGB_HANDSHAKE_color-blanco_hori-izq.svg"
            alt="Mercado Pago"
            sx={{
              height: 55,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        ) : (
          <Typography variant="body2">{params.value}</Typography>
        )
      ),
    },
    {
      field: 'nome_pagador',
      headerName: 'Nome',
      width: 150,
    },
    {
      field: 'conciliado',
      headerName: 'Conciliado',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Sim' : 'Não'}
          size="small"
          color={params.value ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Transaction>) => (
        <IconButton
          onClick={() => openTransactionDetails(params.row)}
          sx={{
            color: theme.palette.success.main,
            '&:hover': {
              backgroundColor: theme.palette.success.light,
            },
          }}
        >
          <Tooltip title="Detalhes" placement="top">
            <IconEye />
          </Tooltip>
        </IconButton>
      ),
    },
  ];

  return (
    <PageContainer title='transações Bancarias' description="Gestão de Transações">
      <Breadcrumb title="transações Bancarias" subtitle="Transações bancarias" />
      <Box display="flex" alignItems="center" justifyContent={'space-around'} ml={-1.5} my={3} marginLeft={1}>
        <Box display={'flex'} alignItems={'center'}>
          <CustomStyledSwitch
            checked={statusFiltroAtivo}
            onChange={(e) => {
              setStatusFiltroAtivo(e.target.checked);
              setPage(0); // resetar página
            }}
          />
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Mostrar apenas Status Mercado Pago Aprovado
          </Typography>
        </Box>

        <Box display={'flex'} alignItems={'center'}>
          <IconButton
            onClick={updateLastResults}
            sx={{
              color: theme.palette.success.main,
              '&:hover': {
                backgroundColor: theme.palette.success.light,
              },
            }}
          >
            <Tooltip title="Atualizar Últimos 100 Resultados" placement="top">
              <IconRefresh />
            </Tooltip>
          </IconButton>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Atualizar Últimos 100 Resultados
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '100vh',
        }}
      >

        <div style={{ width: '90vw' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            pagination
            pageSizeOptions={[10, 20, 50, 100]}
            sx={tableStyles}
            disableColumnMenu
            autoHeight
            onPaginationModelChange={(model) => {
              if (model.pageSize !== rowsPerPage) {
                setRowsPerPage(model.pageSize);
                setPage(0); // resetar a página
              } else {
                setPage(model.page);
              }
            }}
            density="comfortable"
            paginationMode="server"
            rowCount={total}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
          />

          {error && (
            <Typography color="error" mt={2}>
              Erro ao carregar transações: {error}
            </Typography>
          )}

          <TransactionDetails
            open={open}
            onClose={handleClose}
            transaction={selectedTransaction}
          />
        </div>
        {loading && (
          <LinearProgress
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 9999,
            }}
          />
        )}
        <NotificationSnackbar message={snackbar.message} open={snackbar.open} severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} />
      </Box>
    </PageContainer>
  );
};

export default TransactionTable;