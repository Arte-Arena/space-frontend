'use client';
import React, { useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { AttachMoney, Cancel, CheckCircle, Receipt } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { MovimentacaoFinanceiraDetails, ParcelaDetails, Produto, TransacaoBancariaDetails } from '../../components/types';


type MetadadosRaw = {
  forma_pagamento: string;
  tipo_faturamento: string;
  parcelas: ParcelaDetails[];
}

const TransactionDetailsPage = () => {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const [tab, setTab] = useState('gerais');
  const [selectedTransaction, setSelectedTransaction] = useState<TransacaoBancariaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [conciliando, setConciliando] = useState(false);
  const [movimentacao, setMovimentacao] = useState<MovimentacaoFinanceiraDetails | null>(null);
  const [transacoesParecidas, setTransacoesParecidas] = useState<TransacaoBancariaDetails[]>([]);
  const id = params.id;

  if (!accessToken) {
    router.push('/login');
    return null;
  }

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/movimentacoes-financeiras/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Verifica se a resposta foi bem sucedida
        if (!res.ok) {
          throw new Error('Erro ao carregar dados');
        }

        // Converte a resposta para JSON
        const data = await res.json();

        setMovimentacao(data.movimentacao);

        if (data.transacoes_parecidas) {
          setTransacoesParecidas(data.transacoes_parecidas);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, accessToken, conciliando]);


  const isEntrada = movimentacao?.tipo === 'entrada';
  const numberColor = isEntrada ? theme.palette.success.main : theme.palette.error.main;

  const parseListaProdutos = (lista: string | Produto[]): Produto[] => {
    if (typeof lista === 'string') {
      try {
        return JSON.parse(lista) as Produto[];
      } catch (error) {
        console.error('Erro ao parsear lista_produtos:', error);
        return [];
      }
    }
    return lista;
  };

  const parseParcelas = (
    input: string | ParcelaDetails[]
  ): ParcelaDetails[] => {
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input) as MetadadosRaw | ParcelaDetails[];
        // Se o JSON inteiro for o objeto metadados:
        if ((parsed as MetadadosRaw).parcelas) {
          return (parsed as MetadadosRaw).parcelas;
        }
        // Se o JSON já for um array de ParcelaDetails:
        if (Array.isArray(parsed)) {
          return parsed;
        }
        console.error('Formato inesperado em parseParcelas:', parsed);
        return [];
      } catch (err) {
        console.error('Erro ao parsear parcelas:', err);
        return [];
      }
    }
    // já é um array no formato certo
    return input;
  };

  const parcelas: ParcelaDetails[] = parseParcelas(movimentacao?.metadados?.parcelas || []);

  // Totais
  const totalProdutos = parseListaProdutos(movimentacao?.lista_produtos || []).reduce(
    (sum, prod) => sum + prod.preco * prod.quantidade,
    0
  );
  const totalParcelas = parseListaProdutos(movimentacao?.lista_produtos || []).reduce(
    (sum, parc) => sum + parc.preco,
    0
  );
  const tipoFaturamentoLabel =
    movimentacao?.metadados.tipo_faturamento === 'a_vista' ? 'À Vista' : movimentacao?.metadados.tipo_faturamento;

  const handleTabChange = (_: any, newValue: string) => setTab(newValue);

  const encontrarCorrespondencias = () => {
    return transacoesParecidas.map(transacao => ({
      ...transacao,
      porcentagem_semelhanca: transacao.porcentagem_semelhanca ||
        calcularSemelhancaPercentual(parseFloat(transacao.valor))
    }));
  };

  const correspondencias = encontrarCorrespondencias();

  const calcularDiferencaPercentual = (valorTransacao: number) => {
    const valorMovimentacao = parseFloat(movimentacao?.valor_bruto || '0');
    return ((valorTransacao - valorMovimentacao) / valorMovimentacao * 100).toFixed(2);
  };

  const calcularSemelhancaPercentual = (valorTransacao: number) => {
    const valorMovimentacao = parseFloat(movimentacao?.valor_bruto || '0');
    const diferencaPercentual = Math.abs((valorTransacao - valorMovimentacao) / valorMovimentacao * 100);
    return (100 - diferencaPercentual).toFixed(2);
  };

  const handleConciliate = async () => {
    if (!selectedTransaction || !movimentacao) return;
    setConciliando(true);
    try {
      const diferenca = (parseFloat(selectedTransaction.valor) - parseFloat(movimentacao.valor_bruto)).toFixed(2);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/conciliacao`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            transacao_bancaria_id: selectedTransaction.id,
            movimentacao_financeira_id: movimentacao.id,
            status: 'conciliado',
            diferenca,
            observacoes: '',
          }),
        }
      );
      if (!res.ok) throw new Error('Erro ao conciliar');
      alert('Conciliação realizada com sucesso');
      router.refresh();
      setTab('gerais');
    } catch (err) {
      console.error(err);
      alert('Falha ao conciliar');
    } finally {
      setConciliando(false);
    }
  };
    
  if (loading) {
    return <CircularProgress />;
  }

  if (!movimentacao) {
    return <Typography>Nenhuma movimentação encontrada</Typography>;
  }

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
          {movimentacao?.status.includes('pendente') && (
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
              <Typography variant="body1">{movimentacao?.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Origin Type</Typography>
              <Chip label={movimentacao?.origin_type} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Tipo Documento</Typography>
              <Chip label={movimentacao?.tipo_documento} color="primary" />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* Valores & Status */}
          <Grid container spacing={2} justifyContent="space-evenly">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Valor Bruto</Typography>
              <Typography variant="h6" sx={{ color: numberColor }}>
                R$ {parseFloat(movimentacao?.valor_bruto).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Valor Líquido</Typography>
              <Typography variant="h6" sx={{ color: numberColor }}>
                R$ {totalProdutos?.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
              <Chip label={movimentacao?.status} color="warning" />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* Datas & Etapa */}
          <Grid container spacing={2} justifyContent="space-evenly">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Data Operação</Typography>
              <Typography variant="body2">
                {new Date(movimentacao?.data_operacao).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Data Lançamento</Typography>
              <Typography variant="body2">
                {new Date(movimentacao?.data_lancamento).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Etapa</Typography>
              <Chip label={movimentacao?.etapa} />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* Metadados Adicionais */}
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" fontWeight={600}>Forma Pagamento</Typography>
              <Chip label={movimentacao?.metadados.forma_pagamento ? movimentacao?.metadados.forma_pagamento.toUpperCase() : 'N/A'} />
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
                {parseListaProdutos(movimentacao?.lista_produtos || []).map((prod) => (
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
                    <strong>R$ {totalProdutos?.toFixed(2)}</strong>
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
                {parseParcelas(movimentacao?.metadados?.parcelas || []).map((parc) => (
                  <TableRow key={parc.numero}>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} >#{parc.numero}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} >{new Date(parc.data).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 15 }} align="right">
                      R$ {parc.valor ? Number(parc.valor).toFixed(2) : '0.00'}
                    </TableCell>
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
                    <strong>R$ {totalParcelas?.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      )}

      {movimentacao?.status.toLowerCase().includes('pendente') && (
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
                    <Box
                      sx={{
                        height: '500px', // Altura fixa (ajuste conforme necessário)
                        overflowY: 'auto', // Scroll vertical
                        backgroundColor: theme.palette.background.paper
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        Transações Potenciais ({correspondencias.length})
                      </Typography>
                      <List dense>
                        {correspondencias.map((transacao) => (
                          <ListItem
                            key={transacao.id}
                            button
                            selected={selectedTransaction?.id === transacao.id}
                            onClick={() => setSelectedTransaction({
                              ...transacao,
                              porcentagem_semelhanca: typeof transacao.porcentagem_semelhanca === 'string'
                                ? parseFloat(transacao.porcentagem_semelhanca)
                                : transacao.porcentagem_semelhanca
                            })}
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
                    </Box>
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
                          startIcon={conciliando ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                          onClick={handleConciliate}
                          disabled={conciliando}
                        >
                          {conciliando ? 'Conciliando...' : 'Conciliar'}
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
                          R$ {parseFloat(movimentacao?.valor_bruto).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {movimentacao?.documento}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {movimentacao?.metadados.forma_pagamento}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {movimentacao?.metadados.tipo_faturamento === 'a_vista' ? 'A Vista' : movimentacao?.metadados.tipo_faturamento}
                        </Typography>
                        <Typography variant="body2">
                          Cliente: {movimentacao?.metadados_cliente.cliente_octa_number}
                        </Typography>

                        {/* Lista de produtos */}
                        <Box>
                          <List dense sx={{ maxHeight: 150, overflow: 'auto', bgcolor: 'background.paper' }}>
                            {parseListaProdutos(movimentacao?.lista_produtos || []).map((produto) => (
                              <ListItem key={produto.id} sx={{ py: 0, px: 0 }}>
                                <ListItemText
                                  primary={`${produto.quantidade}x ${produto.nome}`}
                                  secondary={`R$ ${produto.preco.toFixed(2)} (Total: R$ ${(produto.preco * produto.quantidade).toFixed(2)})`}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

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
                        {selectedTransaction.detalhes?.payer?.email && (
                          <Typography variant="body2">
                            Email: {selectedTransaction.detalhes.payer.email}
                          </Typography>
                        )}
                        {selectedTransaction.detalhes?.payer?.phone?.number && (
                          <Typography variant="body2">
                            Fone: {selectedTransaction?.detalhes?.payer?.phone?.number}
                          </Typography>
                        )}
                        {selectedTransaction.detalhes?.payer?.identification.number && (
                          <Box>
                            <Typography variant="body2">
                              Doc: {selectedTransaction?.detalhes?.payer?.identification.type}
                            </Typography>
                            <Typography variant="body2">
                              N°: {selectedTransaction?.detalhes?.payer?.identification.number}
                            </Typography>
                          </Box>
                        )}
                        {selectedTransaction.detalhes?.payer?.first_name && (
                          <Typography variant="body2">
                            Nome: {selectedTransaction?.detalhes?.payer?.first_name} {selectedTransaction?.detalhes?.payer?.last_name}
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
      {conciliando && 
      <LinearProgress
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 9999,
        }}
      />
      }
    </Box>
  );
};

export default TransactionDetailsPage;
