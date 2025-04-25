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
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  IconChevronDown,
  IconChevronUp,
  IconUser,
  IconMail,
  IconPhone,
  IconMap,
  IconNotes,
  IconInfoCircle,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Lead {
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
}

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalLeads: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFiltered: boolean;
}

type StatusColor = "success" | "warning" | "primary" | "error" | "secondary" | "info";

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
  isFiltered,
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
        return { bg: "info", color: "info" };
      case "em andamento":
        return { bg: "warning", color: "warning" };
      case "aprovado":
        return { bg: "success", color: "success" };
      case "convertido":
        return { bg: "primary", color: "primary" };
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
      <Paper
        elevation={1}
        sx={{
          p: 4,
          textAlign: "center",
          minHeight: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary">
            Carregando leads...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (!isLoading && (!leads || leads.length === 0)) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1">
          {isFiltered
            ? "Nenhum lead encontrado com os critérios de busca especificados."
            : "Nenhum lead encontrado."}
        </Typography>
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
                        <Typography
                          variant="h6"
                          gutterBottom
                          component="div"
                          sx={{
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            pb: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <IconUser size={20} style={{ marginRight: 8 }} />
                          Detalhes do Lead
                        </Typography>

                        <Grid container spacing={3} sx={{ mt: 0.5 }}>
                          {!lead.client_info &&
                            !lead.endereco &&
                            !lead.observacoes && (
                              <Grid item xs={12}>
                                <Paper
                                  elevation={0}
                                  variant="outlined"
                                  sx={{
                                    p: 4,
                                    borderRadius: 2,
                                    backgroundColor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "rgba(0, 0, 0, 0.02)",
                                    textAlign: "center",
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
                                    <IconInfoCircle size={40} color="#1976d2" />
                                    <Typography
                                      variant="h6"
                                      color="text.primary"
                                    >
                                      Não há informações detalhadas disponíveis
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                    >
                                      Este lead possui apenas informações
                                      básicas. Dados adicionais como contato
                                      completo, endereço e observações não foram
                                      cadastrados.
                                    </Typography>
                                  </Box>
                                </Paper>
                              </Grid>
                            )}
                          {lead.client_info && (
                            <Grid item xs={12} md={6}>
                              <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  height: "100%",
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "rgba(255, 255, 255, 0.05)"
                                      : "rgba(0, 0, 0, 0.02)",
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  gutterBottom
                                  sx={{
                                    color: "primary.main",
                                    fontWeight: "medium",
                                    display: "flex",
                                    alignItems: "center",
                                    pb: 1,
                                  }}
                                >
                                  <IconUser
                                    size={18}
                                    style={{ marginRight: 8 }}
                                  />
                                  Informações do Cliente
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ mt: 1 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Nome
                                  </Typography>
                                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                                    {lead.client_info.client_name || "-"}
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Email
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      mb: 1.5,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <IconMail
                                      size={16}
                                      style={{ marginRight: 6, opacity: 0.7 }}
                                    />
                                    {lead.client_info.client_email || "-"}
                                  </Typography>

                                  {lead.client_info.contact && (
                                    <>
                                      <Divider sx={{ my: 2 }} />
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontWeight: "medium",
                                          mb: 1.5,
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <IconPhone
                                          size={18}
                                          style={{ marginRight: 8 }}
                                        />
                                        Informações de Contato
                                      </Typography>

                                      <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            Tipo de Pessoa
                                          </Typography>
                                          <Chip
                                            label={
                                              lead.client_info.contact
                                                .person_type === "F"
                                                ? "Pessoa Física"
                                                : "Pessoa Jurídica"
                                            }
                                            size="small"
                                            color={
                                              lead.client_info.contact
                                                .person_type === "F"
                                                ? "primary"
                                                : "secondary"
                                            }
                                            sx={{ mt: 0.5, mb: 1.5 }}
                                          />
                                        </Grid>

                                        {lead.client_info.contact
                                          .person_type === "F" && (
                                          <>
                                            <Grid item xs={6}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                RG
                                              </Typography>
                                              <Typography
                                                variant="body1"
                                                sx={{ mb: 1.5 }}
                                              >
                                                {lead.client_info.contact
                                                  .identity_card || "-"}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                CPF
                                              </Typography>
                                              <Typography
                                                variant="body1"
                                                sx={{ mb: 1.5 }}
                                              >
                                                {lead.client_info.contact.cpf ||
                                                  "-"}
                                              </Typography>
                                            </Grid>
                                          </>
                                        )}

                                        {lead.client_info.contact
                                          .person_type === "J" && (
                                          <>
                                            <Grid item xs={12}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                Razão Social
                                              </Typography>
                                              <Typography
                                                variant="body1"
                                                sx={{ mb: 1.5 }}
                                              >
                                                {lead.client_info.contact
                                                  .company_name || "-"}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                CNPJ
                                              </Typography>
                                              <Typography
                                                variant="body1"
                                                sx={{ mb: 1.5 }}
                                              >
                                                {lead.client_info.contact
                                                  .cnpj || "-"}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                Inscrição Estadual
                                              </Typography>
                                              <Typography
                                                variant="body1"
                                                sx={{ mb: 1.5 }}
                                              >
                                                {lead.client_info.contact
                                                  .state_registration || "-"}
                                              </Typography>
                                            </Grid>
                                          </>
                                        )}

                                        <Grid item xs={12}>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            Celular
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{
                                              mb: 1,
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <IconPhone
                                              size={16}
                                              style={{
                                                marginRight: 6,
                                                opacity: 0.7,
                                              }}
                                            />
                                            {lead.client_info.contact
                                              .cell_phone || "-"}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </>
                                  )}
                                </Box>
                              </Paper>
                            </Grid>
                          )}

                          {lead.endereco && (
                            <Grid item xs={12} md={6}>
                              <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  height: "100%",
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "rgba(255, 255, 255, 0.05)"
                                      : "rgba(0, 0, 0, 0.02)",
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  gutterBottom
                                  sx={{
                                    color: "primary.main",
                                    fontWeight: "medium",
                                    display: "flex",
                                    alignItems: "center",
                                    pb: 1,
                                  }}
                                >
                                  <IconMap
                                    size={18}
                                    style={{ marginRight: 8 }}
                                  />
                                  Endereço
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ mt: 1 }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={9}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Rua
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ mb: 1.5 }}
                                      >
                                        {lead.endereco?.rua || "-"}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Número
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ mb: 1.5 }}
                                      >
                                        {lead.endereco?.numero || "-"}
                                      </Typography>
                                    </Grid>

                                    {lead.endereco?.complemento && (
                                      <Grid item xs={12}>
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          Complemento
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          sx={{ mb: 1.5 }}
                                        >
                                          {lead.endereco?.complemento}
                                        </Typography>
                                      </Grid>
                                    )}

                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Bairro
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ mb: 1.5 }}
                                      >
                                        {lead.endereco?.bairro || "-"}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        CEP
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ mb: 1.5 }}
                                      >
                                        {lead.endereco?.cep || "-"}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Cidade
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ mb: 1.5 }}
                                      >
                                        {lead.endereco?.cidade || "-"}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Estado
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ mb: 1.5 }}
                                      >
                                        {lead.endereco?.estado || "-"}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Paper>
                            </Grid>
                          )}

                          {lead.observacoes && (
                            <Grid item xs={12}>
                              <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "rgba(255, 255, 255, 0.05)"
                                      : "rgba(0, 0, 0, 0.02)",
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  gutterBottom
                                  sx={{
                                    color: "primary.main",
                                    fontWeight: "medium",
                                    display: "flex",
                                    alignItems: "center",
                                    pb: 1,
                                  }}
                                >
                                  <IconNotes
                                    size={18}
                                    style={{ marginRight: 8 }}
                                  />
                                  Observações
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body1">
                                  {lead.observacoes || "-"}
                                </Typography>
                              </Paper>
                            </Grid>
                          )}
                        </Grid>
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
