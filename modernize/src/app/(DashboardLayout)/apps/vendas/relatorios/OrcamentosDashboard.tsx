"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar, Box } from "@mui/material";
import { IconArrowUpRight, IconCurrencyReal } from "@tabler/icons-react";
import { differenceInDays } from "date-fns";

import DashboardCard from "../../../../components/shared/DashboardCard";
import { orcamentosData } from "./mockData";
import PeriodoSelector, { PeriodoType } from "./PeriodoSelector";

interface OrcamentosDashboardProps {
  isLoading?: boolean;
}

const OrcamentosDashboard = ({ isLoading }: OrcamentosDashboardProps) => {
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

  const filtrarDadosPorPeriodo = (
    periodo: PeriodoType,
    dataInicioParam?: Date,
    dataFimParam?: Date,
  ) => {
    const historicoFiltrado = [...orcamentosData.historicoMensal];
    let valorTotal = { ...orcamentosData.valorTotal };
    let vendasConvertidas = { ...orcamentosData.vendasConvertidas };
    let vendasSegmento = {
      labels: [...orcamentosData.vendasPorSegmento.labels],
      data: [...orcamentosData.vendasPorSegmento.data],
    };
    let valorSegmento = {
      labels: [...orcamentosData.vendaValorPorSegmento.labels],
      data: [...orcamentosData.vendaValorPorSegmento.data],
    };

    switch (periodo) {
      case "7dias":
        const fator7dias = 0.25;
        valorTotal = {
          atual: Math.round(
            orcamentosData.historicoMensal[11].valor * fator7dias,
          ),
          anterior: Math.round(
            orcamentosData.historicoMensal[10].valor * fator7dias,
          ),
          crescimento: 10.5,
        };
        vendasConvertidas = {
          total: Math.round(
            orcamentosData.vendasConvertidas.total * fator7dias,
          ),
          percentual: 62,
          anterior: Math.round(
            orcamentosData.vendasConvertidas.anterior * fator7dias,
          ),
          crescimento: 8.5,
        };

        vendasSegmento.data = [38, 22, 18, 17, 5];
        valorSegmento.data = vendasSegmento.data.map((porcentagem, index) =>
          Math.round((valorTotal.atual * porcentagem) / 100),
        );
        break;

      case "30dias":
        valorTotal = {
          atual: orcamentosData.historicoMensal[11].valor,
          anterior: orcamentosData.historicoMensal[10].valor,
          crescimento: 10,
        };
        vendasConvertidas = {
          total: Math.round(orcamentosData.vendasConvertidas.total / 12),
          percentual: 63,
          anterior: Math.round(orcamentosData.vendasConvertidas.anterior / 12),
          crescimento: 8.9,
        };
        break;

      case "90dias":
        const valor90dias = orcamentosData.historicoMensal
          .slice(9)
          .reduce((sum, item) => sum + item.valor, 0);
        valorTotal = {
          atual: valor90dias,
          anterior: orcamentosData.historicoMensal
            .slice(6, 9)
            .reduce((sum, item) => sum + item.valor, 0),
          crescimento: 12.5,
        };
        vendasConvertidas = {
          total: Math.round(orcamentosData.vendasConvertidas.total / 4),
          percentual: 64,
          anterior: Math.round(orcamentosData.vendasConvertidas.anterior / 4),
          crescimento: 9.0,
        };
        break;

      case "1ano":
        break;

      case "custom":
        if (dataInicioParam && dataFimParam) {
          const diasNoIntervalo =
            differenceInDays(dataFimParam, dataInicioParam) + 1;
          const fatorProporcional = diasNoIntervalo / 365;

          valorTotal = {
            atual: Math.round(
              orcamentosData.valorTotal.atual * fatorProporcional,
            ),
            anterior: Math.round(
              orcamentosData.valorTotal.anterior * fatorProporcional,
            ),
            crescimento: 11.2,
          };

          vendasConvertidas = {
            total: Math.round(
              orcamentosData.vendasConvertidas.total * fatorProporcional,
            ),
            percentual: 66,
            anterior: Math.round(
              orcamentosData.vendasConvertidas.anterior * fatorProporcional,
            ),
            crescimento: 9.5,
          };

          if (diasNoIntervalo <= 30) {
            vendasSegmento.data = [40, 20, 18, 17, 5];
          } else if (diasNoIntervalo <= 90) {
            vendasSegmento.data = [37, 23, 19, 16, 5];
          } else {
            vendasSegmento.data = [...orcamentosData.vendasPorSegmento.data];
          }

          valorSegmento.data = vendasSegmento.data.map((porcentagem, index) =>
            Math.round((valorTotal.atual * porcentagem) / 100),
          );
        }
        break;

      default:
        break;
    }

    return {
      vendasConvertidas,
      valorTotal,
      vendasPorSegmento: vendasSegmento,
      vendaValorPorSegmento: valorSegmento,
      historicoMensal: historicoFiltrado,
    };
  };

  const dadosFiltrados = filtrarDadosPorPeriodo(periodo, dataInicio, dataFim);

  const vendasPorSegmentoOptions: any = {
    chart: {
      type: "pie",
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
      theme.palette.info.main,
    ],
    labels: dadosFiltrados.vendasPorSegmento.labels,
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    dataLabels: {
      formatter(val: number) {
        return `${val.toFixed(1)}%`;
      },
      style: {
        fontSize: "12px",
        colors: [theme.palette.mode === "dark" ? "#fff" : "#000"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };

  const vendasPorSegmentoSeries = dadosFiltrados.vendasPorSegmento.data;

  const valorPorSegmentoOptions: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 300,
    },
    colors: [secondary],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: dadosFiltrados.vendaValorPorSegmento.labels,
    },
    yaxis: {
      title: {
        text: "Valor (R$)",
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      y: {
        formatter: function (val: number) {
          return formatarMoeda(val);
        },
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
  };

  const valorPorSegmentoSeries = [
    {
      name: "Valor de Vendas",
      data: dadosFiltrados.vendaValorPorSegmento.data,
    },
  ];

  const historicoMensalOptions: any = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 300,
      stacked: false,
    },
    colors: [primary],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      categories: dadosFiltrados.historicoMensal.map((item) => item.mes),
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      y: {
        formatter: function (val: number) {
          return formatarMoeda(val);
        },
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
  };

  const historicoMensalSeries = [
    {
      name: "Valor Mensal",
      data: dadosFiltrados.historicoMensal.map((item) => item.valor),
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

  return (
    <>
      <PeriodoSelector
        onChange={handlePeriodoChange}
        selectedPeriodo={periodo}
        dataInicio={dataInicio}
        dataFim={dataFim}
      />

      <Grid container spacing={3}>
        {/* Vendas Convertidas Card */}
        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard title="Vendas Convertidas">
            <>
              <Typography variant="h3" fontWeight="700">
                {dadosFiltrados.vendasConvertidas.total}
              </Typography>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                  <IconArrowUpRight width={20} color="#39B69A" />
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                  {dadosFiltrados.vendasConvertidas.percentual}%
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  taxa de conversão
                </Typography>
              </Stack>
            </>
          </DashboardCard>
        </Grid>

        {/* Valor Total Card */}
        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard title="Valor Total de Vendas">
            <>
              <Typography variant="h3" fontWeight="700">
                {formatarMoeda(dadosFiltrados.valorTotal.atual)}
              </Typography>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                  <IconArrowUpRight width={20} color="#39B69A" />
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                  +{dadosFiltrados.valorTotal.crescimento}%
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  vs. período anterior
                </Typography>
              </Stack>
            </>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard title="Ticket Médio">
            <>
              <Typography variant="h3" fontWeight="700">
                {formatarMoeda(
                  dadosFiltrados.valorTotal.atual /
                    dadosFiltrados.vendasConvertidas.total,
                )}
              </Typography>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: theme.palette.info.light,
                    width: 27,
                    height: 27,
                  }}
                >
                  <IconCurrencyReal
                    width={20}
                    color={theme.palette.info.main}
                  />
                </Avatar>
                <Typography variant="subtitle2" color="textSecondary">
                  por venda
                </Typography>
              </Stack>
            </>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={8}>
          <DashboardCard title="Histórico Mensal de Vendas">
            <Box height="315px">
              <Chart
                options={historicoMensalOptions}
                series={historicoMensalSeries}
                type="area"
                height={300}
                width={"100%"}
              />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard title="Vendas por Segmento">
            <Box
              height="315px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Chart
                options={vendasPorSegmentoOptions}
                series={vendasPorSegmentoSeries}
                type="pie"
                height={300}
                width={"100%"}
              />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={12}>
          <DashboardCard title="Valor de Vendas por Segmento">
            <Box height="315px">
              <Chart
                options={valorPorSegmentoOptions}
                series={valorPorSegmentoSeries}
                type="bar"
                height={300}
                width={"100%"}
              />
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </>
  );
};

export default OrcamentosDashboard;
