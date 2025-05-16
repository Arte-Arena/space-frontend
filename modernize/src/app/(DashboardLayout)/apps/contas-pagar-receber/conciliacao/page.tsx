'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Button,
  Typography,
  Paper,
  Tooltip,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Avatar,
  useTheme,
  alpha,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/app/components/shared/ParentCard';

// Tipos de Dados
interface Movimentacao {
  id: number;
  valor_bruto: string;
  valor_liquido: string;
  data_operacao: string;
  documento?: string;
  tipo?: 'entrada' | 'saida';
  status?: string;
  lista_produtos?: any[];
  metadados?: any;
}

interface Transacao {
  id: number;
  id_transacao_externa: string;
  valor: string;
  status: string;
  descricao?: string;
  tipo?: string;
  categoria?: string;
  nome_pagador?: string;
  detalhes?: any;
}

interface ConciliacaoItem {
  id: number;
  status: string;
  diferenca: string;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
  movimentacao: Movimentacao;
  transacao: Transacao;
}

interface PaginaConciliacoes {
  current_page: number;
  data: ConciliacaoItem[];
  last_page: number;
  total: number;
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof ConciliacaoItem | string;
  label: string;
  numeric: boolean;
  align?: 'left' | 'right' | 'center';
  icon?: React.ReactNode;
}

export default function EnhancedConciliacaoTable() {
  const [rows, setRows] = useState<ConciliacaoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ConciliacaoItem>('id');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const theme = useTheme();

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/conciliacao?page=${page + 1}&per_page=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error('Falha ao carregar conciliações');

      const json: PaginaConciliacoes = await res.json();
      setRows(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);


  const handleRequestSort = (property: keyof ConciliacaoItem) => {
    // Verifica se a propriedade existe nos dados
    if (!rows.length || !(property in rows[0])) return;

    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    // Ordena os dados localmente (ou pode chamar a API para ordenação server-side)
    const sortedRows = [...rows].sort((a, b) => {
      // Lógica de ordenação para diferentes tipos de dados
      if (property === 'diferenca') {
        return (isAsc ? 1 : -1) * (parseFloat(a[property]) - parseFloat(b[property]));
      }
      else if (property === 'updated_at' || property === 'created_at') {
        return (isAsc ? 1 : -1) * (new Date(a[property]).getTime() - new Date(b[property]).getTime());
      }
      else {
        // Ordenação padrão para strings/IDs
        return (isAsc ? 1 : -1) * String(a[property]).localeCompare(String(b[property]));
      }
    });

    setRows(sortedRows);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExpandRow = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const formatCurrency = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conciliado':
        return <CheckCircleIcon color="success" />;
      case 'pendente':
        return <PendingIcon color="warning" />;
      default:
        return <ErrorIcon color="error" />;
    }
  };

  const headCells: HeadCell[] = [
    {
      id: 'id',
      numeric: true,
      label: 'ID',
      align: 'center',
      icon: <ReceiptIcon fontSize="small" />
    },
    {
      id: 'status',
      numeric: false,
      label: 'Status',
      align: 'center',
      icon: <InfoIcon fontSize="small" />
    },
    {
      id: 'diferenca',
      numeric: true,
      label: 'Diferença',
      align: 'right',
      icon: <AttachMoneyIcon fontSize="small" />
    },
    {
      id: 'movimentacao',
      numeric: false,
      label: 'Movimentação',
      align: 'left',
      icon: <ReceiptIcon fontSize="small" />
    },
    {
      id: 'transacao',
      numeric: false,
      label: 'Transação',
      align: 'left',
      icon: <CreditCardIcon fontSize="small" />
    },
    {
      id: 'data',
      numeric: false,
      label: 'Data',
      align: 'center',
      icon: <CalendarIcon fontSize="small" />
    },
    {
      id: 'actions',
      numeric: false,
      label: 'Ações',
      align: 'center'
    }
  ];


  const EnhancedTableHead = () => {
    const createSortHandler = (property: keyof ConciliacaoItem) => () => {
      handleRequestSort(property);
    };

    return (
      <TableHead>
        <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
          <TableCell padding="checkbox" />
          {headCells.map((headCell) => { // Corrigido: adicionado parênteses ao redor do parâmetro
            // Só permite ordenar em colunas específicas
            const canSort = ['id', 'status', 'diferenca', 'updated_at'].includes(headCell.id);

            return (
              <TableCell
                key={headCell.id}
                align={headCell.align}
                sortDirection={canSort && orderBy === headCell.id ? order : false}
                sx={{ fontWeight: 'bold', py: 2 }}
              >
                {canSort ? (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id as keyof ConciliacaoItem)}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      {headCell.icon}
                    </Box>
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {headCell.icon && (
                      <Box sx={{ mr: 1, display: 'flex' }}>
                        {headCell.icon}
                      </Box>
                    )}
                    {headCell.label}
                  </Box>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  };

  return (
    <PageContainer title="Conciliações" description="Lista de conciliações financeiras">
      <Breadcrumb title="Conciliações" subtitle="Lista detalhada" />
      <ParentCard title="Conciliações Financeiras">
        <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size="medium"
              sx={{ minWidth: 750 }}
            >
              <EnhancedTableHead />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        Nenhuma conciliação encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(row => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.light, 0.05)
                          }
                        }}
                      >
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleExpandRow(row.id)}
                          >
                            {expandedRows.includes(row.id) ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            #{row.id}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={row.status}>
                            <Chip
                              icon={getStatusIcon(row.status)}
                              label={row.status.toUpperCase()}
                              size="small"
                              color={
                                row.status === 'conciliado' ? 'success' :
                                  row.status === 'pendente' ? 'warning' : 'error'
                              }
                              sx={{ minWidth: 100 }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={
                              parseFloat(row.diferenca) > 0 ? 'success.main' :
                                parseFloat(row.diferenca) < 0 ? 'error.main' : 'text.primary'
                            }
                            fontWeight="medium"
                          >
                            {formatCurrency(row.diferenca)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: theme.palette.background.default, mr: 2, width: 32, height: 32 }}>
                              {row.movimentacao.tipo === 'entrada' ? (
                                <AttachMoneyIcon color="success" fontSize="small" />
                              ) : (
                                <CreditCardIcon color="error" fontSize="small" />
                              )}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {row.movimentacao.documento || 'Sem descrição'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatCurrency(row.movimentacao.valor_liquido)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: theme.palette.grey[200], mr: 2, width: 32, height: 32 }}>
                              {row.transacao.tipo === 'credit_card' ? (
                                <CreditCardIcon color="primary" fontSize="small" />
                              ) : (
                                <ReceiptIcon color="info" fontSize="small" />
                              )}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {row.transacao.descricao || 'Sem descrição'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatCurrency(row.transacao.valor)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {formatDate(row.updated_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Detalhes">
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              startIcon={<InfoIcon />}
                              onClick={() => console.log('Detalhes', row)}
                            >
                              Detalhes
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ padding: 0 }} colSpan={headCells.length + 1}>
                          <Collapse in={expandedRows.includes(row.id)} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, boxShadow: 3, border: '1px solid rgba(0, 0, 0, 0.20)' }}>
                              <Typography variant="h6" gutterBottom>
                                Detalhes da Conciliação
                              </Typography>
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                  <Paper sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.20)', boxShadow: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom mb={1} >
                                      <Box display="flex" alignItems="center">
                                        <ReceiptIcon color="primary" sx={{ mr: 1}} />
                                        Movimentação Financeira
                                      </Box>
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <List dense>
                                      <ListItem>
                                        <ListItemText
                                          primary="Documento"
                                          secondary={row.movimentacao.documento || 'Não informado'}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary="Valor Bruto"
                                          secondary={formatCurrency(row.movimentacao.valor_bruto)}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary="Valor Líquido"
                                          secondary={formatCurrency(row.movimentacao.valor_liquido)}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary="Data da Operação"
                                          secondary={formatDate(row.movimentacao.data_operacao)}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary="Tipo"
                                          secondary={
                                            <Chip
                                              label={row.movimentacao.tipo?.toUpperCase() || 'N/A'}
                                              size="small"
                                              color={row.movimentacao.tipo === 'entrada' ? 'success' : 'error'}
                                            />
                                          }
                                        />
                                      </ListItem>
                                    </List>
                                  </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Paper sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.20)', boxShadow: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                      <Box display="flex" alignItems="center">
                                        <CreditCardIcon color="primary" sx={{ mr: 1 }} />
                                        Transação Bancária
                                      </Box>
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <List dense>
                                      <ListItem>
                                        <ListItemText
                                          primary="ID Externo"
                                          secondary={row.transacao.id_transacao_externa}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary="Descrição"
                                          secondary={row.transacao.descricao || 'Não informado'}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary="Valor"
                                          secondary={formatCurrency(row.transacao.valor)}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary="Tipo"
                                          secondary={
                                            <Chip
                                              label={row.transacao.tipo?.toUpperCase() || 'N/A'}
                                              size="small"
                                              color="primary"
                                            />
                                          }
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary="Pagador"
                                          secondary={row.transacao.nome_pagador || 'Não informado'}
                                        />
                                      </ListItem>
                                    </List>
                                  </Paper>
                                </Grid>
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              '& .MuiTablePagination-toolbar': {
                padding: 2
              }
            }}
          />
        </Paper>
      </ParentCard>
    </PageContainer>
  );
}