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
  Tooltip,
  Typography,
} from "@mui/material";
import { IconX, IconEye, IconBug } from "@tabler/icons-react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import { IconArrowLeft, IconDownload, IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { uniformService } from "../uniformService";
import UniformSketchesView from "../UniformSketchesView";
import { UniformData } from "../types";
import { generateUniformPDF } from "../pdfUtils";

const mockUniformData = (budgetId: string): UniformData => {
  return {
    id: "mock-12345",
    client_id: "67890",
    budget_id: parseInt(budgetId),
    sketches: [
      {
        id: "A",
        package_type: "Prata",
        player_count: 12,
        players: [
          {
            gender: "masculino",
            name: "João Silva",
            shirt_size: "M",
            shorts_size: "M",
            number: "10",
            ready: true,
          },
          {
            gender: "masculino",
            name: "Pedro Santos",
            shirt_size: "G",
            shorts_size: "G",
            number: "7",
            ready: true,
          },
          {
            gender: "feminino",
            name: "Ana Oliveira",
            shirt_size: "P",
            shorts_size: "P",
            number: "9",
            ready: false,
            observations: "Verificar tamanho do calção",
          },
        ],
      },
      {
        id: "B",
        package_type: "Ouro",
        player_count: 5,
        players: [
          {
            gender: "masculino",
            name: "Carlos Ferreira",
            shirt_size: "GG",
            shorts_size: "G",
            number: "5",
            ready: true,
          },
          {
            gender: "feminino",
            name: "Mariana Costa",
            shirt_size: "M",
            shorts_size: "P",
            number: "11",
            ready: true,
          },
          {
            gender: "infantil",
            name: "Lucca Mendes",
            shirt_size: "8",
            shorts_size: "8",
            number: "20",
            ready: false,
          },
        ],
      },
    ],
    editable: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

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
  const [isMockData, setIsMockData] = useState(false);
  const [showTestButtons, setShowTestButtons] = useState(false);

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

        if (isMockData) {
          const mockData = mockUniformData(id);
          console.log("Dados de exemplo gerados:", mockData);
          setUniformData(mockData);
          setLoading(false);
          return;
        }

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
  }, [id, isMockData]);

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

  const handleAllowEditing = () => {
    console.log("Allow editing clicked");
  };

  const handleToggleMockData = () => {
    setIsMockData((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    setPdfError(null);
  };

  const handleGenerateTestPDF = async () => {
    if (uniformData) {
      try {
        setGeneratingPDF(true);
        setPdfError(null);

        setTimeout(() => {
          try {
            import("jspdf").then((jsPDFModule) => {
              const jsPDF = jsPDFModule.default;
              const doc = new jsPDF();

              const addCheckbox = (
                x: number,
                y: number,
                checked: boolean,
              ): void => {
                doc.setDrawColor(0);
                doc.setFillColor(255, 255, 255);
                doc.rect(x, y, 3, 3, "FD");

                if (checked) {
                  doc.setDrawColor(0, 0, 0);
                  doc.line(x, y, x + 3, y + 3);
                  doc.line(x + 3, y, x, y + 3);
                }
              };

              const addWrappedText = (
                text: string,
                x: number,
                y: number,
                maxWidth: number,
              ): number => {
                if (!text || text === "-") {
                  doc.text("-", x, y);
                  return y;
                }

                const textLines = doc.splitTextToSize(text, maxWidth);
                doc.text(textLines, x, y);
                return y + (textLines.length - 1) * 5;
              };

              const now = new Date();
              const dataHoraGeracao = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} às ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

              doc.setFontSize(14);
              doc.text(
                `[TESTE] Orçamento #${uniformData.budget_id} - Uniformes`,
                14,
                15,
              );

              doc.setFontSize(10);
              doc.text(
                `Documento gerado para testes - ${dataHoraGeracao}`,
                14,
                22,
              );

              let pageIndex = 0;

              uniformData.sketches.forEach((sketch) => {
                const playersByGender: Record<string, any[]> = {};

                if (sketch.players && sketch.players.length > 0) {
                  sketch.players.forEach((player) => {
                    const gender = player.gender || "Não especificado";
                    if (!playersByGender[gender]) {
                      playersByGender[gender] = [];
                    }
                    playersByGender[gender].push(player);
                  });
                } else {
                  playersByGender["Sem jogadores"] = [];
                }

                Object.entries(playersByGender).forEach(
                  ([gender, players], genderIndex) => {
                    if (pageIndex > 0) {
                      doc.addPage();
                    }
                    pageIndex++;

                    const formattedGender =
                      gender === "masculino"
                        ? "Masculino"
                        : gender === "feminino"
                          ? "Feminino"
                          : gender === "infantil"
                            ? "Infantil"
                            : gender;

                    doc.setFontSize(12);
                    doc.text(
                      `Esboço ${sketch.id} (${sketch.package_type}) - ${formattedGender}`,
                      14,
                      35,
                    );

                    doc.setFontSize(10);
                    doc.text(`Total de jogadores: ${players.length}`, 14, 42);

                    if (players.length > 0) {
                      doc.line(14, 45, 196, 45);

                      const startY = 50;
                      const rowHeight = 8;
                      const colWidths = [14, 50, 18, 18, 18, 64];
                      const colStarts = [
                        14, // Número
                        14 + colWidths[0], // Nome
                        14 + colWidths[0] + colWidths[1], // Tam. Camisa
                        14 + colWidths[0] + colWidths[1] + colWidths[2], // Tam. Calção
                        14 +
                          colWidths[0] +
                          colWidths[1] +
                          colWidths[2] +
                          colWidths[3], // Pronto
                        14 +
                          colWidths[0] +
                          colWidths[1] +
                          colWidths[2] +
                          colWidths[3] +
                          colWidths[4], // Observações
                      ];

                      const lastRowY =
                        players.length > 0
                          ? startY + 4 + (players.length - 1) * rowHeight + 4
                          : startY;

                      for (let i = 0; i < colStarts.length; i++) {
                        doc.line(colStarts[i], 45, colStarts[i], lastRowY);
                      }
                      doc.line(
                        colStarts[colStarts.length - 1] +
                          colWidths[colWidths.length - 1],
                        45,
                        colStarts[colStarts.length - 1] +
                          colWidths[colWidths.length - 1],
                        lastRowY,
                      );

                      doc.setFont("helvetica", "bold");
                      doc.setFontSize(8);
                      doc.text("Número", colStarts[0] + 2, startY - 2);
                      doc.text("Nome", colStarts[1] + 2, startY - 2);
                      doc.text("Tam. Camisa", colStarts[2] + 2, startY - 2);
                      doc.text("Tam. Calção", colStarts[3] + 2, startY - 2);
                      doc.text("Pronto", colStarts[4] + 2, startY - 2);
                      doc.text("Obs", colStarts[5] + 2, startY - 2);

                      doc.line(14, startY, 196, startY);

                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(8);

                      players.forEach((player, index) => {
                        const rowY = startY + 4 + index * rowHeight;

                        doc.text(player.number || "-", colStarts[0] + 2, rowY);

                        const nameWidth = colWidths[1] - 4;
                        addWrappedText(
                          player.name || "-",
                          colStarts[1] + 2,
                          rowY,
                          nameWidth,
                        );

                        doc.text(
                          player.shirt_size || "-",
                          colStarts[2] + 2,
                          rowY,
                        );

                        doc.text(
                          player.shorts_size || "-",
                          colStarts[3] + 2,
                          rowY,
                        );

                        addCheckbox(colStarts[4] + 7, rowY - 2, player.ready);

                        const obs = player.observations || "-";
                        const obsWidth = colWidths[5] - 4;
                        addWrappedText(obs, colStarts[5] + 2, rowY, obsWidth);

                        if (index < players.length - 1) {
                          doc.line(14, rowY + 4, 196, rowY + 4);
                        }
                      });

                      if (players.length > 0) {
                        const lastRowY =
                          startY + 4 + (players.length - 1) * rowHeight;
                        doc.line(14, lastRowY + 4, 196, lastRowY + 4);
                      }
                    } else {
                      doc.setFontSize(10);
                      doc.text(
                        "Este esboço não possui jogadores cadastrados.",
                        14,
                        70,
                      );
                    }
                  },
                );
              });

              const totalPages = doc.getNumberOfPages();
              for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setTextColor(255, 0, 0);
                doc.setFontSize(40);
                doc.text("TESTE", 105, 150, { angle: 45, align: "center" });
                doc.setTextColor(0, 0, 0);

                doc.setFontSize(8);
                doc.text(
                  `Página ${i} de ${totalPages}`,
                  14,
                  doc.internal.pageSize.height - 10,
                );
              }

              doc.save(
                `teste-uniformes-orcamento-${uniformData.budget_id}.pdf`,
              );
              setGeneratingPDF(false);
            });
          } catch (error) {
            console.error("Erro ao gerar PDF de teste:", error);
            setPdfError(
              "Ocorreu um erro ao gerar o PDF de teste. Tente novamente.",
            );
            setGeneratingPDF(false);
          }
        }, 100);
      } catch (error) {
        console.error("Erro ao gerar PDF de teste:", error);
        setPdfError(
          "Ocorreu um erro ao gerar o PDF de teste. Tente novamente.",
        );
        setGeneratingPDF(false);
      }
    }
  };

  const toggleTestButtons = () => {
    setShowTestButtons((prev) => !prev);
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
          <Button
            variant="outlined"
            color="primary"
            startIcon={<IconEye />}
            onClick={handleToggleMockData}
          >
            Visualizar Dados de Exemplo
          </Button>
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

    console.log("renderContent - uniformData:", uniformData);
    console.log("renderContent - sketches:", uniformData.sketches);

    const hasEmptySketches = uniformData.sketches.some(
      (sketch) => !sketch.players || sketch.players.length === 0,
    );

    const refreshData = async () => {
      try {
        setLoading(true);
        if (isMockData) {
          const mockData = mockUniformData(id);
          console.log("refreshData - novos dados de exemplo:", mockData);
          setUniformData(mockData);
          setTimeout(() => {
            setLoading(false);
          }, 500);
          return;
        }

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

            <Stack direction="row" spacing={2}>
              {!loading && !error && (
                <Button
                  variant={isMockData ? "contained" : "outlined"}
                  color="info"
                  startIcon={<IconEye />}
                  onClick={handleToggleMockData}
                >
                  {isMockData
                    ? "Voltar aos Dados Reais"
                    : "Ver Dados de Exemplo"}
                </Button>
              )}

              {/* Botão para mostrar/esconder opções de teste */}
              {!loading && !error && uniformData && (
                <Button
                  variant={showTestButtons ? "contained" : "outlined"}
                  color="warning"
                  startIcon={<IconBug />}
                  onClick={toggleTestButtons}
                  sx={{ ml: 1 }}
                >
                  {showTestButtons
                    ? "Ocultar Opções de Teste"
                    : "Mostrar Opções de Teste"}
                </Button>
              )}
            </Stack>
          </Box>

          <ParentCard
            title={`Uniformes do Orçamento #${id}${isMockData ? " (EXEMPLO)" : ""}`}
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
                    >
                      Permitir Edição
                    </Button>

                    {isMockData && (
                      <Box ml="auto">
                        <Alert severity="info" sx={{ display: "inline-flex" }}>
                          Visualizando dados de exemplo
                        </Alert>
                      </Box>
                    )}
                  </Stack>

                  {/* Botões de teste - Visíveis apenas quando showTestButtons é true */}
                  {showTestButtons && (
                    <Box
                      mb={3}
                      p={2}
                      bgcolor="action.hover"
                      borderRadius={1}
                      borderLeft={4}
                      borderColor="warning.main"
                    >
                      <Typography
                        variant="subtitle2"
                        color="warning.dark"
                        mb={1}
                      >
                        Opções apenas para testes e desenvolvimento
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        O PDF de teste é uma versão simplificada que funciona
                        mesmo com esboços vazios. Ele contém uma marca d'água
                        "TESTE" e lista informações básicas dos uniformes
                        configurados.
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Tooltip title="Gera um PDF simplificado mesmo com esboços vazios">
                          <Button
                            variant="contained"
                            color="warning"
                            startIcon={<IconBug />}
                            onClick={handleGenerateTestPDF}
                          >
                            Gerar PDF de Teste
                          </Button>
                        </Tooltip>
                      </Stack>
                    </Box>
                  )}
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
