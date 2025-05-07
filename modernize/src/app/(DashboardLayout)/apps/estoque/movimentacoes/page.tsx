'use client';

import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/app/components/shared/ParentCard';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  AlertTitle,
  CircularProgress,
  Box,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useMovimentacoes } from './components/useMovimentacoes';

export default function MovimentacoesEstoquePage() {
  const theme = useTheme();
  const router = useRouter();
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  if (!accessToken) {
    router.push('/auth/login');
    return null;
  }

  const { data: movimentacoes, error, isLoading } = useMovimentacoes(accessToken);


  return (
    <PageContainer title="Movimentações" description="Movimentações de Estoque">
      <Breadcrumb title="Movimentações" subtitle="Histórico de Movimentações de Estoque" />
      <ParentCard title="Movimentações de Estoque">
        <Box>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 4 }}>
              <AlertTitle>Erro</AlertTitle>
              {error.message}
            </Alert>
          ) : movimentacoes.length === 0 ? (
            <Alert severity="info" sx={{ mt: 4 }}>
              <AlertTitle>Informação</AlertTitle>
              Nenhuma movimentação de estoque encontrada.
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: theme.palette.primary.main, color: 'white', fontWeight: 'bold' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Produto</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantidade</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nº Pedido</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Observações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movimentacoes.map((mov: any) => (
                    <TableRow key={mov.id}>
                      <TableCell>
                        {format(new Date(mov.data_movimentacao), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{mov.tipo_movimentacao}</TableCell>
                      <TableCell>{mov.estoque?.nome ?? '-'}</TableCell>
                      <TableCell>{mov.quantidade}</TableCell>
                      <TableCell>{mov.numero_pedido ?? '-'}</TableCell>
                      <TableCell>{mov.observacoes ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {isLoading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }} />}
        </Box>
      </ParentCard>
    </PageContainer>
  );
}
