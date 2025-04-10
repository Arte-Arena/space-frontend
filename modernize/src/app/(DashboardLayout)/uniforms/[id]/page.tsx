"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Backdrop,
  Snackbar,
  IconButton,
  Typography,
} from "@mui/material";
import { IconX, IconEdit } from "@tabler/icons-react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import { IconArrowLeft, IconDownload } from "@tabler/icons-react";
import Link from "next/link";
import { uniformService } from "../uniformService";
import UniformSketchesView from "../UniformSketchesView";
import { UniformData } from "../types";
import { generateUniformPDF } from "../pdfUtils";

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
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [allowingEditing, setAllowingEditing] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

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

        try {
          const apiResponse = await uniformService.getUniformsByBudgetId(id);

          if (apiResponse.data && apiResponse.data.length > 0) {
            setUniformData(apiResponse.data[0]);
          } else {
            setError("Não foram encontrados uniformes para este orçamento.");
          }
        } catch (apiError) {
          console.error("Erro ao carregar detalhes do uniforme:", apiError);
          setError("Ocorreu um erro ao carregar os detalhes do uniforme.");
        }
      } catch (error) {
        console.error("Erro geral:", error);
        setError("Ocorreu um erro ao processar a requisição.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (uniformData) {
      try {
        const hasEmptySketches = uniformData.sketches.some(
          (sketch) => !sketch.players || sketch.players.length === 0,
        );

        if (hasEmptySketches) {
          setPdfError(
            "Não é possível gerar o PDF. Todos os esboços devem ter pelo menos um jogador.",
          );
          return;
        }

        setGeneratingPDF(true);
        setPdfError(null);

        setTimeout(() => {
          try {
            generateUniformPDF(uniformData);
            setGeneratingPDF(false);
          } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            setPdfError("Ocorreu um erro ao gerar o PDF. Tente novamente.");
            setGeneratingPDF(false);
          }
        }, 100);
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        setPdfError("Ocorreu um erro ao gerar o PDF. Tente novamente.");
        setGeneratingPDF(false);
      }
    }
  };

  const handleAllowEditing = async () => {
    try {
      setAllowingEditing(true);
      setEditingMessage(null);
      await uniformService.updatePlayerData(id, undefined, true);
      setEditingMessage({type: 'success', text: 'Edição permitida com sucesso!'});
      const apiResponse = await uniformService.getUniformsByBudgetId(id);
      if (apiResponse.data && apiResponse.data.length > 0) {
        setUniformData(apiResponse.data[0]);
      }
    } catch (error) {
      console.error("Erro ao permitir edição:", error);
      setEditingMessage({type: 'error', text: 'Ocorreu um erro ao permitir a edição.'});
    } finally {
      setAllowingEditing(false);
    }
  };

  const handleCloseSnackbar = () => {
    setPdfError(null);
  };

  const handleCloseEditingMessage = () => {
    setEditingMessage(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box>
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Box>
      );
    }

    if (!uniformData) {
      return (
        <Alert severity="info">
          Nenhum dado de uniforme disponível para este orçamento.
        </Alert>
      );
    }

    const hasEmptySketches = uniformData.sketches.some(
      (sketch) => !sketch.players || sketch.players.length === 0,
    );

    const refreshData = async () => {
      try {
        setLoading(true);
        const apiResponse = await uniformService.getUniformsByBudgetId(id);
        if (apiResponse.data && apiResponse.data.length > 0) {
          setUniformData(apiResponse.data[0]);
        }
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        {hasEmptySketches && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            O cliente ainda não preencheu os dados dos jogadores para todos os
            uniformes.
          </Alert>
        )}
        <UniformSketchesView
          uniformData={uniformData}
          refreshData={refreshData}
        />
      </>
    );
  };

  return (
    <PageContainer
      title={`Uniformes - Orçamento ${id}`}
      description="Visualização de uniformes configurados para o orçamento"
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={generatingPDF}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          <Box mt={2} color="white">
            Gerando PDF...
          </Box>
        </Box>
      </Backdrop>

      <Snackbar
        open={!!pdfError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={pdfError}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <IconX />
          </IconButton>
        }
        sx={{
          "& .MuiSnackbarContent-root": {
            bgcolor: "error.main",
          },
        }}
      />

      <Snackbar
        open={!!editingMessage}
        autoHideDuration={4000}
        onClose={handleCloseEditingMessage}
        message={editingMessage?.text}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseEditingMessage}
          >
            <IconX />
          </IconButton>
        }
        sx={{
          "& .MuiSnackbarContent-root": {
            bgcolor: editingMessage?.type === 'success' ? 'success.main' : 'error.main',
          },
        }}
      />

      <Breadcrumb title={`Visualização de Uniformes`} items={BCrumb} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              component={Link}
              href="/apps/orcamento/backoffice"
              startIcon={<IconArrowLeft />}
              variant="text"
            >
              Voltar para Backoffice
            </Button>
          </Box>

          <ParentCard
            title={`Uniformes do Orçamento #${id}`}
          >
            <Box p={2}>
              {!loading && !error && uniformData && (
                <>
                  <Stack direction="row" spacing={2} mb={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<IconDownload />}
                      onClick={handleDownloadPDF}
                      disabled={uniformData.sketches.some(
                        (sketch) =>
                          !sketch.players || sketch.players.length === 0,
                      )}
                      title={
                        uniformData.sketches.some(
                          (sketch) =>
                            !sketch.players || sketch.players.length === 0,
                        )
                          ? "Não é possível gerar o PDF enquanto houver esboços sem jogadores"
                          : "Baixar PDF para impressão"
                      }
                    >
                      Baixar PDF de Impressão
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<IconEdit />}
                      onClick={handleAllowEditing}
                      disabled={allowingEditing || (uniformData && uniformData.editable)}
                    >
                      {allowingEditing ? (
                        <>
                          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                          Processando...
                        </>
                      ) : uniformData && uniformData.editable ? (
                        "Edição já permitida"
                      ) : (
                        "Permitir Edição"
                      )}
                    </Button>
                  </Stack>
                </>
              )}
              {renderContent()}
            </Box>
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
