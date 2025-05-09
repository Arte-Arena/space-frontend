"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar, Box } from "@mui/material";
import { IconArrowUpRight, IconCurrencyReal } from "@tabler/icons-react";

import DashboardCard from "../../../../components/shared/DashboardCard";
import { orcamentosData } from "./mockData";

interface OrcamentosDashboardProps {
  isLoading?: boolean;
}

const OrcamentosDashboard = ({ isLoading }: OrcamentosDashboardProps) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const successlight = theme.palette.success.light;

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Gráfico de vendas por segmento
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
    ],
    labels: orcamentosData.vendasPorSegmento.labels,
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

  const vendasPorSegmentoSeries = orcamentosData.vendasPorSegmento.data;

  // Gráfico de valor por segmento
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
      categories: orcamentosData.vendaValorPorSegmento.labels,
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
      data: orcamentosData.vendaValorPorSegmento.data,
    },
  ];

  // Gráfico de histórico mensal
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
      categories: orcamentosData.historicoMensal.map((item) => item.mes),
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
      data: orcamentosData.historicoMensal.map((item) => item.valor),
    },
  ];

  return (
    <Grid container spacing={3}>
      {/* Vendas Convertidas Card */}
      <Grid item xs={12} sm={6} lg={4}>
        <DashboardCard title="Vendas Convertidas">
          <>
            <Typography variant="h3" fontWeight="700">
              {orcamentosData.vendasConvertidas.total}
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                <IconArrowUpRight width={20} color="#39B69A" />
              </Avatar>
              <Typography variant="subtitle2" fontWeight="600">
                {orcamentosData.vendasConvertidas.percentual}%
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
              {formatarMoeda(orcamentosData.valorTotal.atual)}
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                <IconArrowUpRight width={20} color="#39B69A" />
              </Avatar>
              <Typography variant="subtitle2" fontWeight="600">
                +{orcamentosData.valorTotal.crescimento}%
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                vs. período anterior
              </Typography>
            </Stack>
          </>
        </DashboardCard>
      </Grid>

      {/* Ticket Médio */}
      <Grid item xs={12} sm={6} lg={4}>
        <DashboardCard title="Ticket Médio">
          <>
            <Typography variant="h3" fontWeight="700">
              {formatarMoeda(
                orcamentosData.valorTotal.atual /
                  orcamentosData.vendasConvertidas.total,
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
                <IconCurrencyReal width={20} color={theme.palette.info.main} />
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                por venda
              </Typography>
            </Stack>
          </>
        </DashboardCard>
      </Grid>

      {/* Gráfico de Histórico Mensal */}
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

      {/* Gráfico de Vendas por Segmento */}
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

      {/* Gráfico de Valor por Segmento */}
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
  );
};

export default OrcamentosDashboard;
