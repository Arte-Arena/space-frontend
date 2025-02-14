'use client';
import React, { useEffect, useState } from 'react';
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
import { Pagination, Stack, Button, Box, Typography, Collapse, Popover, TablePagination } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconProgressCheck, IconEdit, IconCircleCheck, IconBan, IconProgressHelp, IconX, IconArrowBackUp } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';
import { useStatusChangeAprovado, useStatusChangeDesaprovado } from '@/utils/PutStatusOrcamentos';


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

const useFetchOrcamentos = (searchQuery: string, page: number) => {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

  return useQuery({
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
};

const OrcamentoBuscarScreen = () => {
  const router = useRouter();

  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  // busca os dados
  const { isFetching, error, data, refetch } = useFetchOrcamentos(searchQuery, page);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  // const { isFetching: isFetchingOrcamentos, error: errorOrcamentos, data: dataOrcamentos, refetch } = useQuery({
  //   queryKey: ['budgetData', searchQuery, page],
  //   queryFn: () =>
  //     fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/get-orcamentos-status?q=${encodeURIComponent(searchQuery)}&page=${page}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }).then((res) => res.json()),
  // });




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

  if (isFetching) return <CircularProgress />;
  if (error) return <p>Ocorreu um erro: {error.message}</p>;
  // if (data) console.log(data);

  // TODOS OS HANDLES DE APROVAÇÃO

  const handleAprovarArteArena = (rowId: number) => {
    window.open(`/apps/orcamento/aprovar/${rowId}`, '_blank');
  };

  const handleAprovar = async (campo: string, rowId: number) =>{
    try{
      await useStatusChangeAprovado(campo, rowId);
      refetch();    
    }
    catch(err){
      console.log(err)
    }
  }

  // TODOS OS HANDLES DE MUDANÇA DE STATUS DESAPROVADOS

  const handleDesaprovarArteArena = async (rowId: number) =>{
    return null
  }

  const handleDesaprovar = async (campo: string, rowId: number) =>{
    try{
      await useStatusChangeDesaprovado(campo, rowId);
      refetch();
    }catch(err){
      console.log(err)
    }
  }
  
  // const handleEditOrcamento = (orcamentoId: number) => {
  //   // router.push(`/apps/orcamento/editar?id=${orcamentoId}`);
  //   console.log('Aguarde.');
  // };

  return (
    <PageContainer title="Orçamento / Buscar" description="Buscar Orçamento da Arte Arena">
      <Breadcrumb title="Orçamento / Buscar" subtitle="Gerencie os Orçamentos da Arte Arena / Buscar" />
      <ParentCard title="Buscar Orçamento" >
        <>

          <Stack spacing={1} direction="row" alignItems="center" mb={2}>
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
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >ID</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Número do Cliente</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center', padding: '0'}} >Data de Criação</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Arte Arena</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Cliente</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Envio Pedido</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Amostra Arte Arena</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Envio Amostra</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Amostra Cliente</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Faturamento</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Pagamento</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Produção Esboço</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Produção Arte Final</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Esboço</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Arte Final</TableCell>
                  {/* <TableCell>Ações</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((row: Orcamento) => (
                  <React.Fragment key={row.id}>
                    <TableRow>
                      <TableCell sx={{fontSize: '8px'}}>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggleRow(row.id)}
                        >
                          {openRow[row.id] ? <KeyboardArrowUpIcon sx={{fontSize: '15px'}}/> : <KeyboardArrowDownIcon sx={{fontSize: '15px'}}/>}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{fontSize: '8px'}} >{row.id}</TableCell>
                      <TableCell sx={{fontSize: '8px'}} >{row.cliente_octa_number}</TableCell>
                      <TableCell sx={{fontSize: '8px', padding: '0'}} >{new Date(row.created_at).toLocaleDateString()}</TableCell>
                      
                      {/* status handles */}
                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                              {row.status === "aprovado" ? (
                                <IconCircleCheck color="green" size={22} />
                              ) : (
                                <IconBan color="red" size={22} />
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
                                {row.status === "aprovado" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
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
                            {row.status_aprovacao_cliente === "aprovado" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_cliente === "aprovado"
                                  ? handleDesaprovar('status_aprovacao_cliente', row.id)
                                  : handleAprovar('status_aprovacao_cliente', row.id)
                              }
                            >
                              {row.status_aprovacao_cliente === "aprovado" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_envio_pedido === "enviado" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_envio_pedido === "enviado"
                                  ? handleDesaprovar('status_envio_pedido', row.id)
                                  : handleAprovar('status_envio_pedido', row.id)
                              }
                            >
                              {row.status_envio_pedido === "enviado" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_aprovacao_amostra_arte_arena === "aprovada" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_amostra_arte_arena === "aprovada"
                                  ? handleDesaprovar('status_aprovacao_amostra_arte_arena', row.id)
                                  : handleAprovar('status_aprovacao_amostra_arte_arena', row.id)
                              }
                            >
                              {row.status_aprovacao_amostra_arte_arena === "aprovada" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_envio_amostra === "enviada" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_envio_amostra === "enviada"
                                  ? handleDesaprovar('status_envio_amostra',row.id)
                                  : handleAprovar('status_envio_amostra',row.id)
                              }
                            >
                              {row.status_envio_amostra === "enviada" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_aprovacao_amostra_cliente === "aprovada" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_amostra_cliente === "aprovada"
                                  ? handleDesaprovar('status_aprovacao_amostra_cliente',row.id)
                                  : handleAprovar('status_aprovacao_amostra_cliente',row.id)
                              }
                            >
                              {row.status_aprovacao_amostra_cliente === "aprovada" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_faturamento === "faturado" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_faturamento === "faturado"
                                  ? handleDesaprovar('status_faturamento',row.id)
                                  : handleAprovar('status_faturamento',row.id)
                              }
                            >
                              {row.status_faturamento === "faturado" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_pagamento === "pago" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_pagamento === "pago"
                                  ? handleDesaprovar('status_pagamento',row.id)
                                  : handleAprovar('status_pagamento',row.id)
                              }
                            >
                              {row.status_pagamento === "pago" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_producao_esboco === "aguardando_melhoria" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_producao_esboco === "aguardando_melhoria"
                                  ? handleDesaprovar('status_producao_esboco',row.id)
                                  : handleAprovar('status_producao_esboco',row.id)
                              }
                            >
                              {row.status_producao_esboco === "aguardando_melhoria" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_producao_arte_final === "aguardando_melhoria" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_producao_arte_final === "aguardando_melhoria"
                                  ? handleDesaprovar('status_producao_arte_final',row.id)
                                  : handleAprovar('status_producao_arte_final',row.id)
                              }
                            >
                              {row.status_producao_arte_final === "aguardando_melhoria" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_aprovacao_esboco === "aprovado" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_esboco === "aprovado"
                                  ? handleDesaprovar('status_aprovacao_esboco',row.id)
                                  : handleAprovar('status_aprovacao_esboco',row.id)
                              }
                            >
                              {row.status_aprovacao_esboco === "aprovado" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="column" spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {row.status_aprovacao_arte_final === "aprovada" ? (
                              <IconCircleCheck color="green" size={22} />
                            ) : (
                              <IconBan color="red" size={22} />
                            )}
                          </Stack>
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() =>
                                row.status_aprovacao_arte_final === "aprovada"
                                  ? handleDesaprovar('status_aprovacao_arte_final',row.id)
                                  : handleAprovar('status_aprovacao_arte_final',row.id)
                              }
                            >
                              {row.status_aprovacao_arte_final === "aprovada" ? <IconArrowBackUp size={18} /> : <IconProgressCheck size={18} />}
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
              count={Math.ceil(data.total / data.per_page)}
              page={data.current_page}
              onChange={handlePageChange}
            />
          </Stack>

        </>
      </ParentCard>
    </PageContainer>
  );
}


export default OrcamentoBuscarScreen;
