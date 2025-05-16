'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Paper,
} from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';

export default function ConciliacaoDetailsPage() {
  const { id } = useParams();
  const accessToken = localStorage.getItem('accessToken')
  const [data, setData] = useState<Conciliacao | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conciliacao/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error('Erro ao buscar dados');
        const json: Conciliacao = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  if (!data) return null;

  return (
    <PageContainer title={"Conciliação " + data.id} description={"detalhes da conciliação N° " + data.id}>
      <Box p={3} maxWidth="80vw" mx="auto">
        <Typography variant="h4" gutterBottom>
          Conciliação #{data.id}
        </Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Status:</strong> {data.status}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Diferença:</strong> R$ {data.diferenca}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Observações:</strong> {data.observacoes}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Criado em:</strong> {new Date(data.created_at).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Atualizado em:</strong> {new Date(data.updated_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Movimentação
        </Typography>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography><strong>Origem:</strong> {data.movimentacao.origin_type} #{data.movimentacao.origin_id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Número do pedido:</strong> {data.movimentacao.numero_pedido}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Documento:</strong> {data.movimentacao.documento}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Tipo:</strong> {data.movimentacao.tipo_documento}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Valor Bruto:</strong> R$ {data.movimentacao.valor_bruto}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Valor Líquido:</strong> R$ {data.movimentacao.valor_liquido}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Data Operação:</strong> {new Date(data.movimentacao.data_operacao).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Status:</strong> {data.movimentacao.status}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Transação
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography><strong>ID Externo:</strong> {data.transacao.id_transacao_externa}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Data da Transação:</strong> {new Date(data.transacao.data_transacao).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Valor:</strong> R$ {data.transacao.valor}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Taxas:</strong> R$ {data.transacao.valor_taxas}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Operação:</strong> {data.transacao.tipo_operacao}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Status:</strong> {data.transacao.status}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Pagador:</strong> {data.transacao.nome_pagador}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Email:</strong> {data.transacao.email_pagador}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Documento Pagador:</strong> {data.transacao.documento_pagador}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
}
