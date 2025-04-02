'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { isSameDay } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import getBrazilTime from '@/utils/brazilTime';
import { DateTime } from 'luxon';
import {
  Typography,
  Grid,
  Stack,
  Button,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Box,
  MenuItem,
  TextField,
  Select,
  TextFieldProps,
  Snackbar,
  AlertProps,
  Alert
} from "@mui/material";
import { IconEdit, IconEye, IconTrash, IconShirt, IconBrush, IconPrinter, IconBrandTrello, IconUserPlus } from '@tabler/icons-react';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import { GridPaginationModel } from '@mui/x-data-grid';
import { ArteFinal, Produto } from './components/types';
import SidePanel from './components/drawer';
import AssignDesignerDialog from './components/designerDialog';
import { ApiResponsePedidosArteFinal } from './components/types';
import trocarStatusPedido from './components/useTrocarStatusPedido';
import DialogObs from './components/observacaoDialog';
import deletePedidoArteFinal from './components/useDeletePedido';
import atribuirDesigner from './components/useDeisgnerJoin';

const ArteFinalScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [openDialogDesinger, setOpenDialogDesinger] = useState(false);
  const [openDialogObs, setOpenDialogObs] = useState(false);
  const [selectedRowDesinger, setSelectedRowDesinger] = useState<ArteFinal | null>(null);
  const [selectedRowObs, setSelectedRowObs] = useState<ArteFinal | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [observacoes, setObservacoes] = useState<{ [key: string]: string }>({});
  const [searchNumero, setSearchNumero] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<{ start: string | null; end: string | null }>({ start: '', end: '' });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 100,
    page: 0,
  });
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const router = useRouter();
  // const myTheme = useThemeMode()

  const accessToken = localStorage.getItem('accessToken');
  const designers = localStorage.getItem('designers');
  const roles = localStorage.getItem('roles')?.split(',').map(Number) || [];

  const allowedRoles = [1, 2, 3, 4, 7, 10];
  const DesignerRoles = [6];
  const DesignerCoordanateRole = [7];

  const canShowButtonAtribuirDesigner = roles.some(role => DesignerCoordanateRole.includes(role));
  const canShowButton = roles.some(role => allowedRoles.includes(role));
  const canShowButtonDesigner = roles.some(role => DesignerRoles.includes(role));

  const filters = {
    numero_pedido: searchNumero,
    pedido_status_id: statusFilter,
  };

  const { data: dataPedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, refetch } = useQuery<ApiResponsePedidosArteFinal>({
    queryKey: ['pedidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final?fila=D`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (dataPedidos && dataPedidos.data) {
      setAllPedidos(dataPedidos.data);
    }
  }, [dataPedidos]);

  useEffect(() => {
    const inicializarObservacoes = paginatedPedidos.reduce((acc, row) => {
      acc[row?.id ?? 0] = row.observacoes || "";
      return acc;
    }, {} as { [key: string]: string });
    setObservacoes(inicializarObservacoes);
  }, [allPedidos]);

  // const handleObservacaoChange = (id: string, novaObservacao: string) => {
  //   console.log('novaObservacao: ', novaObservacao);
  //   setObservacoes((prev) => ({ ...prev, [id]: novaObservacao }));
  // };

  const handleObservacaoChange = (id: string, novaObservacao: string) => {
    console.log('novaObservacao: ', novaObservacao);
    setObservacoes((prev) => {
      const novoEstado = { ...prev, [id]: novaObservacao };
      console.log('Novo estado:', novoEstado);
      return novoEstado;
    });
  };

  // isso vai ser mudado
  useEffect(() => {
    if (!openDialogDesinger) {
      refetch();
    }
  }, [openDialogDesinger, refetch]);

  const handleEdit = (pedido: ArteFinal) => {
    const pedidoId = String(pedido.id);

    setLoadingStates((prev) => ({
      ...prev,
      [pedidoId]: { ...(prev[pedidoId] ?? { editing: false, detailing: false }), editing: true },
    }));

    router.push(`/apps/producao/arte-final/edit/${pedido.id}/`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDelete = async (row: ArteFinal) => {
    const confirmar = window.confirm('Deseja excluir o pedido N° ' + row.numero_pedido);
    if (confirmar) {
      const sucesso = await deletePedidoArteFinal(row?.id, refetch);
      if (sucesso) {
        console.log("Pedido deletado com sucesso!");
        setSnackbar({
          open: true,
          message: `✅ ${'Sucesso!'}`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: `${'Falha ao excluir pedido'}`,
          severity: 'error'
        });
        console.log("Falha ao excluir pedido.");
      }
    } else {
      console.log("Envio cancelado.");
      setSnackbar({
        open: true,
        message: `${'Envio Cancelado'}`,
        severity: 'info'
      });
    }
  };

  const handleLinkTrello = (row: ArteFinal) => {
    if (row.url_trello) {
      window.open(row.url_trello, '_blank');
    } else {
      setSnackbar({
        open: true,
        message: `${'URL do Trello não disponível'}`,
        severity: 'warning'
      });
      console.warn('URL do Trello não disponível');
    }
  };

  // não está funcionando
  const handleListaUniformes = async (row: ArteFinal) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/pedido-arte-final/${row.id}/verificar-uniformes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        router.push(data.redirect);
      } else {
        console.error('Erro ao verificar uniformes:', data.error);
        setSnackbar({
          open: true,
          message: `${'Erro ao verificar uniformes: ' + data.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Erro ao verificar uniformes:', error);
      setSnackbar({
        open: true,
        message: `${'Erro ao verificar uniformes'}`,
        severity: 'error'
      });
    }
  };

  const handleAtribuirDesigner = (row: ArteFinal) => {
    setSelectedRowDesinger(row);
    setOpenDialogDesinger(true);
  };

  const handleEntrarDesigner = async (id: number | undefined) => {
    const resposta = await atribuirDesigner(id, refetch);
    if (resposta) {
      console.log("Designer adicionado com sucesso!");
      setSnackbar({
        open: true,
        message: '✅ Sucesso!',
        severity: 'success'
      });
    } else {
      console.log("Falha ao atribuir designer.");
    }
  }

  const handleVerDetalhes = (row: ArteFinal) => {
    setSelectedRowSidePanel(row);
    setOpenDrawer(true);
  };

  const handleEnviarImpressora = async (row: ArteFinal) => {
    const confirmar = window.confirm('Deseja enviar o pedido N° ' + row.numero_pedido + ' para Impressão?');
    if (!row.designer_id) {
      return setSnackbar({
        open: true,
        message: `${'Designer precisa ser atribuido antes de enviar para Impressão'}`,
        severity: 'error'
      });
    }
    if (!row.pedido_tipo_id) {
      return setSnackbar({
        open: true,
        message: `${'Tipo deopedido precisa ser atribuido antes de enviar para Impressão'}`,
        severity: 'error'
      });
    }
    if (!row.pedido_status_id) {
      return setSnackbar({
        open: true,
        message: `${'Status do pedido precisa ser atribuido antes de enviar para Impressão'}`,
        severity: 'error'
      });
    }
    if (!row.data_prevista) {
      return setSnackbar({
        open: true,
        message: `${'Previsão de Entrega do pedido precisa ser atribuido antes de enviar para Impressão'}`,
        severity: 'error'
      });
    }
    if (!row.lista_produtos) {
      return setSnackbar({
        open: true,
        message: `${'Previsão de Entrega do pedido precisa ser atribuido antes de enviar para Impressão'}`,
        severity: 'error'
      });
    }
    if (!row.numero_pedido) {
      return setSnackbar({
        open: true,
        message: `${'Previsão de Entrega do pedido precisa ser atribuido antes de enviar para Impressão'}`,
        severity: 'error'
      });
    }

    if (confirmar) {
      const sucesso = await trocarStatusPedido(row?.id, 8, refetch);
      if (sucesso) {
        console.log("Pedido enviado com sucesso!");
        setSnackbar({
          open: true,
          message: '✅ Sucesso!',
          severity: 'success'
        });
      } else {
        console.log("Falha ao enviar pedido.");
        setSnackbar({
          open: true,
          message: `${'Falha ao enviar pedido.'}`,
          severity: 'error'
        });
      }
    } else {
      console.log("Envio cancelado.");
      setSnackbar({
        open: true,
        message: `${'Envio cancelado.'}`,
        severity: 'error'
      });
    }
  };

  const handleStatusChange = async (row: ArteFinal, status_id: number) => {
    const sucesso = await trocarStatusPedido(row?.id, status_id, refetch);
    if (sucesso) {
      console.log("Pedido enviado com sucesso!");
      setSnackbar({
        open: true,
        message: `✅ ${'Sucesso!'}`,
        severity: 'success'
      });
    } else {
      console.log("Falha ao trocar status.");
      setSnackbar({
        open: true,
        message: `${'Status não atualizado.'}`,
        severity: 'warning'
      });
    }
  }

  const handleClickOpenDialogObs = async (row: ArteFinal) => {
    setSelectedRowObs(row);
    setOpenDialogObs(true);
  };

  const handleEnviarObservacao = async (id: string) => {
    if (!id) {
      console.error("ID do pedido não encontrado");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/producao/pedido-obs-change/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ observacoes: observacoes[id] }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar observação");
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: `${'Observação salva com sucesso.'}`,
        severity: 'success'
      });
      console.log("Observação salva com sucesso:", data);

      refetch();
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
    }
  };

  const pedidoStatus = {
    1: { nome: 'Pendente', fila: 'D' },
    2: { nome: 'Em andamento', fila: 'D' },
    3: { nome: 'Arte OK', fila: 'D' },
    4: { nome: 'Em espera', fila: 'D' },
    5: { nome: 'Cor teste', fila: 'D' },
  } as const;

  const filteredPedidos = useMemo(() => {
    return allPedidos.filter((pedido) => {
      const isNumberMatch = !filters.numero_pedido || pedido.numero_pedido.toString().includes(filters.numero_pedido);
      const isStatusMatch = !filters.pedido_status_id || pedido.pedido_status_id === Number(filters.pedido_status_id);
      const isDateMatch = (
        (!dateFilter.start || new Date(pedido.data_prevista) >= new Date(dateFilter.start)) &&
        (!dateFilter.end || new Date(pedido.data_prevista) <= new Date(dateFilter.end))
      );
      return isNumberMatch && isStatusMatch && isDateMatch;
    });
  }, [allPedidos, filters, dateFilter]);

  const paginatedPedidos = useMemo(() => {
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const endIndex = startIndex + paginationModel.pageSize;
    return filteredPedidos.slice(startIndex, endIndex);
  }, [filteredPedidos, paginationModel]);

  const handleClearFilters = () => {
    setSearchNumero('');
    setStatusFilter('');
    setDateFilter({ start: null, end: null });
  };

  const handleDateChange = (field: 'start' | 'end') => (newValue: Date | null) => {
    setDateFilter((prev) => ({ ...prev, [field]: newValue }));
  }

  function formatarDataSegura(dataISOString: string): string {
    const dataUTC = DateTime.fromISO(dataISOString, { zone: 'utc' });
    const dataFormatada = dataUTC.toFormat('dd/MM/yyyy');
    return dataFormatada;
  }

  const zerarHorario = (data: Date): Date => {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
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
      to: "/apps/produção/arte-final",
      title: "Pedidos com Arte Final",
    },
  ];

  // useEffect(() => {
  //   console.log("📌 Estado atualizado - selectedRowIdSidePanel:", selectedRowSidePanel);
  // }, [selectedRowSidePanel]);

  // console.log(allPedidos);
  // console.log(designers);

  return (
    <PageContainer title="Produção / Arte - Final" description="Tela de Produção da Arte - Final | Arte Arena">
      <Breadcrumb title="Produção / Arte - Final" items={BCrumb} />
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, }}>
        <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
          Total de Pedidos: <strong>{allPedidos.length}</strong>.
        </Typography>
      </Box>
      <ParentCard title="Arte - Final">
        <>
          <Grid container spacing={1} sx={{ alignItems: 'center', mb: 2, flexWrap: 'nowrap' }}>
            {/* Campo de Número do Pedido */}
            <Grid item>
              <TextField
                label="Número do Pedido"
                variant="outlined"
                size="small"
                value={searchNumero}
                onChange={(e) => setSearchNumero(e.target.value)}
              />
            </Grid>

            {/* Select de Status */}
            <Grid item>
              <Select
                sx={{ minWidth: '150px' }} // Define uma largura mínima
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                size="small"
              >
                <MenuItem value="">Todos os Status</MenuItem>
                {Object.entries(pedidoStatus).map(([id, status]) => (
                  <MenuItem key={id} value={id}>
                    {status.nome}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data Inicial"
                  value={dateFilter.start}
                  onChange={handleDateChange('start')}
                  renderInput={(params: TextFieldProps) => (
                    <CustomTextField
                      {...params}
                      error={false}
                      size="small"
                      sx={{
                        width: '200px',
                      }}
                    />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data Final"
                  value={dateFilter.end}
                  onChange={handleDateChange('end')}
                  renderInput={(params: TextFieldProps) => (
                    <CustomTextField
                      {...params}
                      error={false}
                      size="small"
                      sx={{
                        width: '200px'
                      }}
                    />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item>
              <Button onClick={handleClearFilters} variant="outlined" size="small">
                Limpar Filtros
              </Button>
            </Grid>
          </Grid>

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
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align='center' sx={{ width: '2%' }}>N° Pedido</TableCell>
                    <TableCell align='center' sx={{ width: '35%' }}>Produtos</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Previsão de Entrega</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Designer</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}>Observação</TableCell>
                    <TableCell align='center' sx={{ width: '7%' }}>Tipo</TableCell>
                    <TableCell align='center' sx={{ width: '3%' }}>Status</TableCell>
                    <TableCell align='center' sx={{ width: '13%' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(paginatedPedidos) && paginatedPedidos.map((row) => {
                    const listaProdutos: Produto[] = row.lista_produtos
                      ? typeof row.lista_produtos === 'string'
                        ? JSON.parse(row.lista_produtos)
                        : row.lista_produtos
                      : [];

                    const dataPrevistaSegura = formatarDataSegura(String(row?.data_prevista));

                    const dataPrevista = row?.data_prevista ? dataPrevistaSegura : null;

                    const dataAtual = formatarDataSegura(zerarHorario(getBrazilTime()).toISOString());

                    // console.log('dataAtual: ', row.numero_pedido, dataAtual)

                    let atraso = false;
                    let isHoje = false;

                    // console.log('dataPrevista: ', row.numero_pedido, row?.data_prevista, formatarDataSegura(String(row?.data_prevista)), dataPrevista, dataAtual)

                    if (dataPrevista && dataPrevista < dataAtual) {
                      atraso = true;
                    }

                    if (dataPrevista && dataPrevista === dataAtual) {
                      isHoje = true;
                    }
                    const parsedDesigners = typeof designers === 'string' ? JSON.parse(designers) : designers;

                    const usersMap = new Map(
                      Array.isArray(parsedDesigners)
                        ? parsedDesigners.map(designer => [designer.id, designer.name])
                        : []
                    );

                    const getUserNameById = (id: number | null | undefined) => {
                      return id && usersMap.has(id) ? usersMap.get(id) : "Desconhecido";
                    };
                    const designerNome = getUserNameById(row.designer_id);

                    const pedidoTipos = {
                      1: 'Prazo normal',
                      2: 'Antecipação',
                      3: 'Faturado',
                      4: 'Metade/Metade',
                      5: 'Amostra',
                    } as const;

                    const pedidoStatusColors: Record<number, string> = {
                      1: 'rgba(220, 53, 69, 0.49)',
                      2: 'rgba(213, 121, 0, 0.8)',
                      3: 'rgba(123, 157, 0, 0.8)',
                      4: 'rgba(0, 152, 63, 0.65)',
                      5: 'rgba(0, 146, 136, 0.8)',
                    };

                    const status = pedidoStatus[row.pedido_status_id as keyof typeof pedidoStatus];
                    const tipo = row.pedido_tipo_id && pedidoTipos[row.pedido_tipo_id as keyof typeof pedidoTipos];

                    return (
                      <>
                        <TableRow
                          key={row.id}
                          sx={{
                          }}
                        >
                          <TableCell
                            sx={{
                              color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(String(row.numero_pedido));
                              setSnackbar({
                                open: true,
                                message: `✅ Número do Pedido ${row.numero_pedido} copiado com sucesso!`,
                                severity: 'success'
                              });

                            }}
                          >
                            {String(row.numero_pedido)}
                          </TableCell>

                          <TableCell sx={{
                            color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                          }} align='left'>
                            <Box
                              sx={{
                                maxHeight: 80,
                                overflowY: 'auto',
                                padding: '12px'
                              }}
                            >
                              {row.lista_produtos?.length > 0
                                ? (
                                  <ul style={{ listStyleType: 'disc', padding: 0, margin: 0 }}>
                                    {listaProdutos.map((produto, index) => (
                                      <li key={index}>{produto.nome} ({produto.quantidade})</li>
                                    ))}
                                  </ul>
                                )
                                : 'N/A'}
                            </Box>
                          </TableCell>

                          <TableCell
                            sx={{
                              color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                              backgroundColor: atraso ? 'rgba(255, 31, 53, 0.64)' : isHoje ? 'rgba(0, 255, 0, 0.64)' : 'rgba(1, 152, 1, 0.64)',
                            }}
                            align="center"
                          >
                            {formatarDataSegura(String(row.data_prevista))}
                          </TableCell>

                          {designerNome !== 'Desconhecido' ? (
                            <TableCell
                              sx={{
                                color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                              }}
                              align="center"
                            >
                              {designerNome}
                            </TableCell>
                          ) : (
                            <TableCell align="center">
                              {canShowButtonDesigner ? (
                                <Button
                                  sx={{
                                    backgroundColor: 'transparent',
                                    borderRadius: '100px',
                                    border: (theme: any) => theme.palette.mode === 'dark' ? '1px solid white' : '1px solid black',
                                    color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                                  }}
                                  onClick={() => handleEntrarDesigner(row.id)}
                                >
                                  <IconUserPlus />
                                </Button>
                              ) : (
                                <>
                                  Não Atribuído
                                </>
                              )}
                            </TableCell>
                          )}

                          <Tooltip title={row?.observacoes ? row.observacoes : "Adicionar Observação"} placement="left">
                            <TableCell
                              sx={{
                                color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                                textAlign: "left",
                              }}
                            >
                              <CustomTextField
                                value={observacoes[String(row?.id)]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleObservacaoChange(String(row?.id), e.target.value)}
                                onKeyDown={(e: { key: string; }) => e.key === "Enter" && handleEnviarObservacao(String(row?.id))}
                                fullWidth
                              />
                            </TableCell>
                          </Tooltip>

                          <TableCell sx={{
                            color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                            backgroundColor: Number(row.pedido_tipo_id) === 2 ? 'rgba(255, 31, 53, 0.64)' : 'inherit',
                          }} align='center'>{tipo ?? '-'}</TableCell>

                          {/* STATUS (precisa validar qual q role do usuario pra usar ou um ou outro) */}
                          <TableCell sx={{
                            color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                            backgroundColor: pedidoStatusColors[row?.pedido_status_id ?? 0] || 'inherit',
                          }} align='center'>
                            <CustomSelect
                              style={{
                                height: '30px',
                                textAlign: 'center',
                                padding: '0px',
                                fontSize: '12px',
                                borderRadius: '4px',
                                backgroundColor: 'transparent',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                cursor: 'pointer',
                                width: '100%',
                                boxSizing: 'border-box',  // Para garantir que o padding não quebre a largura
                              }}

                              value={String(row.pedido_status_id)} // O valor precisa ser uma string
                              onChange={(event: { target: { value: any; }; }) => {
                                const newStatus = event.target.value;  // O valor será do tipo string
                                handleStatusChange(row, Number(newStatus)); // Converte para número antes de passar para a função
                              }}
                            >
                              {Object.entries(pedidoStatus).map(([id, status]) => (
                                <MenuItem key={id} value={id}>
                                  {status.nome}
                                </MenuItem>
                              ))}
                            </CustomSelect>
                          </TableCell>

                          <TableCell sx={{
                            color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                          }} align='center'>
                            <Tooltip title="Ver Detalhes">
                              <IconButton onClick={() => handleVerDetalhes(row)}>
                                <IconEye />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={row.url_trello === null ? "Sem Link do Trello" : "Link Trello"}>
                              <IconButton
                                onClick={() => handleLinkTrello(row)}
                                disabled={row.url_trello === null}
                              >
                                <IconBrandTrello />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Lista de Uniformes">
                              <IconButton onClick={() => handleListaUniformes(row)}>
                                <IconShirt />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Enviar para Impressão!">
                              <IconButton onClick={() => handleEnviarImpressora(row)}>
                                <IconPrinter />
                              </IconButton>
                            </Tooltip>

                            {/* validar a role do user 6*/}
                            {canShowButtonAtribuirDesigner && (
                              <Tooltip title="Atribuir Designer">
                                <IconButton onClick={() => handleAtribuirDesigner(row)}>
                                  <IconBrush />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* validar a role do user 2,4,1*/}
                            {canShowButton && (
                              <>
                                <Tooltip title="Editar">
                                  <IconButton onClick={() => handleEdit(row)}>
                                    <IconEdit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton onClick={() => handleDelete(row)}>
                                    <IconTrash />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>

              </Table >
              <TablePagination
                rowsPerPageOptions={[15, 25, 50, 100, 200]}
                component="div"
                count={filteredPedidos.length || 0}
                rowsPerPage={paginationModel.pageSize}
                page={paginationModel.page}
                onPageChange={(event, newPage) => setPaginationModel({ ...paginationModel, page: newPage })}
                onRowsPerPageChange={(event) => setPaginationModel({ ...paginationModel, pageSize: parseInt(event.target.value, 10), page: 0 })}
              />
            </TableContainer>
          )}
          {selectedRowDesinger !== null && (
            <AssignDesignerDialog openDialogDesinger={openDialogDesinger} onCloseDialogDesinger={() => setOpenDialogDesinger(false)} row={selectedRowDesinger} refetch={refetch} />
          )}
          <DialogObs openDialogObs={openDialogObs} onCloseDialogObs={() => setOpenDialogObs(false)} row={selectedRowObs} refetch={refetch} />
          <SidePanel openDrawer={openDrawer} onCloseDrawer={() => setOpenDrawer(false)} row={selectedRowSidePanel} refetch={refetch} />

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
        </>
      </ParentCard>
    </PageContainer>
  );
};

export default ArteFinalScreen;