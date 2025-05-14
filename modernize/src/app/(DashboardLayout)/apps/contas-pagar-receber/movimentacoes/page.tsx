'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetter } from '@mui/x-data-grid';
import { AlertProps, Box, Button, Chip, IconButton, LinearProgress, Tooltip, Typography, useTheme } from '@mui/material';
import { MovimentacaoFinanceira, Parcela } from './components/types';
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

const MovimentacoesTable = () => {
  const theme = useTheme();
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    router.push('/login');
    return null;
  }

  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<MovimentacaoFinanceira | null>(null);
  const [rows, setRows] = useState<MovimentacaoFinanceira[]>([]);
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
        `${process.env.NEXT_PUBLIC_API}/api/movimentacoes-financeiras?page=${page + 1}&per_page=${rowsPerPage}${statusParam}`,
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

  const openTransactionDetails = (transaction: MovimentacaoFinanceira) => {
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

  const columns: GridColDef<MovimentacaoFinanceira>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'numero_pedido',
      headerName: 'Nº Pedido',
      width: 100,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body2" noWrap>
            {params.value === "0" ? 'N/A' : params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'documento',
      headerName: 'Documento',
      width: 150,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira>) => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Typography variant="body2" fontWeight={700}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'valor_bruto',
      headerName: 'Valor Bruto',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, string, string>) => {
        const value = Number(params.value);
        const color = params.row.tipo.toLowerCase() === 'entrada'
          ? theme.palette.success.main
          : theme.palette.error.main;

        return (
          <span style={{ color }}>
            {value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        );
      },
    },
    // {
    //   field: 'valor_liquido',
    //   headerName: 'Valor Líquido',
    //   width: 120,
    //   align: 'right',
    //   headerAlign: 'right',
    //   renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, string, string>) => {
    //     const value = Number(params.value);
    //     return value.toLocaleString('pt-BR', {
    //       style: 'currency',
    //       currency: 'BRL',
    //     });
    //   },
    // },
    {
      field: 'data_operacao',
      headerName: 'Data Operação',
      width: 150,
      valueFormatter: (params: any) => formatDate(params),
    },
    {
      field: 'etapa',
      headerName: 'Etapa',
      width: 160,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, string, string>) => (
        <Chip
          label={params.value}
          size="small"
          color="info"
          variant="outlined"
        />
      ),
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 100,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, 'entrada' | 'saida', 'entrada' | 'saida'>) => (
        <Chip
          label={(params.value ?? '').toUpperCase()}
          size="small"
          color={
            params.value?.toLowerCase() === 'entrada' ? 'success' : 'error'
          }
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status Conciliação',
      width: 150,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, string, string>) => (
        <Chip
          label={params.value?.includes('pendente') ? 'Pendente' : params.value}
          size="small"
          sx={{
            backgroundColor:
              params.value?.includes('pendente') ? 'warning.light' :
                params.value === 'cancelado' ? 'error.light' :
                  'success.light',
            color:
              params.value?.includes('pendente') ? 'warning.main' :
                params.value === 'cancelado' ? 'error.main' :
                  'success.main',
          }}
        />
      ),
    },
    {
      field: 'metadados',
      headerName: 'Forma Pagto',
      width: 150,
      valueGetter: (params: any) => {
        try {
          return params?.forma_pagamento || 'N/A';
        } catch (error) {
          return 'N/A';
        }
      },
    },
    // {
    //   field: 'tipo_faturamento',
    //   headerName: 'Faturamento',
    //   width: 120,
    //   valueGetter: (params: any) => {
    //     try {
    //       // const metadados = typeof params.row.metadados === 'string'
    //       //   ? JSON.parse(params.row.metadados)
    //       //   : params.row.metadados;
    //       return params || 'N/A';
    //     } catch {
    //       return 'N/A';
    //     }
    //   },
    // },
    {
      field: 'parcelas',
      headerName: 'Parcelas',
      width: 100,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, any, any>) => {
        try {
          const metadados = typeof params.row.metadados === 'string'
            ? JSON.parse(params.row.metadados)
            : params.row.metadados;
          const parcelas = metadados?.parcelas || [];
          const parcelasPendentes = parcelas.filter((p: any) => p.status === 'pendente').length;

          return (
            <Tooltip title={`${parcelasPendentes}/${parcelas.length} pendentes`}>
              <Chip
                label={`${parcelas.length}x`}
                size="small"
                color={parcelasPendentes > 0 ? 'warning' : 'success'}
                variant="outlined"
              />
            </Tooltip>
          );
        } catch {
          return <Chip label="0x" size="small" />;
        }
      },
    },
    {
      field: 'cliente_info',
      headerName: 'Cliente',
      width: 100,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, any, any>) => {
        try {
          const metadadosCliente = typeof params.row.metadados_cliente === 'string'
            ? JSON.parse(params.row.metadados_cliente)
            : params.row.metadados_cliente;

          return (
            <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%' }}>
              <Tooltip title={metadadosCliente?.cliente_octa_number || 'N/A'}>
                <Typography variant="body2" fontWeight="bold" align="center">
                  {metadadosCliente?.cliente_octa_number ? `${metadadosCliente?.cliente_octa_number.slice(0, 10)}...` : 'N/A'}
                </Typography>
              </Tooltip>
            </Box>
          );
        } catch {
          return 'N/A';
        }
      },
    },
    {
      field: 'produtos',
      headerName: 'Produtos',
      width: 150,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, any, any>) => {
        try {
          const listaProdutos = typeof params.row.lista_produtos === 'string'
            ? JSON.parse(params.row.lista_produtos)
            : params.row.lista_produtos;

          return listaProdutos?.length
            ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', height: '100%' }}>
                {listaProdutos.map((produto: any) => (
                  <Tooltip key={produto.id} title={produto.nome}>
                    <Typography variant="body2" component="li" sx={{ mt: 0.5, '&:first-child': { mt: 0 } }}>
                      {produto.nome.length > 20 ? `${produto.nome.slice(0, 20)}...` : produto.nome}
                    </Typography>
                  </Tooltip>
                ))}
              </Box>
            )
            : 'Nenhum';
        } catch {
          return 'N/A';
        }
      },
    },
    // {
    //   field: 'observacoes',
    //   headerName: 'Observações',
    //   width: 200,
    //   renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira, string | null, string | null>) => (
    //     <Tooltip title={params.value || 'Sem observações'}>
    //       <Typography noWrap>
    //         {params.value || '-'}
    //       </Typography>
    //     </Tooltip>
    //   ),
    // },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams<MovimentacaoFinanceira>) => (
        <IconButton
          onClick={() => { /* Implemente sua função openTransactionDetails aqui */ console.log('Detalhes', params.row) }}
          color="primary"
        >
          <Tooltip title="Detalhes">
            <IconEye />
          </Tooltip>
        </IconButton>
      ),
    },
  ];


  return (
    <PageContainer title='transações Bancarias' description="Gestão de Transações">
      <Breadcrumb title="transações Bancarias" subtitle="Transações bancarias" />
      {/* <Box display="flex" alignItems="center" justifyContent={'space-around'} ml={-1.5} my={3} marginLeft={1}>
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
      </Box> */}
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

          {/* <TransactionDetails
            open={open}
            onClose={handleClose}
            transaction={selectedTransaction}
          /> */}
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

export default MovimentacoesTable;