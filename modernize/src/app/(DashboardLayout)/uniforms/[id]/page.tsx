'use client';
import React, { useState, useEffect } from "react";
import { Grid, Box, Button, CircularProgress, Alert } from "@mui/material";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { uniformService } from "../uniformService";
import UniformSketchesView from "../UniformSketchesView";
import { UniformData } from "../types";

interface UniformViewPageProps {
  params: {
    id: string;
  };
}

export default function UniformViewPage({ params }: UniformViewPageProps) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uniformData, setUniformData] = useState<UniformData | null>(null);

  const BCrumb = [
    {
      to: "/",
      title: "Início",
    },
    {
      to: "/apps/orcamento/backoffice",
      title: "Backoffice",
    },
    {
      title: `Uniformes - Orçamento #${id}`,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await uniformService.getUniformsByBudgetId(id);
        
        if (response.data && response.data.length > 0) {
          setUniformData(response.data[0]);
        } else {
          setError("Não foram encontrados uniformes para este orçamento.");
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do uniforme:", error);
        setError("Ocorreu um erro ao carregar os detalhes do uniforme.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <PageContainer
      title={`Uniformes - Orçamento ${id}`}
      description="Visualização de uniformes configurados para o orçamento"
    >
      <Breadcrumb title={`Visualização de Uniformes`} items={BCrumb} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mb={3}>
            <Button
              component={Link}
              href="/apps/orcamento/backoffice"
              startIcon={<IconArrowLeft />}
              variant="text"
            >
              Voltar para Backoffice
            </Button>
          </Box>

          <ParentCard title={`Uniformes do Orçamento #${id}`}>
            <Box p={2}>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  py={5}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="warning">{error}</Alert>
              ) : uniformData ? (
                <UniformSketchesView uniformData={uniformData} />
              ) : (
                <Alert severity="info">
                  Nenhum dado de uniforme disponível para este orçamento.
                </Alert>
              )}
            </Box>
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
} 