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
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 300,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    colors: ['#3E82F7'],
    stroke: { curve: 'smooth', width: 1 },
    xaxis: {
      categories: categories,
      labels: {
        show: false,
      },
      // labels: {
      //   style: {
      //     colors: '#8898aa',
      //     fontSize: '12px',
      //     fontWeight: 500,
      //   },
      // },
      // axisBorder: { color: '#2c3e50' },
      // axisTicks: { color: '#2c3e50' },
      axisBorder: {
        show: false, // remove a linha horizontal
      },
      axisTicks: {
        show: false, // remove as marcações
      },
    },
    yaxis: {
      title: {
        text: 'Nº de Orçamentos',
        style: {
          color: '#ccc',
          fontWeight: 500,
          fontSize: '14px',
        },
      },
      labels: {
        style: {
          colors: '#8898aa',
          fontSize: '12px',
        },
      },
    },
    grid: {
      show: false,
      // borderColor: '#2c3e50',
      // strokeDashArray: 4,
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.7,
        gradientToColors: ['#3E82F7'], // cor de fundo clara
        inverseColors: false,
        opacityFrom: 0.4, // começa mais forte
        opacityTo: 0,     // vai sumindo
        stops: [0, 100],
      },
    },
    // markers: {
    //   size: 1,
    //   strokeWidth: 2,
    //   strokeColors: '#fff',
    //   hover: {
    //     size: 7,
    //   },
    // },
    title: {
      text: 'Orçamentos no Mês',
      align: 'left',
      style: {
        fontSize: '16px',
        color: '#fff',
        fontWeight: 600,
      },
    },
    legend: { show: false },
    dataLabels: {
      enabled: false, // <- desativa os números nos pontos
    },
  };

  // Série de dados para o gráfico
  const series = [{ name: 'Orçamentos', data: seriesData }];

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="area"
        height="auto"
        width={"100%"}
      />
    </div>
  );
};

export default ApexOrcamentosMes;