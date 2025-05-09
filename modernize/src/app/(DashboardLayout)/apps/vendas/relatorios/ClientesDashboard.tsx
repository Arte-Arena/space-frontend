"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar, Box } from "@mui/material";
import { IconArrowUpRight } from "@tabler/icons-react";

import DashboardCard from "../../../../components/shared/DashboardCard";
import { clientesData } from "./mockData";

interface ClientesDashboardProps {
  isLoading?: boolean;
}

const ClientesDashboard = ({ isLoading }: ClientesDashboardProps) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const successlight = theme.palette.success.light;

  // Gráfico de novos clientes mensais
  const novosClientesOptions: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 300,
    },
    colors: [primary],
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
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
    },
    yaxis: {
      title: {
        text: "Clientes",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      y: {
        formatter: function (val: number) {
          return val + " clientes";
        },
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
  };

  const novosClientesSeries = [
    {
      name: "Novos Clientes",
      data: clientesData.novosMensais,
    },
  ];

  // Gráfico de tempo de fechamento
  const tempoFechamentoOptions: any = {
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
    labels: clientesData.tempoFechamento.labels,
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              color: "#adb0bb",
            },
            value: {
              show: true,
              fontSize: "16px",
              color: undefined,
              formatter: function (val: number) {
                return val + "%";
              },
            },
            total: {
              show: true,
              label: "Total",
              color: "#adb0bb",
              formatter: function () {
                return "100%";
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      colors: ["transparent"],
    },
    legend: {
      show: true,
      position: "bottom",
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };

  const tempoFechamentoSeries = clientesData.tempoFechamento.data;

  // Estatísticas gerais
  const totalClientes = clientesData.novosMensais.reduce((a, b) => a + b, 0);
  const mediaMensal = Math.round(totalClientes / 12);

  return (
    <Grid container spacing={3}>
      {/* Total de Clientes Card */}
      <Grid item xs={12} sm={6} lg={4}>
        <DashboardCard title="Total de Clientes">
          <>
            <Typography variant="h3" fontWeight="700">
              {totalClientes}
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                <IconArrowUpRight width={20} color="#39B69A" />
              </Avatar>
              <Typography variant="subtitle2" fontWeight="600">
                +
                {Math.round(
                  (clientesData.novosMensais[11] / mediaMensal - 1) * 100,
                )}
                %
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                último mês
              </Typography>
            </Stack>
          </>
        </DashboardCard>
      </Grid>

      {/* Média Mensal Card */}
      <Grid item xs={12} sm={6} lg={4}>
        <DashboardCard title="Média Mensal">
          <>
            <Typography variant="h3" fontWeight="700">
              {mediaMensal}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" mt={1}>
              clientes por mês
            </Typography>
          </>
        </DashboardCard>
      </Grid>

      {/* Tempo Médio de Conversão */}
      <Grid item xs={12} sm={6} lg={4}>
        <DashboardCard title="Conversão < 30 Dias">
          <>
            <Typography variant="h3" fontWeight="700">
              {clientesData.tempoFechamento.data[0] +
                clientesData.tempoFechamento.data[1]}
              %
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" mt={1}>
              dos clientes fecham em menos de 30 dias
            </Typography>
          </>
        </DashboardCard>
      </Grid>

      {/* Gráfico Novos Clientes */}
      <Grid item xs={12} lg={8}>
        <DashboardCard title="Novos Clientes por Mês">
          <Box height="315px">
            <Chart
              options={novosClientesOptions}
              series={novosClientesSeries}
              type="bar"
              height={300}
              width={"100%"}
            />
          </Box>
        </DashboardCard>
      </Grid>

      {/* Gráfico Tempo de Fechamento */}
      <Grid item xs={12} lg={4}>
        <DashboardCard title="Tempo para Fechamento de Compra">
          <Box
            height="315px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Chart
              options={tempoFechamentoOptions}
              series={tempoFechamentoSeries}
              type="donut"
              height={300}
              width={"100%"}
            />
          </Box>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};

export default ClientesDashboard;
