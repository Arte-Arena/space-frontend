'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Produto } from './components/types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus, IconEdit, IconEye, IconTrash, IconShirt, IconBrush } from '@tabler/icons-react';
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
  Select,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { GridPaginationModel } from '@mui/x-data-grid';
import { IconPrinter } from '@tabler/icons-react';
import { IconBrandTrello } from '@tabler/icons-react';
import SidePanel from './components/drawer';
import DialogObs from './components/observacaoDialog';
import { ApiResponsePedidosArteFinal } from './components/types';
import { format, isSameDay } from 'date-fns';
import trocarStatusPedido from './components/useTrocarStatusPedido';
import { useThemeMode } from '@/utils/useThemeMode';
import { IconDirectionSign } from '@tabler/icons-react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import getBrazilTime from '@/utils/brazilTime';

const ConfeccaoScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialogObs, setOpenDialogObs] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [selectedRowObs, setSelectedRowObs] = useState<ArteFinal | null>(null);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [searchNumero, setSearchNumero] = useState<string>("");  // Filtro de número do pedido
  const [statusFilter, setStatusFilter] = useState<string>("");  // Filtro de status
  const [dateFilter, setDateFilter] = useState<{ start: string | null; end: string | null }>({ start: '', end: '' });  // Filtro de data
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 50,
    page: 0,
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
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final?fila=C`, {
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

  // console.log(allPedidos);
  // total de medidas
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

  const totalPrazoProducao = Array.isArray(allPedidos)
    ? allPedidos.reduce((totalPedido, row) => {
      const listaProdutos: Produto[] = row.lista_produtos
        ? typeof row.lista_produtos === "string"
          ? JSON.parse(row.lista_produtos)
          : row.lista_produtos
        : [];

      return totalPedido + listaProdutos.reduce((acc, produto) => acc + (produto.prazo ?? 0), 0);
    }, 0)
    : 0;

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
    console.log("Deletar pedido", row);
  };

  const handleVerDetalhes = (row: ArteFinal) => {
    setSelectedRowSidePanel(row);
    setOpenDrawer(true);
  };

  const handleEnviarEntrega = async (row: ArteFinal) => {
    const confirmar = window.confirm('Deseja enviar o pedido N° ' + row.numero_pedido + ' para Expedição?');
    if (confirmar) {
      const sucesso = await trocarStatusPedido(row?.id, 22, refetch);
      if (sucesso) {
        console.log("Pedido enviado com sucesso!");
        alert('Sucesso');
      } else {
        console.log("Falha ao enviar pedido.");
        alert('Falha ao enviar pedido.');
      }
    } else {
      console.log("Envio cancelado.");
      alert('Envio cancelado.');
    }
  }

  // handles dos selects
  const handleStatusChange = async (row: ArteFinal, status_id: number) => {
    const sucesso = await trocarStatusPedido(row?.id, status_id, refetch);
    if (sucesso) {
      console.log("Pedido enviado com sucesso!");
      alert('sucesso');
    } else {
      console.log("Falha ao enviar pedido.");
    }
  }

  const handleClickOpenDialogObs = async (row: ArteFinal) => {
    // abre o dialog e passa a row
    setSelectedRowObs(row);
    setOpenDialogObs(true);
  };

  const handleClearFilters = () => {
    setSearchNumero('');
    setStatusFilter('');
    setDateFilter({ start: null, end: null });
  };

  const handleDateChange = (field: 'start' | 'end') => (newValue: Date | null) => {
    setDateFilter((prev) => ({ ...prev, [field]: newValue }));
  }

  const pedidoStatus = {
    14: { nome: 'prensa/clandra', fila: 'C' },
    15: { nome: 'checagem', fila: 'C' },
    16: { nome: 'corte/preparaçao', fila: 'C' },
    17: { nome: 'prateleriera/pendente', fila: 'C' },
    18: { nome: 'costura/confeccao', fila: 'C' },
    19: { nome: 'conferencia final', fila: 'C' },
    20: { nome: 'finalizado', fila: 'C' },
    21: { nome: 'reposição', fila: 'C' },
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
    <PageContainer title="Produção / Confecção" description="Tela de Produção da Confecção | Arte Arena">
      <>
        <Breadcrumb title="Produção / Confecção" items={BCrumb} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', padding: 2, mb: 2, }}>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
            <span style={{ fontWeight: 'bold' }}>Total Medida Linear:</span> {totalMedidaLinearGlobal} Cm
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
            <span style={{ fontWeight: 'bold' }}>Total Prazo de Produção:</span> {totalPrazoProducao} Dias
          </Typography>
        </Box>
        <ParentCard title="Confecção">
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
                      <TableCell align='center' sx={{ width: '10%' }}>Data De Entrega</TableCell>
                      {/* <TableCell align='center' sx={{ width: '5%' }}>Medida Linear</TableCell> */}
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

                      // definição dos designers
                      const parsedDesigners = typeof designers === 'string' ? JSON.parse(designers) : designers;
                      const usersMap = new Map(
                        Array.isArray(parsedDesigners)
                          ? parsedDesigners.map(designer => [designer.id, designer.name])
                          : []
                      );

                      // terminar de ver no backend se esta realmente mudando
                      const getUserNameById = (id: number | null | undefined) => {
                        return id && usersMap.has(id) ? usersMap.get(id) : row.designer_id;
                        // return id && usersMap.has(id) ? usersMap.get(id) : "Desconhecido";
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
                        14: { nome: 'prensa/clandra', fila: 'C' },
                        15: { nome: 'checagem', fila: 'C' },
                        16: { nome: 'corte/preparaçao', fila: 'C' },
                        17: { nome: 'prateleriera/pendente', fila: 'C' },
                        18: { nome: 'costura/confeccao', fila: 'C' },
                        19: { nome: 'conferencia final', fila: 'C' },
                        20: { nome: 'finalizado', fila: 'C' },
                        21: { nome: 'reposição', fila: 'C' },
                      } as const;

                      const pedidoStatusColors: Record<number, string> = {
                        14: 'rgba(220, 53, 69, 0.49)',
                        15: 'rgba(213, 121, 0, 0.8)',
                        16: 'rgba(123, 157, 0, 0.8)',
                        17: 'rgba(0, 152, 63, 0.65)',
                        18: 'rgba(0, 146, 136, 0.8)',
                        19: 'rgba(238, 84, 84, 0.8)',
                        20: 'rgba(20, 175, 0, 0.8)',
                        21: 'rgba(180, 0, 0, 0.8)',
                        22: 'rgba(152, 0, 199, 0.8)',
                      };

                      const status = pedidoStatus[row.pedido_status_id as keyof typeof pedidoStatus];
                      const tipo = row.pedido_tipo_id && pedidoTipos[row.pedido_tipo_id as keyof typeof pedidoTipos];

                      return (
                        <>
                          {/* colocar as condições de data e de tipos de status e suas cores */}
                          {/* total: {totalMedidaLinearPorPedido} */}
                          <TableRow
                            key={row.id}
                            sx={{

                            }}
                          >

                            <TableCell sx={{
                              color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                            }}>{String(row.numero_pedido)}</TableCell>


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

                            <TableCell sx={{
                              color: myTheme === 'dark' ? 'white' : 'black', // Branco no modo escuro e azul escuro no claro
                              backgroundColor: atraso ? 'rgba(255, 31, 53, 0.64)' : isHoje ? 'rgba(0, 255, 0, 0.64)' : 'rgba(1, 152, 1, 0.64)'
                            }} align='center'>
                              {row?.data_prevista ? format(new Date(row?.data_prevista), "dd/MM/yyyy") : "Data inválida"}
                              {atraso && <span> (Atraso)</span>}
                            </TableCell>


                            <TableCell sx={{
                              color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                            }} align='center'>{designerNome ?? 'Não Atribuido'}</TableCell>

                            <TableCell sx={{
                              color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                            }} align="center">
                              <Button
                                sx={{
                                  background: 'transparent',
                                  color: myTheme === 'dark' ? 'white' : 'black',
                                  borderRadius: '4px',
                                  border: myTheme === 'dark' ? '1px solid white' : '1px solid black',
                                  fontSize: '12px',
                                  whiteSpace: 'nowrap', // Impede que o texto quebre em várias linhas
                                  overflow: 'hidden', // Esconde o texto que ultrapassa o limite do botão
                                  textOverflow: 'ellipsis', // Adiciona "..." ao texto que não cabe
                                  maxWidth: '150px', // Define uma largura máxima para o botão
                                  '&:hover': {
                                    backgroundColor: 'rgba(13, 12, 12, 0.1)', // Cor neutra ao passar o mouse
                                    color: theme.palette.text.secondary, // Cor do texto ao passar o mouse
                                  }
                                }}
                                onClick={() => handleClickOpenDialogObs(row)}
                              >
                                {row.observacoes ?? "Adicionar Observação"}
                              </Button>
                            </TableCell>

                            <TableCell sx={{
                              color: myTheme === 'dark' ? 'white' : 'black',
                              backgroundColor: Number(row.pedido_tipo_id) === 2 ? 'rgba(255, 31, 53, 0.64)' : 'inherit',
                            }} align='center'>{tipo ?? 'null'}</TableCell>

                            {/* STATUS (precisa validar qual q role do usuario pra usar ou um ou outro) */}
                            <TableCell
                              sx={{
                                color: myTheme === 'dark' ? 'white' : 'black', // Branco no modo escuro e azul escuro no claro
                                backgroundColor: pedidoStatusColors[row?.pedido_status_id ?? 0] || 'inherit',
                              }}
                              align='center'>
                              <select
                                style={{
                                  textAlign: 'center',
                                  padding: '0px',
                                  fontSize: '12px',
                                  borderRadius: '4px',
                                  border: myTheme === 'dark' ? '1px solid white' : '1px solid black',
                                  color: myTheme === 'dark' ? 'white' : 'black',
                                  appearance: 'none',
                                  WebkitAppearance: 'none',
                                  MozAppearance: 'none',
                                  cursor: 'pointer',
                                  width: 'auto',
                                  boxSizing: 'border-box',  // Para garantir que o padding não quebre a largura
                                  backgroundColor: 'transparent',
                                }}
                                value={String(row.pedido_status_id)} // O valor precisa ser uma string
                                onChange={(event) => {
                                  const newStatus = event.target.value;  // O valor será do tipo string
                                  handleStatusChange(row, Number(newStatus)); // Converte para número antes de passar para a função
                                }}
                              >
                                {Object.entries(pedidoStatus).map(([id, status]) => (
                                  <option
                                    key={id}
                                    value={id}
                                    style={{
                                      backgroundColor: myTheme === 'dark' ? 'black' : 'white', // Define um fundo para os options
                                      color: myTheme === 'dark' ? 'white' : 'black',
                                    }}
                                  >
                                    {status.nome}
                                    {/* {status.fila} */}
                                  </option>
                                ))}
                              </select>
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
                              <Tooltip title="Enviar para Expedição">
                                <IconButton onClick={() => handleEnviarEntrega(row)}>
                                  <IconDirectionSign />
                                </IconButton>
                              </Tooltip>
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
            <DialogObs openDialogObs={openDialogObs} onCloseDialogObs={() => setOpenDialogObs(false)} row={selectedRowObs} refetch={refetch} />
          </>
        </ParentCard>
      </>
    </PageContainer>

  );
};

export default ConfeccaoScreen;