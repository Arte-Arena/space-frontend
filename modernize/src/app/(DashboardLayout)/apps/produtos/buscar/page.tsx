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
import { Pagination, Stack, Button, Link, Typography, Grid } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconCategory, IconEyeDollar, IconPencil, IconPencilCheck, IconSearch, IconWeight } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@mui/lab';

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
  const [cat, setCat] = useState<string>('');
  const [preco, setPreco] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Mantém a query atual usada na API
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    // throw new Error('Access token is missing');
    console.error('Access token is missing');
    router.push('/auth/login');
  }

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: ['repoData', searchQuery, page],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/produto?q=${encodeURIComponent(searchQuery)}&page=${page}&cat=${cat}&preco=${preco}&peso=${peso}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  const handleCleanSearch = () => {
    setQuery('');
    setCat('');
    setPeso('');
    setPreco('');
    setPage(1); 
    setSearchQuery('');
    // refetch();
  };
  const handleSearch = () => {
    setSearchQuery(query);
    setPage(1); // Reseta para a primeira página ao realizar uma nova busca
    refetch();
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
          <Grid container spacing={2} alignItems="center" mb={2}>
            {/* 1️⃣ Primeiro campo ocupa 4/12 colunas */}
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Buscar por nome ou código..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* 2️⃣,3️⃣,4️⃣ Próximos campos ocupam 2/12 colunas cada */}
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                onKeyPress={handleSearchKeyPress}
                value={cat}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCat(e.target.value)}
                placeholder="Categoria..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconCategory />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                onKeyPress={handleSearchKeyPress}
                value={preco}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreco(e.target.value)}
                placeholder="Preço..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconEyeDollar />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                onKeyPress={handleSearchKeyPress}
                value={peso}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPeso(e.target.value)}
                placeholder="Peso..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconWeight />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* 5️⃣ Botão ocupa 1/12 colunas */}
            <Grid item xs={12} sm={1}>
              <LoadingButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSearch}
                loading={isFetching}
                startIcon={<IconSearch />}
              >
                Buscar
              </LoadingButton>
            </Grid>

            <Grid item xs={12} sm={1}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleCleanSearch}
                startIcon={<IconSearch />}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>

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
                    <TableCell>
                      <Link
                        component={Link}
                        href={`/apps/produtos/${product.id}`}
                        underline="hover"
                        target="_blank"
                        sx={{ fontWeight: '500' }}
                      >
                        <Typography variant="body2" component="span" color="text.primary">
                          {product.nome}
                        </Typography>
                      </Link>
                    </TableCell>
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
