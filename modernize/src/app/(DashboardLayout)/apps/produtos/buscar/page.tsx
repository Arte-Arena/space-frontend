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
import { Button, Snackbar, Alert } from '@mui/material';

// Interface para os dados de paginação
interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Interface para o produto
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

// Interface para a resposta da API
interface ProductListResponse {
  data: Product[];
  next_page_url: string | null;
  prev_page_url: string | null;
}

const ProdutosBuscarScreen = () => {
  const [query, setQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/produto?q=${encodeURIComponent(query)}&page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ProductListResponse = await response.json();
      setProducts(data.data);
      // Se a resposta tiver URLs de próxima página, podemos calcular a quantidade total de páginas
      const lastPage = data.next_page_url ? page + 1 : page;
      setTotalPages(lastPage);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/produto/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((product) => product.id !== productId));
      setSnackbarMessage('Produto deletado com sucesso!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage((error as Error).message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Reexecuta a busca quando o query ou page mudarem
  useEffect(() => {
    fetchProducts();
  }, [query, page]);  // A dependência da página é mantida aqui

  return (
    <PageContainer title="Produtos / Buscar" description="Produtos da Arte Arena">
      <Breadcrumb title="Produtos / Buscar" subtitle="Gerencie Produtos da Arte Arena / Buscar" />
      <ParentCard title="Buscar Produto">
        <div>
          <h1>Buscar Produto</h1>

          {loading ? (
            <CircularProgress />
          ) : products.length > 0 ? (
            <>
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
                    {products.map((product) => (
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
                          <IconButton onClick={() => handleDeleteProduct(product.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <span style={{ margin: '0 10px' }}>
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="contained"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  Próxima
                </Button>
              </div>
            </>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      </ParentCard>

      {/* Snackbar for delete message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ProdutosBuscarScreen;
