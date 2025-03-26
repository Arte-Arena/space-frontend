'use client';
import React from 'react';
import { useTheme } from "@mui/material/styles";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import("react-apexcharts"), { loading: () => <div>Carregando gráfico...</div>, ssr: false });


interface ApexOrcamentosProps {
  totalOrcamentos: { date: string; count: number }[]; // Dados com 'date' e 'count'
}

const ApexOrcamentosMes: React.FC<ApexOrcamentosProps> = ({ totalOrcamentos }) => {
  // Extrair as datas e os valores de vendas
  const categories = totalOrcamentos.map(item => item.date);
  const seriesData = totalOrcamentos.map(item => item.count);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // Opções do gráfico
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'pie',
      height: "auto",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: { show: false },
    },
    colors: ['#0b73e5'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 7,
      curve: 'smooth', //'straight' ou 'smooth'\\
    },
    xaxis: {
      categories: categories, // Datas
      title: {
        text: 'Data',
      },
      labels: {
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: [secondary],
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 1,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    markers: {
      size: 4,
      colors: [secondary],
      strokeWidth: 2,

      hover: {
        size: 7,
      },
    },
    yaxis: {
      title: {
        text: 'Número de Orçamentos',
      },
      labels: {
      },
    },
    title: {
      text: 'Orçamentos no Mês',
      align: 'center',
    },
    legend: {
      labels: {
        colors: [primary],
      },
    },
    tooltip: {
      theme: 'dark',
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
    },
  };

  // Série de dados para o gráfico
  const series = [{ name: 'Orçamentos', data: seriesData }];

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="line"
        height="auto"
        width={"100%"}
      />
    </div>
  );
};

export default ApexOrcamentosMes;