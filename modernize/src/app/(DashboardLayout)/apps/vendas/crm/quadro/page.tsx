"use client";
import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { useAuth } from "@/utils/useAuth";
import { Box, Typography, Paper } from "@mui/material";
import BoardManager from "./BoardManager";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Vendas",
  },
  {
    to: "/apps/vendas/crm/quadro",
    title: "Quadro",
  },
];

function QuadroScreen() {
  const isLoggedIn = useAuth();

  return (
    <PageContainer title="Quadro" description="Visualização em Quadro">
      <Breadcrumb title="Quadro" items={BCrumb} />

      <Box sx={{ width: "100%" }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom component="div">
            Quadro de Visualização
          </Typography>
          <Typography variant="body1" gutterBottom>
            Visualize e gerencie seus leads em formato de quadro.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, minHeight: "600px" }}>
          <BoardManager />
        </Paper>
      </Box>
    </PageContainer>
  );
}

export default QuadroScreen;
