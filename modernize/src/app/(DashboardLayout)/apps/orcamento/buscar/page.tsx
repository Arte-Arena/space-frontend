'use client';
import React, { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import { Pagination, Stack, Button, Box, Typography, Collapse, Popover } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconProgressCheck, IconEdit, IconCircleCheck, IconBan, IconProgressHelp, IconX, IconArrowBackUp } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';

// IMPORTAR FUNÇÕES DE MUDANÇA NO BACKEND (fazer num arquivo só e ter varios exports)


interface Orcamento {
  id: number;
  user_id: number;
  cliente_octa_number: string;
  nome_cliente: string | null;
  lista_produtos: string | null;
  texto_orcamento: string | null;
  endereco_cep: string;
  endereco: string;
  opcao_entrega: string;
  prazo_opcao_entrega: number;
  preco_opcao_entrega: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  brinde: number;
  tipo_desconto: string;
  valor_desconto: number;
  data_antecipa: string;
  taxa_antecipa: string;
  total_orcamento: number;
  status_aprovacao_arte_arena: string;
  status_aprovacao_cliente: string;
  status_envio_pedido: string;
  status_aprovacao_amostra_arte_arena: string;
  status_envio_amostra: string;
  status_aprovacao_amostra_cliente: string;
  status_faturamento: string;
  status_pagamento: string;
  status_producao_esboco: string;
  status_producao_arte_final: string;
  status_aprovacao_esboco: string;
  status_aprovacao_arte_final: string;
}

const OrcamentoBuscarScreen = () => {
  const router = useRouter();

  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { isFetching: isFetchingOrcamentos, error: errorOrcamentos, data: dataOrcamentos, refetch } = useQuery({
    queryKey: ['budgetData', searchQuery, page],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/get-orcamentos-status?q=${encodeURIComponent(searchQuery)}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });


  const handleSearch = () => {
    setSearchQuery(query); // Atualiza a busca
    setPage(1); // Reseta para a primeira página ao realizar uma nova busca
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleToggleRow = (id: number) => {
    setOpenRow(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isFetchingOrcamentos) return <CircularProgress />;
  if (errorOrcamentos) return <p>Ocorreu um erro: {errorOrcamentos.message}</p>;
  if (dataOrcamentos) console.log(dataOrcamentos);

  // TODOS OS HANDLES DE APROVAÇÃO

  const handleAprovarArteArena = (rowId: number) => {
    window.open(`/apps/orcamento/aprovar/${rowId}`, '_blank');
  };

  const handleAprovarCliente = (rowId: number) =>{
    return null;
  }

  const handleAprovarEnvioPedido = (rowId: number) =>{
    return null;
  }

  const handleAprovarAmostraArteArena = (rowId: number) =>{
    return null;
  }

  const handleAprovarEnvioAmostra = (rowId: number) =>{
    return null;
  }

  const handleAprovarAmostraCliente = (rowId: number) =>{
    return null;
  }

  const handleAprovarFaturamento = (rowId: number) =>{
    return null;
  }

  const handleAprovarPagamento = (rowId: number) =>{
    return null;
  }

  const handleAprovarProducaoEsboco = (rowId: number) =>{
    return null;
  }

  const handleAprovarProducaoArteFinal = (rowId: number) =>{
    return null;
  }

  const handleAprovarEsboco = (rowId: number) =>{
    return null;
  }

  const handleAprovarArteFinal = (rowId: number) =>{
    return null;
  }


  // TODOS OS HANDLES DE MUDANÇA DE STATUS

  const handleDesaprovarArteArena = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarCliente = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarEnvioPedido = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarAmostraArteArena = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarEnvioAmostra = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarAmostraCliente = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarFaturamento = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarPagamento = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarProducaoEsboco = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarProducaoArteFinal = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarEsboco = (rowId: number) =>{
    return null;
  }

  const handleDesaprovarArteFinal = (rowId: number) =>{
    return null;
  }

  const handleEditOrcamento = (orcamentoId: number) => {
    // router.push(`/apps/orcamento/editar?id=${orcamentoId}`);
    console.log('Aguarde.');
  };

  return (
    <PageContainer title="Orçamento / Buscar" description="Buscar Orçamento da Arte Arena">
      <Breadcrumb title="Orçamento / Buscar" subtitle="Gerencie os Orçamentos da Arte Arena / Buscar" />
      <ParentCard title="Buscar Orçamento" >
        <>

          <Stack spacing={2} direction="row" alignItems="center" mb={2}>
            <CustomTextField
              fullWidth
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<IconSearch />}
            >
              Buscar
            </Button>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Número do Cliente</TableCell>
                  <TableCell>Data de Criação</TableCell>
                  <TableCell>Aprovação Arte Arena</TableCell>
                  <TableCell>Aprovação Cliente</TableCell>
                  <TableCell>Envio Pedido</TableCell>
                  <TableCell>Aprovação Amostra Arte Arena</TableCell>
                  <TableCell>Envio Amostra</TableCell>
                  <TableCell>Aprovação Amostra Cliente</TableCell>
                  <TableCell>Faturamento</TableCell>
                  <TableCell>Pagamento</TableCell>
                  <TableCell>Produção Esboço</TableCell>
                  <TableCell>Produção Arte Final</TableCell>
                  <TableCell>Aprovação Esboço</TableCell>
                  <TableCell>Aprovação Arte Final</TableCell>

                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataOrcamentos?.data.map((row: Orcamento) => (
                  <React.Fragment key={row.id}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggleRow(row.id)}
                        >
                          {openRow[row.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.cliente_octa_number}</TableCell>
                      <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                      
                      {/* status handles */}
                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status === "aprovado" ? "Aprovado" : "Não Aprovado"}
                            </Typography>
                              {row.status === "aprovado" ? (
                                <IconCircleCheck color="green" size={20} />
                              ) : (
                                <IconBan color="red" size={20} />
                              )}
                          </Stack>
                            <Tooltip title="Alterar Status">
                              <IconButton
                                aria-label="alterar status"
                                onClick={() =>
                                  row.status === "aprovado"
                                    ? handleDesaprovarArteArena(row.id)
                                    : handleAprovarArteArena(row.id)
                                }
                              >
                                {row.status === "aprovado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                              </IconButton>
                            </Tooltip>                          
                        </Stack>
                      </TableCell>
                          {/* <IconButton
                            aria-label="edit"
                            onClick={() => handleEditOrcamento(row.id)}
                          >
                            <IconEdit />
                          </IconButton> */}


                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_aprovacao_cliente ?? "Aguardando Aprovação"}
                            </Typography>
                            {row.status_aprovacao_cliente === "Aprovado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_cliente === "Aprovado"
                                  ? handleDesaprovarCliente(row.id)
                                  : handleAprovarCliente(row.id)
                              }
                            >
                              {row.status_aprovacao_cliente === "Aprovado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_envio_pedido ?? "Não Enviado"}
                            </Typography>
                            {row.status_envio_pedido === "Enviado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_envio_pedido === "Enviado"
                                  ? handleDesaprovarEnvioPedido(row.id)
                                  : handleAprovarEnvioPedido(row.id)
                              }
                            >
                              {row.status_envio_pedido === "Enviado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_aprovacao_amostra_arte_arena ?? "Não Aprovado"}
                            </Typography>
                            {row.status_aprovacao_amostra_arte_arena === "Aprovado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_amostra_arte_arena === "Aprovado"
                                  ? handleDesaprovarAmostraArteArena(row.id)
                                  : handleAprovarAmostraArteArena(row.id)
                              }
                            >
                              {row.status_aprovacao_amostra_arte_arena === "Aprovado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_envio_amostra ?? "Não Enviada"}
                            </Typography>
                            {row.status_envio_amostra === "Enviada" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_envio_amostra === "Enviada"
                                  ? handleDesaprovarEnvioAmostra(row.id)
                                  : handleAprovarEnvioAmostra(row.id)
                              }
                            >
                              {row.status_envio_amostra === "Enviada" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_aprovacao_amostra_cliente ?? "Não Aprovado"}
                            </Typography>
                            {row.status_aprovacao_amostra_cliente === "Aprovado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_amostra_cliente === "Aprovado"
                                  ? handleDesaprovarAmostraCliente(row.id)
                                  : handleAprovarAmostraCliente(row.id)
                              }
                            >
                              {row.status_aprovacao_amostra_cliente === "Aprovado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_faturamento ?? "Em Análise"}
                            </Typography>
                            {row.status_faturamento === "Faturado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_faturamento === "Faturado"
                                  ? handleDesaprovarFaturamento(row.id)
                                  : handleAprovarFaturamento(row.id)
                              }
                            >
                              {row.status_faturamento === "Faturado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_pagamento ?? "Aguardando"}
                            </Typography>
                            {row.status_pagamento === "Pago" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_pagamento === "Pago"
                                  ? handleDesaprovarPagamento(row.id)
                                  : handleAprovarPagamento(row.id)
                              }
                            >
                              {row.status_pagamento === "Pago" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_producao_esboco ?? "Aguardando Primeira Versão"}
                            </Typography>
                            {row.status_producao_esboco === "Finalizado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_producao_esboco === "Finalizado"
                                  ? handleDesaprovarProducaoEsboco(row.id)
                                  : handleAprovarProducaoEsboco(row.id)
                              }
                            >
                              {row.status_producao_esboco === "Finalizado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_producao_arte_final ?? "Aguardando Primeira Versão"}
                            </Typography>
                            {row.status_producao_arte_final === "Finalizado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_producao_arte_final === "Finalizado"
                                  ? handleDesaprovarProducaoArteFinal(row.id)
                                  : handleAprovarProducaoArteFinal(row.id)
                              }
                            >
                              {row.status_producao_arte_final === "Finalizado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_aprovacao_esboco ?? "Não Aprovado"}
                            </Typography>
                            {row.status_aprovacao_esboco === "Aprovado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_esboco === "Aprovado"
                                  ? handleDesaprovarEsboco(row.id)
                                  : handleAprovarEsboco(row.id)
                              }
                            >
                              {row.status_aprovacao_esboco === "Aprovado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography align="center">
                              {row.status_aprovacao_arte_final ?? "Não Aprovado"}
                            </Typography>
                            {row.status_aprovacao_arte_final === "Aprovado" ? (
                              <IconCircleCheck color="green" size={20} />
                            ) : (
                              <IconBan color="red" size={20} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_arte_final === "Aprovado"
                                  ? handleDesaprovarArteFinal(row.id)
                                  : handleAprovarArteFinal(row.id)
                              }
                            >
                              {row.status_aprovacao_arte_final === "Aprovado" ? <IconArrowBackUp /> : <IconProgressCheck />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={openRow[row.id]} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Lista de Produtos:</strong> {row.lista_produtos}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Texto do Orçamento:</strong> {row.texto_orcamento}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Endereço CEP:</strong> {row.endereco_cep}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Endereço:</strong> {row.endereco}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Op&ccedil;&atilde;o de Entrega:</strong> {row.opcao_entrega}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Prazo da Op&ccedil;&atilde;o de Entrega:</strong> {row.prazo_opcao_entrega} dias
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Pre&ccedil;o da Op&ccedil;&atilde;o de Entrega:</strong> {row.preco_opcao_entrega?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Typography>

                            {/* variaveis de gustavo */}
                            {row.brinde !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Brinde:</strong> {row.brinde === 1 ? "Com Brinde" : "Sem Brinde"}
                            </Typography>
                            )}

                            {row.valor_desconto !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Desconto:</strong>{" Com Desconto"}
                            </Typography>
                            )}
                              
                            {row.tipo_desconto !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Tipo Descontado:</strong> {row.tipo_desconto ?? "Nenhum"}
                            </Typography>
                            )}

                            {row.valor_desconto !== null &&(
                              <Typography variant="body2" gutterBottom>
                              <strong>Valor Descontado:</strong> R$ {row.valor_desconto ?? "Sem Desconto"}
                            </Typography>
                            )}

                            {row.data_antecipa !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Data Antecipação:</strong> {row.data_antecipa ?? "Sem Antecipação"}
                            </Typography>
                            )}

                            {row.taxa_antecipa !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Taxa Antecipação:</strong> R$ {row.taxa_antecipa ?? "Sem Taxa de Antecipação"}
                            </Typography>
                            )}

                            {row.total_orcamento !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Total Orçamento:</strong> R$ {row.total_orcamento ?? "Sem total Definido"}
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

          {/* Paginação */}
          <Stack spacing={2} mt={2} alignItems="center">
            <Pagination
              count={Math.ceil(dataOrcamentos.total / dataOrcamentos.per_page)}
              page={dataOrcamentos.current_page}
              onChange={handlePageChange}
            />
          </Stack>

        </>
      </ParentCard>
    </PageContainer>
  );
}


export default OrcamentoBuscarScreen;

