'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Pedido, Produto } from './components/types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconEye, IconShirt, IconSquareChevronsLeft, IconTruckDelivery } from '@tabler/icons-react';
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
  Box,
  MenuItem,
  useTheme,
  TextField,
  Select,
  TextFieldProps,
  AlertProps,
} from "@mui/material";
import { GridPaginationModel } from '@mui/x-data-grid';
import { IconBrandTrello } from '@tabler/icons-react';
import SidePanel from './components/drawer';
import { ApiResponsePedidosArteFinal } from './components/types';
import { format, isSameDay } from 'date-fns';
import trocarStatusPedido from './components/useTrocarStatusPedido';
import { useThemeMode } from '@/utils/useThemeMode';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import getBrazilTime from '@/utils/brazilTime';
import DialogExp from './components/expedicaoDialog';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import trocarEstagioPedidoArteFinal from './components/useTrocarEstagioPedido';
import { useAuth } from '@/utils/useAuth';

const ExpediçãoScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [selectedRowExp, setSelectedRowExp] = useState<ArteFinal | null>(null);
  const [searchNumero, setSearchNumero] = useState<string>("");  // Filtro de número do pedido
  const [statusFilter, setStatusFilter] = useState<string>("");  // Filtro de status
  const [dateFilter, setDateFilter] = useState<{ start: string | null; end: string | null }>({ start: '', end: '' });  // Filtro de data
  const [openDialogExp, setOpenDialogExp] = useState(false);
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

  const myTheme = useThemeMode()

  const accessToken = localStorage.getItem('accessToken');
  const designers = localStorage.getItem('designers');

  const isLoggedIn = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  const filters = {
    numero_pedido: searchNumero,
    pedido_status_id: statusFilter,
  };

  const { data: dataPedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, refetch } = useQuery<ApiResponsePedidosArteFinal>({
    queryKey: ['pedidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final?fila=E`, {
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
    }
  }, [dataPedidos]);

  // handles
  const handleLinkTrello = (row: ArteFinal) => {
    if (row.url_trello) {
      window.open(row.url_trello, '_blank');
    } else {
      alert('URL do Trello não disponível');
      console.warn('URL do Trello não disponível');
    }
  };

  const handleListaUniformes = (row: ArteFinal) => {
    // provavelmente tem que ver validar se existe uma lista de uniformes nesse pedido
    // unica forma atualmente é pelo 'ocamento_id'
  };

  // colocar pra jogar pra reposição
  const handleVoltarCostura = async (row: ArteFinal) => {
    const confirmar = window.confirm('Deseja voltar o pedido N° ' + row.numero_pedido + ' para Costura?');

    if (confirmar) {
      const sucesso = await trocarEstagioPedidoArteFinal(row?.id, "C", refetch);
      if (sucesso) {
        console.log("Pedido enviado com sucesso!");
        setSnackbar({
          open: true,
          message: `${'Pedido enviado com sucesso.'}`,
          severity: 'success'
        });
      } else {
        console.log("Falha ao enviar pedido.");
        setSnackbar({
          open: true,
          message: `${'Erro ao mover pedido.'}`,
          severity: 'error'
        });
      }
    } else {
      console.log("Envio cancelado.");
      setSnackbar({
        open: true,
        message: `${'Envio cancelado.'}`,
        severity: 'warning'
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

  // handles dos selects
  const handleStatusChange = async (row: ArteFinal, status_nome: string) => {
    const sucesso = await trocarStatusPedido(row?.id, status_nome, refetch);
    if (sucesso) {
      console.log("Pedido enviado com sucesso!");
      alert('sucesso');
    } else {
      console.log("Falha ao enviar pedido.");
    }
  }

  const handleClearFilters = () => {
    setSearchNumero('');
    setStatusFilter('');
    setDateFilter({ start: null, end: null });
  };

  const handleDateChange = (field: 'start' | 'end') => (newValue: Date | null) => {
    setDateFilter((prev) => ({ ...prev, [field]: newValue }));
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
        // throw new Error("Erro ao salvar observação");
        console.error("Erro: ", response.text() || "Erro ao salvar observação");
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

  const pedidosStatusFilaD: Record<number, { nome: string; fila: 'E' }> = Object.fromEntries(
    parsedPedidosStatus
      .filter((item: { fila: string }) => item.fila === 'E')
      .map(({ id, nome, fila }: { id: number; nome: string; fila: 'E' }) => [id, { nome, fila }])
  );

  const pedidoStatus: Record<number, { nome: string; fila: 'E' }> = pedidosStatusFilaD as Record<number, { nome: string; fila: 'E' }>;

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

  // coisas da entrega:
  const handleOpenDialogEntrega = (row: ArteFinal) => {
    setSelectedRowExp(row);
    setOpenDialogExp(true);
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

  return (
    <PageContainer title="Produção / Expedição" description="Tela de Produção da Expedição | Arte Arena">
      <Breadcrumb title="Produção / Expedição" items={BCrumb} />
      <ParentCard title="Expedição">
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
                    <TableCell align='center' sx={{ width: '5%' }}>N° Pedido</TableCell>
                    <TableCell align='center' sx={{ width: '30%' }}>Produtos</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Data De Entrega</TableCell>
                    <TableCell align='center' sx={{ width: '5%' }}>Designer</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}>Observação</TableCell>
                    <TableCell align='center' sx={{ width: '3%' }}>Tipo</TableCell>
                    <TableCell align='center' sx={{ width: '7%' }}>Status</TableCell>
                    <TableCell align='center' sx={{ width: '15%' }}>Ações</TableCell>
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
                      return id && usersMap.has(id) ? usersMap.get(id) : row.designer_id;
                    };
                    const designerNome = getUserNameById(row.designer_id);

                    const pedidoStatusColors: Record<number, string> = {
                      22: 'rgba(220, 53, 69, 0.49)',
                      23: 'rgba(213, 121, 0, 0.8)',
                      24: 'rgba(123, 157, 0, 0.8)',
                      25: 'rgba(0, 152, 63, 0.65)',
                      26: 'rgba(0, 146, 136, 0.8)',
                    };

                    const tipo = row.pedido_tipo_id && pedidoTiposMapping[row.pedido_tipo_id as keyof typeof pedidoTiposMapping];

                    return (
                      <>
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
                            {row?.data_prevista ? format(new Date(row?.data_prevista), "dd/MM/yyyy") : "Data inválida"}
                            {atraso && <span> (Atraso)</span>}
                          </TableCell>

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black'
                          }} align='center'>{designerNome ?? 'Não Atribuido'}</TableCell>

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
                              onChange={(event: { target: { value: string; }; }) => {
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

                          <TableCell align='center'>
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
                            <Tooltip title={"Expedição"}>
                              <IconButton
                                onClick={() => handleOpenDialogEntrega(row)}
                                disabled={row.url_trello === null}
                              >
                                <IconTruckDelivery />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Mover para Costura">
                              <IconButton onClick={() => handleVoltarCostura(row)}>
                                <IconSquareChevronsLeft />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      </>
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
          <SidePanel openDrawer={openDrawer} onCloseDrawer={() => setOpenDrawer(false)} row={selectedRowSidePanel} />
          <DialogExp openDialogExp={openDialogExp} onCloseDialogExp={() => setOpenDialogExp(false)} row={selectedRowExp} refetch={refetch} />
        </>
      </ParentCard >
    </PageContainer >

  );
};

export default ExpediçãoScreen;