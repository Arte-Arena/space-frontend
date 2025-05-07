"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { IconSearch, IconPlus } from "@tabler/icons-react";
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

interface LeadSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectLead: (leadContent: string) => void;
}

const LeadSearchDialog: React.FC<LeadSearchDialogProps> = ({
  open,
  onClose,
  onSelectLead,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType] = useState<SearchType>("idOcta");
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const rowsPerPage = 25;

  useEffect(() => {
    if (open) {
      fetchLeads();
    }
  }, [open, page]);

  const fetchLeads = async (search = "") => {
    setIsSearching(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API}/api/vendas/crm/leads`,
      );

      url.searchParams.append("page", (page + 1).toString());
      url.searchParams.append("pageSize", rowsPerPage.toString());

      if (search) {
        url.searchParams.append("search", search);
        url.searchParams.append("searchType", "idOcta");
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
        };

        if (clientInfo) {
          lead.cpfCnpj =
            clientInfo.contact.person_type === "F"
              ? clientInfo.contact.cpf
              : clientInfo.contact.cnpj;
        }

        return lead;
      });

      setLeads(transformedLeads);
      setTotalItems(result.pagination.total_items);
    } catch (error) {
      logger.error("Error fetching leads:", error);
      setLeads([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchLeads(searchTerm);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSelectLead = (lead: Lead) => {
    const leadContent = `Nome: ${lead.nome}
Email: ${lead.email}
Telefone: ${lead.telefone}
Status: ${lead.status}
Origem: ${lead.origem}
ID: ${lead.idOcta || lead.id}
${lead.orcamento_id ? `Orçamento: ${lead.orcamento_id}` : ""}
${lead.cpfCnpj ? `CPF/CNPJ: ${lead.cpfCnpj}` : ""}
${lead.jaCadastrado ? "Cliente cadastrado" : "Lead não cadastrado"}`;

    onSelectLead(leadContent);
    onClose();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Pesquisar Lead por ID</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="ID do Lead"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o ID do lead para pesquisar"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} disabled={isSearching}>
                    <IconSearch size="1.2rem" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            Pesquise pelo ID do lead ou deixe em branco para ver os últimos 25
            leads
          </Typography>
        </Box>

        {isSearching ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {searchTerm
                          ? "Nenhum lead encontrado"
                          : "Carregando leads..."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{lead.nome}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.telefone}</TableCell>
                        <TableCell>{formatDate(lead.dataCriacao)}</TableCell>
                        <TableCell>{lead.status}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSelectLead(lead)}
                          >
                            <IconPlus size="1rem" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalItems}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[25]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
              }
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadSearchDialog;
