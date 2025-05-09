"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar, Box } from "@mui/material";
import { IconArrowUpRight } from "@tabler/icons-react";
import { differenceInDays, subDays, isWithinInterval } from "date-fns";

import DashboardCard from "../../../../components/shared/DashboardCard";
import { clientesData } from "./mockData";
import PeriodoSelector, { PeriodoType } from "./PeriodoSelector";

interface ClientesDashboardProps {
  isLoading?: boolean;
}

const ClientesDashboard = ({ isLoading }: ClientesDashboardProps) => {
  const [periodo, setPeriodo] = useState<PeriodoType>("todos");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const successlight = theme.palette.success.light;

  const filtrarDadosPorPeriodo = (
    periodo: PeriodoType,
    dataInicioParam?: Date,
    dataFimParam?: Date,
  ) => {
    let novosMensaisData = [...clientesData.novosMensais];
    let tempoFechamentoData = [...clientesData.tempoFechamento.data];

    switch (periodo) {
      case "7dias":
        novosMensaisData = [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          Math.round(clientesData.novosMensais[11] * 0.25),
        ];
        tempoFechamentoData = [40, 30, 20, 10];
        break;
      case "30dias":
        novosMensaisData = [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          clientesData.novosMensais[11],
        ];
        tempoFechamentoData = [38, 28, 22, 12];
        break;
      case "90dias":
        novosMensaisData = [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          clientesData.novosMensais[9],
          clientesData.novosMensais[10],
          clientesData.novosMensais[11],
        ];
        tempoFechamentoData = [37, 27, 21, 15];
        break;
      case "1ano":
        novosMensaisData = [...clientesData.novosMensais];
        tempoFechamentoData = [35, 25, 20, 20];
        break;
      case "custom":
        if (dataInicioParam && dataFimParam) {
          const diasNoIntervalo =
            differenceInDays(dataFimParam, dataInicioParam) + 1;
          const fatorProporcional = diasNoIntervalo / 365;

          if (diasNoIntervalo <= 30) {
            novosMensaisData = [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              Math.round(clientesData.novosMensais[11] * fatorProporcional),
            ];
            tempoFechamentoData = [39, 29, 21, 11];
          } else if (diasNoIntervalo <= 90) {
            novosMensaisData = [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              Math.round(clientesData.novosMensais[9] * fatorProporcional),
              Math.round(clientesData.novosMensais[10] * fatorProporcional),
              Math.round(clientesData.novosMensais[11] * fatorProporcional),
            ];
            tempoFechamentoData = [36, 26, 22, 16];
          } else {
            novosMensaisData = clientesData.novosMensais.map((valor) =>
              Math.round(valor * fatorProporcional),
            );
            tempoFechamentoData = [35, 25, 20, 20];
          }
        }
        break;
      default:
        novosMensaisData = [...clientesData.novosMensais];
        tempoFechamentoData = [...clientesData.tempoFechamento.data];
        break;
    }

    return {
      novosMensais: novosMensaisData,
      tempoFechamento: {
        labels: clientesData.tempoFechamento.labels,
        data: tempoFechamentoData,
      },
    };
  };

  const dadosFiltrados = filtrarDadosPorPeriodo(periodo, dataInicio, dataFim);

  const totalClientes = dadosFiltrados.novosMensais.reduce((a, b) => a + b, 0);

  let divisorMedia = 12;
  if (periodo === "7dias") divisorMedia = 1;
  if (periodo === "30dias") divisorMedia = 1;
  if (periodo === "90dias") divisorMedia = 3;
  if (periodo === "custom" && dataInicio && dataFim) {
    const diasNoIntervalo = differenceInDays(dataFim, dataInicio) + 1;
    divisorMedia = Math.max(1, Math.round(diasNoIntervalo / 30));
  }

  const mediaMensal = Math.round(totalClientes / divisorMedia) || 0;

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
      data: dadosFiltrados.novosMensais,
    },
  ];

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
    labels: dadosFiltrados.tempoFechamento.labels,
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

  const tempoFechamentoSeries = dadosFiltrados.tempoFechamento.data;

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
                    ((dadosFiltrados.novosMensais[11] || 0) /
                      (mediaMensal || 1) -
                      1) *
                      100,
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

        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard title="Conversão < 30 Dias">
            <>
              <Typography variant="h3" fontWeight="700">
                {dadosFiltrados.tempoFechamento.data[0] +
                  dadosFiltrados.tempoFechamento.data[1]}
                %
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" mt={1}>
                dos clientes fecham em menos de 30 dias
              </Typography>
            </>
          </DashboardCard>
        </Grid>

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
    </>
  );
};

export default ClientesDashboard;
