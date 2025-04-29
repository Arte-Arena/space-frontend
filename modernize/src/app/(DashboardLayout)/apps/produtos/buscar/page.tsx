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
import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination, Stack, Button } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconPencil, IconPencilCheck, IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  nome: string;
  categoria: string;
  codigo: string;
  preco: number;
  altura: number;
  largura: number;
  comprimento: number;
  peso: number;
}

const ProdutosBuscarScreen = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Mantém a query atual usada na API
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    // throw new Error('Access token is missing');
    console.error('Access token is missing');
    router.push('/auth/login');
  }

  const { isFetching, error, data } = useQuery({
    queryKey: ['repoData', searchQuery, page],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/produto?q=${encodeURIComponent(searchQuery)}&page=${page}`, {
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

  const handleDeleteProduct = async (productId: number) => {
    console.log(`handleDeleteProduct: ${productId}`);
  };
  const handleEditProduct = async (productId: number) => {
    console.log(`handleEditProduct: ${productId}`);
    window.open(`/apps/produtos/editar/${productId}`, '_blank');
  };

  if (isFetching) return <CircularProgress />;
  if (error) return <p>Ocorreu um erro: {error.message}</p>;

  return (
    <PageContainer title="Produtos / Buscar" description="Produtos da Arte Arena">
      <Breadcrumb title="Produtos / Buscar" subtitle="Gerencie Produtos da Arte Arena / Buscar" />
      <ParentCard title="Buscar Produto">

        <>

        {/* Campo de busca com botão */}
        <Stack spacing={2} direction="row" alignItems="center" mb={2}>
          <CustomTextField
            fullWidth
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="Buscar produto..."
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

        {/* Tabela */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Altura</TableCell>
                <TableCell>Largura</TableCell>
                <TableCell>Comprimento</TableCell>
                <TableCell>Peso</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.nome}</TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>{product.codigo}</TableCell>
                  <TableCell>{product.preco}</TableCell>
                  <TableCell>{product.altura}</TableCell>
                  <TableCell>{product.largura}</TableCell>
                  <TableCell>{product.comprimento}</TableCell>
                  <TableCell>{product.peso}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditProduct(product.id)}>
                      <IconPencil />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteProduct(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
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
};

export default ProdutosBuscarScreen;
