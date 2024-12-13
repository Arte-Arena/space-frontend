'use client'
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
// import { Button } from '@mui/material';
// import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
// import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
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
import { IconArrowIteration } from "@tabler/icons-react";

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

interface ApiResponse {
  data: Product[];
}

const ProdutosBuscarScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`#`, {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/contas-and-recorrentes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data: ApiResponse = await response.json();
        setProducts(data.data);
        console.log(data.data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const handleDeleteProduct = async (productId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`#`, {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conta/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

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

  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <PageContainer title="Produtos / Buscar" description="Produtos da Arte Arena">
      <Breadcrumb title="Produtos / Buscar" subtitle="Gerencie Produtos da Arte Arena / Buscar" />
      <ParentCard title="Buscar Produto">
        <div>
          <h1>Buscar Produto</h1>

          {loading ? (
            <CircularProgress />
          ) : products.length > 0 ? (

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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.nome}</TableCell>
                      <TableCell>{product.categoria}</TableCell>
                      <TableCell>{product.preco}</TableCell>
                      <TableCell>{product.altura}</TableCell>
                      <TableCell>{product.largura}</TableCell>
                      <TableCell>{product.comprimento}</TableCell>
                      <TableCell>{product.peso}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <p>Nenhuma conta encontrada.</p>
          )}
        </div>
      </ParentCard>
    </PageContainer>
  );
};

export default ProdutosBuscarScreen;

