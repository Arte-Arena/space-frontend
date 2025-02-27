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
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconEdit, IconCircleCheck, IconBan, IconProgressHelp } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
}

const OrcamentoEditarScreen = () => {
  const router = useRouter();

  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});

  const regexFrete = /Frete:\s*R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})\s?\(([^)]+)\)/;
  const regexPrazo = /Prazo de Produção:\s*\d{1,3}\s*dias úteis/;
  const regexEntrega = /Previsão de Entrega:\s*([\d]{1,2} de [a-zA-Z]+ de \d{4})\s?\(([^)]+)\)/;
  const regexBrinde = /Brinde:\s*\d+\s*un\s*[\w\s]*\s*R\$\s*\d{1,3}(?:,\d{2})*\s*\(R\$\s*\d{1,3}(?:,\d{2})*\)/;

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

  const handleEditOrcamento = (orcamentoId: number) => {
    router.push(`/apps/orcamento/editar/${orcamentoId}`);
    console.log('Aguarde.');
  };

  return (
    <PageContainer title="Orçamento / Editar" description="Editar Orçamento da Arte Arena">
      <Breadcrumb title="Orçamento / Editar" subtitle="Gerencie os Orçamentos da Arte Arena / Editar" />
      <ParentCard title="Editar Orçamento" >
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
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataOrcamentos?.data.map((row: Orcamento) => {
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
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggleRow(row.id)}
                        >
                          {openRow[row.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                              width: "40px",
                              height: "40px",
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
                      <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {row.status === "aprovado" ? (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <IconCircleCheck />
                            <Typography>Aprovado</Typography>
                          </Stack>
                        ) : (
                          row.status === "reprovado" ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <IconBan />
                              <Typography>Reprovado</Typography>
                            </Stack>
                          ) : (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <IconProgressHelp />
                              <Typography>Pendente</Typography>
                            </Stack>
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Alterar Orçamento">
                            <IconButton
                              aria-label="alterar Orçamento"
                              onClick={() => handleEditOrcamento(row.id)}
                            >
                              <IconEdit />
                            </IconButton>
                          </Tooltip>

                        </Stack>
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


export default OrcamentoEditarScreen;

