'use client';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { format, isSameDay, subDays } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import getBrazilTime from '@/utils/brazilTime';
import { DateTime } from 'luxon';
import { calcularDataPassadaDiasUteis } from '@/utils/calcDiasUteis';
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
  Select,
  TextFieldProps,
  Snackbar,
  AlertProps,
  Alert,
  InputAdornment
} from "@mui/material";
import { IconEdit, IconEye, IconTrash, IconShirt, IconBrush, IconPrinter, IconBrandTrello, IconUserPlus, IconSearch } from '@tabler/icons-react';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import { ArteFinal, Produto } from './components/types';
import SidePanel from './components/drawer';
import AssignDesignerDialog from './components/designerDialog';
import { ApiResponsePedidosArteFinal } from './components/types';
import trocarStatusPedido from './components/useTrocarStatusPedido';
import deletePedidoArteFinal from './components/useDeletePedido';
import atribuirDesigner from './components/useDeisgnerJoin';
import trocarEstagioPedidoArteFinal from './components/useTrocarEstagioPedido';

const ArteFinalScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [openDialogDesinger, setOpenDialogDesinger] = useState(false);
  const [selectedRowDesinger, setSelectedRowDesinger] = useState<ArteFinal | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [searchDateStart, setSearchDateStart] = useState<string | null>(null);
  const [searchDateEnd, setSearchDateEnd] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(15);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [diasAntecipaProducao, setDiasAntecipaProducao] = useState<number>(0);
  const observacoesRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('Access token is missing');
    router.push('/auth/login');
  }

  const designers = localStorage.getItem('designers');
  const roles = localStorage.getItem('roles')?.split(',').map(Number) || [];
  const configs = localStorage.getItem('configs');

  const DesignerRoles = [1, 6, 13];
  const DesignerCoordanateRole = [1, 7, 13];
  const BackOfficeRoles = [1, 10, 13];

  const canShowButtonAtribuirDesigner = roles.some(role => DesignerCoordanateRole.includes(role));
  const canShowButtonDesigner = roles.some(role => DesignerRoles.includes(role));
  const canShowButtonBackOffice = roles.some(role => BackOfficeRoles.includes(role));


  useEffect(() => {
    if (configs) {
      const configsParsed = JSON.parse(configs);
      const diasAntecipaProducao = configsParsed.dias_antecipa_producao;
      setDiasAntecipaProducao(diasAntecipaProducao);
    }
  }, [configs]);

  const { data: dataPedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, refetch } = useQuery<ApiResponsePedidosArteFinal>({
    queryKey: ['pedidos', searchQuery, page, rowsPerPage],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final?fila=D&per_page=${rowsPerPage}&page=${page}&q=${encodeURIComponent(searchQuery)}&data_inicial=${searchDateStart}&data_final=${searchDateEnd}`, {
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

  //handles
  const handleFilter = () => {
    setPage(1);
    setSearchQuery(query);
    refetch();
  }

  const handleSearch = () => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTablePageChange = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleKeyPressObservacoes = (id: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const inputElement = observacoesRefs.current[id];
      const valor = inputElement?.value || '';
      handleEnviarObservacao(id, valor);
    }
  };

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
      setSnackbar({
        open: true,
        message: 'Falha ao atribuir designer.',
        severity: 'error'
      });
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

    if (row.lista_produtos) {
      const listaProdutos: Produto[] = row.lista_produtos
        ? typeof row.lista_produtos === 'string'
          ? JSON.parse(row.lista_produtos)
          : row.lista_produtos
        : [];

      const produtosInvalidos = listaProdutos.some(
        (produto: Produto) => !produto.medida_linear || produto.medida_linear <= 0
      );

      if (produtosInvalidos) {
        return setSnackbar({
          open: true,
          message: `${'Todos os produtos devem ter medidas lineares maiores que zero antes de enviar para Impressão'}`,
          severity: 'error'
        });
      }
    }


    if (confirmar) {
      const sucesso = await trocarEstagioPedidoArteFinal(row?.id, 'I', refetch);
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
    const statusEncontrado = pedidoStatus[status_id];

    if (!statusEncontrado) {
      console.error("Status não encontrado para o id fornecido:", status_id);
      setSnackbar({
        open: true,
        message: 'Status não encontrado.',
        severity: 'warning'
      });
      return;
    }
    const sucesso = await trocarStatusPedido(row?.id, statusEncontrado.nome, refetch);
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

  const handleEnviarObservacao = async (id: string, obs: string) => {
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
          body: JSON.stringify({ observacoes: obs }),
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

  const localStoragePedidosTipos = localStorage.getItem('pedidosTipos');
  const parsedPedidosTipos = JSON.parse(localStoragePedidosTipos || '[]');
  const pedidoTiposMapping = parsedPedidosTipos.reduce((acc: any, item: any) => {
    acc[item.id] = item.nome;
    return acc;
  }, {});

  const localStoragePedidosStatus = localStorage.getItem('pedidosStatus');
  const parsedPedidosStatus = JSON.parse(localStoragePedidosStatus || '[]');

  const pedidosStatusFilaD: Record<number, { id: number, nome: string; fila: 'D' }> = Object.fromEntries(
    parsedPedidosStatus
      .filter((item: { fila: string }) => item.fila === 'D')
      .map(({ id, nome, fila }: { id: number; nome: string; fila: 'D' }) => [id, { nome, fila }])
  );

  const pedidoStatus: Record<number, { id: number, nome: string; fila: 'D' }> = pedidosStatusFilaD as Record<number, { id: number, nome: string; fila: 'D' }>;

  const filteredPedidos = useMemo(() => {
    return allPedidos.filter((pedido) => {
      const isNumberMatch = !query || String(pedido.numero_pedido).includes(query.trim());
      const isStatusMatch = !statusFilter || pedido.pedido_status_id === Number(statusFilter);
      const pedidoDate = new Date(pedido.data_prevista);
      const isDateMatch =
        (!searchDateStart || pedidoDate >= new Date(searchDateStart)) &&
        (!searchDateEnd || pedidoDate <= new Date(searchDateEnd));
      return isNumberMatch && isStatusMatch && isDateMatch;
    });
  }, [allPedidos, searchDateStart, searchDateEnd, statusFilter, query]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setQuery('');
    setSearchDateStart(null);
    setSearchDateEnd(null);
    setStatusFilter('');
  };

  function formatarDataSegura(dataISOString: string): string {
    const dataUTC = DateTime.fromISO(dataISOString, { zone: 'utc' });
    const dataFormatada = dataUTC.toFormat('MM/dd/yyyy');
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
      to: "/apps/producao/",
      title: "produção",
    },
    {
      to: "/apps/producao/arte-final",
      title: "Pedidos com Arte Final",
    },
  ];

  return (
    <PageContainer title="Produção / Arte - Final" description="Tela de Produção da Arte - Final | Arte Arena">
      <Breadcrumb title="Produção / Arte - Final" items={BCrumb} />
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, p: 2 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
          Total de Pedidos: <strong>{dataPedidos?.total}</strong>.
        </Typography>
      </Box>
      <ParentCard title="Arte - Final">
        <>
          <Grid container spacing={1} sx={{ alignItems: 'center', mb: 2, flexWrap: 'nowrap' }}>
            <Grid item>
              <CustomTextField
                label="Número do Pedido"
                variant="outlined"
                size="small"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Buscar orçamento..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item>
              <Select
                sx={{ minWidth: '150px' }}
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
                  value={searchDateStart}
                  onChange={(newDate: Date | null) => setSearchDateStart(newDate ? format(newDate, 'yyyy-MM-dd') : null)}
                  renderInput={(params: TextFieldProps) => (
                    <CustomTextField
                      {...params}
                      error={false}
                      size="small"
                      sx={{ width: '200px' }}
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
                  value={searchDateEnd}
                  onChange={(newDate: Date | null) => setSearchDateEnd(newDate ? format(newDate, 'yyyy-MM-dd') : null)}
                  renderInput={(params: TextFieldProps) => (
                    <CustomTextField
                      {...params}
                      error={false}
                      size="small"
                      sx={{ width: '200px' }}
                    />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>

            {/* Botão Limpar Filtros */}
            <Grid item>
              <Button onClick={handleClearFilters} variant="outlined" size="small">
                Limpar Filtros
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleFilter} variant="outlined" size="small">
                Filtrar Profundamente
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
                    <TableCell align='center' sx={{ width: '5%' }}>Prazo de Entrega da Arte Final</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Designer</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}>Observação</TableCell>
                    <TableCell align='center' sx={{ width: '3%' }}>Tipo</TableCell>
                    <TableCell align='center' sx={{ width: '7%' }}>Status</TableCell>
                    <TableCell align='center' sx={{ width: '13%' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(filteredPedidos) &&
                    filteredPedidos.map((row) => {

                      const listaProdutos: Produto[] = row.lista_produtos
                        ? typeof row.lista_produtos === 'string'
                          ? JSON.parse(row.lista_produtos)
                          : row.lista_produtos
                        : [];

                      const dataPrevistaSegura = formatarDataSegura(String(row?.data_prevista));
                      const dataPrevista = row?.data_prevista ? dataPrevistaSegura : '';
                      const dataPrevistaDateTime = DateTime.fromFormat(dataPrevista, 'MM/dd/yyyy').startOf('day');
                      const dataAtual = formatarDataSegura(zerarHorario(getBrazilTime()).toISOString());
                      const localStoragePrazos = localStorage.getItem('configPrazos');
                      const parsedPrazos = JSON.parse(localStoragePrazos || '[]');
                      const diasAntecipaProducao = parsedPrazos.dias_antecipa_producao_arte_final;
                      const feriados = localStorage.getItem('feriados');
                      const parsedFeriados = JSON.parse(feriados || '[]');
                      const prazoArteFinal = calcularDataPassadaDiasUteis(dataPrevistaDateTime, diasAntecipaProducao, parsedFeriados);
                      let atraso = false;
                      let isHoje = false;
                      const dataAtualJS = new Date(dataAtual);
                      const dataPrevistaConfeccao = new Date(String(dataPrevista));
                      const dataPrevistaArteFinal = subDays(dataPrevistaConfeccao, diasAntecipaProducao);
                      if (dataPrevistaArteFinal < dataAtualJS) {
                        atraso = true;
                      }
                      if (isSameDay(dataPrevistaArteFinal, dataAtualJS)) {
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

                      const pedidoStatusColors: Record<number, string> = {
                        1: 'rgba(220, 53, 69, 0.49)',
                        2: 'rgba(213, 121, 0, 0.8)',
                        3: 'rgba(123, 157, 0, 0.8)',
                        4: 'rgba(0, 152, 63, 0.65)',
                        5: 'rgba(0, 146, 136, 0.8)',
                      };

                      const tipo = row.pedido_tipo_id && pedidoTiposMapping[row.pedido_tipo_id as keyof typeof pedidoTiposMapping];

                      return (
                        <TableRow
                          key={row.id}
                          sx={{
                            height: '84px',
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
                                paddingLeft: '5%',
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
                            {prazoArteFinal.toFormat('dd/MM/yyyy')}
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
                                key={row?.id}
                                label={row?.observacoes ? "Observação" : "Adicionar Observação"}
                                defaultValue={row?.observacoes || ""}
                                inputRef={(ref: HTMLInputElement | null) => {
                                  if (row?.id && ref) {
                                    observacoesRefs.current[row.id] = ref;
                                  }
                                }}
                                onBlur={() => {
                                  if (row?.id) {
                                    const inputElement = observacoesRefs.current[row.id];
                                    const valor = inputElement?.value || '';
                                    handleEnviarObservacao(String(row.id), valor);
                                  }
                                }}
                                onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                  if (row?.id) handleKeyPressObservacoes(String(row.id), event);
                                }}
                                fullWidth
                              />
                            </TableCell>
                          </Tooltip>

                          <TableCell
                            sx={{
                              color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                              backgroundColor: Number(row.pedido_tipo_id) === 2 ? 'rgba(255, 31, 53, 0.64)' : 'inherit',
                            }}
                            align='center'
                          >
                            {tipo ?? '-'}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                              backgroundColor: pedidoStatusColors[row?.pedido_status_id ?? 0] || 'inherit',
                            }}
                            align='center'
                          >
                            <CustomSelect
                              style={{
                                height: '30px',
                                textAlign: 'center',
                                padding: '0px',
                                fontSize: '12px',
                                borderRadius: '4px',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                width: '100%',
                                boxSizing: 'border-box',
                              }}

                              value={String(row.pedido_status_id)}
                              onChange={(event: { target: { value: number; }; }) => {
                                const newStatus = event.target.value;
                                handleStatusChange(row, newStatus);
                              }}
                            >
                              {Object.entries(pedidoStatus).map(([id, status]) => (
                                <MenuItem key={id} value={id}>
                                  {status.nome}
                                </MenuItem>
                              ))}
                            </CustomSelect>
                          </TableCell>

                          <TableCell
                            sx={{
                              color: (theme: any) => theme.palette.mode === "dark" ? "white" : "black",
                            }}
                            align="center"
                          >
                            <Grid container spacing={0} justifyContent="left">
                              <Grid item xs={5} sm={5} md={5} lg={5}>
                                <Tooltip title="Ver Detalhes">
                                  <IconButton onClick={() => handleVerDetalhes(row)}>
                                    <IconEye />
                                  </IconButton>
                                </Tooltip>
                              </Grid>

                              <Grid item xs={5} sm={5} md={5} lg={5}>
                                {row.url_trello !== null ? (
                                  <Tooltip title="Link Trello">
                                    <IconButton onClick={() => handleLinkTrello(row)} disabled={row.url_trello === null}>
                                      <IconBrandTrello />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <IconButton onClick={() => handleLinkTrello(row)} disabled={row.url_trello === null}>
                                    <IconBrandTrello />
                                  </IconButton>
                                )}
                              </Grid>

                              <Grid item xs={5} sm={5} md={5} lg={5}>
                                <Tooltip title="Lista de Uniformes">
                                  <IconButton onClick={() => handleListaUniformes(row)}>
                                    <IconShirt />
                                  </IconButton>
                                </Tooltip>
                              </Grid>

                              {canShowButtonAtribuirDesigner && (
                                <>
                                  <Grid item xs={5} sm={5} md={5} lg={5}>
                                    <Tooltip title="Atribuir Designer">
                                      <IconButton onClick={() => handleAtribuirDesigner(row)}>
                                        <IconBrush />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                </>
                              )}

                              {canShowButtonDesigner && (
                                <>
                                  <Grid item xs={5} sm={5} md={5} lg={5}>
                                    <Tooltip title="Mover para Impressão!">
                                      <IconButton onClick={() => handleEnviarImpressora(row)}>
                                        <IconPrinter />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                </>
                              )}

                              {canShowButtonBackOffice && (
                                <>
                                  <Grid item xs={5} sm={5} md={5} lg={5}>
                                    <Tooltip title="Editar">
                                      <IconButton onClick={() => handleEdit(row)}>
                                        <IconEdit />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>

                                  <Grid item xs={5} sm={5} md={5} lg={5}>
                                    <Tooltip title="Excluir">
                                      <IconButton onClick={() => handleDelete(row)}>
                                        <IconTrash />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>

              </Table >
              <TablePagination
                component="div"
                count={dataPedidos?.total || 0}
                page={page - 1}
                onPageChange={handleTablePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[15, 25, 50]}
              />
            </TableContainer>
          )}
          {selectedRowDesinger !== null && (
            <AssignDesignerDialog openDialogDesinger={openDialogDesinger} onCloseDialogDesinger={() => setOpenDialogDesinger(false)} row={selectedRowDesinger} refetch={refetch} />
          )}
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