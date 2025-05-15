'use client';
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Tabs,
  Tab,
  useTheme,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  LinearProgress,
  Button,
} from '@mui/material';
import { AttachMoney, Cancel, CheckCircle, Receipt } from '@mui/icons-material';

// Dados completos de exemplo
const data = {
  id: 6,
  pedido_arte_final_id: null,
  orcamento_id: 293,
  orcamento_status_id: 47,
  carteira_id: null,
  conta_id: null,
  estoque_id: null,
  fornecedor_id: null,
  cliente_id: null,
  categoria_id: null,
  origin_type: "Orçamento",
  origin_id: 293,
  numero_pedido: "0",
  documento: "orçamento N° 293",
  tipo_documento: "orçamento",
  valor_bruto: "89.07",
  valor_liquido: "89.07",
  data_operacao: "2025-05-15T12:46:56.000000Z",
  data_lancamento: "2025-05-15T12:46:56.000000Z",
  tipo: "entrada",
  etapa: "orçamento aprovado",
  status: "pendente conciliação",
  // status: "conciliado",
  observacoes: null,
  lista_produtos: [
    {
      id: 1071,
      nome: "Bandeira Personalizada - 1.5 x 1 - Uma face",
      peso: "0.16",
      type: "produtosOrcamento",
      prazo: 15,
      preco: 42.50,
      altura: "5.00",
      largura: "20.00",
      created_at: null,
      quantidade: 1,
      updated_at: null,
      comprimento: "20.00",
    },
    {
      id: 1072,
      nome: "Bandeira Personalizada - 1.5 x 1.5 - Uma face",
      peso: "0.18",
      type: "produtosOrcamento",
      prazo: 15,
      preco: 43.20,
      altura: "5.00",
      largura: "20.00",
      created_at: null,
      quantidade: 1,
      updated_at: null,
      comprimento: "20.00",
    },
  ],
  metadados_cliente: {
    cliente_octa_number: "123",
  },
  metadados: {
    forma_pagamento: "pix",
    tipo_faturamento: "a_vista",
    parcelas: [
      {
        numero: 1,
        data: "2025-05-15T12:46:52.203Z",
        valor: "89.07",
        status: "pago",
      },
      {
        numero: 2,
        data: "2025-06-15T12:46:52.203Z",
        valor: "89.07",
        status: "pendente",
      },
    ],
  },
  created_at: "2025-05-15T12:46:56.000000Z",
  updated_at: "2025-05-15T12:46:56.000000Z",
  deleted_at: null,
};

// Dados de transações bancárias de exemplo
const transacoesBanco = [
  {
    id: 82,
    valor: "85.80",
    data_transacao: "2025-05-15T12:37:30.000000Z",
    descricao: "Pagamento Orçamento 293",
    status: "confirmado",
    plataforma: "mercado_pago",
    chave_conciliacao: "1702190852",
    detalhes: {
      payer: {
        id: "123",
        email: "cliente@example.com"
      }
    }
  },
  {
    id: 83,
    valor: "89.07",
    data_transacao: "2025-05-15T12:45:00.000000Z",
    descricao: "Transferência Pix",
    status: "pendente",
    plataforma: "banco_brasil",
    chave_conciliacao: null
  },
  {
    id: 84,
    valor: "92.50",
    data_transacao: "2025-05-15T13:10:00.000000Z",
    descricao: "Pagamento não identificado",
    status: "confirmado",
    plataforma: "mercado_pago",
    chave_conciliacao: null
  }
];

const TransactionDetailsPage = () => {
  const theme = useTheme();
  const [tab, setTab] = useState('gerais');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const isEntrada = data.tipo === 'entrada';
  const numberColor = isEntrada ? theme.palette.success.main : theme.palette.error.main;

  // Totais
  const totalProdutos = data.lista_produtos.reduce(
    (sum, prod) => sum + prod.preco * prod.quantidade,
    0
  );
  const totalParcelas = data.metadados.parcelas.reduce(
    (sum, parc) => sum + parseFloat(parc.valor),
    0
  );
  const tipoFaturamentoLabel =
    data.metadados.tipo_faturamento === 'a_vista' ? 'À Vista' : data.metadados.tipo_faturamento;

  const handleTabChange = (_: any, newValue: string) => setTab(newValue);

  // Encontrar correspondências
  const encontrarCorrespondencias = () => {
    const margem = 0.15;
    const valorMovimentacao = parseFloat(data.valor_bruto);

    return transacoesBanco.filter(transacao => {
      const valorTransacao = parseFloat(transacao.valor);
      const diferenca = Math.abs(valorTransacao - valorMovimentacao);
      return diferenca <= (valorMovimentacao * margem);
    });
  };

  const correspondencias = encontrarCorrespondencias();

  const calcularDiferencaPercentual = (valorTransacao: number) => {
    const valorMovimentacao = parseFloat(data.valor_bruto);
    return ((valorTransacao - valorMovimentacao) / valorMovimentacao * 100).toFixed(2);
  };

  const calcularSemelhancaPercentual = (valorTransacao: number) => {
    const valorMovimentacao = parseFloat(data.valor_bruto);
    const diferencaPercentual = Math.abs((valorTransacao - valorMovimentacao) / valorMovimentacao * 100);
    return (100 - diferencaPercentual).toFixed(2);
  };

  return (
    <Box p={4} component={Paper} elevation={3}>
      <Typography variant="h4" gutterBottom>
        Detalhes da Transação
      </Typography>

      {/* Abas principais */}
      <Box display="flex" width={'100%'}>
        <Tabs
          sx={{ display: "flex", width: "100%", }}
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          defaultValue="gerais"
        >
          <Tab label="Gerais" value="gerais" />
          <Tab label="Produtos" value="produtos" />
          <Tab label="Parcelas" value="parcelas" />
          {data.status.includes('pendente') && (
            <Tab label="Conciliação" value="conciliacao" />
          )}
        </Tabs>
      </Box>

      {/* Conteúdo das abas */}
      {tab === 'gerais' && (
        <Box mt={2}>
          {/* Dados Gerais */}
          <Grid container spacing={2} justifyContent="space-evenly">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>ID</Typography>
              <Typography variant="body1">{data.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Origin Type</Typography>
              <Chip label={data.origin_type} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Tipo Documento</Typography>
              <Chip label={data.tipo_documento} color="primary" />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* Valores & Status */}
          <Grid container spacing={2} justifyContent="space-evenly">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Valor Bruto</Typography>
              <Typography variant="h6" sx={{ color: numberColor }}>
                R$ {parseFloat(data.valor_bruto).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Valor Líquido</Typography>
              <Typography variant="h6" sx={{ color: numberColor }}>
                R$ {totalProdutos.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
              <Chip label={data.status} color="warning" />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* Datas & Etapa */}
          <Grid container spacing={2} justifyContent="space-evenly">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Data Operação</Typography>
              <Typography variant="body2">
                {new Date(data.data_operacao).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Data Lançamento</Typography>
              <Typography variant="body2">
                {new Date(data.data_lancamento).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Etapa</Typography>
              <Chip label={data.etapa} />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* Metadados Adicionais */}
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Forma Pagamento</Typography>
              <Chip label={data.metadados.forma_pagamento.toUpperCase()} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={700}>Tipo Faturamento</Typography>
              <Typography variant="body1">
                <strong>{tipoFaturamentoLabel}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {tab === 'produtos' && (
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }} >Nome</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }} align="right">Quantidade</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }} align="right">Preço Unit.</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }} align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.lista_produtos.map((prod) => (
                  <TableRow key={prod.id}>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} >{prod.nome}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} align="right">{prod.quantidade}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} align="right">R$ {prod.preco.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} align="right">
                      R$ {(prod.preco * prod.quantidade).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: 15 }} ><strong>Total Produtos</strong></TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell sx={{ fontWeight: 600, fontSize: 15 }} align="right">
                    <strong>R$ {totalProdutos.toFixed(2)}</strong>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tab === 'parcelas' && (
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }} >Parcela</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }} >Data</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }} align="right">Valor</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }} >Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.metadados.parcelas.map((parc) => (
                  <TableRow key={parc.numero}>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} >#{parc.numero}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} >{new Date(parc.data).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} align="right">R$ {parseFloat(parc.valor).toFixed(2)}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} >
                      <Chip label={parc.status} size="small" color={parc.status === 'pago' ? 'success' : 'warning'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: 15 }} ><strong>Total Parcelas</strong></TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 15 }} />
                  <TableCell sx={{ fontWeight: 600, fontSize: 15 }} align="right">
                    <strong>R$ {totalParcelas.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      )}

      {data.status.toLowerCase().includes('pendente') && (
        <div>
          <Divider sx={{ my: 5 }} />
          <Box mt={2}>
            <Typography variant="h3" gutterBottom>
              Correspondências Bancárias
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Transações com valores dentro da margem de 15% do valor da movimentação
            </Typography>

            <Grid container spacing={3} mt={2}>
              {/* Lista de correspondências */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Transações Potenciais ({correspondencias.length})
                    </Typography>

                    <List>
                      {correspondencias.map((transacao) => (
                        <ListItem
                          key={transacao.id}
                          button
                          selected={selectedTransaction?.id === transacao.id}
                          onClick={() => setSelectedTransaction(transacao)}
                          sx={{
                            borderLeft: selectedTransaction?.id === transacao.id ?
                              `4px solid ${theme.palette.primary.main}` : 'none',
                            mb: 1
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.grey[200] }}>
                              <AttachMoney color="action" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`R$ ${parseFloat(transacao.valor).toFixed(2)}`}
                            secondary={
                              <>
                                <Box component="span" display="block">{transacao.descricao}</Box>
                                <Box component="span" display="block">
                                  {new Date(transacao.data_transacao).toLocaleString()}
                                </Box>
                              </>
                            }
                          />
                          <Chip
                            label={`${calcularSemelhancaPercentual(parseFloat(transacao.valor))}%`}
                            color={
                              parseFloat(calcularSemelhancaPercentual(parseFloat(transacao.valor))) > 95 ?
                                'success' : 'warning'
                            }
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Detalhes da transação selecionada */}
              <Grid item xs={12} md={6}>
                {selectedTransaction ? (
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Detalhes da Transação</Typography>
                        <Chip
                          label={selectedTransaction.status}
                          color={selectedTransaction.status === 'confirmado' ? 'success' : 'warning'}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">ID Transação</Typography>
                          <Typography>{selectedTransaction.id}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Valor</Typography>
                          <Typography variant="h6">
                            R$ {parseFloat(selectedTransaction.valor).toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Data</Typography>
                          <Typography>
                            {new Date(selectedTransaction.data_transacao).toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Plataforma</Typography>
                          <Typography>{selectedTransaction.plataforma}</Typography>
                        </Grid>
                        {selectedTransaction.detalhes?.payer && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2">Pagador</Typography>
                            <Typography>
                              ID: {selectedTransaction.detalhes.payer.id}
                              {selectedTransaction.detalhes.payer.email && (
                                <Box component="span" display="block">
                                  Email: {selectedTransaction.detalhes.payer.email}
                                </Box>
                              )}
                            </Typography>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Diferença</Typography>
                          <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(100, Math.abs(parseFloat(calcularDiferencaPercentual(parseFloat(selectedTransaction.valor)))) * 5)}
                                color={
                                  Math.abs(parseFloat(calcularDiferencaPercentual(parseFloat(selectedTransaction.valor)))) < 5 ?
                                    'success' : 'warning'
                                }
                              />
                            </Box>
                            <Typography>
                              {calcularDiferencaPercentual(parseFloat(selectedTransaction.valor))}%
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Semelhança</Typography>
                          <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                              <LinearProgress
                                variant="determinate"
                                value={parseFloat(calcularSemelhancaPercentual(parseFloat(selectedTransaction.valor)))}
                                color={
                                  parseFloat(calcularSemelhancaPercentual(parseFloat(selectedTransaction.valor))) > 95 ?
                                    'success' : 'warning'
                                }
                              />
                            </Box>
                            <Typography>
                              {calcularSemelhancaPercentual(parseFloat(selectedTransaction.valor))}%
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                        {/* <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      >
                      Descartar
                      </Button> */}
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CheckCircle />}
                        >
                          Conciliar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Receipt sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Selecione uma transação para visualizar os detalhes
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>

            {/* Comparação de valores */}
            {selectedTransaction && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Comparação de Valores
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Movimentação Financeira
                        </Typography>
                        <Typography variant="h5" color={numberColor}>
                          R$ {parseFloat(data.valor_bruto).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.documento}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.metadados.forma_pagamento}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.metadados.tipo_faturamento === 'a_vista' ? 'A Vista' : data.metadados.tipo_faturamento}
                        </Typography>
                        <Typography variant="body2">
                          Cliente: {data.metadados_cliente.cliente_octa_number}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Transação Bancária
                        </Typography>
                        <Typography variant="h5" color={numberColor}>
                          R$ {parseFloat(selectedTransaction.valor).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedTransaction.descricao}
                        </Typography>
                        {selectedTransaction.detalhes?.payer && (
                          <Typography variant="body2">
                            Pagador: {selectedTransaction.detalhes.payer.id}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </div>
      )}

    </Box>
  );
};

export default TransactionDetailsPage;
