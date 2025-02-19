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
import { Pagination, Stack, Button, Box, Typography, Collapse, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconProgressCheck, IconCircleCheck, IconBan } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { useStatusChangeAprovado, useStatusChangeDesaprovado } from '@/utils/PutStatusOrcamentos';
import { useThemeMode } from "@/utils/useThemeMode";


interface Produto {
  id: number;
  nome: string;
  peso: string; // Caso o peso seja uma string
  prazo: number;
  preco: number;
  altura: string; // Considerando que altura, largura e comprimento são strings
  largura: string;
  comprimento: string;
  created_at: string | null; // Pode ser null ou uma string
  quantidade: number;
  updated_at: string | null; // Pode ser null ou uma string
}

interface StatusCellProps {
  status: string;
  statusKey: string;
  rowId: number;
  approvedValue: string; // Valor que representa "aprovado" ou equivalente
  disabled?: boolean; // Se o botão deve estar desabilitado
}

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

const OrcamentoStatusScreen = () => {

  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<{
    statusKey: string;
    rowId: number;
    status: string;
    approvedValue: string;
  } | null>(null);
  const mode = useThemeMode();
  // busca os dados
  const { isFetching, error, data, refetch } = useFetchOrcamentos(searchQuery, page);

  const regexFrete = /Frete:\s*R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})\s?\(([^)]+)\)/;
  const regexPrazo = /Prazo de Produção:\s*\d{1,3}\s*dias úteis/;
  const regexEntrega = /Previsão de Entrega:\s*([\d]{1,2} de [a-zA-Z]+ de \d{4})\s?\(([^)]+)\)/;
  const regexBrinde = /Brinde:\s*\d+\s*un\s*[\w\s]*\s*R\$\s*\d{1,3}(?:,\d{2})*\s*\(R\$\s*\d{1,3}(?:,\d{2})*\)/;

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  // renderização dos botoes da tabela
  const renderStatusCell = ({
    status,
    statusKey,
    rowId,
    approvedValue,
  }: StatusCellProps) => {
    return (
      <TableCell>
      <Stack direction="column" spacing={1} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            sx={{cursor: 'pointer'}}
            onClick={() => handleOpenDialog(statusKey, rowId, status, approvedValue)}
          >
            <Tooltip title={status}>
              {status === approvedValue ? (
                <IconCircleCheck color="green" size={22} />
              ) : (
                statusKey == "status" ? (
                  <Tooltip title={"Não Aprovado"}>
                  <IconProgressCheck color="white" size={22} />
                  </Tooltip>
                ): (
                  <IconBan color="red" size={22} />
                )
              )}
            </Tooltip>
          </IconButton>
        </Stack>
      </Stack>
    </TableCell>
    );
  };

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

  const handleDesaprovar = async (campo: string, rowId: number) =>{
    try{
      await useStatusChangeDesaprovado(campo, rowId);
      refetch();
    }catch(err){
      console.log(err)
    }
  }
  
  const handleOpenDialog = (statusKey: string, rowId: number, status: string, approvedValue: string) => {
    setDialogData({ statusKey, rowId, status, approvedValue });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
  };

  return (
    <PageContainer title="Orçamento / Status" description="Status Orçamento da Arte Arena">
      <Breadcrumb title="Orçamento / Status" subtitle="Gerencie os Orçamentos da Arte Arena / Status" />
      <Box sx={{width: '101%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <ParentCard  title="Status Orçamento">
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

          <TableContainer sx={{maxHeight: '450px'}}>
            <Table size='small' sx={{width: '100%'}}>
              <TableHead sx={{position: 'sticky', top: '0', zIndex: '10', backgroundColor: mode === 'dark' ? '#2A3447' : '#fff', color: mode === 'dark' ? '#fff' : '#2A3547'}}>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >ID</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Número do Cliente</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center', padding: '0'}} >Data de Criação</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Faturamento</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Pagamento</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Produção Arte Final</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Arte Final</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Amostra Arte Arena</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Envio Amostra</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Amostra Cliente</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Cliente</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Produção Esboço</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Aprovação Esboço</TableCell>
                  <TableCell sx={{fontSize: '8px', textAlign: 'center'}} >Envio Pedido</TableCell>
                  <TableCell sx={{fontSize: '9px', textAlign: 'center', fontWeight: '700'}} >Aprovação Arte Arena</TableCell>
                  {/* <TableCell>Ações</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
              {data?.data.map((row: Orcamento) => {
                const listaProdutos = row.lista_produtos
                ? (typeof row.lista_produtos === 'string' ? JSON.parse(row.lista_produtos) : row.lista_produtos)
                : [];

                const texto = row.texto_orcamento;
                const frete = texto?.match(regexFrete);
                const prazo = texto?.match(regexPrazo);
                console.log(prazo)
                const entrega = texto?.match(regexEntrega);
                const brinde = texto?.match(regexBrinde);

                return (
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
                      

                      {/* Célula de status_faturamento */}
                      {renderStatusCell({
                        status: row.status_faturamento,
                        statusKey: 'status_faturamento',
                        rowId: row.id,
                        approvedValue: 'faturado',
                      })}
                                                    
                      {/* Célula de status_pagamento */}
                      {renderStatusCell({
                      status: row.status_pagamento,
                      statusKey: 'status_pagamento',
                      rowId: row.id,
                      approvedValue: 'pago',
                      })}
                      
                      {/* Célula de status_producao_arte_final */}
                      {renderStatusCell({
                        status: row.status_producao_arte_final,
                        statusKey: 'status_producao_arte_final',
                        rowId: row.id,
                        approvedValue: 'aguardando_melhoria',
                      })}


                      {/* Célula de status_aprovacao_arte_final */}
                      {renderStatusCell({
                        status: row.status_aprovacao_arte_final,
                        statusKey: 'status_aprovacao_arte_final',
                        rowId: row.id,
                        approvedValue: 'aprovada',
                      })}

                      {/* Célula de status_aprovacao_amostra_arte_arena */}
                      {renderStatusCell({
                        status: row.status_aprovacao_amostra_arte_arena,
                        statusKey: 'status_aprovacao_amostra_arte_arena',
                        rowId: row.id,
                        approvedValue: 'aprovada',
                      })}
                      
                      {/* Célula de status_envio_amostra */}
                      {renderStatusCell({
                        status: row.status_envio_amostra,
                        statusKey: 'status_envio_amostra',
                        rowId: row.id,
                        approvedValue: 'enviada',
                      })}

                      {/* Célula de status_aprovacao_amostra_cliente */}
                      {renderStatusCell({
                        status: row.status_aprovacao_amostra_cliente,
                        statusKey: 'status_aprovacao_amostra_cliente',
                        rowId: row.id,
                        approvedValue: 'aprovada',
                      })}

                      {renderStatusCell({
                        status: row.status_aprovacao_cliente,
                        statusKey: 'status_aprovacao_cliente',
                        rowId: row.id,
                        approvedValue: 'aprovado',
                      })}

                      {/* Célula de status_producao_esboco */}
                      {renderStatusCell({
                        status: row.status_producao_esboco,
                        statusKey: 'status_producao_esboco',
                        rowId: row.id,
                        approvedValue: 'aguardando_melhoria',
                      })}

                      {/* Célula de status_aprovacao_esboco */}
                      {renderStatusCell({
                        status: row.status_aprovacao_esboco,
                        statusKey: 'status_aprovacao_esboco',
                        rowId: row.id,
                        approvedValue: 'aprovado',
                      })}

                      {/* Célula de status_envio_pedido */}
                      {renderStatusCell({
                        status: row.status_envio_pedido,
                        statusKey: 'status_envio_pedido',
                        rowId: row.id,
                        approvedValue: 'enviado',
                      })}
                        
                      {renderStatusCell({
                        status: row.status,
                        statusKey: 'status',
                        rowId: row.id,
                        approvedValue: 'aprovado',
                      })}

                      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                        <DialogTitle>Alterar Status</DialogTitle>
                        <DialogContent>
                        <Typography sx={{marginBottom: '10px'}}>
                            {dialogData?.statusKey}
                          </Typography>
                          <DialogContentText>
                            Selecione a ação desejada para o status:
                          </DialogContentText>
                          <Typography>
                            Status atual: {dialogData?.status}
                          </Typography>
                          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              disabled={dialogData?.status === dialogData?.approvedValue}
                              onClick={() => {
                               
                                if(dialogData?.statusKey === "status"){
                                    handleAprovarArteArena(dialogData.rowId);
                                }
                               
                                if (dialogData) {
                                  handleAprovar(dialogData.statusKey, dialogData.rowId);
                                }
                               
                                handleCloseDialog();
                              }}
                            >
                              Aprovar
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              disabled={dialogData?.status !== dialogData?.approvedValue} 
                              onClick={() => {
                                if (dialogData) {
                                  handleDesaprovar(dialogData.statusKey, dialogData.rowId);
                                }
                                handleCloseDialog();
                              }}
                            >
                              Desaprovar
                            </Button>
                          </Stack>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseDialog} color="primary">
                            Fechar
                          </Button>
                        </DialogActions>
                      </Dialog>

                    </TableRow>

                    <TableRow>
                      {/* colSpan deve ter o mesmo número que o número de cabeçalhos da tabela, no caso 16 */}
                      <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
                        <Collapse in={openRow[row.id]} timeout="auto" unmountOnExit>
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
                                          quantidade:
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                          Preço:
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                          Tamanho:
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                          Peso:
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                          Prazo:
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {listaProdutos.length > 0 ? (
                                        listaProdutos.map((produto:Produto, index: number) => (
                                        <TableRow key={produto.id || index}>
                                            <TableCell sx={{ fontWeight: 'bold', padding: '8px' }} colSpan={1}>
                                              {produto.nome}
                                            </TableCell>
                                            <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                              {produto.quantidade}
                                            </TableCell>
                                            <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                              {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </TableCell>
                                            <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                              {produto.altura} x {produto.largura} x {produto.comprimento} cm
                                            </TableCell>
                                            <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                              {produto.peso} kg
                                            </TableCell>
                                            <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                              {produto.prazo} dias
                                            </TableCell>
                                          </TableRow>
                                          ))
                                        ) : (
                                        <Typography variant="body2" color="textSecondary">Nenhum produto disponível</Typography>
                                      )}
                                    </TableBody>
                                  </TableCell>
                                </TableRow>

                                {/* Texto do Orçamento */}
                                <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Cliente:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{row.nome_cliente}</TableCell>
                                </TableRow>

                                {brinde !== null && (
                                  <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Brinde:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{brinde}</TableCell>
                                </TableRow>
                                )}

                                {entrega !== null && (
                                  <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Entrega:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{entrega}</TableCell>
                                </TableRow>
                                )}
                                {prazo !== null && (
                                  <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Prazo:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{prazo}</TableCell>
                                </TableRow>
                                )}

                                {frete !== null && (
                                  <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Frete:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{frete}</TableCell>
                                </TableRow>
                                )}

                                {/* Endereço CEP */}
                                <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Endereço CEP:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{row.endereco_cep}</TableCell>
                                </TableRow>

                                {/* Endereço */}
                                <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Endereço:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{row.endereco}</TableCell>
                                </TableRow>

                                {/* Opção de Entrega */}
                                <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Opção de Entrega:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{row.opcao_entrega}</TableCell>
                                </TableRow>

                                {/* Prazo da Opção de Entrega */}
                                <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Prazo da Opção de Entrega:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{row.prazo_opcao_entrega} dias</TableCell>
                                </TableRow>

                                {/* Preço da Opção de Entrega */}
                                <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Preço da Opção de Entrega:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>
                                    {row.preco_opcao_entrega?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  </TableCell>
                                </TableRow>

                                {/* Brinde */}
                                {row.brinde !== null && (
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Brinde:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>{row.brinde === 1 ? 'Com Brinde' : 'Sem Brinde'}</TableCell>
                                  </TableRow>
                                )}

                                {/* Desconto */}
                                {row.valor_desconto !== null && (
                                  <>
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Desconto:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>Com Desconto</TableCell>
                                    </TableRow>

                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Tipo Descontado:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>{row.tipo_desconto ?? 'Nenhum'}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Valor Descontado:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {row.valor_desconto ?? 'Sem Desconto'}</TableCell>
                                    </TableRow>
                                  </>
                                )}

                                {/* Data Antecipação */}
                                {row.data_antecipa !== null && (
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Data Antecipação:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>{row.data_antecipa ?? 'Sem Antecipação'}</TableCell>
                                  </TableRow>
                                )}

                                {/* Taxa Antecipação */}
                                {row.taxa_antecipa !== null && (
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Taxa Antecipação:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {row.taxa_antecipa ?? 'Sem Taxa de Antecipação'}</TableCell>
                                  </TableRow>
                                )}

                                {/* Total Orçamento */}
                                {row.total_orcamento !== null && (
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Total Orçamento:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {row.total_orcamento ?? 'Sem total Definido'}</TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )})}
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
      </Box>
    </PageContainer>
  );
}


export default OrcamentoStatusScreen;