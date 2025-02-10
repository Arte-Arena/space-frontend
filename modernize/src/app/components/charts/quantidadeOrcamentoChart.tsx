'use client';
import React from 'react';
import { useTheme } from "@mui/material/styles";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import("react-apexcharts"), { loading: () => <div>Carregando gráfico...</div>, ssr: false });


interface ApexOrcamentosProps {
  totalOrcamentos: { date: string; count: number }[]; // Dados com 'date' e 'count'
}

const ApexOrcamentos: React.FC<ApexOrcamentosProps> = ({ totalOrcamentos }) => {
  // Extrair as datas e os valores de vendas
  const categories = totalOrcamentos.map(item => item.date);
  const seriesData = totalOrcamentos.map(item => item.count);

    const theme = useTheme();
  const primary = theme.palette.primary.main;

  // Opções do gráfico
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'pie',
      height: 350,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: { show: false },
    },
    dropShadow: {
      enabled: true,
      color: "rgba(0,0,0,0.2)",
      top: 12,
      left: 4,
      blur: 3,
      opacity: 0.4,
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
        // style: { fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF' },
      },
      labels: {
        // style: { fontSize: '12px', fontWeight: 'normal', colors: '#FFFFFF' },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: [primary],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100, 100, 100],
      },
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
    yaxis: {
      title: {
        text: 'Número de Orçamentos',
        // style: { fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF' },
      },
      labels: {
        // style: { fontSize: '12px', fontWeight: 'normal', colors: '#FFFFFF' },
      },
    },
    title: {
      text: 'Orçamentos por Data',
      align: 'center',
      // style: { fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' },
    },
    legend: {
      labels: {
        // style: { colors: '#FFFFFF', fontSize: '14px' },
      },
    },
    tooltip: {
      theme: 'dark',
      // style: { fontSize: '14px', fontFamily: 'Arial', color: '#FFFFFF' },
    },
    grid: {
      show: false,
    },
  };

  // Série de dados para o gráfico
  const series = [{ name: 'Orçamentos', data: seriesData }];

  return (
    // <div style={{ backgroundColor: '#2A3447',
    //   padding: '20px',
    //   borderRadius: '10px',
    //   textAlign: 'center',
    //   border: '1px solid #3A4557', // Cor levemente mais clara que o fundo
    //   margin: '20px 0' }}>
    <div> 
      <Chart
        options={options}
        series={series}
        type="line"
        height="300px"
        width={"100%"}
      />      
      {/* <ReactApexChart options={options} series={series} type="line" height={350} /> */}
    </div>
  );
};

export default ApexOrcamentos;