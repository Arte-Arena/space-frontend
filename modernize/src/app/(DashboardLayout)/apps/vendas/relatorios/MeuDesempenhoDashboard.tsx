"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Stack,
  Typography,
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  IconArrowUpRight,
  IconCurrencyReal,
  IconUserCheck,
  IconEye,
} from "@tabler/icons-react";
import { differenceInDays, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

import DashboardCard from "../../../../components/shared/DashboardCard";
import { desempenhoData } from "./mockData";
import PeriodoSelector, { PeriodoType } from "./PeriodoSelector";

interface MeuDesempenhoDashboardProps {
  isLoading?: boolean;
}

interface Orcamento {
  id: string;
  cliente: string;
  valor: number;
  data: string;
  status: string;
}

const MeuDesempenhoDashboard = ({ isLoading }: MeuDesempenhoDashboardProps) => {
  const [periodo, setPeriodo] = useState<PeriodoType>("todos");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const successlight = theme.palette.success.light;
  const infolight = theme.palette.info.light;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (dataString: string) => {
    try {
      const data = parseISO(dataString);
      return format(data, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return {
          color: theme.palette.success.main,
          bgColor: theme.palette.success.light,
        };
      case "Em análise":
        return {
          color: theme.palette.info.main,
          bgColor: theme.palette.info.light,
        };
      case "Aguardando cliente":
        return {
          color: theme.palette.warning.main,
          bgColor: theme.palette.warning.light,
        };
      case "Cancelado":
        return {
          color: theme.palette.error.main,
          bgColor: theme.palette.error.light,
        };
      default:
        return {
          color: theme.palette.secondary.main,
          bgColor: theme.palette.secondary.light,
        };
    }
  };

  const filtrarDadosPorPeriodo = (
    periodo: PeriodoType,
    dataInicioParam?: Date,
    dataFimParam?: Date,
  ) => {
    let vendasPessoais = { ...desempenhoData.vendasPessoais };
    let valorTotalPessoal = { ...desempenhoData.valorTotalPessoal };
    let taxaConversaoPessoal = { ...desempenhoData.taxaConversaoPessoal };
    let orcamentosPorStatus = {
      labels: [...desempenhoData.orcamentosPorStatus.labels],
      data: [...desempenhoData.orcamentosPorStatus.data],
    };
    let meusOrcamentos = [...desempenhoData.meusOrcamentos];
    const historicoMensal = [...desempenhoData.historicoMensal];

    if (periodo !== "todos") {
      const hoje = new Date();
      let dataLimite: Date;

      switch (periodo) {
        case "7dias":
          dataLimite = new Date(hoje);
          dataLimite.setDate(hoje.getDate() - 7);
          meusOrcamentos = meusOrcamentos.filter((orc) => {
            const dataOrc = parseISO(orc.data);
            return dataOrc >= dataLimite;
          });
          break;
        case "30dias":
          dataLimite = new Date(hoje);
          dataLimite.setDate(hoje.getDate() - 30);
          meusOrcamentos = meusOrcamentos.filter((orc) => {
            const dataOrc = parseISO(orc.data);
            return dataOrc >= dataLimite;
          });
          break;
        case "90dias":
          dataLimite = new Date(hoje);
          dataLimite.setDate(hoje.getDate() - 90);
          meusOrcamentos = meusOrcamentos.filter((orc) => {
            const dataOrc = parseISO(orc.data);
            return dataOrc >= dataLimite;
          });
          break;
        case "custom":
          if (dataInicioParam && dataFimParam) {
            meusOrcamentos = meusOrcamentos.filter((orc) => {
              const dataOrc = parseISO(orc.data);
              return dataOrc >= dataInicioParam && dataOrc <= dataFimParam;
            });
          }
          break;
        default:
          break;
      }
    }

    switch (periodo) {
      case "7dias":
        const fator7dias = 0.25;
        vendasPessoais = {
          total: Math.round(desempenhoData.vendasPessoais.total * fator7dias),
          percentual: 72.5,
          anterior: Math.round(
            desempenhoData.vendasPessoais.anterior * fator7dias,
          ),
          crescimento: 14.0,
        };
        valorTotalPessoal = {
          atual: Math.round(
            desempenhoData.valorTotalPessoal.atual * fator7dias,
          ),
          anterior: Math.round(
            desempenhoData.valorTotalPessoal.anterior * fator7dias,
          ),
          crescimento: 14.5,
        };
        taxaConversaoPessoal = {
          atual: 70,
          anterior: 63,
          crescimento: 11.1,
        };
        orcamentosPorStatus.data = [45, 25, 20, 10];
        break;

      case "30dias":
        vendasPessoais = {
          total: Math.round(desempenhoData.vendasPessoais.total / 12),
          percentual: 71.2,
          anterior: Math.round(desempenhoData.vendasPessoais.anterior / 12),
          crescimento: 13.5,
        };
        valorTotalPessoal = {
          atual: Math.round(desempenhoData.valorTotalPessoal.atual / 12),
          anterior: Math.round(desempenhoData.valorTotalPessoal.anterior / 12),
          crescimento: 13.8,
        };
        taxaConversaoPessoal = {
          atual: 69,
          anterior: 63,
          crescimento: 9.5,
        };
        break;

      case "90dias":
        const fator90dias = 0.25;
        vendasPessoais = {
          total: Math.round((desempenhoData.vendasPessoais.total * 3) / 12),
          percentual: 70.5,
          anterior: Math.round(
            (desempenhoData.vendasPessoais.anterior * 3) / 12,
          ),
          crescimento: 13.0,
        };
        valorTotalPessoal = {
          atual: Math.round((desempenhoData.valorTotalPessoal.atual * 3) / 12),
          anterior: Math.round(
            (desempenhoData.valorTotalPessoal.anterior * 3) / 12,
          ),
          crescimento: 13.2,
        };
        taxaConversaoPessoal = {
          atual: 68.5,
          anterior: 62.5,
          crescimento: 9.6,
        };
        break;

      case "1ano":
        break;

      case "custom":
        if (dataInicioParam && dataFimParam) {
          const diasNoIntervalo =
            differenceInDays(dataFimParam, dataInicioParam) + 1;
          const fatorProporcional = diasNoIntervalo / 365;

          vendasPessoais = {
            total: Math.round(
              desempenhoData.vendasPessoais.total * fatorProporcional,
            ),
            percentual: 70.8,
            anterior: Math.round(
              desempenhoData.vendasPessoais.anterior * fatorProporcional,
            ),
            crescimento: 13.3,
          };
          valorTotalPessoal = {
            atual: Math.round(
              desempenhoData.valorTotalPessoal.atual * fatorProporcional,
            ),
            anterior: Math.round(
              desempenhoData.valorTotalPessoal.anterior * fatorProporcional,
            ),
            crescimento: 13.4,
          };
          taxaConversaoPessoal = {
            atual: 68,
            anterior: 62,
            crescimento: 9.7,
          };

          if (diasNoIntervalo <= 30) {
            orcamentosPorStatus.data = [45, 25, 20, 10];
          } else if (diasNoIntervalo <= 90) {
            orcamentosPorStatus.data = [43, 27, 19, 11];
          }
        }
        break;

      default:
        break;
    }

    return {
      vendasPessoais,
      valorTotalPessoal,
      taxaConversaoPessoal,
      orcamentosPorStatus,
      meusOrcamentos,
      historicoMensal,
    };
  };

  const dadosFiltrados = filtrarDadosPorPeriodo(periodo, dataInicio, dataFim);

  const orcamentosPorStatusOptions: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
    },
    colors: [
      primary,
      secondary,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    labels: dadosFiltrados.orcamentosPorStatus.labels,
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
      formatter: function (val: number) {
        return `${val.toFixed(1)}%`;
      },
    },
  };

  const orcamentosPorStatusSeries = dadosFiltrados.orcamentosPorStatus.data;

  const historicoOptions: any = {
    chart: {
      type: "line",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 300,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: [3, 3],
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: dadosFiltrados.historicoMensal.map((item) => item.mes),
    },
    yaxis: [
      {
        title: {
          text: "Valor (R$)",
        },
        min: 0,
      },
      {
        opposite: true,
        title: {
          text: "Orçamentos",
        },
        min: 0,
      },
    ],
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      y: [
        {
          formatter: function (val: number) {
            return formatarMoeda(val);
          },
        },
        {
          formatter: function (val: number) {
            return val + " orçamentos";
          },
        },
      ],
    },
    legend: {
      show: true,
      position: "bottom",
    },
  };

  const historicoSeries = [
    {
      name: "Valor Total",
      type: "line",
      data: dadosFiltrados.historicoMensal.map((item) => item.valor),
    },
    {
      name: "Quantidade de Orçamentos",
      type: "line",
      data: dadosFiltrados.historicoMensal.map((item) => item.orcamentos),
    },
  ];

  const handlePeriodoChange = (
    novoPeriodo: PeriodoType,
    novaDataInicio?: Date,
    novaDataFim?: Date,
  ) => {
    setPeriodo(novoPeriodo);
    setDataInicio(novaDataInicio);
    setDataFim(novaDataFim);
  };

  const renderHistoricoChart = () => {
    if (typeof window === "undefined") {
      return <></>;
    }
    return (
      <Chart
        options={historicoOptions}
        series={historicoSeries}
        type="line"
        height={380}
      />
    );
  };

  const renderOrcamentosStatusChart = () => {
    if (typeof window === "undefined") {
      return <></>;
    }
    return (
      <Chart
        options={orcamentosPorStatusOptions}
        series={orcamentosPorStatusSeries}
        type="donut"
        height={380}
      />
    );
  };

  return (
    <Box>
      <PeriodoSelector
        onChange={handlePeriodoChange}
        selectedPeriodo={periodo}
        dataInicio={dataInicio}
        dataFim={dataFim}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            title="Meus Orçamentos"
            subtitle="Total de orçamentos realizados"
            action={
              <IconUserCheck width={20} color={theme.palette.primary.main} />
            }
          >
            <>
              <Box
                sx={{
                  mt: 2.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" fontWeight="700">
                  {dadosFiltrados.vendasPessoais.total}
                </Typography>
                <Box
                  sx={{
                    ml: 1,
                    p: 0.5,
                    borderRadius: 1,
                    bgcolor: successlight,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconArrowUpRight
                    width={18}
                    color={theme.palette.success.main}
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    color="success.main"
                  >
                    {dadosFiltrados.vendasPessoais.crescimento}%
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Typography variant="subtitle2" fontWeight="600">
                  {dadosFiltrados.vendasPessoais.percentual}% do total
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  vs {dadosFiltrados.vendasPessoais.anterior} anteriores
                </Typography>
              </Stack>
            </>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            title="Valor Total"
            subtitle="Valor dos orçamentos realizados"
            action={
              <IconCurrencyReal width={20} color={theme.palette.primary.main} />
            }
          >
            <>
              <Box
                sx={{
                  mt: 2.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" fontWeight="700">
                  {formatarMoeda(dadosFiltrados.valorTotalPessoal.atual)}
                </Typography>
                <Box
                  sx={{
                    ml: 1,
                    p: 0.5,
                    borderRadius: 1,
                    bgcolor: successlight,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconArrowUpRight
                    width={18}
                    color={theme.palette.success.main}
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    color="success.main"
                  >
                    {dadosFiltrados.valorTotalPessoal.crescimento}%
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                  vs {formatarMoeda(dadosFiltrados.valorTotalPessoal.anterior)}{" "}
                  anteriores
                </Typography>
              </Stack>
            </>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            title="Taxa de Conversão"
            subtitle="Orçamentos aprovados"
            action={
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: infolight,
                  color: secondary,
                }}
              >
                %
              </Avatar>
            }
          >
            <>
              <Box
                sx={{
                  mt: 2.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" fontWeight="700">
                  {dadosFiltrados.taxaConversaoPessoal.atual}%
                </Typography>
                <Box
                  sx={{
                    ml: 1,
                    p: 0.5,
                    borderRadius: 1,
                    bgcolor: successlight,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconArrowUpRight
                    width={18}
                    color={theme.palette.success.main}
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    color="success.main"
                  >
                    {dadosFiltrados.taxaConversaoPessoal.crescimento}%
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                  vs {dadosFiltrados.taxaConversaoPessoal.anterior}% anteriores
                </Typography>
              </Stack>
            </>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={8}>
          <DashboardCard title="Histórico de Desempenho">
            {renderHistoricoChart()}
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <DashboardCard title="Status dos Orçamentos">
            {renderOrcamentosStatusChart()}
          </DashboardCard>
        </Grid>

        <Grid item xs={12}>
          <DashboardCard title="Meus Orçamentos">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dadosFiltrados.meusOrcamentos.map((orcamento) => {
                    const statusColor = getStatusColor(orcamento.status);
                    return (
                      <TableRow key={orcamento.id}>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="600">
                            {orcamento.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{orcamento.cliente}</TableCell>
                        <TableCell>{formatarData(orcamento.data)}</TableCell>
                        <TableCell align="right">
                          {formatarMoeda(orcamento.valor)}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={orcamento.status}
                            size="small"
                            sx={{
                              color: statusColor.color,
                              bgcolor: statusColor.bgColor,
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalhes do orçamento">
                            <Link
                              href={`/apps/vendas/orcamentos/${orcamento.id}`}
                              passHref
                            >
                              <IconButton
                                color="primary"
                                size="small"
                                aria-label="ver orçamento"
                              >
                                <IconEye size={18} />
                              </IconButton>
                            </Link>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MeuDesempenhoDashboard;
