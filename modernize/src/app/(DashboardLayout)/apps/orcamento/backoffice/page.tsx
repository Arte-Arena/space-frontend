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

const OrcamentoBackofficeScreen = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [linkOrcamento, setLinkOrcamento] = useState<string>('');
  const [openLinkDialog, setOpenLinkDialog] = useState<boolean>(false);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { isFetching: isFetchingOrcamentos, error: errorOrcamentos, data: dataOrcamentos } = useQuery({
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

  const handleDeleteOrcamento = async (orcamentoId: number) => {
    console.log(`handleDeleteOrcamento: ${orcamentoId}`);
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
        setLinkOrcamento(`${window.location.origin}${data.caminho}`);
        setOpenLinkDialog(true);
      }
    }
  };

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
                          <Button variant="outlined">
                            <IconShirtSport />
                          </Button>
                          {/* botão da chamada da api */}
                          <Button variant="contained" color="primary"> 
                            <IconCheck />
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={openRow[row.id]} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            {/* trazer os outros dados dos orcamentos do banco de dados */}
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
                              <strong>Valor Descontado:</strong> {row.valor_desconto ?? "Sem Desconto"}
                            </Typography>
                            )}

                            {row.data_antecipa !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Data Antecipação:</strong> {row.data_antecipa ?? "Sem Antecipação"}
                            </Typography>
                            )}

                            {row.taxa_antecipa !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Taxa Antecipação:</strong> {row.taxa_antecipa ?? "Sem Taxa de Antecipação"}
                            </Typography>
                            )}

                            {row.total_orcamento !== null && (
                              <Typography variant="body2" gutterBottom>
                              <strong>Total Orçamento:</strong> {row.total_orcamento ?? "Sem total Definido"}
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


export default OrcamentoBackofficeScreen;

