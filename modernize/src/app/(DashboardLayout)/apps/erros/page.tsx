'use client'
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import ParentCard from "@/app/components/shared/ParentCard";
import { useThemeMode } from "@/utils/useThemeMode";
import { Alert, AlertProps, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, MenuItem, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextFieldProps, Tooltip, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { IconBrandTrello, IconExclamationCircle, IconEye, IconSearch, IconShirt } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import trocarStatusErro from "./components/useTrocarStatusErro";
import { format } from "date-fns";
import { calcularDataPassadaDiasUteis } from "@/utils/calcDiasUteis";
import { DateTime } from "luxon";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SidePanel from "./components/drawer";
import { useQuery } from "@tanstack/react-query";
import { TextField } from "@mui/material";

interface ApiResponseErros {
  current_page: number;
  data: Erros[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface Erros {
  id: number;
  detalhes: string;
  responsavel: string;
  prejuizo: number;
  numero_pedido: number;
  setor: string;
  link_trello: string;
  solucao: string;
  status: string;
  updated_at: Date;
  created_at: Date;
}

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Erros",
  },
];

export default function Erros() {
  const [openDialogSolucao, setOpenDialogSolucao] = useState(false);
  const [currentRowSolucao, setCurrentRowSolucao] = useState<Erros | null>(null);
  const [novaSolucao, setNovaSolucao] = useState('');
  const [allErros, setallErros] = useState<Erros[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [searchDateStart, setSearchDateStart] = useState<string | null>(null);
  const [searchDateEnd, setSearchDateEnd] = useState<string | null>(null);
  const [statusFilterErro, setStatusFilterErro] = useState<string>("");
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<Erros | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const detalhesRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const solucaoRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
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
  const CorteRoles = [1, 11, 13, 15];
  const unableActions = roles.some(role => CorteRoles.includes(role));

  const { data: dataErros, isLoading: isLoadingErros, isError: isErrorErros, refetch } = useQuery<ApiResponseErros>({
    queryKey: ['erros', searchQuery, page, rowsPerPage],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/erros`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (dataErros && dataErros.data) {
      setallErros(dataErros.data);
    }
  }, [dataErros]);

  // handles
  const handleOpenDialogSolucao = (row: Erros) => {
    setCurrentRowSolucao(row);
    setNovaSolucao(row.solucao || '');
    setOpenDialogSolucao(true);
  };

  const handleCloseDialogSolucao = () => {
    setOpenDialogSolucao(false);
  };

  const handleSalvarSolucao = async () => {
    if (currentRowSolucao) {
      await handleEnviarSolucao(String(currentRowSolucao.id), novaSolucao);
      setOpenDialogSolucao(false);
    }
  };

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

  const handleLinkTrello = (row: Erros) => {
    if (row.link_trello) {
      window.open(row.link_trello, '_blank');
    } else {
      setSnackbar({
        open: true,
        message: `${'URL do Trello não disponível'}`,
        severity: 'warning'
      });
      console.warn('URL do Trello não disponível');
    }
  };

  const handleVerDetalhes = (row: Erros) => {
    setSelectedRowSidePanel(row);
    setOpenDrawer(true);
  };

  const handleStatusChangeErro = async (row: Erros, status: string) => {
    const sucesso = await trocarStatusErro(row?.id, status, refetch);
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
    setStatusFilterErro('');
  };

  const handleKeyPressSolucao = (id: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const inputElement = solucaoRefs.current[id];
      const valor = inputElement?.value || '';
      handleEnviarSolucao(id, valor);
    }
  };

  const handleEnviarSolucao = async (id: string, obs: string) => {
    if (!id) {
      console.error("ID do erro não encontrado");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/erros/solucao/${id}`, // trocar a URL para a correta
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ solucao: obs }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar Solução");
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: `${'Solução salva com sucesso.'}`,
        severity: 'success'
      });
      console.log("Solução salva com sucesso:", data);

      refetch();
    } catch (error) {
      console.error("Erro ao salvar Solução:", error);
      setSnackbar({
        open: true,
        message: `${'Erro ao salvar Solução.'}`,
        severity: 'error'
      });
    }
  };

  const handleKeyPressdetalhes = (id: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const inputElement = detalhesRefs.current[id];
      const valor = inputElement?.value || '';
      handleEnviarDetalhes(id, valor);
    }
  };

  const handleEnviarDetalhes = async (id: string, obs: string) => {
    if (!id) {
      console.error("ID do erro não encontrado");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/erros/detalhes/${id}`, // trocar a URL para a correta
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ detalhes: obs }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar Detalhe");
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: `${'Detalhes salvos com sucesso.'}`,
        severity: 'success'
      });
      console.log("Detalhes salvos com sucesso:", data);

      refetch();
    } catch (error) {
      console.error("Erro ao salvar Detalhe:", error);
      setSnackbar({
        open: true,
        message: `${'Erro ao salvar Detalhe.'}`,
        severity: 'error'
      });
    }
  };

  const status = [
    'Pendente',
    'Em Análise',
    'Em Correção',
    'Resolvido',
    'Recusado',
  ];

  const setorColors: { [key: string]: string } = {
    'Design': '#1E88E5',           // Azul
    'Impressão': '#43A047',        // Verde
    'Sublimação': '#FB8C00',       // Laranja escuro
    'Costura': '#F4511E',          // Laranja queimado
    'Corte & Confêrencia': '#8E24AA', // Roxo
    'Comercial': '#3949AB',        // Azul escuro
    'Backoffice': '#00897B',       // Verde azulado
  };

  // Filtro de pedidos
  const filteredErros = useMemo(() => {
    return allErros.filter((erro) => {
      // Filtro por número do pedido
      const isNumberMatch = !query ||
        String(erro.numero_pedido).toLowerCase().includes(query.trim().toLowerCase());

      // Filtro por status (usando statusFilterErro em vez de status)
      let isErroStatusMatch = true;
      if (statusFilterErro && erro.status) {
        isErroStatusMatch = erro.status.toLowerCase() === statusFilterErro.toLowerCase();
      }

      // Filtro por data
      let isDateMatch = true;
      if (searchDateStart || searchDateEnd) {
        const pedidoDate = new Date(erro.created_at);
        const startDate = searchDateStart ? new Date(searchDateStart) : null;
        const endDate = searchDateEnd ? new Date(searchDateEnd) : null;

        // Zerar horário para comparação justa
        const pedidoDateOnly = zerarHorario(pedidoDate);
        const startDateOnly = startDate ? zerarHorario(startDate) : null;
        const endDateOnly = endDate ? zerarHorario(endDate) : null;

        isDateMatch =
          (!startDateOnly || pedidoDateOnly >= startDateOnly) &&
          (!endDateOnly || pedidoDateOnly <= endDateOnly);
      }

      return isNumberMatch && isErroStatusMatch && isDateMatch;
    });
  }, [allErros, query, statusFilterErro, searchDateStart, searchDateEnd]);

  function formatarDataSegura(dataISOString: string): string {
    const dataUTC = DateTime.fromISO(dataISOString, { zone: 'utc' });
    const dataFormatada = dataUTC.toFormat('MM/dd/yyyy');
    return dataFormatada;
  }

  const zerarHorario = (data: Date): Date => {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  };

  return (
    <PageContainer title="Tabela de Erros" description="Tabela de Erros">
      <>
        <Breadcrumb title="Tabela de Erros" items={BCrumb} />
        <ParentCard title="Tabela de Erros">
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
                  placeholder="Buscar erro..."
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
                  value={statusFilterErro}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setStatusFilterErro(e.target.value)}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="">Status Erros</MenuItem>
                  {Object.entries(status).map(([id, status]) => (
                    <MenuItem key={id} value={status}>
                      {status}
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
              <Grid item xs>
                <Box display="flex" justifyContent="flex-end">
                  <Tooltip title="Adicionar Erro" placement="top">
                    <IconButton
                      color="error"
                      onClick={() => window.open('../../apps/erros/add', '_blank')}
                      size="small"
                    >
                      <IconExclamationCircle />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>

            {isErrorErros ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="error">Erro ao carregar pedidos.</Typography>
              </Stack>
            ) : isLoadingErros ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 1 }}>Carregando pedidos...</Typography>
              </Stack>
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align='center' sx={{ width: '6%' }}>N° Pedido</TableCell>
                      <TableCell align='center' sx={{ width: '6%' }}>Data De Criação</TableCell>
                      <TableCell align='center' sx={{ width: '20%' }}>Setores</TableCell>
                      <TableCell align='center' sx={{ width: '20%' }}>Detalhes</TableCell>
                      <TableCell align='center' sx={{ width: '12%' }}>Solução</TableCell>
                      <TableCell align='center' sx={{ width: '9%' }}>Responsável</TableCell>
                      <TableCell align='center' sx={{ width: '9%' }}>Prejuizo</TableCell>
                      <TableCell align='center' sx={{ width: '7%' }}>Status</TableCell>
                      <TableCell align='center' sx={{ width: '11%' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(filteredErros) && filteredErros.map((row) => {

                      const dataPrevistaSegura = formatarDataSegura(String(row?.created_at));
                      const dataPrevista = row?.created_at ? dataPrevistaSegura : '';
                      const dataPrevistaDateTime = DateTime.fromFormat(dataPrevista, 'MM/dd/yyyy').startOf('day');
                      const feriados = localStorage.getItem('feriados');
                      const parsedFeriados = JSON.parse(feriados || '[]');
                      const prazoCorteConferencia = calcularDataPassadaDiasUteis(dataPrevistaDateTime, 0, parsedFeriados);

                      return (
                        <TableRow
                          key={row.id}
                        >

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black',
                          }} align='center'>{row.numero_pedido ? String(row.numero_pedido) : "-"}</TableCell>


                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black',
                          }} align='center'>
                            {prazoCorteConferencia.toFormat('dd/MM/yyyy')}
                          </TableCell>

                          {/* setor */}
                          <TableCell align='center'>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                              {(row.setor || '')
                                .split(',')
                                .map((setor) => setor.trim())
                                .filter(Boolean)
                                .map((setor, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      px: 1.2,
                                      py: 0.5,
                                      borderRadius: '12px',
                                      backgroundColor: setorColors[setor] || '#9E9E9E',
                                      color: 'white',
                                      fontSize: '0.75rem',
                                      fontWeight: 500,
                                      lineHeight: 1,
                                      textAlign: 'center',
                                    }}
                                  >
                                    {setor}
                                  </Box>
                                ))}
                            </Box>
                          </TableCell>


                          {/* Detalhes */}
                          <Tooltip title={row?.detalhes ? row.detalhes : "Adicionar Detalhe"} placement="left">
                            <TableCell
                              sx={{
                                color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                                textAlign: "left",
                              }}
                            >
                              <CustomTextField
                                key={row?.id}
                                label={row?.detalhes ? "Detalhe" : "Adicionar Detalhe"}
                                defaultValue={row?.detalhes || ""}
                                inputRef={(ref: HTMLInputElement | null) => {
                                  if (row?.id && ref) {
                                    detalhesRefs.current[row.id] = ref;
                                  }
                                }}
                                onBlur={() => {
                                  if (row?.id) {
                                    const inputElement = detalhesRefs.current[row.id];
                                    const valor = inputElement?.value || '';
                                    handleEnviarDetalhes(String(row.id), valor);
                                  }
                                }}
                                onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                  if (row?.id) handleKeyPressdetalhes(String(row.id), event);
                                }}
                                fullWidth
                              />
                            </TableCell>
                          </Tooltip>

                          {/* solucao */}
                          <Tooltip title={row?.solucao ? row.solucao : "Adicionar Solução"} placement="top">
                            <TableCell
                              sx={{
                                color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                                textAlign: "center",
                              }}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleOpenDialogSolucao(row)}
                                fullWidth
                              >
                                {row.solucao ? "Editar Solução" : "Adicionar Solução"}
                              </Button>
                            </TableCell>
                          </Tooltip>

                          {/* Responsavel */}
                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black',
                          }} align='center'>
                            {row.responsavel ? String(row.responsavel) : "-"}
                          </TableCell>

                          {/* Prejuizo */}
                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black',
                          }} align='center'>
                            {row.prejuizo ? "R$ " + row.prejuizo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "-"}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: (theme: any) => theme.palette.mode === 'dark' ? 'white' : 'black',
                            }}
                            align='center'
                          >
                            <CustomSelect
                              disabled={!unableActions}
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

                              value={String(row?.status ?? '')}
                              onChange={(event: { target: { value: string; }; }) => {
                                const newStatus = event.target.value;
                                handleStatusChangeErro(row, newStatus);
                              }}
                            >
                              {Object.entries(status).map(([id, status]) => (
                                <MenuItem key={id} value={status}>
                                  {status}
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
                            <Grid container spacing={0} justifyContent="center" alignItems="center">
                              <Grid item xs={12}>
                                <Tooltip title="Ver Detalhes">
                                  <IconButton onClick={() => handleVerDetalhes(row)}>
                                    <IconEye />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={row.link_trello === null ? "Sem Link do Trello" : "Link Trello"}>
                                  <IconButton
                                    onClick={() => handleLinkTrello(row)}
                                    disabled={row.link_trello === null}
                                    sx={{ ml: 1 }}
                                  >
                                    <IconBrandTrello />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={dataErros?.total || 0}
                  page={page - 1}
                  onPageChange={handleTablePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[15, 25, 50]}
                />
              </TableContainer>
            )}
            <Dialog open={openDialogSolucao} onClose={handleCloseDialogSolucao} maxWidth="md" fullWidth>
              <DialogTitle>
                <Box display="flex" alignItems="center">
                  <IconExclamationCircle color="primary"/>
                  <Typography variant="h6">Descreva a Solução</Typography>
                </Box>
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="solucao-dialog"
                  label="Solução Detalhada"
                  type="text"
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  value={novaSolucao}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovaSolucao(e.target.value)}
                  inputProps={{
                    maxLength: 500
                  }}
                  helperText={`${novaSolucao.length}/500 caracteres`}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialogSolucao} color="secondary">
                  Cancelar
                </Button>
                <Button onClick={handleSalvarSolucao} color="primary">
                  Aplicar
                </Button>
              </DialogActions>
            </Dialog>
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
}
