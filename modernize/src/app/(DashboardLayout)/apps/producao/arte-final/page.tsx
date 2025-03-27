'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Produto } from './components/types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconEdit, IconEye, IconTrash, IconShirt, IconBrush } from '@tabler/icons-react';
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
  TableSortLabel,
  IconButton,
  Collapse,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  TextField,
  Select,
  TextFieldProps,
  Snackbar,
  AlertProps,
  Alert,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { GridPaginationModel } from '@mui/x-data-grid';
import { IconPrinter } from '@tabler/icons-react';
import { IconBrandTrello } from '@tabler/icons-react';
import SidePanel from './components/drawer';
import AssignDesignerDialog from './components/designerDialog';
import { ApiResponsePedidosArteFinal } from './components/types';
import { format, isSameDay } from 'date-fns';
import trocarStatusPedido from './components/useTrocarStatusPedido';
import DialogObs from './components/observacaoDialog';
import deletePedidoArteFinal from './components/useDeletePedido';
import { useThemeMode } from '@/utils/useThemeMode';
import atribuirDesigner from './components/useDeisgnerJoin';
import { IconUserPlus } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import getBrazilTime from '@/utils/brazilTime';
import { DateTime } from 'luxon';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';

const ArteFinalScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [openDialogDesinger, setOpenDialogDesinger] = useState(false);
  const [openDialogObs, setOpenDialogObs] = useState(false);
  const [selectedRowDesinger, setSelectedRowDesinger] = useState<ArteFinal | null>(null);
  const [selectedRowObs, setSelectedRowObs] = useState<ArteFinal | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [rows, setRows] = useState<ArteFinal[]>([]);
  const [observacoes, setObservacoes] = useState<{ [key: string]: string }>({});
  const [searchNumero, setSearchNumero] = useState<string>("");  // Filtro de número do pedido
  const [statusFilter, setStatusFilter] = useState<string>("");  // Filtro de status
  const [dateFilter, setDateFilter] = useState<{ start: string | null; end: string | null }>({ start: '', end: '' });  // Filtro de data
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
  const roles = localStorage.getItem('roles')?.split(',').map(Number) || [];
  const allowedRoles = [1, 2, 4, 7, 10]; // colocar backoffice
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
    if (dataPedidos && dataPedidos.data) { // Verificação adicional
      setAllPedidos(dataPedidos.data);
      console.log(dataPedidos);
    }
  }, [dataPedidos]);


  // Inicializa o estado apenas uma vez
  useEffect(() => {
    const inicializarObservacoes = paginatedPedidos.reduce((acc, row) => {
      acc[row?.id ?? 0] = row.observacoes || "";
      return acc;
    }, {} as { [key: string]: string });

    setObservacoes(inicializarObservacoes);
  }, [allPedidos]);

  const handleObservacaoChange = (id: string, novaObservacao: string) => {
    setObservacoes((prev) => ({ ...prev, [id]: novaObservacao }));
  };

  console.log(allPedidos);

  useEffect(() => {
    if (!openDialogDesinger) {
      refetch(); // Chama refetch quando o dialog é fechado
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

    // validações
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

  // handles dos selects
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
    // abre o dialog e passa a row
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
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ observacoes: observacoes[id] }), // Envia apenas a observação específica do ID
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar observação");
      }

      const data = await response.json();
      console.log("Observação salva com sucesso:", data);

      refetch(); // Atualiza os dados da página
      router.refresh();
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

  // Filtro de pedidos
  const filteredPedidos = useMemo(() => {
    return allPedidos.filter((pedido) => {
      // Verifica se o número do pedido corresponde ao filtro
      const isNumberMatch = !filters.numero_pedido || pedido.numero_pedido.toString().includes(filters.numero_pedido);

      // Verifica se o status do pedido corresponde ao filtro
      const isStatusMatch = !filters.pedido_status_id || pedido.pedido_status_id === Number(filters.pedido_status_id);

      // Filtro de data (data inicial e final)
      const isDateMatch = (
        (!dateFilter.start || new Date(pedido.data_prevista) >= new Date(dateFilter.start)) &&
        (!dateFilter.end || new Date(pedido.data_prevista) <= new Date(dateFilter.end))
      );

      // Retorna true se todas as condições de filtro forem atendidas
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

  useEffect(() => {
    console.log("📌 Estado atualizado - selectedRowIdSidePanel:", selectedRowSidePanel);
  }, [selectedRowSidePanel]);

  // console.log(allPedidos);
  // console.log(designers);

  return (
    <PageContainer title="Produção / Arte - Final" description="Tela de Produção da Arte - Final | Arte Arena">
      <Breadcrumb title="Produção / Arte - Final" items={BCrumb} />
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, }}>
        <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
          Total de {allPedidos.length} Pedidos
          {/* {filteredPedidos.length} Filtrados */}
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
                    <TableCell align='center' sx={{ width: '5%' }}>N° Pedido</TableCell>
                    <TableCell align='center' sx={{ width: '15%' }}>Produtos</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Previsão de Entrega</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Designer</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Observação</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Tipo</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Status</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}>Ações</TableCell>
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
                    // tem que usar isso na logica do rastreamento

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

                    const pedidoStatusColors: Record<number, string> = {
                      1: 'rgba(220, 53, 69, 0.49)',
                      2: 'rgba(213, 121, 0, 0.8)',
                      3: 'rgba(123, 157, 0, 0.8)',
                      4: 'rgba(0, 152, 63, 0.65)',
                      5: 'rgba(0, 146, 136, 0.8)',
                      // 19: 'rgba(238, 84, 84, 0.8)',
                      // 20: 'rgba(20, 175, 0, 0.8)',
                      // 21: 'rgba(180, 0, 0, 0.8)',
                      // 22: 'rgba(152, 0, 199, 0.8)',
                    };


                    const status = pedidoStatus[row.pedido_status_id as keyof typeof pedidoStatus];
                    const tipo = row.pedido_tipo_id && pedidoTipos[row.pedido_tipo_id as keyof typeof pedidoTipos];


                    return (
                      <>
                        {/* colocar as condições de data e de tipos de status e suas cores */}
                        {/* teste usar a theme   */}
                        <TableRow
                          key={row.id}
                          sx={{
                          }}
                        >

                          <TableCell
                            sx={{
                              color: myTheme === 'dark' ? 'white' : 'black', // Branco no modo escuro e azul escuro no claro
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(String(row.numero_pedido));
                              // colocar um alert bunitinho de copiado
                            }}
                          >
                            {String(row.numero_pedido)}
                          </TableCell>

                          {/* Nome de produto */}
                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align='center'>
                            {row.lista_produtos?.length > 0
                              ? (
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                  {listaProdutos.map((produto, index) => (
                                    <li key={index}>{produto.nome}</li> // Cada produto em uma nova linha
                                  ))}
                                </ul>
                              )
                              : 'N/A'}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: myTheme === 'dark' ? 'white' : 'black',
                              backgroundColor: atraso ? 'rgba(255, 31, 53, 0.64)' : isHoje ? 'rgba(0, 255, 0, 0.64)' : 'rgba(1, 152, 1, 0.64)',
                            }}
                            align="center"
                          >
                            {row?.data_prevista
                              ? DateTime.fromISO(new Date(row.data_prevista).toISOString(), { zone: "utc" })
                                .setZone("America/Sao_Paulo")
                                .toFormat("dd/MM/yyyy")
                              : " "}
                            {atraso && <span> (Atraso)</span>}
                          </TableCell>

                          {designerNome !== 'Desconhecido' ? (
                            <TableCell
                              sx={{
                                color: myTheme === "dark" ? "white" : "black", // Branco no modo escuro e preto no claro
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
                                    border: myTheme === 'dark' ? '1px solid white' : '1px solid black',
                                    color: myTheme === 'dark' ? 'white' : 'black',
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

                          <TableCell
                            sx={{
                              color: myTheme === "dark" ? "white" : "black",
                              textAlign: "center",
                            }}
                          >
                            {row?.observacoes ? (
                              <Tooltip title={"Adicionar Observação?"} placement="top">
                                <Typography
                                  onClick={() => handleClickOpenDialogObs(row)}
                                  sx={{
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: row.observacoes ? "500" : "regular",
                                    color: myTheme === "dark" ? "white" : "black",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px", // Ajuste conforme necessário
                                    display: "inline-block",
                                    "&:hover": {
                                      fontWeight: "bold",
                                      color: myTheme === "dark" ? "#bdbdbd" : "#555",
                                    },
                                  }}
                                >
                                  {row?.observacoes ?? observacoes[row.id ?? 0]}
                                </Typography>
                              </Tooltip>
                            ) : (
                              <CustomTextField
                                value={observacoes[row?.id ?? 0] || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleObservacaoChange(String(row?.id), e.target.value)}
                                onKeyDown={(e: { key: string; }) => e.key === "Enter" && handleEnviarObservacao(String(row?.id))} // Salva ao pressionar Enter
                                fullWidth 
                              />
                            )}
                          </TableCell>

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black',
                            backgroundColor: Number(row.pedido_tipo_id) === 2 ? 'rgba(255, 31, 53, 0.64)' : 'inherit',
                          }} align='center'>{tipo ?? '-'}</TableCell>

                          {/* STATUS (precisa validar qual q role do usuario pra usar ou um ou outro) */}
                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black', // Branco no modo escuro e azul escuro no claro
                            backgroundColor: pedidoStatusColors[row?.pedido_status_id ?? 0] || 'inherit',
                          }} align='center'>
                            <select
                              style={{
                                textAlign: 'center',
                                padding: '0px',
                                fontSize: '12px',
                                borderRadius: '4px',
                                border: myTheme === 'dark' ? '1px solid white' : '1px solid black',
                                backgroundColor: 'transparent',
                                color: myTheme === 'dark' ? 'white' : 'black',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                cursor: 'pointer',
                                width: 'auto',
                                boxSizing: 'border-box',  // Para garantir que o padding não quebre a largura
                              }}
                              value={String(row.pedido_status_id)} // O valor precisa ser uma string
                              onChange={(event) => {
                                const newStatus = event.target.value;  // O valor será do tipo string
                                handleStatusChange(row, Number(newStatus)); // Converte para número antes de passar para a função
                              }}
                            >
                              {Object.entries(pedidoStatus).map(([id, status]) => (
                                <option key={id} value={id}>
                                  {status.nome}
                                </option>
                              ))}
                            </select>
                          </TableCell>

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
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

                        <TableRow>
                          {/* colSpan deve ter o mesmo número que o número de cabeçalhos da tabela, no caso 16 */}
                          <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                            <Collapse in={openRow[row.id ?? 0]} timeout="auto" unmountOnExit>
                              <Box margin={1}>
                                <Table size="small" aria-label="detalhes">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell sx={{ border: 'none' }} colSpan={16}>
                                        <strong>Lista de Produtos</strong>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                              Tipo:
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                              Material:
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                              Medida linear:
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {listaProdutos.length > 0 ? (
                                            listaProdutos.map((produto: Produto, index: number) => (
                                              <TableRow key={produto.id || index}>
                                                <TableCell sx={{ fontWeight: 'bold', padding: '8px' }} colSpan={1}>
                                                  {produto.nome}
                                                </TableCell>
                                                <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                  {produto.nome}
                                                </TableCell>
                                                {/* <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                  {produto.materiais.map((material: Material) => material.material).join(', ')} 
                                                </TableCell> */}
                                                <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                  {produto.medida_linear}
                                                </TableCell>
                                              </TableRow>
                                            ))
                                          ) : (
                                            <Typography variant="body2" color="textSecondary">Nenhum produto disponível</Typography>
                                          )}
                                        </TableBody>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
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