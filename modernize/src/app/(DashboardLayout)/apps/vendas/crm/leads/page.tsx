"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { useAuth } from "@/utils/useAuth";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import LeadSearch from "./LeadSearch";
import LeadTable from "./LeadTable";
import { logger } from "@/utils/logger";

type SearchType = "nome" | "celular" | "cpf" | "cnpj" | "idOcta";

type Lead = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj?: string;
  dataCriacao: string;
  status: string;
  jaCadastrado: boolean;
  origem: string;
  idOcta?: string;
  orcamento_id?: string;
  orcamento_status?: "aprovado" | "pendente" | null;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  observacoes?: string;
  client_info?: {
    client_id: string;
    client_name: string;
    client_email: string;
    has_uniform: boolean;
    contact: {
      person_type: string;
      identity_card: string;
      cpf: string;
      cell_phone: string;
      zip_code: string;
      address: string;
      number: string;
      complement: string;
      neighborhood: string;
      city: string;
      state: string;
      company_name: string;
      cnpj: string;
      state_registration: string;
    };
  };
};

interface ApiResponse {
  data: {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    origem: string;
    criado_em: string;
    orcamento_id?: string;
    orcamento_status?: "aprovado" | "pendente" | null;
    tem_pedido?: boolean;
    client_info: {
      client_id: string;
      client_name: string;
      client_email: string;
      has_uniform: boolean;
      contact: {
        person_type: string;
        identity_card: string;
        cpf: string;
        cell_phone: string;
        zip_code: string;
        address: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        company_name: string;
        cnpj: string;
        state_registration: string;
      };
    } | null;
  }[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
  };
}

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
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("nome");
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const rowsPerPage = 25;

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchLeads();
  }, [isLoggedIn, page]);

  const fetchLeads = async (search = "", searchType: SearchType = "nome") => {
    setIsLoadingLeads(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API}/api/vendas/crm/leads`,
      );

      url.searchParams.append("page", (page + 1).toString());
      url.searchParams.append("pageSize", rowsPerPage.toString());

      if (search) {
        url.searchParams.append("search", search);
        url.searchParams.append("searchType", searchType);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      const transformedLeads = result.data.map((item) => {
        const hasOrcamento = item.orcamento_id;
        const clientInfo = item.client_info;
        const isCadastrado = clientInfo !== null;

        let status: string;
        if (!hasOrcamento) {
          status = "Novo";
        } else {
          const hasPedido = item.tem_pedido;
          
          const lastInteraction = item.criado_em ? new Date(item.criado_em) : null;
          const now = new Date();
          
          if (lastInteraction && (now.getTime() - lastInteraction.getTime()) > 60 * 24 * 60 * 60 * 1000) {
            status = "Perdido";
          }

          if (hasPedido) {
            status = "Convertido";
          } else if (item.orcamento_status === "aprovado") {
            status = "Aprovado";
          } else if (hasOrcamento) {
            status = "Em andamento";
          } else {
            status = "Novo";
          }
        }

        const lead: Lead = {
          id: item.id,
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          dataCriacao: item.criado_em,
          status: status,
          jaCadastrado: isCadastrado,
          origem: item.origem || "Desconhecida",
          idOcta: item.id,
          orcamento_id: item.orcamento_id,
          orcamento_status: item.orcamento_status,
        };

        if (clientInfo) {
          lead.cpfCnpj =
            clientInfo.contact.person_type === "F"
              ? clientInfo.contact.cpf
              : clientInfo.contact.cnpj;

          lead.endereco = {
            rua: clientInfo.contact.address,
            numero: clientInfo.contact.number,
            complemento: clientInfo.contact.complement,
            bairro: clientInfo.contact.neighborhood,
            cidade: clientInfo.contact.city,
            estado: clientInfo.contact.state,
            cep: clientInfo.contact.zip_code,
          };

          lead.client_info = clientInfo;
        }

        return lead;
      });

      setLeads(transformedLeads);
      setTotalItems(result.pagination.total_items);
    } catch (error) {
      logger.error("Error fetching leads:", error);
      setLeads([]);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleSearch = (searchTerm: string, searchType: SearchType) => {
    setIsSearching(true);
    logger.log(`Pesquisando por ${searchType}: ${searchTerm}`);
    setPage(0);
    setSearchTerm(searchTerm);
    setSearchType(searchType);

    if (!searchTerm.trim()) {
      fetchLeads();
      setIsSearching(false);
      return;
    }

    fetchLeads(searchTerm, searchType).finally(() => {
      setIsSearching(false);
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);

    if (searchTerm) {
      fetchLeads(searchTerm, searchType);
    }
  };

  const getCurrentPageData = () => {
    return leads;
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
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircularProgress color="primary" size={40} />
              <Typography variant="body2" color="text.secondary">
                Buscando leads...
              </Typography>
            </Box>
          </Box>
        ) : (
          <LeadTable
            leads={getCurrentPageData()}
            isLoading={isLoadingLeads}
            page={page}
            rowsPerPage={rowsPerPage}
            totalLeads={totalItems}
            onPageChange={handleChangePage}
            onRowsPerPageChange={() => {}}
            isFiltered={!!searchTerm}
          />
        )}
      </Box>
    </PageContainer>
  );
}

export default LeadsScreen;
