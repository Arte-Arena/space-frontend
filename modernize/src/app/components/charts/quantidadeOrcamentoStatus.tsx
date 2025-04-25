'use client';
import React from 'react';
import { useTheme } from "@mui/material/styles";
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Chart = dynamic(() => import("react-apexcharts"), { loading: () => <div>Carregando gráfico...</div>, ssr: false });


interface ApexOrcamentosProps {
  aprovados: number;  // Total de orçamentos
  naoAprovados: number;     // Quantidade de não aprovados
}

const ApexOrcamentoStatus: React.FC<ApexOrcamentosProps> = ({ aprovados, naoAprovados }) => {

  const theme = useTheme();
  const primary = theme.palette.primary.main;


  // Opções do gráfico
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'pie',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#ADB0BB',
      toolbar: { show: false },
    },
    labels: ['Orçamentos Aprovados', 'Orçamentos Não Aprovados'],
    colors: ['#3E82F7', '#FF4C52'],
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '13px',
      fontWeight: 500,
      labels: {
        colors: ['#CBD5E1'],
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 4,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontWeight: 600,
        colors: ['#fff'],
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
    stroke: {
      show: false, // ❌ sem contorno ao redor das fatias
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: { width: 280 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  // Série de dados
  const series = [aprovados, naoAprovados];

  return (
    <div>
      <Chart options={options} series={series} type="pie" height={'auto'} />
    </div>
  );
};

export default ApexOrcamentoStatus;