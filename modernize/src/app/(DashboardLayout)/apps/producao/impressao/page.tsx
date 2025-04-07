'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Produto } from './components/types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconEye, IconShirt, IconNeedleThread } from '@tabler/icons-react';
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
  useTheme,
  TextField,
  Select,
  TextFieldProps,
  AlertProps,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { GridPaginationModel } from '@mui/x-data-grid';
import { IconBrandTrello } from '@tabler/icons-react';
import SidePanel from './components/drawer';
import { ApiResponsePedidosArteFinal } from './components/types';
import { format, isSameDay } from 'date-fns';
import trocarStatusPedido from './components/useTrocarStatusPedido';
import { useThemeMode } from '@/utils/useThemeMode';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import getBrazilTime from '@/utils/brazilTime';
import useFetchPedidoPorData from './components/useGetPedidoPorData';
import { DateTime } from 'luxon';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import trocarImpressora from './components/useTrocarImpressora';
import trocarTipoCorte from './components/useTrocarTipoCorte';

const ImpressaoScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialogObs, setOpenDialogObs] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [selectedRowObs, setSelectedRowObs] = useState<ArteFinal | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [searchNumero, setSearchNumero] = useState<string>("");  // Filtro de número do pedido
  const [statusFilter, setStatusFilter] = useState<string>("");  // Filtro de status
  const [dateFilter, setDateFilter] = useState<{ start: string | null; end: string | null }>({ start: '', end: '' });  // Filtro de data
  const [open, setOpen] = useState(false);
  const [diasAntecipaProducao, setDiasAntecipaProducao] = useState<number>(0);
  const observacoesRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
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
  const theme = useTheme()
  const myTheme = useThemeMode()

  const accessToken = localStorage.getItem('accessToken');
  const designers = localStorage.getItem('designers');

  const filters = {
    numero_pedido: searchNumero,
    pedido_status_id: statusFilter,
  };

  const { data: dataPedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, refetch } = useQuery<ApiResponsePedidosArteFinal>({
    queryKey: ['pedidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final?fila=I`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });
  console.log(dataPedidos);

  const { errorPedido, isLoadingPedido, pedido: porDia } = useFetchPedidoPorData("I");
  // console.log(errorPedido);

  useEffect(() => {
    if (dataPedidos && dataPedidos.data) { // Verificação adicional
      setAllPedidos(dataPedidos.data);
    }
  }, [dataPedidos]);

  const handleKeyPressObservacoes = (id: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const inputElement = observacoesRefs.current[id];
      const valor = inputElement?.value || '';
      handleEnviarObservacao(id, valor);
    }
  };

  const totalMedidaLinearGlobal = Array.isArray(allPedidos)
    ? allPedidos.reduce((totalPedido, row) => {
      const listaProdutos: Produto[] = row.lista_produtos
        ? typeof row.lista_produtos === "string"
          ? JSON.parse(row.lista_produtos)
          : row.lista_produtos
        : [];

      return totalPedido + listaProdutos.reduce((acc, produto) => acc + (produto.medida_linear ?? 0), 0);
    }, 0)
    : 0;

    // handles
    //     Route::patch('/producao/impressao/impressora-change/{id}', [PedidoArteFinalController::class, 'trocarImpressoraArteFinalImpressao']);
    // Route::patch('/producao/impressao/corte-change/{id}', [PedidoArteFinalController::class, 'trocarCorteArteFinalImpressao']);
    // criar os handles de trocarImpressoraArteFinalImpressao e trocarCorteArteFinalImpressao
    
  const handleImpressoraChange = async (row: ArteFinal, impressora: number) => {
    const sucesso = await trocarImpressora(row?.id, impressora, refetch);
    if (sucesso) {
      console.log("Impressora atualizada com sucesso!");
      setSnackbar({
        open: true,
        message: `✅ ${'Sucesso!'}`,
        severity: 'success'
      });
    } else {
      console.log("Falha ao trocar Impressora.");
      setSnackbar({
        open: true,
        message: `${'Impressora não atualizada.'}`,
        severity: 'warning'
      });
    }
  }

  const handleTipoCorteChange = async (row: ArteFinal, TipoCorte: string) => {
    const sucesso = await trocarTipoCorte(row?.id, TipoCorte, refetch);
    if (sucesso) {
      console.log("Corte atualizado com sucesso!");
      setSnackbar({
        open: true,
        message: `✅ ${'Sucesso!'}`,
        severity: 'success'
      });
    } else {
      console.log("Falha ao trocar corte.");
      setSnackbar({
        open: true,
        message: `${'Corte não atualizado.'}`,
        severity: 'warning'
      });
    }
  }


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

  const handleEnviarConfeccao = async (row: ArteFinal) => {
    const confirmar = window.confirm('Deseja enviar o pedido N° ' + row.numero_pedido + ' para Confecção?');

    if (confirmar) {
      const sucesso = await trocarStatusPedido(row?.id, 14, refetch);
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
  };

  const handleVerDetalhes = (row: ArteFinal) => {
    setSelectedRowSidePanel(null); // Zera antes de atualizar
    setTimeout(() => {
      setSelectedRowSidePanel(row);
      setOpenDrawer(true);
    }, 0);
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

  const handleClearFilters = () => {
    setSearchNumero('');
    setStatusFilter('');
    setDateFilter({ start: null, end: null });
  };

  const handleDateChange = (field: 'start' | 'end') => (newValue: Date | null) => {
    setDateFilter((prev) => ({ ...prev, [field]: newValue }));
  }

  const handleToggle = () => {
    setOpen(!open);
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

  const pedidoStatus = {
    8: { nome: 'Pendente', fila: 'I' },
    9: { nome: 'Processando', fila: 'I' },
    10: { nome: 'Renderizando', fila: 'I' },
    11: { nome: 'Impresso', fila: 'I' },
    12: { nome: 'Em Impressão', fila: 'I' },
    13: { nome: 'Separação', fila: 'I' },
  } as const;

  // Filtro de pedidos
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

  return (
    <PageContainer title="Produção / Impressão" description="Tela de Produção da Impressão | Arte Arena">
      <Breadcrumb title="Produção / Impressão" items={BCrumb} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', padding: 2, mb: 2, }}>
        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
          <span style={{ fontWeight: 'bold' }}>Total Medida Linear:</span> {totalMedidaLinearGlobal.toFixed(2)} Metros
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
          <span style={{ fontWeight: 'bold' }}>Total De: </span> {allPedidos.length} Pedidos:
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
                  <TableCell align="center"><strong>Medida Linear Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {porDia && Object.entries(porDia.dados_por_data).map(([data, valores]) => {
                  const { quantidade_pedidos, total_medida_linear } = valores as { quantidade_pedidos: number; total_medida_linear: number };

                  // Formata a data para "DD/MM/YYYY"
                  const dataObjeto = DateTime.fromFormat(data, "yyyy-MM-dd HH:mm:ss");
                  const dataFormatada = dataObjeto.toFormat("dd/MM/yyyy");

                  return (
                    <TableRow key={data}>
                      <TableCell align="center">{dataFormatada}</TableCell>
                      <TableCell align="center">{quantidade_pedidos}</TableCell>
                      <TableCell align="center">{total_medida_linear.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>
      <ParentCard title="Impressão">
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

            {/* DatePicker - Data Inicial */}
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data Inicial"
                  value={dateFilter.start}
                  onChange={handleDateChange('start')}
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      {...params}
                      error={false}
                      size="small"
                      sx={{ width: '200px' }} // Define uma largura fixa
                    />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>

            {/* DatePicker - Data Final */}
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data Final"
                  value={dateFilter.end}
                  onChange={handleDateChange('end')}
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      {...params}
                      error={false}
                      size="small"
                      sx={{ width: '200px' }} // Define uma largura fixa
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
                    {/* <TableCell> </TableCell> */}
                    <TableCell align='center' sx={{ width: '2%' }}>N° Pedido</TableCell>
                    <TableCell align='center' sx={{ width: '30%' }}>Produtos</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Medida Linear</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Impressora</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Tipo de corte</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Data De Entrega</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Designer</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}>Observação</TableCell>
                    <TableCell align='center' sx={{ width: '3%' }}>Tipo</TableCell>
                    <TableCell align='center' sx={{ width: '7%' }}>Status</TableCell>
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

                    // definição das datas e atrasos
                    const dataPrevista = row?.data_prevista ? new Date(row?.data_prevista) : null;
                    const dataAtual = getBrazilTime(); //colocar no getBrazilTime
                    let atraso = false;
                    let isHoje = false;
                    if (dataPrevista && dataPrevista < dataAtual) {
                      atraso = true;
                    }
                    if (dataPrevista && isSameDay(dataPrevista, dataAtual)) {
                      isHoje = true;
                    }

                    // definição dos designers
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

                    const pedidoStatus = {
                      8: { nome: 'Pendente', fila: 'I' },
                      9: { nome: 'Processando', fila: 'I' },
                      10: { nome: 'Renderizando', fila: 'I' },
                      11: { nome: 'Impresso', fila: 'I' },
                      12: { nome: 'Em Impressão', fila: 'I' },
                      13: { nome: 'Separação', fila: 'I' },
                    } as const;

                    const pedidoStatusColors: Record<number, string> = {
                      8: 'rgba(220, 53, 69, 0.49)',
                      9: 'rgba(213, 121, 0, 0.8)',
                      10: 'rgba(123, 157, 0, 0.8)',
                      11: 'rgba(0, 152, 63, 0.65)',
                      12: 'rgba(0, 146, 136, 0.8)',
                      13: 'rgba(238, 84, 84, 0.8)',
                    };

                    const status = pedidoStatus[row.pedido_status_id as keyof typeof pedidoStatus];
                    const tipo = row.pedido_tipo_id && pedidoTipos[row.pedido_tipo_id as keyof typeof pedidoTipos];

                    return (
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

                        {/* medida linear */}
                        <TableCell
                          sx={{
                            color: myTheme === "dark" ? "white" : "black",
                          }}
                          align="center"
                        >
                          {row.lista_produtos?.length > 0 ? (
                            <>
                              <strong>
                                {listaProdutos
                                  .filter((produto) => produto.medida_linear)
                                  .reduce((acc, produto) => acc + produto.medida_linear, 0)
                                  .toFixed(2)}{" "}
                                m
                              </strong>
                            </>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        {/* impressora */}
                        <TableCell
                          sx={{
                            color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
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

                            value={row.impressao?.impressora ?? 0}
                            onChange={(event: { target: { value: number; }; }) => {
                              const newImpressora = event.target.value;
                              handleImpressoraChange(row, newImpressora);
                            }}
                          >
                            <MenuItem key={1} value={1}>
                              {1}
                            </MenuItem>
                            <MenuItem key={2} value={2}>
                              {2}
                            </MenuItem>
                          </CustomSelect>
                        </TableCell>

                        {/* tipo_corte */}
                        <TableCell
                          sx={{
                            color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
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

                            value={row.impressao?.tipo_corte ?? " - "}
                            onChange={(event: { target: { value: string; }; }) => {
                              const newTipoCorte = event.target.value;
                              handleTipoCorteChange(row, newTipoCorte);
                            }}
                          >
                            <MenuItem key={1} value={"Laser"}>
                              Laser
                            </MenuItem>
                            <MenuItem key={2} value={"Mesa"}>
                              Mesa
                            </MenuItem>
                            <MenuItem key={3} value={"Normal"}>
                              Normal
                            </MenuItem>
                          </CustomSelect>
                        </TableCell>

                        <TableCell sx={{
                          color: myTheme === 'dark' ? 'white' : 'black',
                          backgroundColor: atraso ? 'rgba(255, 31, 53, 0.64)' : isHoje ? 'rgba(0, 255, 0, 0.64)' : 'rgba(1, 152, 1, 0.64)'
                        }} align='center'>
                          {row?.data_prevista ? format(new Date(row?.data_prevista), "dd/MM/yyyy") : "Data inválida"}
                          {atraso && <span> (Atraso)</span>}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: myTheme === 'dark' ? 'white' : 'black'
                          }}
                          align='center'
                        >
                          {designerNome ?? 'Não Atribuido'}
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
                            onChange={(event: { target: { value: any; }; }) => {
                              const newStatus = event.target.value;
                              handleStatusChange(row, Number(newStatus));
                            }}
                          >
                            {Object.entries(pedidoStatus).map(([id, status]) => (
                              <MenuItem key={id} value={id}>
                                {status.nome}
                              </MenuItem>
                            ))}
                          </CustomSelect>
                        </TableCell>

                        <TableCell align='center'>
                          <Tooltip title="Ver Detalhes">
                            <IconButton onClick={() => handleVerDetalhes(row)}>
                              <IconEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Lista de Uniformes">
                            <IconButton onClick={() => handleListaUniformes(row)}>
                              <IconShirt />
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
                          <Tooltip title="Enviar para Confecção!">
                            <IconButton onClick={() => handleEnviarConfeccao(row)}>
                              <IconNeedleThread />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

              </Table>
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
    </PageContainer >

  );
};

export default ImpressaoScreen;