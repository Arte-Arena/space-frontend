"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { useAuth } from "@/utils/useAuth";
import { Box, Typography, Paper } from "@mui/material";
import LeadSearch from "./LeadSearch";
import { logger } from "@/utils/logger";

type SearchType = "nome" | "celular" | "cpf" | "cnpj" | "idOcta";

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
];

function LeadsScreen() {
  const isLoggedIn = useAuth();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  const handleSearch = (searchTerm: string, searchType: SearchType) => {
    setIsSearching(true);

    logger.log(`Pesquisando por ${searchType}: ${searchTerm}`);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([]);
    }, 1000);
  };

  return (
    <PageContainer title="Leads" description="Gerenciamento de Leads">
      <Breadcrumb title="Leads" items={BCrumb} />

      <Box sx={{ width: "100%" }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom component="div">
            Gerenciador de Leads
          </Typography>
          <Typography variant="body1" gutterBottom>
            Use o formulário abaixo para pesquisar leads existentes.
          </Typography>
        </Paper>

        <LeadSearch onSearch={handleSearch} />

        {isSearching ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography>Buscando...</Typography>
          </Box>
        ) : searchResults.length > 0 ? (
          <Box>
            <Typography>
              Resultados encontrados: {searchResults.length}
            </Typography>
          </Box>
        ) : (
          <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1">
              {searchResults === null
                ? "Use a pesquisa acima para encontrar leads."
                : "Nenhum resultado encontrado para a pesquisa."}
            </Typography>
          </Paper>
        )}
      </Box>
    </PageContainer>
  );
}

export default LeadsScreen;
