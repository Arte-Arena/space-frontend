'use client';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { Fornecedor } from '../components/Types';
import { useEffect, useState } from 'react';
import { PanoramaSharp } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { set } from 'lodash';

export default function FornecedoresScreen() {
  const params = useParams();
  const id = params.id as string;
  const accessToken = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null;

  if (!accessToken) {
    typeof window !== 'undefined' && (window.location.href = '/auth/login');
    return null;
  }

  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);

  const { data, isLoading, isError, error } = useQuery<Fornecedor>({
    queryKey: ['fornecedor', id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/fornecedor/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }
      const resposta = await res.json() as Fornecedor;
      setFornecedor(resposta);
      return resposta;
    },
    enabled: !!id,
  });

  const produtos = fornecedor?.produtos ?? [];

  if (isLoading) return <p>Carregando fornecedor…</p>;
  if (isError) return <p>Erro ao buscar: {(error as Error).message}</p>;

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <PageContainer title="Fornecedor" description="Fornecedor">
      <Box p={2} sx={{
        width: '85%',
        mx: 'auto',
      }}>
        <Breadcrumb title="Fornecedor" subtitle='Fornecedor' />
        <Typography variant="h6" gutterBottom>Dados Gerais</Typography>
        <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="textSecondary">ID</Typography>
            <Typography variant="body1">{fornecedor?.id}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="textSecondary">Tipo Pessoa</Typography>
            <Typography variant="body1">{fornecedor?.tipo_pessoa}</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" color="textSecondary">Criado em</Typography>
            <Typography variant="body1">{fornecedor?.created_at ? formatDate(fornecedor.created_at) : '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" color="textSecondary">Ultima Atualização</Typography>
            <Typography variant="body1">{fornecedor?.created_at ? formatDate(fornecedor.updated_at) : '-'}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Dados Pessoa Física */}
        {fornecedor?.tipo_pessoa === 'PF' && (
          <>
            <Typography variant="h6" gutterBottom>Dados Pessoa Física</Typography>
            <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">Nome Completo</Typography>
                <Typography variant="body1">{data?.nome_completo ?? '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">RG</Typography>
                <Typography variant="body1">{fornecedor?.rg ?? '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">CPF</Typography>
                <Typography variant="body1">{fornecedor?.cpf ?? '-'}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Dados Pessoa Jurídica */}
        {fornecedor?.tipo_pessoa === 'PJ' && (
          <>
            <Typography variant="h6" gutterBottom>Dados Pessoa Jurídica</Typography>
            <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">Razão Social</Typography>
                <Typography variant="body1">{fornecedor?.razao_social ?? '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">CNPJ</Typography>
                <Typography variant="body1">{fornecedor?.cnpj ?? '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">Inscrição Estadual</Typography>
                <Typography variant="body1">{fornecedor?.inscricao_estadual ?? '-'}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Contato */}
        <Typography variant="h6" gutterBottom>Contato</Typography>
        <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">E-mail</Typography>
            <Typography variant="body1">{fornecedor?.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Celular</Typography>
            <Typography variant="body1">{fornecedor?.celular}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Endereço */}
        <Typography variant="h6" gutterBottom>Endereço</Typography>
        <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="textSecondary">CEP</Typography>
            <Typography variant="body1">{fornecedor?.cep}</Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" color="textSecondary">Endereço</Typography>
            <Typography variant="body1">{fornecedor?.endereco}, {fornecedor?.numero}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="textSecondary">Complemento</Typography>
            <Typography variant="body1">{fornecedor?.complemento ?? '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="textSecondary">Bairro</Typography>
            <Typography variant="body1">{fornecedor?.bairro}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="textSecondary">Cidade / UF</Typography>
            <Typography variant="body1">{fornecedor?.cidade} / {fornecedor?.uf}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Produtos */}
        <Typography variant="h6" gutterBottom>Produtos</Typography>
        <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
          {produtos.length > 0 ? (
            produtos.map((produto, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Typography variant="body1">{produto.nome}</Typography>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1">Sem produtos cadastrados</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </PageContainer>
  );
}
