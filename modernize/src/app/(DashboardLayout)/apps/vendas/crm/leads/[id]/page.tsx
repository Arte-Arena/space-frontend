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
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  IconButton,
  Menu,
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
  IconThumbUp,
  IconThumbDown,
  IconMessages,
  IconCategory,
  IconCurrencyReal,
  IconCalendar,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { logger } from "@/utils/logger";
import { SelectChangeEvent } from "@mui/material/Select";

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
  orcamentos?: Array<{
    id: string;
    valor: number;
    dataCriacao: string;
    status: "aprovado" | "pendente" | "perdido";
  }>;
  orcamento_id?: string;
  orcamento_status?: "aprovado" | "pendente" | null;
  qualificacao?: "bom" | "ruim" | null;
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
}

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
    qualificacao: "bom",
    seguimento: "atletica_interclasse",
    orcamento_id: "ORÇ-2023-001",
    orcamento_status: "pendente",
    orcamentos: [
      {
        id: "ORÇ-2023-001",
        valor: 2500.0,
        dataCriacao: "2023-06-16T14:30:00",
        status: "pendente",
      },
      {
        id: "ORÇ-2023-015",
        valor: 1800.5,
        dataCriacao: "2023-07-05T09:15:00",
        status: "perdido",
      },
      {
        id: "ORÇ-2023-032",
        valor: 3200.75,
        dataCriacao: "2023-08-12T16:45:00",
        status: "aprovado",
      },
    ],
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
    qualificacao: "ruim",
    seguimento: "times",
    orcamento_id: "ORÇ-2023-045",
    orcamento_status: "aprovado",
    orcamentos: [
      {
        id: "ORÇ-2023-045",
        valor: 15750.0,
        dataCriacao: "2023-07-22T10:30:00",
        status: "aprovado",
      },
      {
        id: "ORÇ-2023-046",
        valor: 12800.0,
        dataCriacao: "2023-07-22T10:35:00",
        status: "pendente",
      },
    ],
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
  const [qualificacao, setQualificacao] = useState<"bom" | "ruim" | null>(null);
  const [seguimento, setSeguimento] = useState<
    | "atletica_interclasse"
    | "times"
    | "pessoa_juridica"
    | "agencias_marketing"
    | "outros"
    | null
  >(null);

  useEffect(() => {
    if (!leadId || leadId === "undefined") {
      setIsValidId(false);
      setIsLoading(false);
      return;
    }

    const loadMockData = () => {
      setIsLoading(true);

      setTimeout(() => {
        const mockLead = mockLeadData[leadId] || mockLeadData["123456"];

        if (mockLead) {
          setLead(mockLead);
          setQualificacao(mockLead.qualificacao || null);
          setSeguimento(mockLead.seguimento || null);
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

  const handleQualificacaoChange = (
    _event: React.MouseEvent<HTMLElement>,
    newQualificacao: "bom" | "ruim" | null,
  ) => {
    if (newQualificacao !== null) {
      setQualificacao(newQualificacao);
      if (lead) {
        setLead({ ...lead, qualificacao: newQualificacao });
      }
    }
  };

  const handleSeguimentoChange = (event: SelectChangeEvent) => {
    const newSeguimento = event.target.value as
      | "atletica_interclasse"
      | "times"
      | "pessoa_juridica"
      | "agencias_marketing"
      | "outros"
      | null;
    setSeguimento(newSeguimento);
    if (lead) {
      setLead({ ...lead, seguimento: newSeguimento });
    }
  };

  const handleOpenOctaChat = () => {
    if (lead?.idOcta) {
      window.open(`https://app.octadesk.com/chat/${lead.idOcta}`, "_blank");
    }
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
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

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  {/* ID do Lead */}
                  <Typography variant="body2" color="text.secondary">
                    ID: {lead.id}
                  </Typography>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ mx: 1, height: 20 }}
                  />

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 1 }}
                    >
                      Classificação:
                    </Typography>
                    <ToggleButtonGroup
                      value={qualificacao}
                      exclusive
                      onChange={handleQualificacaoChange}
                      aria-label="qualificação do cliente"
                      size="small"
                    >
                      <ToggleButton
                        value="bom"
                        aria-label="bom cliente"
                        sx={{
                          py: 0.5,
                          "&.Mui-selected": {
                            bgcolor: "success.light",
                            color: "success.dark",
                            "&:hover": { bgcolor: "success.light" },
                          },
                        }}
                      >
                        <IconThumbUp size={18} />
                      </ToggleButton>
                      <ToggleButton
                        value="ruim"
                        aria-label="cliente ruim"
                        sx={{
                          py: 0.5,
                          "&.Mui-selected": {
                            bgcolor: "error.light",
                            color: "error.dark",
                            "&:hover": { bgcolor: "error.light" },
                          },
                        }}
                      >
                        <IconThumbDown size={18} />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ mx: 1, height: 20 }}
                  />

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 1 }}
                    >
                      Seguimento:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select
                        value={seguimento || ""}
                        onChange={handleSeguimentoChange}
                        displayEmpty
                        variant="outlined"
                        sx={{ height: 32 }}
                      >
                        <MenuItem value="">
                          <em>Selecionar</em>
                        </MenuItem>
                        <MenuItem value="atletica_interclasse">
                          Atlética/Interclasse
                        </MenuItem>
                        <MenuItem value="times">Times</MenuItem>
                        <MenuItem value="pessoa_juridica">
                          Pessoa Jurídica
                        </MenuItem>
                        <MenuItem value="agencias_marketing">
                          Agências/Marketing
                        </MenuItem>
                        <MenuItem value="outros">Outros</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {lead.idOcta && (
                    <>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ mx: 1, height: 20 }}
                      />

                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<IconMessages size={16} />}
                        onClick={handleOpenOctaChat}
                        sx={{ height: 32 }}
                      >
                        Chat
                      </Button>
                    </>
                  )}
                </Box>
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

          {lead.orcamentos && lead.orcamentos.length > 0 && (
            <Paper elevation={1} sx={{ p: 4, mb: 3 }}>
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
                  <IconFileInvoice size={18} style={{ marginRight: 8 }} />
                  Orçamentos
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {lead.orcamentos.map((orcamento) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={orcamento.id}>
                      <Card
                        elevation={1}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle2" component="div">
                              {orcamento.id}
                            </Typography>
                            <Chip
                              label={
                                orcamento.status === "aprovado"
                                  ? "Aprovado"
                                  : orcamento.status === "perdido"
                                    ? "Perdido"
                                    : "Pendente"
                              }
                              size="small"
                              color={
                                orcamento.status === "aprovado"
                                  ? "success"
                                  : orcamento.status === "perdido"
                                    ? "error"
                                    : "warning"
                              }
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <IconCurrencyReal
                              size={16}
                              style={{ marginRight: 6, opacity: 0.7 }}
                            />
                            <Typography
                              variant="body1"
                              component="div"
                              sx={{ fontWeight: "medium" }}
                            >
                              {orcamento.valor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconCalendar
                              size={16}
                              style={{ marginRight: 6, opacity: 0.7 }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {format(
                                new Date(orcamento.dataCriacao),
                                "dd/MM/yyyy",
                                {
                                  locale: ptBR,
                                },
                              )}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ p: 1, pt: 0 }}>
                          <Button
                            size="small"
                            variant="text"
                            fullWidth
                            startIcon={<IconFileInvoice size={14} />}
                            onClick={() =>
                              handleNavigateToOrcamento(orcamento.id)
                            }
                          >
                            Ver detalhes
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
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
