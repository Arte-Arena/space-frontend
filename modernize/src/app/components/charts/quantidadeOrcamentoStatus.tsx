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
      height: 350,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: { show: false }
    },
    dropShadow: {
      enabled: true,
      color: "rgba(0,0,0,0.2)",
      top: 12,
      left: 4,
      blur: 3,
      opacity: 0.4,
    },
    labels: ["Orçamentos Aprovados","Orçamentos Não Aprovados"],
    colors: ['#0b73e5', '#ff4d4d'], // Azul para aprovados, vermelho para não aprovados
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Number(val).toFixed(1)}%`, // Exibir porcentagem
    },
    title: {
      text: 'Status dos Orçamentos',
      align: 'center',
    },
    markers: {
      size: 4,
      opacity: 0.9,
      colors: [primary],
      strokeColor: "#fff",
      strokeWidth: 2,

      hover: {
        size: 7,
      },
    },
    tooltip: {
      theme: 'dark',
      // style: { fontSize: '14px', fontFamily: 'Arial', color: '#FFFFFF' },
    },
  };

  // Série de dados
  const series = [aprovados, naoAprovados];

  return (
    <div>
    <Chart options={options} series={series} type="pie" height={300} />
    
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <Link href="/apps/vendas/relatorios/quantidade-orcamentos-aprovados" target='_blank'>
        <button style={{ margin: "5px", padding: "10px", backgroundColor: "#0b73e5", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Ver Orçamentos Aprovados
        </button>
      </Link>
      <Link href="/apps/vendas/relatorios/orcamentos-nao-aprovados" target='_blank'>
        <button style={{ margin: "5px", padding: "10px", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Ver Orçamentos Não Aprovados
        </button>
      </Link>
    </div>
  </div>
  );
};

export default ApexOrcamentoStatus;