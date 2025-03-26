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
import { Pagination, Stack, Button, Box, Typography, Collapse } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconSearch, IconCircleCheck, IconCircleCheckFilled, IconEdit } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useThemeMode } from '@/utils/useThemeMode';
import Link from 'next/link';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';

interface Produto {
  id: number;
  nome: string;
  peso: string;
  prazo: number;
  preco: number;
  altura: string;
  largura: string;
  comprimento: string;
  created_at: string | null;
  quantidade: number;
  updated_at: string | null;
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
  total_orcamento: string;
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

const vendedores = JSON.parse(localStorage.getItem('vendedores') || '[]') as {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}[];

const OrcamentoBuscarScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const mode = useThemeMode();

  const regexFrete = /Frete:\s*R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})\s?\(([^)]+)\)/;
  const regexPrazo = /Prazo de Produção:\s*(\d{1,3})\s*dias úteis/;
  const regexEntrega = /Previsão de Entrega:\s*([\d]{1,2} de [a-zA-Z]+ de \d{4})\s?\(([^)]+)\)/;
  const regexBrinde = /Brinde:\s*\d+\s*un\s*[\w\s]*\s*R\$\s*\d{1,3}(?:,\d{2})*\s*\(R\$\s*\d{1,3}(?:,\d{2})*\)/;


  // busca os dados
  const { isFetching, error, data } = useFetchOrcamentos(searchQuery, page);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const handleSearch = () => {
    setSearchQuery(query); // Atualiza a busca
    setPage(1);
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

  const handleAprovarOrcamento = (orcamentoId: number) => {
    router.push(`/apps/orcamento/aprovar/${orcamentoId}`);
    console.log('Aguarde.');
  };

  if (isFetching) return <CircularProgress />;
  if (error) return <p>Ocorreu um erro: {error.message}</p>;

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

          <TableContainer sx={{ maxHeight: '450px' }}>
            <Table size='small' sx={{ width: '100%' }}>
              <TableHead sx={{ position: 'sticky', top: '0', zIndex: '10', backgroundColor: mode === 'dark' ? '#2A3447' : '#fff', color: mode === 'dark' ? '#fff' : '#2A3547' }}>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Número do Cliente</TableCell>
                  <TableCell>Vendedor</TableCell>
                  <TableCell>Valor Total</TableCell>
                  <TableCell>Data de Criação</TableCell>
                  <TableCell>Aprovar</TableCell>
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
                  const entrega = texto?.match(regexEntrega);
                  const brinde = texto?.match(regexBrinde);

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleToggleRow(row.id)}
                          >
                            {openRow[row.id] ? <KeyboardArrowUpIcon sx={{ fontSize: '25px' }} /> : <KeyboardArrowDownIcon sx={{ fontSize: '25px' }} />}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/apps/orcamento/editar/${row.id}`}
                            passHref
                            style={{ textDecoration: "none" }} // Remove o sublinhado do link
                          >
                            <Box
                              sx={{
                                cursor: "pointer",
                                textAlign: "center",
                                position: "relative",
                                borderRadius: "50%",
                                backgroundColor: "#5D87FF",
                                color: "white",
                                fontWeight: "bold",
                                width: "30px",
                                height: "30px",
                                transition: "background-color 0.3s ease, transform 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": {
                                  backgroundColor: "darkblue",
                                  transform: "scale(1.1)", // Pequeno efeito de zoom ao passar o mouse
                                },
                              }}
                            >
                              {row.id}
                            </Box>
                          </Link>
                        </TableCell>
                        <TableCell>{row.cliente_octa_number}</TableCell>
                        <TableCell>
                          {
                            vendedores.find(vendedor => vendedor.id === row.user_id)?.name || ''
                          }
                        </TableCell>
                        <TableCell>
                          {`R$ ${parseFloat(row.total_orcamento).toFixed(2).replace('.', ',')}`}
                        </TableCell>
                        <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {row.status === "aprovado" ? (
                            <Stack direction="row" alignItems={"center"} spacing={1}>
                              <Tooltip title="Orçamento Aprovado">
                                <IconButton
                                  aria-label="orçamento aprovado"
                                >
                                  <IconCircleCheckFilled />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar Orçamento">
                                <IconButton
                                  aria-label="editar orçamento"
                                  onClick={() => router.push(`/apps/orcamento/editar/${row.id}`)}
                                >
                                  <IconEdit />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          ) : (
                            <Stack direction="row" alignItems={"center"} spacing={1}>
                              <Tooltip title="Aprovar Orçamento">
                                <IconButton
                                  aria-label="aprovar orçamento"
                                  onClick={() => handleAprovarOrcamento(row.id)}
                                >
                                  <IconCircleCheck />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar Orçamento">
                                <IconButton
                                  aria-label="editar orçamento"
                                  onClick={() => router.push(`/apps/orcamento/editar/${row.id}`)}
                                >
                                  <IconEdit />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          )}
                        </TableCell>
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
                                          listaProdutos.map((produto: Produto, index: number) => (
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
                                  {/* <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                    Texto do Orçamento:
                                  </TableCell>
                                  <TableCell sx={{ border: 'none' }} colSpan={1}>{row.texto_orcamento}</TableCell>
                                </TableRow> */}

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
                  )
                })}
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