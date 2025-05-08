"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { Box, Button, Paper, Typography, Alert } from "@mui/material";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Vendas",
  },
  {
    to: "/apps/vendas/crm/leads",
    title: "Leads",
  },
  {
    title: "Detalhes do Lead",
  },
];

function LeadDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;
  const [isValidId, setIsValidId] = useState(true);

  useEffect(() => {
    if (!leadId || leadId === "undefined") {
      setIsValidId(false);
    }
  }, [leadId]);

  return (
    <PageContainer
      title={`Lead: ${isValidId ? leadId : "Não encontrado"}`}
      description="Detalhes do lead"
    >
      <Breadcrumb title="Detalhes do lead" items={BCrumb} />

      <Box sx={{ display: "flex", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft size={18} />}
          onClick={() => router.back()}
        >
          Voltar para leads
        </Button>
      </Box>

      {!isValidId ? (
        <Alert severity="error" icon={<IconAlertCircle />} sx={{ mb: 3 }}>
          ID do lead inválido ou não encontrado.
        </Alert>
      ) : (
        <Paper elevation={1} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Detalhes do lead
          </Typography>
          <Typography variant="body1" paragraph>
            Esta é a página de detalhes para o lead com ID:{" "}
            <strong>{leadId}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta página está em construção e terá informações detalhadas sobre o
            lead em breve.
          </Typography>
        </Paper>
      )}
    </PageContainer>
  );
}

export default LeadDetailsPage;
