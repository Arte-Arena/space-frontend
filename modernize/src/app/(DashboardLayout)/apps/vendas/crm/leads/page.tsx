"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { useAuth } from "@/utils/useAuth";
import { Box, Typography, Paper } from "@mui/material";
import LeadSearch from "./LeadSearch";
import LeadTable from "./LeadTable";
import { logger } from "@/utils/logger";

type SearchType = "nome" | "celular" | "cpf" | "cnpj" | "idOcta";

const mockLeads = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    cpfCnpj: "123.456.789-00",
    dataCriacao: "2023-10-15T10:30:00Z",
    status: "Novo",
    jaCadastrado: false,
    origem: "Site",
    idOcta: "OCT-7532",
    endereco: {
      rua: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    },
    observacoes: "Cliente interessado em produtos premium.",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    telefone: "(11) 97654-3210",
    cpfCnpj: "987.654.321-00",
    dataCriacao: "2023-10-16T14:20:00Z",
    status: "Em andamento",
    jaCadastrado: true,
    origem: "Indicação",
    idOcta: "OCT-8921",
    endereco: {
      rua: "Avenida Paulista",
      numero: "1000",
      complemento: "Apto 501",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
    },
  },
  {
    id: "3",
    nome: "Carlos Santos",
    email: "carlos.santos@email.com",
    telefone: "(11) 91234-5678",
    cpfCnpj: "111.222.333-44",
    dataCriacao: "2023-10-17T09:15:00Z",
    status: "Convertido",
    jaCadastrado: false,
    origem: "Redes Sociais",
    idOcta: "OCT-4567",
    endereco: {
      rua: "Rua Augusta",
      numero: "789",
      bairro: "Consolação",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01305-000",
    },
    observacoes: "Cliente fechou negócio após demonstração do produto.",
  },
  {
    id: "4",
    nome: "Ana Souza",
    email: "ana.souza@email.com",
    telefone: "(11) 98888-7777",
    cpfCnpj: "444.555.666-77",
    dataCriacao: "2023-10-18T16:45:00Z",
    status: "Perdido",
    jaCadastrado: false,
    origem: "Google Ads",
    idOcta: "OCT-3214",
    endereco: {
      rua: "Rua Oscar Freire",
      numero: "456",
      bairro: "Jardins",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01426-000",
    },
    observacoes: "Cliente optou por concorrente devido ao preço.",
  },
  {
    id: "5",
    nome: "Roberto Ferreira",
    email: "roberto.ferreira@email.com",
    telefone: "(11) 99999-8888",
    cpfCnpj: "222.333.444-55",
    dataCriacao: "2023-10-19T11:30:00Z",
    status: "Novo",
    jaCadastrado: true,
    origem: "Feira",
    idOcta: "OCT-9876",
    endereco: {
      rua: "Rua Haddock Lobo",
      numero: "321",
      complemento: "Sala 101",
      bairro: "Consolação",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01414-000",
    },
  },
  {
    id: "6",
    nome: "Roberta Ferreira",
    email: "roberta.ferreira@email.com",
    telefone: "(11) 99999-8888",
    cpfCnpj: "222.333.444-55",
    dataCriacao: "2023-10-19T11:30:00Z",
    status: "Aprovado",
    jaCadastrado: true,
    origem: "Feira",
    idOcta: "OCT-6543",
    endereco: {
      rua: "Rua Haddock Lobo",
      numero: "321",
      complemento: "Sala 101",
      bairro: "Consolação",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01414-000",
    },
  },
];

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
  const [leads, setLeads] = useState(mockLeads);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  useEffect(() => {
    if (!isLoggedIn) return;
  }, [isLoggedIn]);

  const handleSearch = (searchTerm: string, searchType: SearchType) => {
    setIsSearching(true);
    logger.log(`Pesquisando por ${searchType}: ${searchTerm}`);
    setPage(0);

    setTimeout(() => {
      setIsSearching(false);

      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      const filtered = mockLeads.filter((lead) => {
        const value =
          lead[
            searchType === "nome"
              ? "nome"
              : searchType === "celular"
                ? "telefone"
                : searchType === "cpf" || searchType === "cnpj"
                  ? "cpfCnpj"
                  : searchType === "idOcta"
                    ? "idOcta"
                    : "nome"
          ];

        return value.toLowerCase().includes(searchTerm.toLowerCase());
      });

      setSearchResults(filtered);
      setLeads(filtered);
    }, 1000);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const getCurrentPageData = () => {
    const currentLeads = searchResults.length > 0 ? searchResults : leads;
    const startIndex = page * rowsPerPage;
    return currentLeads.slice(startIndex, startIndex + rowsPerPage);
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
        ) : (
          <LeadTable
            leads={getCurrentPageData()}
            isLoading={isLoadingLeads}
            page={page}
            rowsPerPage={rowsPerPage}
            totalLeads={
              searchResults.length > 0 ? searchResults.length : leads.length
            }
            onPageChange={handleChangePage}
            onRowsPerPageChange={() => {}}
          />
        )}
      </Box>
    </PageContainer>
  );
}

export default LeadsScreen;
