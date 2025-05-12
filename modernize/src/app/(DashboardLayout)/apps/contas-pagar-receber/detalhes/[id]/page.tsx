"use client";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Divider,
  Paper,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  useTheme,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { usePagination } from "@mui/lab";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ParentCard from "@/app/components/shared/ParentCard";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

interface Parcela {
  data: string;
  valor: number;
  status: string;
  parcela: number;
}

interface Recorrente {
  tipo_recorrencia: string;
  intervalo: number;
  data_inicio: string;
  data_fim: string;
  max_ocorrencias: number;
  valor: string;
  status: string;
}

interface Conta {
  id: number;
  titulo: string;
  descricao: string;
  valor: string;
  data_vencimento: string;
  status: string;
  tipo: string;
  parcelas: Parcela[];
  data_pagamento: string;
  data_emissao: string;
  forma_pagamento: string;
  documento: string;
  recorrencia: string;
  fixa: boolean;
  observacoes: string;
  estoque_id?: number;
  estoque_quantidade?: string;
  recorrente?: Recorrente;
  created_at: string;
  updated_at: string;
}

export default function ContaDetalhesPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conta, setConta] = useState<Conta>({} as Conta);

  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!accessToken) {
    router.push("/auth/login");
    return null;
  }

  useEffect(() => {
    if (!id) return setLoading(false);
    setLoading(true);
    axios
      .get<Conta>(`${process.env.NEXT_PUBLIC_API}/api/conta/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setConta(res.data))
      .catch(() => setError("Erro ao carregar dados de estoque."))
      .finally(() => setLoading(false));
  }, [id, accessToken]);


  const handleAprovarPagamento = async (parcela: Parcela, data: string) => {

  }




  if (!conta || loading) {
    return (
      <PageContainer title="Detalhes da Conta">
        <Breadcrumb title="Detalhes da Conta" subtitle="Gerenciar contas" />
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
          <LinearProgress
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 9999,
            }}
          />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Erro"
        description="Erro ao carregar detalhes da conta"
      >
        <Breadcrumb title="Detalhes da Conta" subtitle="Erro" />
        <Box p={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderColor: "error.main",
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Ocorreu um Erro
            </Typography>
            <Typography>{error}</Typography>
          </Paper>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Detalhes da Conta">
      <Breadcrumb title="Detalhes da Conta" subtitle="Gerenciar contas" />
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Detalhes da Conta: {conta.titulo}
        </Typography>

        <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2 }}>
          <Tab label="Geral" />
          <Tab label="Recorrência" />
          <Tab label="Parcelas" />
          <Tab label="Estoque" />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle1">Criado em</Typography>
                <Typography>
                  {dayjs(conta.created_at).format("DD/MM/YYYY")}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Vencimento</Typography>
                <Typography>
                  {dayjs(conta.data_vencimento).format("DD/MM/YYYY")}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Valor {conta.tipo}</Typography>
                <Typography
                  sx={{
                    color:
                      conta.tipo === "a pagar"
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                  }}
                >
                  R$ {conta.valor}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Documento</Typography>
                <Typography>{conta.documento}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Forma de Pagamento</Typography>
                <Typography>{conta.forma_pagamento}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle1">Atualizado em</Typography>
                <Typography>
                  {dayjs(conta.updated_at).format("DD/MM/YYYY")}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Descrição</Typography>
                <Typography>{conta.descricao}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Status</Typography>
                <Chip
                  sx={{
                    fontSize: "0.75rem",
                    maxWidth: "fit-content", // impede que force uma largura mínima padrão
                  }}
                  size="small"
                  label={conta.status}
                  color={conta.status === "pendente" ? "warning" : "success"}
                />
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Tipo</Typography>
                <Chip
                  sx={{
                    fontSize: "0.75rem",
                    maxWidth: "fit-content", // impede que force uma largura mínima padrão
                  }}
                  size="small"
                  label={
                    conta.tipo.charAt(0).toUpperCase() + conta.tipo.slice(1)
                  }
                  color={conta.tipo === "a pagar" ? "error" : "success"}
                />
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Parcela Fixa</Typography>
                <Typography>{conta.fixa ? "Sim" : "Não"}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 1 && conta.recorrente && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">Tipo</Typography>
                <Typography>{conta.recorrente.tipo_recorrencia}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Intervalo</Typography>
                <Typography>{conta.recorrente.intervalo}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Status</Typography>
                <Typography>{conta.recorrente.status}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">Data Início</Typography>
                <Typography>
                  {dayjs(conta.recorrente.data_inicio).format("DD/MM/YYYY")}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Data Fim</Typography>
                <Typography>
                  {dayjs(conta.recorrente.data_fim).format("DD/MM/YYYY")}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Valor</Typography>
                <Typography
                  style={{
                    color:
                      conta.tipo === "a pagar"
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                  }}
                >
                  R$ {conta.recorrente.valor}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 2 && (
          <Paper sx={{ boxShadow: "0px 4px 10px rgba(100, 98, 98, 0.1)" }}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                    Parcela
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                    Data
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                    Valor
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conta.parcelas?.map((parcela) => (
                  <TableRow key={parcela.parcela}>
                    <TableCell align="center">{parcela.parcela}</TableCell>
                    <TableCell align="center">
                      {dayjs(parcela.data).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={parcela.status}
                        icon={
                          parcela.status === "Pago" ? (
                            <CheckCircle style={{ color: theme.palette.success.main }} />
                          ) : (
                            <Cancel style={{ color: theme.palette.warning.main }} />
                          )
                        }
                        sx={{
                          backgroundColor:
                            parcela.status === "Pago"
                              ? theme.palette.success.light
                              : theme.palette.error.light,
                          color:
                            parcela.status === "Pago"
                              ? theme.palette.success.contrastText
                              : theme.palette.error.contrastText,
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center"
                      sx={{
                        color:
                          parcela.status === "Não Pago"
                            ? theme.palette.error.main
                            : theme.palette.success.main,
                      }}
                    >
                      {parcela.valor ? `R$ ${parcela.valor.toFixed(2)}` : 'Valor não informado'}
                    </TableCell>
                    <TableCell align="center">
                      {parcela.status === "Não Pago" && (
                        <Button
                          onClick={() => handleAprovarPagamento(parcela, parcela.data)}
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircle fontSize="small" />}
                          sx={{
                            fontWeight: 500,
                            px: 1.5,
                            py: 0.5,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderRadius: 2,
                          }}
                        >
                          Aprovar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {tab === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6">Em manutenção!</Typography>
              {/* <Typography variant="h6">Informações de Estoque</Typography> */}
              {/* <Typography>ID do Estoque: {conta.estoque_id}</Typography>
              <Typography>Quantidade: {conta.estoque_quantidade}</Typography> */}
            </CardContent>
          </Card>
        )}
      </Box>
    </PageContainer>
  );
}
