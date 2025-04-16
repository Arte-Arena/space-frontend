'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Produto } from './components/types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconEye, IconShirt, IconSquareChevronsRight, IconSquareChevronsLeft } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
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
  Collapse,
  Box,
  MenuItem,
  TextFieldProps,
  AlertProps,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { IconBrandTrello } from '@tabler/icons-react';
import SidePanel from './components/drawer';
import { ApiResponsePedidosArteFinal } from './components/types';
import { format, isSameDay, subDays } from 'date-fns';
import trocarStatusPedidoCorte from './components/useTrocarStatusPedidoCorte';
import trocarStatusPedidoConferencia from './components/useTrocarStatusPedidoConferencia';
import { useThemeMode } from '@/utils/useThemeMode';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import getBrazilTime from '@/utils/brazilTime';
import useFetchPedidoPorData from '../../impressao/components/useGetPedidoPorData';
import { DateTime } from 'luxon';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import trocarEstagioPedidoArteFinal from './components/useTrocarEstagioPedido';
import { calcularDataPassadaDiasUteis } from '@/utils/calcDiasUteis';
import { IconSearch } from '@tabler/icons-react';

const CorteConferenciaScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [searchDateStart, setSearchDateStart] = useState<string | null>(null);
  const [searchDateEnd, setSearchDateEnd] = useState<string | null>(null);
  const [statusFilterCorte, setStatusFilterCorte] = useState<string>("");
  const [statusFilterConferencia, setStatusFilterConferencia] = useState<string>("");
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const observacoesRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [open, setOpen] = useState(false);
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

  const myTheme = useThemeMode()
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('Access token is missing');
    router.push('/auth/login');
  }
  const roles = localStorage.getItem('roles')?.split(',').map(Number) || [];
  const MoverProducaoRoles = [1, 11, 13];
  const canShowButtonMover = roles.some(role => MoverProducaoRoles.includes(role));

  const { data: dataPedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, refetch } = useQuery<ApiResponsePedidosArteFinal>({
    queryKey: ['pedidos', searchQuery, page, rowsPerPage],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final?fila=F&per_page=${rowsPerPage}&page=${page}&q=${encodeURIComponent(searchQuery)}&data_inicial=${searchDateStart}&data_final=${searchDateEnd}`, { // mudar pra fila Corte e Costura no hooks e 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  const { errorPedido, isLoadingPedido, pedido: porDia } = useFetchPedidoPorData("F");

  useEffect(() => {
    if (dataPedidos && dataPedidos.data) {
      setAllPedidos(dataPedidos.data);
    }
  }, [dataPedidos]);

  // handles
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  const handleVerDetalhes = (row: ArteFinal) => {
    setSelectedRowSidePanel(row);
    setOpenDrawer(true);
  };

  const handleEnviarCostura = async (row: ArteFinal) => {
    const confirmar = window.confirm('Deseja enviar o pedido N° ' + row.numero_pedido + ' para Costura?');
    if (confirmar) {
      const sucesso = await trocarEstagioPedidoArteFinal(row?.id, "C", refetch);
      if (sucesso) {
        setSnackbar({
          open: true,
          message: '✅ Sucesso!',
          severity: 'success'
        });
      } else {
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
  }

  const handleVoltarSublimacao = async (row: ArteFinal) => {
    const confirmar = window.confirm('Deseja voltar o pedido N° ' + row.numero_pedido + ' para Sublimação?');
    if (confirmar) {
      const sucesso = await trocarEstagioPedidoArteFinal(row?.id, "S", refetch);
      if (sucesso) {
        setSnackbar({
          open: true,
          message: '✅ Sucesso!',
          severity: 'success'
        });
      } else {
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
  }

  const handleStatusChangeCorte = async (row: ArteFinal, status: string) => {
    const sucesso = await trocarStatusPedidoCorte(row?.id, status, refetch);
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
  const handleStatusChangeConferencia = async (row: ArteFinal, status: string) => {
    const sucesso = await trocarStatusPedidoConferencia(row?.id, status, refetch);
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

  const handleClearFilters = () => {
    setSearchQuery('');
    setQuery('');
    setSearchDateStart(null);
    setSearchDateEnd(null);
    setStatusFilterCorte('');
    setStatusFilterConferencia('');
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleKeyPressObservacoes = (id: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const inputElement = observacoesRefs.current[id];
      const valor = inputElement?.value || '';
      handleEnviarObservacao(id, valor);
    }
  };

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

  const pedidosStatusFilaR: Record<number, { id: number, nome: string; fila: 'R' }> = Object.fromEntries(
    parsedPedidosStatus
      .filter((item: { fila: string }) => item.fila === 'R')
      .map(({ id, nome, fila }: { id: number; nome: string; fila: 'R' }) => [id, { nome, fila }])
  );

  const pedidosStatusFilaF: Record<number, { id: number, nome: string; fila: 'F' }> = Object.fromEntries(
    parsedPedidosStatus
      .filter((item: { fila: string }) => item.fila === 'F')
      .map(({ id, nome, fila }: { id: number; nome: string; fila: 'F' }) => [id, { nome, fila }])
  );

  const pedidoStatusCorte: Record<number, { id: number, nome: string; fila: 'R' }> = pedidosStatusFilaR as Record<number, { id: number, nome: string; fila: 'R' }>;
  const pedidoStatusConferencia: Record<number, { id: number, nome: string; fila: 'F' }> = pedidosStatusFilaF as Record<number, { id: number, nome: string; fila: 'F' }>;

  // Filtro de pedidos
  const filteredPedidos = useMemo(() => {
    return allPedidos.filter((pedido) => {
      const isNumberMatch = !query || String(pedido.numero_pedido).includes(query.trim());

      let isCorteMatch = true;
      if (statusFilterCorte && pedido.confeccao_corte_conferencia) {
        isCorteMatch = pedido.confeccao_corte_conferencia.status_corte === String(statusFilterCorte);
      }

      let isConferenciaMatch = true;
      if (statusFilterConferencia && pedido.confeccao_corte_conferencia) {
        isConferenciaMatch = pedido.confeccao_corte_conferencia.status_conferencia === String(statusFilterConferencia);
      }

      const pedidoDate = new Date(pedido.data_prevista);
      const isDateMatch =
        (!searchDateStart || pedidoDate >= new Date(searchDateStart)) &&
        (!searchDateEnd || pedidoDate <= new Date(searchDateEnd));

      return isNumberMatch && isCorteMatch && isConferenciaMatch && isDateMatch;
    });
  }, [allPedidos, query, statusFilterCorte, statusFilterConferencia, searchDateStart, searchDateEnd]);

  function formatarDataRelatorio(dataString: string): string {
    let dataUTC;
    if (dataString.includes(' ')) {
      dataUTC = DateTime.fromFormat(dataString, 'yyyy-MM-dd HH:mm:ss', { zone: 'utc' });
    } else {
      dataUTC = DateTime.fromISO(dataString, { zone: 'utc' });
    }
    return dataUTC.toFormat('MM/dd/yyyy');
  }

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
      to: "/apps/producao/pedidos",
      title: "Pedidos",
    },
  ];

  return (
    <PageContainer title="Produção / Corte & Conferência" description="Tela de Produção da Corte & Conferência | Arte Arena">
      <>
        <Breadcrumb title="Produção / Corte & Conferência" items={BCrumb} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', padding: 2, mb: 2, }}>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
            <span style={{ fontWeight: 'bold' }}>Total De: </span> {dataPedidos?.total} Pedidos:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: 16 }}>Por Dia: </span>
            <Button onClick={handleToggle} variant="outlined" size='small' sx={{ mb: 0, padding: 1, height: '16px', width: "auto" }}>
              {open ? "Ocultar Pedidos" : "Mostrar Pedidos"}
            </Button>
          </Typography>

          <Collapse in={open}>
            <TableContainer component={Paper} sx={{ maxWidth: 600, margin: 'auto', mt: 4, boxShadow: 3 }}>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>📅 Pedidos por Data</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><strong>Data Entrega</strong></TableCell>
                    <TableCell align="center"><strong>Quantidade de Pedidos</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {porDia && Object.entries(porDia.dados_por_data).map(([data, valores]) => {
                    const { quantidade_pedidos, total_medida_linear } = valores as { quantidade_pedidos: number; total_medida_linear: number };

                    const localStoragePrazos = localStorage.getItem('configPrazos');
                    const feriados = localStorage.getItem('feriados');
                    const parsedFeriados = JSON.parse(feriados || '[]');
                    const parsedPrazos = JSON.parse(localStoragePrazos || '[]');
                    const diasAntecipaProducao = parsedPrazos.dias_antecipa_producao_confeccao_sublimacao;
                    const dataSeguraRelatorio = formatarDataRelatorio(data); // mes dia e ano
                    const dataRelatorio = data ? dataSeguraRelatorio : '';
                    const dataPrevistaDateTime = DateTime.fromFormat(dataRelatorio, 'MM/dd/yyyy').startOf('day');
                    const prazoRelatoriosSublimiacao = calcularDataPassadaDiasUteis(dataPrevistaDateTime, diasAntecipaProducao, parsedFeriados);

                    return (
                      <TableRow key={data}>
                        <TableCell align="center">{prazoRelatoriosSublimiacao.toFormat('dd/MM/yyyy')}</TableCell>
                        <TableCell align="center">{quantidade_pedidos}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </Box>
        <ParentCard title="Corte & Conferência">
          <>
            <Grid container spacing={1} sx={{ alignItems: 'center', mb: 2, flexWrap: 'nowrap' }}>
              {/* Campo de Número do Pedido */}
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

              {/* Select de Status */}
              <Grid item>
                <CustomSelect
                  sx={{ minWidth: '150px' }} // Define uma largura mínima
                  value={statusFilterCorte}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setStatusFilterCorte(e.target.value)}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="">Todos os Status Corte</MenuItem>
                  {Object.entries(pedidoStatusCorte).map(([id, status]) => (
                    <MenuItem key={id} value={status.nome}>
                      {status.nome}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>
              <Grid item>
                <CustomSelect
                  sx={{ minWidth: '150px' }} // Define uma largura mínima
                  value={statusFilterConferencia}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setStatusFilterConferencia(e.target.value)}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="">Todos os Status Conferência</MenuItem>
                  {Object.entries(pedidoStatusConferencia).map(([id, status]) => (
                    <MenuItem key={id} value={status.nome}>
                      {status.nome}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              {/* DatePicker - Data Inicial */}
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
                      <TableCell align='center' sx={{ width: '5%' }}>N° Pedido</TableCell>
                      <TableCell align='center' sx={{ width: '33%' }}>Produtos</TableCell>
                      <TableCell align='center' sx={{ width: '5%' }}>Data De Entrega</TableCell>
                      <TableCell align='center' sx={{ width: '25%' }}>Observação</TableCell>
                      <TableCell align='center' sx={{ width: '3%' }}>Tipo</TableCell>
                      <TableCell align='center' sx={{ width: '7%' }}>Corte</TableCell>
                      <TableCell align='center' sx={{ width: '7%' }}>Conferênia</TableCell>
                      <TableCell align='center' sx={{ width: '15%' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(filteredPedidos) && filteredPedidos.map((row) => {
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
                      const diasAntecipaProducao = parsedPrazos.dias_antecipa_producao_confeccao_sublimacao; // precisa colocar data de corte e conferência
                      const feriados = localStorage.getItem('feriados');
                      const parsedFeriados = JSON.parse(feriados || '[]');
                      const prazoCorteConferencia = calcularDataPassadaDiasUteis(dataPrevistaDateTime, diasAntecipaProducao, parsedFeriados);
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

                      const pedidoStatusColorsCortado: Record<string, string> = {
                        "Não Cortado": 'inherit',
                        "Cortado": 'rgba(0, 152, 63, 0.65)',
                      };
                      const pedidoStatusColorsConferido: Record<string, string> = {
                        "Não Conferido": 'inherit',
                        "Conferido": 'rgba(0, 152, 63, 0.65)',
                      };

                      const tipo = row.pedido_tipo_id && pedidoTiposMapping[row.pedido_tipo_id as keyof typeof pedidoTiposMapping];

                      return (
                        <TableRow
                          key={row.id}
                        >

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black'
                          }}>{String(row.numero_pedido)}</TableCell>

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

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black',
                            backgroundColor: atraso ? 'rgba(255, 31, 53, 0.64)' : isHoje ? 'rgba(0, 255, 0, 0.64)' : 'rgba(1, 152, 1, 0.64)'
                          }} align='center'>
                            {prazoCorteConferencia.toFormat('dd/MM/yyyy')}
                          </TableCell>

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

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black',
                            backgroundColor: Number(row.pedido_tipo_id) === 2 ? 'rgba(255, 31, 53, 0.64)' : 'inherit',
                          }} align='center'>{tipo ?? '-'}</TableCell>

                          <TableCell
                            sx={{
                              color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                              backgroundColor: pedidoStatusColorsCortado[row?.confeccao_corte_conferencia?.status_corte ?? 0] || 'inherit',
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

                              value={String(row.confeccao_corte_conferencia?.status_corte ?? 0)}
                              onChange={(event: { target: { value: string; }; }) => {
                                const newStatus = event.target.value;
                                handleStatusChangeCorte(row, newStatus);
                              }}
                            >
                              {Object.entries(pedidoStatusCorte).map(([id, status]) => (
                                <MenuItem key={id} value={status.nome}>
                                  {status.nome}
                                </MenuItem>
                              ))}
                            </CustomSelect>
                          </TableCell>

                          <TableCell
                            sx={{
                              color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                              backgroundColor: pedidoStatusColorsConferido[row?.confeccao_corte_conferencia?.status_conferencia ?? 0] || 'inherit',
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

                              value={String(row.confeccao_corte_conferencia?.status_conferencia ?? 0)}
                              onChange={(event: { target: { value: string; }; }) => {
                                const newStatus = event.target.value;
                                handleStatusChangeConferencia(row, newStatus);
                              }}
                            >
                              {Object.entries(pedidoStatusConferencia).map(([id, status]) => (
                                <MenuItem key={id} value={status.nome}>
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

                                <Tooltip title="Lista de Uniformes">
                                  <IconButton onClick={() => handleListaUniformes(row)}>
                                    <IconShirt />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                              <Grid item xs={5} sm={5} md={5} lg={5}>
                                <Tooltip title={row.url_trello === null ? "Sem Link do Trello" : "Link Trello"}>
                                  <IconButton
                                    onClick={() => handleLinkTrello(row)}
                                    disabled={row.url_trello === null}
                                  >
                                    <IconBrandTrello />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                              {canShowButtonMover && (
                                <>
                                  <Grid item xs={5} sm={5} md={5} lg={5}>
                                    <Tooltip title="Mover para Sublimação">
                                      <IconButton onClick={() => handleVoltarSublimacao(row)}>
                                        <IconSquareChevronsLeft />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                  <Grid item xs={5} sm={5} md={5} lg={5}>
                                    <Tooltip title="Mover para Costura">
                                      <IconButton onClick={() => handleEnviarCostura(row)}>
                                        <IconSquareChevronsRight />
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
                </Table>
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
            <SidePanel openDrawer={openDrawer} onCloseDrawer={() => setOpenDrawer(false)} row={selectedRowSidePanel} />
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
      </>
    </PageContainer>

  );
};

export default CorteConferenciaScreen;