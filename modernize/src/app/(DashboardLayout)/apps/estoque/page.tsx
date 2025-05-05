'use client';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import ParentCard from '@/app/components/shared/ParentCard';
import NotificationSnackbar from '../../../../utils/snackbar';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  LinearProgress,
  Typography,
  Button,
  Box,
  IconButton,
  Stack,
  Chip,
} from '@mui/material';
import { IconPencil, IconSearch } from '@tabler/icons-react';
import type { Estoque } from './components/Types';
import { method } from 'lodash';


export default function Estoque() {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    router.push('/login');
    return null;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data, isFetching, isError, refetch } = useQuery<{ data: Estoque[]; total: number }>({
    queryKey: ['estoque', page, rowsPerPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('per_page', String(rowsPerPage));
      params.set('page', String(page + 1)); // backend espera 1-based
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/estoque?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
      });
      if (!res.ok) throw new Error('Erro ao carregar estoque');
      return res.json();
    },
  });

  const handleSearch = () => {
    setPage(0);
    refetch();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));


  return (
    <PageContainer title="Estoque" description="Estoque">
      <Breadcrumb title="Estoque" subtitle='Estoque' />
      <ParentCard title="Estoque">
        <Box>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Buscar por nome ou categoria..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            InputProps={{ startAdornment: <InputAdornment position="start"><IconSearch /></InputAdornment> }}
            sx={{ mb: 2, width: '300px' }}
          />
          {!isError && data && (
            <>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID</TableCell>
                      <TableCell align="center">Nome</TableCell>
                      <TableCell align="center">Categoria</TableCell>
                      <TableCell align="center">Quantidade</TableCell>
                      <TableCell align="center">Mínimo</TableCell>
                      <TableCell align="center">Máximo</TableCell>
                      <TableCell align="center">Unidade</TableCell>
                      <TableCell align="center">Fornecedores</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.data.map(item => (
                      <TableRow key={item.id} hover>
                        <TableCell align="center" width={'10%'}>{item.id}</TableCell>
                        <TableCell align="center" width={'10%'}>{item.nome}</TableCell>
                        <TableCell align="center" width={'10%'}>{item.categoria}</TableCell>
                        <TableCell align="center" width={'10%'}>{item.quantidade}</TableCell>
                        <TableCell align="center" width={'10%'}>{item.estoque_min}</TableCell>
                        <TableCell align="center" width={'10%'}>{item.estoque_max}</TableCell>
                        <TableCell align="center" width={'10%'}>{item.unidade_medida}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap">
                            {item.fornecedores?.map(f => (
                              <Chip
                                key={f.id}
                                label={f.nome_completo ?? '-'}
                                size="small"
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: 'common.white',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: '8px',
                                  maxWidth: 100,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              />
                            ))}
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" onClick={() => router.push(`/apps/estoque/${item.id}`)}>
                            Ver
                          </Button>
                          <IconButton aria-label="edit" onClick={() => { window.location.href = `/apps/estoque/editar/${item.id}`; }}>
                            <IconPencil />
                          </IconButton>
                          {/* adicionar o botão de excluir o produto */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={data.total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[15, 25, 50]}
              />
            </>
          )}
          {isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              Erro ao carregar estoque. Tente novamente.
            </Typography>
          )}
        </Box>
      </ParentCard>
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
      <>
        {isFetching && (
          <LinearProgress
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 9999,
            }}
          />
        )}
      </>
    </PageContainer>
  );
}
