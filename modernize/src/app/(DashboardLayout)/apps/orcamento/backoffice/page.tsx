'use client';
import React, { useState, useEffect } from 'react';
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
import { IconSearch, IconLink, IconShirtSport, IconCheck } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

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
  produtos_brinde: string | null;
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

const OrcamentoBackofficeScreen = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [linkOrcamento, setLinkOrcamento] = useState<string>('');
  const [openLinkDialog, setOpenLinkDialog] = useState<boolean>(false);
  const [linkUniform, setLinkUniform] = useState<string>('');
  const [openUniformDialog, setOpenUniformDialog] = useState<boolean>(false);

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
      fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/get-orcamentos-aprovados?q=${encodeURIComponent(searchQuery)}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  // Precisamos validar os botões pro caso de ja terem sido feitos clientes e pedidos.


  const handleMakePedido = async (orcamento: Orcamento) => {

    const orcamentoFormated = {
      id: orcamento.id,
      id_vendedor: orcamento.user_id,
      cliente_codigo: orcamento.cliente_octa_number,
      nome_cliente: orcamento.nome_cliente,
      lista_produtos: orcamento.lista_produtos,
      produtos_brinde: orcamento.produtos_brinde,
      brinde: orcamento.brinde,
      texto_orcamento: orcamento.texto_orcamento,
      cep: orcamento.endereco_cep,
      endereco: orcamento.endereco,
      transportadora: orcamento.opcao_entrega,
      data_pedido: orcamento.created_at,
      updated_at: orcamento.updated_at,
      tipo_desconto: orcamento.tipo_desconto,
      valor_desconto: orcamento.valor_desconto,
      data_antecipa: orcamento.data_antecipa,
      taxa_antecipa: orcamento.taxa_antecipa,
      total_orcamento: orcamento.total_orcamento,
    };

    // console.log(orcamentoFormated)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/pedido-cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orcamentoFormated),
    });
      
    const data = await response.json()

    if(data.retorno.status === "Erro"){
      const registros = data.retorno.registros;
      const ultimoRegistro = registros[registros.length - 1];
      if (ultimoRegistro && ultimoRegistro.registro && ultimoRegistro.registro.erros && ultimoRegistro.registro.erros.length > 0) {
      const ultimoErro = ultimoRegistro.registro.erros[ultimoRegistro.registro.erros.length - 1];
      const mensagemErro = ultimoErro.erro;
      alert('Pedido não salvo! ' + mensagemErro);
      return
    }
    
    if (response.ok) {
      alert('Pedido N°'+ orcamento.id + ' salvo com sucesso!');
      // levar a pessoa pra uma pagina de sucesso pra ela não se confundir e mandar duas vezes ou mais a requisição.
    } else {
      const errorData = await response.json();
      console.log(errorData.message)
      alert(`Erro ao salvar: ${errorData.message}`);
    }

  }

}
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

  const handleLinkOrcamento = async (orcamentoId: number) => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/url/${orcamentoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.caminho) {
        console.log('Erro: servidor de short URL não disponível');
      } else {
        setLinkOrcamento(`${window.location.origin}/s${data.caminho}`);
        setOpenLinkDialog(true);
      }
    }
  };

  async function handleShortlinkUniform(uniformId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/url/${uniformId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return console.error('Erro ao criar link do uniforme:', response.status);
    const data = await response.json();
    if (!data.caminho) return console.error(
      'Erro ao criar link do uniforme: servidor de short URL não disponível'
    );
    setLinkUniform(`${window.location.origin}/u${data.caminho}`);
    setOpenUniformDialog(true);
  }

  return (
    <PageContainer title="Orçamento / Backoffice" description="Gerenciar Pedidos da Arte Arena">
      <Breadcrumb title="Orçamento / Backoffice" subtitle="Gerenciar Pedidos da Arte Arena / Backoffice" />
      <ParentCard title="Backoffice" >
        <>

          <Stack spacing={2} direction="row" alignItems="center" mb={2}>
            <CustomTextField
              fullWidth
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Buscar orçamento aprovado..."
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
                  <TableCell>ID do Orçamento</TableCell>
                  <TableCell>ID do Pedido</TableCell>
                  <TableCell>Número do Cliente</TableCell>
                  <TableCell>Data de Criação</TableCell>
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
                      <TableCell>{row.id}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{row.cliente_octa_number}</TableCell>
                      <TableCell>{new Date(row.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton aria-label="link">
                            <IconButton
                              aria-label="link"
                              onClick={() => {
                                setOpenLinkDialog(true);
                                handleLinkOrcamento(row.id);
                              }}
                            >
                              <IconLink />
                            </IconButton>
                            <Dialog
                              open={openLinkDialog}
                              onClose={() => setOpenLinkDialog(false)}
                            >
                              <DialogTitle>Link do Orçamento</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  {linkOrcamento}
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText(linkOrcamento);
                                    setOpenLinkDialog(false);
                                  }}
                                >
                                  Copiar Link
                                </Button>
                              </DialogActions>
                            </Dialog>

                          </IconButton>
                          <Button variant="outlined" onClick={() => {
                            setOpenUniformDialog(true);
                            handleShortlinkUniform(row.id);
                          }}>
                            <IconShirtSport />
                          </Button>
                          <Dialog
                            open={openUniformDialog}
                            onClose={() => setOpenUniformDialog(false)}
                          >
                            <DialogTitle>Link do Uniforme</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                {linkUniform}
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => {
                                  navigator.clipboard.writeText(linkUniform);
                                  setOpenUniformDialog(false);
                                }}
                              >
                                Copiar Link
                              </Button>
                            </DialogActions>
                          </Dialog>

                          {/* botão da chamada da api */}
                          {}
                          <Button variant="contained" color="primary" onClick={() => handleMakePedido(row)}> 

                            <IconCheck />
                          </Button>

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


export default OrcamentoBackofficeScreen;

