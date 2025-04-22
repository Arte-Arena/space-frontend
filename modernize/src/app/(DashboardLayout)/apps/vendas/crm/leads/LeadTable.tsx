"use client";
import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Collapse,
  Typography,
  Chip,
  IconButton,
  Theme,
  TablePagination,
} from "@mui/material";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  dataCriacao: string;
  status: string;
  jaCadastrado: boolean;
  origem: string;
  idOcta?: string;
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
}

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalLeads: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type StatusColor = "success" | "warning" | "primary" | "error" | "secondary";

interface StatusColorProps {
  bg: StatusColor;
  color: StatusColor;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  page,
  rowsPerPage,
  totalLeads,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof Lead>("dataCriacao");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleRequestSort = (property: keyof Lead) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedLeads = React.useMemo(() => {
    if (!leads) return [];

    return [...leads].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (orderBy === "dataCriacao") {
        return order === "asc"
          ? new Date(a.dataCriacao).getTime() -
              new Date(b.dataCriacao).getTime()
          : new Date(b.dataCriacao).getTime() -
              new Date(a.dataCriacao).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [leads, order, orderBy]);

  const handleRowClick = (leadId: string, jaCadastrado: boolean) => {
    setExpandedRow(expandedRow === leadId ? null : leadId);
  };

  const getStatusColor = (status: string): StatusColorProps => {
    switch (status.toLowerCase()) {
      case "novo":
        return { bg: "success", color: "success" };
      case "em andamento":
        return { bg: "warning", color: "warning" };
      case "convertido":
        return { bg: "primary", color: "primary" };
      case "aprovado":
        return { bg: "secondary", color: "secondary" };
      case "perdido":
        return { bg: "error", color: "error" };
      default:
        return { bg: "secondary", color: "secondary" };
    }
  };

  const getChipBgColor = (theme: Theme, status: string) => {
    const colorType = getStatusColor(status).bg;
    return theme.palette[colorType].light;
  };

  const getChipTextColor = (theme: Theme, status: string) => {
    const colorType = getStatusColor(status).color;
    return theme.palette[colorType].main;
  };

  if (isLoading) {
    return (
      <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
        <Typography>Carregando leads...</Typography>
      </Paper>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1">Nenhum lead encontrado.</Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "50px" }}></TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "nome"}
                  direction={orderBy === "nome" ? order : "asc"}
                  onClick={() => handleRequestSort("nome")}
                >
                  Nome
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? order : "asc"}
                  onClick={() => handleRequestSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "dataCriacao"}
                  direction={orderBy === "dataCriacao" ? order : "asc"}
                  onClick={() => handleRequestSort("dataCriacao")}
                >
                  Data de Criação
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "origem"}
                  direction={orderBy === "origem" ? order : "asc"}
                  onClick={() => handleRequestSort("origem")}
                >
                  Origem
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "idOcta"}
                  direction={orderBy === "idOcta" ? order : "asc"}
                  onClick={() => handleRequestSort("idOcta")}
                >
                  ID do Octa
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLeads.map((lead) => (
              <React.Fragment key={lead.id}>
                <TableRow
                  hover
                  onClick={() => handleRowClick(lead.id, lead.jaCadastrado)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: lead.jaCadastrado
                      ? "rgba(255, 193, 7, 0.1)"
                      : "inherit",
                  }}
                >
                  <TableCell>
                    <IconButton size="small">
                      {expandedRow === lead.id ? (
                        <IconChevronUp size="1rem" />
                      ) : (
                        <IconChevronDown size="1rem" />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body1">
                        {lead.nome || "-"}
                        {lead.jaCadastrado && (
                          <Chip
                            label="Já cadastrado"
                            size="small"
                            color="warning"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{lead.email || "-"}</TableCell>
                  <TableCell>{lead.telefone || "-"}</TableCell>
                  <TableCell>{lead.cpfCnpj || "-"}</TableCell>
                  <TableCell>
                    {lead.dataCriacao
                      ? format(new Date(lead.dataCriacao), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lead.status}
                      sx={{
                        bgcolor: (theme) => getChipBgColor(theme, lead.status),
                        color: (theme) => getChipTextColor(theme, lead.status),
                        borderRadius: "8px",
                      }}
                    />
                  </TableCell>
                  <TableCell>{lead.origem || "-"}</TableCell>
                  <TableCell>{lead.idOcta || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={9}
                  >
                    <Collapse
                      in={expandedRow === lead.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 2, mb: 4 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Detalhes do Lead
                        </Typography>

                        {lead.endereco && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              Endereço
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body1">
                                Rua: {lead.endereco?.rua || "-"}
                              </Typography>
                              <Typography variant="body1">
                                Número: {lead.endereco?.numero || "-"}
                              </Typography>
                              {lead.endereco?.complemento && (
                                <Typography variant="body1">
                                  Complemento: {lead.endereco?.complemento}
                                </Typography>
                              )}
                              <Typography variant="body1">
                                Bairro: {lead.endereco?.bairro || "-"}
                              </Typography>
                              <Typography variant="body1">
                                Cidade: {lead.endereco?.cidade || "-"}
                              </Typography>
                              <Typography variant="body1">
                                Estado: {lead.endereco?.estado || "-"}
                              </Typography>
                              <Typography variant="body1">
                                CEP: {lead.endereco?.cep || "-"}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {lead.observacoes && (
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Observações</Typography>
                            <Typography variant="body1">
                              {lead.observacoes || "-"}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={totalLeads}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </TableContainer>
    </>
  );
};

export default LeadTable;
