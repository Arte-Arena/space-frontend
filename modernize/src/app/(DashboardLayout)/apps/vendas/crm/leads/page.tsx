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
type StatusType =
  | "all"
  | "novo"
  | "em andamento"
  | "aprovado"
  | "convertido"
  | "perdido";
type ClientType = "all" | "b2b" | "b2c";

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
  orcamento_valor?: number;
  tipoCliente?: "b2b" | "b2c";
  seguimento?:
    | "atletica_interclasse"
    | "times"
    | "pessoa_juridica"
    | "agencias_marketing"
    | "outros"
    | null;
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
    orcamento_valor?: number;
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
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("nome");
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const rowsPerPage = 25;

  const [activeFilters, setActiveFilters] = useState<{
    status: StatusType | null;
    budgetRange: [number, number] | null;
    clientType: ClientType | null;
    budgetSort: "none" | "asc" | "desc";
  }>({
    status: null,
    budgetRange: null,
    clientType: null,
    budgetSort: "none",
  });
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchLeads();
  }, [isLoggedIn, page]);

  useEffect(() => {
    if (!isSearching && !isFiltering) {
      setFilteredLeads(leads);
    }
  }, [leads, isSearching, isFiltering]);

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

          const lastInteraction = item.criado_em
            ? new Date(item.criado_em)
            : null;
          const now = new Date();

          if (
            lastInteraction &&
            now.getTime() - lastInteraction.getTime() > 60 * 24 * 60 * 60 * 1000
          ) {
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
          orcamento_valor: item.orcamento_valor,
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

          lead.tipoCliente =
            clientInfo.contact.person_type === "F" ? "b2c" : "b2b";
          lead.seguimento = null;
        }

        return lead;
      });

      setLeads(transformedLeads);
      setFilteredLeads(transformedLeads);
      setTotalItems(result.pagination.total_items);
    } catch (error) {
      logger.error("Error fetching leads:", error);
      setLeads([]);
      setFilteredLeads([]);
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

  const handleFilter = (filters: {
    status: StatusType | null;
    budgetRange: [number, number] | null;
    clientType: ClientType | null;
    budgetSort: "none" | "asc" | "desc";
  }) => {
    setIsFiltering(true);
    setActiveFilters(filters);

    let filtered = [...leads];

    if (filters.status) {
      filtered = filtered.filter(
        (lead) => lead.status.toLowerCase() === filters.status,
      );
    }

    if (filters.budgetRange) {
      const [min, max] = filters.budgetRange;
      filtered = filtered.filter((lead) => {
        const valor = lead.orcamento_valor || 0;
        return valor >= min && valor <= max;
      });
    }

    if (filters.clientType) {
      filtered = filtered.filter(
        (lead) => lead.tipoCliente === filters.clientType,
      );
    }

    if (filters.budgetSort !== "none") {
      filtered.sort((a, b) => {
        const valorA = a.orcamento_valor || 0;
        const valorB = b.orcamento_valor || 0;

        return filters.budgetSort === "asc" ? valorA - valorB : valorB - valorA;
      });
    }

    setFilteredLeads(filtered);
    setIsFiltering(false);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      status: null,
      budgetRange: null,
      clientType: null,
      budgetSort: "none",
    });
    setFilteredLeads(leads);
    setIsFiltering(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);

    if (searchTerm) {
      fetchLeads(searchTerm, searchType);
    }
  };

  const getCurrentPageData = () => {
    return filteredLeads;
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

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Legenda de Status
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: (theme) => theme.palette.info.main,
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Novo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lead recém chegado que ainda não teve orçamento gerado com a
                  equipe de vendas.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: (theme) => theme.palette.warning.main,
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Em andamento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lead com orçamento pendente, em processo de negociação com a
                  equipe de vendas.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: (theme) => theme.palette.success.main,
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Aprovado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lead com orçamento aprovado, aguardando conversão em pedido.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: (theme) => theme.palette.primary.main,
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Convertido
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lead convertido em cliente com pedido relacionado finalizado.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: (theme) => theme.palette.error.main,
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Perdido
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lead sem andamento ou interação após 30 dias desde o último
                  contato.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <LeadSearch
          onSearch={handleSearch}
          onFilter={handleFilter}
          onClearFilters={handleClearFilters}
        />

        {isSearching || isFiltering ? (
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
                {isSearching ? "Buscando leads..." : "Filtrando leads..."}
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
            isFiltered={
              !!searchTerm ||
              Object.values(activeFilters).some((f) => f !== null)
            }
          />
        )}
      </Box>
    </PageContainer>
  );
}

export default LeadsScreen;
