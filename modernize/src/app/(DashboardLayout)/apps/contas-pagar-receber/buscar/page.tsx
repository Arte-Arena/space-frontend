'use client'
import React, { useState, useEffect, useCallback } from 'react';

// MUI Components
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  Link,
  Button, // Para links em breadcrumbs ou outros locais
} from '@mui/material';

// MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Para erros
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Para sucesso
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Para info

// Tabler Icons (se ainda for necessário)
import { IconArrowIteration, IconPlus, IconX } from "@tabler/icons-react";

// Project Components
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { useRouter } from 'next/navigation';

// Supondo que suas definições de tipo estejam aqui
// É crucial que estas interfaces reflitam a estrutura real dos seus dados
export interface Parcela {
  id: number | string;
  parcela: number;
  data?: string | Date;
  status?: string;
  valor?: number;
  data_pagamento?: string | Date;
}

export interface Conta {
  id: number;
  titulo: string;
  recorrencia?: boolean | null | { id: number }; // Ajuste conforme a estrutura real
  isRecorrente?: boolean; // Avaliar se é necessário, pode ser derivado de 'recorrencia'
  valor?: number;
  data_vencimento?: string | Date;
  tipo?: 'a pagar' | 'a receber' | string;
  status?: 'pendente' | 'pago' | 'vencido' | 'cancelado' | 'confirmado' | string;
  forma_pagamento?: string;
  documento?: string | null;
  observacoes?: string | null;
  parcelas?: Parcela[];
  data_pagamento?: string | Date;
  data_emissao?: string | Date;
  fixa?: boolean;
  created_at: string | Date;
  updated_at?: string | Date;
}


// Funções Utilitárias
const formatCurrency = (value?: number | string): string => {
  if (value === null || value === undefined || value === '') return 'N/A';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return 'N/A';
  return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return 'N/A';

  try {
    const coercedDate =
      typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)
        ? new Date(dateString + 'T00:00:00Z') // garante validade no Chrome/Node
        : new Date(dateString);

    if (isNaN(coercedDate.getTime())) return 'Data inválida';

    return coercedDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  } catch {
    return 'Data inválida';
  }
};


const ContasPagarReceberAdicionarScreen = () => {
  const theme = useTheme();
  const [accounts, setAccounts] = useState<Conta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    router.push('/login');
    return null;
  }

  const toggleRowExpansion = (accountId: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado. Por favor, realize o login novamente.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/contas-and-recorrentes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // Se o corpo do erro não for JSON ou estiver vazio
          throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
        }
        console.error("Erro ao buscar contas:", errorData);
        throw new Error(errorData.message || `Falha ao buscar contas (status: ${response.status})`);
      }

      const data = await response.json();
      setAccounts(data.data || []); // Garante que seja um array
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao buscar as contas.';
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error("Detalhe do erro em fetchAccounts:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Adicionar dependências se 'process.env.NEXT_PUBLIC_API' puder mudar, mas geralmente é constante

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleDeleteAccount = async (accountId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setSnackbarMessage('Sessão expirada. Por favor, realize o login novamente.');
        setSnackbarSeverity('warning');
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conta/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
        }
        console.error("Erro ao deletar conta:", errorData);
        throw new Error(errorData.message || `Falha ao deletar conta (status: ${response.status})`);
      }

      setAccounts(prevAccounts => prevAccounts.filter((account) => account.id !== accountId));
      setSnackbarMessage('Conta deletada com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao deletar a conta.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error("Detalhe do erro em handleDeleteAccount:", err);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const getStatusChipProps = (status?: string): { label: string; color: 'success' | 'warning' | 'error' | 'info' | 'default'; icon?: React.ReactElement } => {
    if (!status) return { label: 'N/A', color: 'default' };
    const s = status.toLowerCase();
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

    switch (s) {
      case 'pago':
      case 'confirmado':
      case 'recebido':
        return { label: capitalizedStatus, color: 'success', icon: <CheckCircleOutlineIcon fontSize="inherit" /> };
      case 'pendente':
        return { label: capitalizedStatus, color: 'warning', icon: <InfoOutlinedIcon fontSize="inherit" /> };
      case 'a pagar':
      case 'a receber': // Pode ser que precise de lógica diferente, mas agrupando por cor
        return { label: capitalizedStatus, color: 'info', icon: <InfoOutlinedIcon fontSize="inherit" /> };
      case 'vencido':
      case 'cancelado':
        return { label: capitalizedStatus, color: 'error', icon: <WarningAmberIcon fontSize="inherit" /> };
      default:
        return { label: capitalizedStatus, color: 'default' };
    }
  };

  const getTipoChipProps = (tipo?: string): { label: string; color: 'error' | 'success' | 'primary' | 'secondary' | 'default'; variant?: 'filled' | 'outlined' } => {
    if (!tipo) return { label: 'N/A', color: 'default', variant: 'outlined' };
    const t = tipo.toLowerCase();
    const capitalizedTipo = tipo.charAt(0).toUpperCase() + tipo.slice(1);

    switch (t) {
      case 'a pagar':
        return { label: 'A Pagar', color: 'error', variant: 'outlined' };
      case 'a receber':
        return { label: 'A Receber', color: 'success', variant: 'outlined' };
      default:
        return { label: capitalizedTipo, color: 'default', variant: 'outlined' };
    }
  };

  const BCrumb = [
    {
      to: '/', // Ajuste este link para sua página inicial do dashboard
      title: 'Dashboard',
    },
    {
      title: 'Contas a Pagar e Receber',
    },
    {
      title: 'Listagem', // Mantendo a consistência com o título da página
    },
  ];

  if (loading) {
    return (
      <PageContainer title="Carregando Contas..." description="Aguarde enquanto buscamos as informações.">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>Carregando contas...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error && accounts.length === 0) { // Mostra erro principal se não houver contas para exibir
    return (
      <PageContainer title="Erro ao Carregar Contas" description="Houve um problema ao buscar as contas.">
        <Breadcrumb title="Listagem de Contas" items={BCrumb} />
        <ParentCard title="Contas Registradas">
          <Alert severity="error" icon={<WarningAmberIcon />} sx={{ m: 2 }}>
            <Typography fontWeight="bold">Falha ao carregar contas:</Typography>
            {error}
          </Alert>
        </ParentCard>
      </PageContainer>
    );
  }


  return (
    <PageContainer title="Contas a Pagar e a Receber" description="Gerencie as contas a pagar e a receber da Arte Arena.">
      <Breadcrumb title="Listagem de Contas" items={BCrumb} />

      <ParentCard title="Contas Registradas">
        <Box>
          {error && accounts.length > 0 && ( // Mostra erro como um alerta acima da tabela se já houver contas carregadas
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error} - Algumas informações podem estar desatualizadas.
            </Alert>
          )}
          {accounts.length === 0 && !loading && !error ? (
            <Box sx={{ textAlign: 'center', p: theme.spacing(3, 2) }}>
              <InfoOutlinedIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="h6" color="textSecondary">
                Nenhuma conta encontrada.
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Você ainda não possui contas a pagar ou a receber cadastradas.
              </Typography>
              {/* Você pode adicionar um botão para ir para a página de adicionar contas se esta não for a página de adicionar */}
              {/* Exemplo: */}
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconPlus />}
                sx={{ mt: 3 }}
                onClick={() => router.push('/contas-pagar-receber/adicionar')} // Ajuste a rota
              >
                Adicionar Nova Conta
              </Button>

            </Box>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: theme.shadows[2] }}>
              <TableContainer sx={{ maxHeight: 'calc(100vh - 320px)' /* Ajuste conforme necessidade */ }}>
                <Table stickyHeader aria-label="Tabela de Contas">
                  <TableHead>
                    <TableRow sx={{ '& th': { backgroundColor: theme.palette.background.default, fontWeight: 'bold' } }}>
                      <TableCell sx={{ width: '50px', p: 1 }} /> {/* Ícone de expandir */}
                      <TableCell>Título | Obs.</TableCell>
                      <TableCell align="center">Recorrente</TableCell>
                      <TableCell align="right">Valor</TableCell>
                      <TableCell>Vencimento</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Forma Pag.</TableCell>
                      {/* <TableCell>Documento</TableCell> */} {/* Descomente se necessário */}
                      <TableCell align="center">Parcelas</TableCell>
                      <TableCell>Dt. Pagamento</TableCell>
                      <TableCell>Dt. Emissão</TableCell>
                      <TableCell align="center">Fixa</TableCell>
                      <TableCell>Criado em</TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounts.map((account) => (
                      <React.Fragment key={account.id}>
                        <TableRow>
                          <TableCell
                            
                            onClick={() => (account.parcelas && account.parcelas.length > 0) && toggleRowExpansion(account.id)}
                            sx={{
                              p: 1,
                              cursor: (account.parcelas && account.parcelas.length > 0) ? 'pointer' : 'default',
                              '& > *': { borderBottom: 'unset' },
                              '&:last-child td, &:last-child th': { border: 0 },
                              '&:hover': {
                                cursor: 'pointer',
                              },
                            }}
                          >
                            {(account.parcelas && account.parcelas.length > 0) ? (
                              <IconButton aria-label="expandir linha" size="small">
                                {expandedRows[account.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            ) : null}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" fontWeight={600} color="textPrimary">
                              <Link
                                href={`/apps/contas-pagar-receber/detalhes/${account.id}`}
                                underline="hover"
                                color="inherit"
                              >
                                {account.titulo}
                              </Link>
                            </Typography>
                            {account.observacoes && (
                              <Typography variant="caption" display="block" color="textSecondary" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {account.observacoes}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {account.recorrencia || account.isRecorrente ? (
                              <Tooltip title="Conta Recorrente">
                                <IconArrowIteration size={20} color={theme.palette.info.main} />
                              </Tooltip>
                            ) : (
                              <Typography variant="caption" color="textSecondary">-</Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={500} color={account.tipo === 'a receber' ? theme.palette.success.main : theme.palette.error.main}>
                              {formatCurrency(account.valor)}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatDate(account.data_vencimento)}</TableCell>
                          <TableCell>
                            <Chip {...getTipoChipProps(account.tipo)} size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip {...getStatusChipProps(account.status)} size="small" />
                          </TableCell>
                          <TableCell>{account.forma_pagamento || 'N/A'}</TableCell>
                          {/* <TableCell>{account.documento || 'N/A'}</TableCell> */}
                          <TableCell align="center">{account.parcelas?.length || "N/A"}</TableCell>
                          <TableCell>{formatDate(account.data_pagamento)}</TableCell>
                          <TableCell>{formatDate(account.data_emissao)}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={account.fixa ? 'Sim' : 'Não'}
                              size="small"
                              variant="outlined"
                              color={account.fixa ? "info" : "default"}
                            />
                          </TableCell>
                          <TableCell>{formatDate(account.created_at)}</TableCell>
                          <TableCell align="center" sx={{ p: 0.5 }}>
                            {/* editar */}
                            <Tooltip title="Editar Conta">
                              <IconButton
                                color="success"
                                size="small"
                                aria-label="deletar conta"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/apps/contas-pagar-receber/editar/${account.id}`);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {/* Deletar */}
                            <Tooltip title="Deletar Conta">
                              <IconButton
                                color="error"
                                size="small"
                                aria-label="deletar conta"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAccount(account.id);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ padding: 0 }} colSpan={14}> {/* Ajustado colSpan */}
                            <Collapse in={expandedRows[account.id]} timeout="auto" unmountOnExit>
                              <Box
                                sx={{
                                  margin: theme.spacing(1, 0, 1, 7), // Alinhado com a célula do título
                                  padding: theme.spacing(2),
                                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
                                  borderRadius: 1,
                                  border: `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                <Typography variant="h6" gutterBottom component="div" sx={{ mb: 1.5, fontSize: '1.1rem' }}>
                                  Detalhes das Parcelas
                                </Typography>
                                {(account.parcelas && account.parcelas.length > 0) ? (
                                  <Table size="small" aria-label="parcelas">
                                    <TableHead>
                                      <TableRow sx={{ '& th': { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100], fontWeight: 'medium' } }}>
                                        <TableCell>#</TableCell>
                                        <TableCell>Data Venc.</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Valor</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {account.parcelas.map((parcela, index) => (
                                        <TableRow key={parcela.id || index} hover>
                                          <TableCell component="th" scope="row">{parcela.parcela}</TableCell>
                                          <TableCell>{String(parcela.data)}</TableCell>
                                          <TableCell>
                                            <Chip {...getStatusChipProps(parcela.status)} size="small" />
                                          </TableCell>
                                          <TableCell align="right">{formatCurrency(parcela.valor)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <Typography variant="body2" color="textSecondary" sx={{ py: 1 }}>
                                    Nenhuma parcela associada a esta conta.
                                  </Typography>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </ParentCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Posição mais comum
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled" elevation={6}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ContasPagarReceberAdicionarScreen;