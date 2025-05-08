"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import {
  IconArrowLeft,
  IconAlertCircle,
  IconUser,
  IconMail,
  IconPhone,
  IconMap,
  IconNotes,
  IconInfoCircle,
  IconFileInvoice,
  IconExternalLink,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { logger } from "@/utils/logger";

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
}

// Mock data para exemplificar a interface até que a API esteja pronta
const mockLeadData: Record<string, Lead> = {
  "123456": {
    id: "123456",
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    cpfCnpj: "123.456.789-00",
    dataCriacao: "2023-06-15T10:30:00",
    status: "Em andamento",
    jaCadastrado: true,
    origem: "Site",
    idOcta: "123456",
    orcamento_id: "ORÇ-2023-001",
    orcamento_status: "pendente",
    endereco: {
      rua: "Avenida Paulista",
      numero: "1000",
      complemento: "Apto 123",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
    },
    observacoes:
      "Cliente interessado em uniformes para sua empresa de tecnologia. Solicitou amostras de tecido e catálogo completo.",
    client_info: {
      client_id: "CLI-123",
      client_name: "João Silva",
      client_email: "joao.silva@email.com",
      has_uniform: false,
      contact: {
        person_type: "F",
        identity_card: "12.345.678-9",
        cpf: "123.456.789-00",
        cell_phone: "(11) 98765-4321",
        zip_code: "01310-100",
        address: "Avenida Paulista",
        number: "1000",
        complement: "Apto 123",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        company_name: "",
        cnpj: "",
        state_registration: "",
      },
    },
  },
  "789012": {
    id: "789012",
    nome: "Empresa ABC Ltda",
    email: "contato@empresaabc.com.br",
    telefone: "(11) 3456-7890",
    cpfCnpj: "12.345.678/0001-90",
    dataCriacao: "2023-07-20T14:15:00",
    status: "Aprovado",
    jaCadastrado: true,
    origem: "Indicação",
    idOcta: "789012",
    orcamento_id: "ORÇ-2023-045",
    orcamento_status: "aprovado",
    endereco: {
      rua: "Rua da Indústria",
      numero: "500",
      complemento: "Galpão 3",
      bairro: "Distrito Industrial",
      cidade: "Campinas",
      estado: "SP",
      cep: "13087-535",
    },
    client_info: {
      client_id: "CLI-456",
      client_name: "Empresa ABC Ltda",
      client_email: "contato@empresaabc.com.br",
      has_uniform: true,
      contact: {
        person_type: "J",
        identity_card: "",
        cpf: "",
        cell_phone: "(11) 99123-4567",
        zip_code: "13087-535",
        address: "Rua da Indústria",
        number: "500",
        complement: "Galpão 3",
        neighborhood: "Distrito Industrial",
        city: "Campinas",
        state: "SP",
        company_name: "Empresa ABC Ltda",
        cnpj: "12.345.678/0001-90",
        state_registration: "123.456.789.000",
      },
    },
  },
  "987654": {
    id: "987654",
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    telefone: "(21) 99876-5432",
    dataCriacao: "2023-08-05T09:45:00",
    status: "Novo",
    jaCadastrado: false,
    origem: "Formulário de Contato",
    idOcta: "987654",
  },
};

function LeadDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;
  const [isValidId, setIsValidId] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId || leadId === "undefined") {
      setIsValidId(false);
      setIsLoading(false);
      return;
    }

    // Simular carregamento para demonstrar o estado de loading
    const loadMockData = () => {
      setIsLoading(true);

      // Simular um delay de rede
      setTimeout(() => {
        // Tentar encontrar os dados mock para o ID fornecido
        const mockLead = mockLeadData[leadId] || mockLeadData["123456"]; // Fallback para um lead default

        if (mockLead) {
          setLead(mockLead);
        } else {
          setError("Lead não encontrado");
          setIsValidId(false);
        }

        setIsLoading(false);
      }, 1000);
    };

    loadMockData();
  }, [leadId]);

  const handleNavigateToOrcamento = (orcamentoId: string) => {
    router.push(`/apps/orcamento/${orcamentoId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "novo":
        return { bg: "info.light", color: "info.main" };
      case "em andamento":
        return { bg: "warning.light", color: "warning.main" };
      case "aprovado":
        return { bg: "success.light", color: "success.main" };
      case "convertido":
        return { bg: "primary.light", color: "primary.main" };
      case "perdido":
        return { bg: "error.light", color: "error.main" };
      default:
        return { bg: "secondary.light", color: "secondary.main" };
    }
  };

  return (
    <PageContainer
      title={`Lead: ${lead?.nome || (isValidId ? leadId : "Não encontrado")}`}
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

      {!isValidId || error ? (
        <Alert severity="error" icon={<IconAlertCircle />} sx={{ mb: 3 }}>
          {error || "ID do lead inválido ou não encontrado."}
        </Alert>
      ) : isLoading ? (
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
              Carregando detalhes do lead...
            </Typography>
          </Box>
        </Paper>
      ) : lead ? (
        <Box>
          <Paper elevation={1} sx={{ p: 4, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  {lead.nome}
                  {lead.jaCadastrado && (
                    <Chip
                      label="Já cadastrado"
                      size="small"
                      color="warning"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  ID: {lead.id}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
                <Chip
                  label={lead.status}
                  sx={{
                    bgcolor: (theme) => getStatusColor(lead.status).bg,
                    color: (theme) => getStatusColor(lead.status).color,
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    py: 0.5,
                    px: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Criado em:{" "}
                  {lead.dataCriacao
                    ? format(new Date(lead.dataCriacao), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {lead.orcamento_id && (
            <Paper elevation={1} sx={{ p: 4, mb: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
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
                  <IconFileInvoice size={18} style={{ marginRight: 8 }} />
                  Orçamento disponível
                </Typography>
                <Divider sx={{ mb: 2, width: "100%" }} />
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Este lead possui um orçamento disponível. Você pode acessá-lo
                  para mais detalhes.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<IconFileInvoice size={18} />}
                  onClick={() => handleNavigateToOrcamento(lead.orcamento_id!)}
                >
                  Ver orçamento
                </Button>
              </Box>
            </Paper>
          )}

          <Grid container spacing={3}>
            {!lead.client_info && !lead.endereco && !lead.observacoes && (
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 4 }}>
                  <Box
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
                      <Typography variant="h6" color="text.primary">
                        Não há informações detalhadas disponíveis
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Este lead possui apenas informações básicas. Dados
                        adicionais como contato completo, endereço e observações
                        não foram cadastrados.
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}

            {lead.client_info && (
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 4, height: "100%" }}>
                  <Box
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
                      <IconUser size={18} style={{ marginRight: 8 }} />
                      Informações do Cliente
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nome
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1.5 }}>
                        {lead.client_info.client_name || "-"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
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
                            <IconPhone size={18} style={{ marginRight: 8 }} />
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
                                  lead.client_info.contact.person_type === "F"
                                    ? "Pessoa Física"
                                    : "Pessoa Jurídica"
                                }
                                size="small"
                                color={
                                  lead.client_info.contact.person_type === "F"
                                    ? "primary"
                                    : "secondary"
                                }
                                sx={{ mt: 0.5, mb: 1.5 }}
                              />
                            </Grid>

                            {lead.client_info.contact.person_type === "F" && (
                              <>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    RG
                                  </Typography>
                                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                                    {lead.client_info.contact.identity_card ||
                                      "-"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    CPF
                                  </Typography>
                                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                                    {lead.client_info.contact.cpf || "-"}
                                  </Typography>
                                </Grid>
                              </>
                            )}

                            {lead.client_info.contact.person_type === "J" && (
                              <>
                                <Grid item xs={12}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Razão Social
                                  </Typography>
                                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                                    {lead.client_info.contact.company_name ||
                                      "-"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    CNPJ
                                  </Typography>
                                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                                    {lead.client_info.contact.cnpj || "-"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Inscrição Estadual
                                  </Typography>
                                  <Typography variant="body1" sx={{ mb: 1.5 }}>
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
                                {lead.client_info.contact.cell_phone || "-"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}

            {lead.endereco && (
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 4, height: "100%" }}>
                  <Box
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
                      <IconMap size={18} style={{ marginRight: 8 }} />
                      Endereço
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mt: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={9}>
                          <Typography variant="body2" color="text.secondary">
                            Rua
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {lead.endereco?.rua || "-"}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2" color="text.secondary">
                            Número
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {lead.endereco?.numero || "-"}
                          </Typography>
                        </Grid>

                        {lead.endereco?.complemento && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              Complemento
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1.5 }}>
                              {lead.endereco?.complemento}
                            </Typography>
                          </Grid>
                        )}

                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Bairro
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {lead.endereco?.bairro || "-"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            CEP
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {lead.endereco?.cep || "-"}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Cidade
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {lead.endereco?.cidade || "-"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Estado
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {lead.endereco?.estado || "-"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}

            {lead.observacoes && (
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 4 }}>
                  <Box
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
                      <IconNotes size={18} style={{ marginRight: 8 }} />
                      Observações
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">{lead.observacoes}</Typography>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      ) : (
        <Alert severity="error" icon={<IconAlertCircle />} sx={{ mb: 3 }}>
          Não foi possível carregar os detalhes do lead.
        </Alert>
      )}
    </PageContainer>
  );
}

export default LeadDetailsPage;
