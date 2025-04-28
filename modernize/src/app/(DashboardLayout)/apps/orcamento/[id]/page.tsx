"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CircularProgress,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Chip,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";

interface Produto {
  id: number;
  nome: string;
  peso: string;
  prazo: number;
  preco: number;
  altura: string;
  largura: string;
  comprimento: string;
  created_at: string | null;
  quantidade: number;
  updated_at: string | null;
}

interface Orcamento {
  id: number;
  user_id: number;
  cliente_octa_number: string;
  nome_cliente: string | null;
  lista_produtos: string | null;
  produtos_brinde: string | null;
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
  prazo_producao: number;
  prev_entrega: string;
  status_aprovacao_arte_arena: string;
  status_aprovacao_cliente: string;
  status_envio_pedido: string;
  status_aprovacao_amostra_arte_arena: string;
  status_envio_amostra: string;
  status_aprovacao_amostra_cliente: string;
  status_faturamento: string;
  status_pagamento: string;
  status_producao_esboco: string;
  status_producao_arte_final: string;
  status_aprovacao_esboco: string;
  status_aprovacao_arte_final: string;
}

const OrcamentoViewPage = () => {
  const params = useParams();
  const id = params.id;

  const getOrcamentoById = async (): Promise<Orcamento | null> => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || !id) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/orcamento/get-orcamento/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  };

  const {
    data: orcamento,
    isLoading,
    isError,
  } = useQuery<Orcamento | null>({
    queryKey: ["orcamento", id],
    queryFn: getOrcamentoById,
    enabled: !!id,
  });

  const formatarData = (dataString?: string) => {
    if (!dataString) return "Data não disponível";
    try {
      return format(parseISO(dataString), "dd/MM/yyyy");
    } catch (error) {
      return "Data inválida";
    }
  };

  const formatarValor = (valor?: number) => {
    if (valor === undefined || valor === null) return "Valor não disponível";
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const renderProdutos = () => {
    if (!orcamento?.lista_produtos) return null;

    try {
      const produtos: Produto[] = JSON.parse(orcamento.lista_produtos);

      return (
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Produtos
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {produtos.map((produto, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{produto.nome}</Typography>
                    <Typography variant="body2">
                      Quantidade: {produto.quantidade}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Preço: {formatarValor(produto.preco)}
                    </Typography>
                    <Typography variant="body2">
                      Prazo: {produto.prazo} dias
                    </Typography>
                  </Grid>
                  {produto.altura && produto.largura && produto.comprimento && (
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        Dimensões: {produto.altura} x {produto.largura} x{" "}
                        {produto.comprimento}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      );
    } catch (error) {
      return (
        <Typography color="error">
          Erro ao processar lista de produtos
        </Typography>
      );
    }
  };

  const renderProdutosBrinde = () => {
    if (!orcamento?.produtos_brinde || orcamento.brinde !== 1) return null;

    try {
      const produtosBrinde: Produto[] = JSON.parse(orcamento.produtos_brinde);

      if (!produtosBrinde.length) return null;

      return (
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Produtos Brinde
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {produtosBrinde.map((produto, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{produto.nome}</Typography>
                    <Typography variant="body2">
                      Quantidade: {produto.quantidade}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Preço: {formatarValor(produto.preco)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      );
    } catch (error) {
      return (
        <Typography color="error">
          Erro ao processar lista de brindes
        </Typography>
      );
    }
  };

  const getStatusChip = (status?: string) => {
    if (!status) return null;

    const statusColors: Record<string, { color: string; bgcolor: string }> = {
      aprovado: { color: "success.main", bgcolor: "success.light" },
      desaprovado: { color: "error.main", bgcolor: "error.light" },
      pendente: { color: "warning.main", bgcolor: "warning.light" },
      "em andamento": { color: "info.main", bgcolor: "info.light" },
      concluído: { color: "success.main", bgcolor: "success.light" },
      cancelado: { color: "error.main", bgcolor: "error.light" },
    };

    const statusInfo = statusColors[status.toLowerCase()] || {
      color: "text.primary",
      bgcolor: "grey.200",
    };

    return (
      <Chip
        label={status}
        sx={{
          color: statusInfo.color,
          bgcolor: statusInfo.bgcolor,
          textTransform: "capitalize",
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !orcamento) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="error">
          Erro ao carregar o orçamento
        </Typography>
      </Box>
    );
  }

  return (
    <PageContainer
      title={`Orçamento #${orcamento.id}`}
      description="Visualização de orçamento"
    >
      <Breadcrumb
        title={`Orçamento #${orcamento.id}`}
        items={[
          { title: "Dashboard", href: "/" },
          { title: "Orçamentos", href: "/apps/orcamento/editar" },
          { title: `Orçamento #${orcamento.id}` },
        ]}
      />

      <Box sx={{ p: 3 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4">Orçamento #{orcamento.id}</Typography>
            {getStatusChip(orcamento.status)}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Cliente
                  </Typography>
                  <Typography variant="body1">
                    {orcamento.nome_cliente || orcamento.cliente_octa_number}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Endereço
                  </Typography>
                  <Typography variant="body1">{orcamento.endereco}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    CEP: {orcamento.endereco_cep}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Opção de Entrega
                  </Typography>
                  <Typography variant="body1">
                    {orcamento.opcao_entrega}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Data de Criação
                  </Typography>
                  <Typography variant="body1">
                    {formatarData(orcamento.created_at)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Previsão de Entrega
                  </Typography>
                  <Typography variant="body1">
                    {formatarData(orcamento.prev_entrega)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Valor Total
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatarValor(orcamento.total_orcamento)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {renderProdutos()}
        {renderProdutosBrinde()}

        {orcamento.texto_orcamento && (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Observações
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                {orcamento.texto_orcamento}
              </Typography>
            </CardContent>
          </Card>
        )}

        {orcamento.tipo_desconto && orcamento.valor_desconto > 0 && (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações de Desconto
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                Tipo de Desconto:{" "}
                {orcamento.tipo_desconto === "percentual"
                  ? "Percentual"
                  : "Valor Fixo"}
              </Typography>
              <Typography variant="body1">
                Valor do Desconto: {formatarValor(orcamento.valor_desconto)}
              </Typography>
            </CardContent>
          </Card>
        )}

        {orcamento.data_antecipa && orcamento.taxa_antecipa && (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações de Antecipação
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                Data Desejada: {formatarData(orcamento.data_antecipa)}
              </Typography>
              <Typography variant="body1">
                Taxa de Antecipação: {orcamento.taxa_antecipa}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </PageContainer>
  );
};

export default OrcamentoViewPage;
