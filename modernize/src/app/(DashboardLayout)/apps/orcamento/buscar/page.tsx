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
import { IconProgressCheck, IconEdit, IconCircleCheck, IconBan, IconProgressHelp, IconX } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';


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


  const handleAprovar = (rowId: number) => {
    router.push(`/apps/orcamento/aprovar/${rowId}`);
  };

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
                  <TableCell>Status</TableCell>
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
                          <Tooltip title="Alterar Status">
                            <IconButton
                              aria-label="alterar status"
                              onClick={() => handleAprovar(row.id)}
                            >
                              <IconProgressCheck />
                            </IconButton>
                          </Tooltip>


                          {/* <IconButton
                            aria-label="edit"
                            onClick={() => handleEditOrcamento(row.id)}
                          >
                            <IconEdit />
                          </IconButton> */}
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

