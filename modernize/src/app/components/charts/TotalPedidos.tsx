import React from 'react';
import { useTheme } from "@mui/material/styles";
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Pedido {
  total_orcamento: number;
  id: number;
  orcamento_id: number;
  created_at: string;
}

interface ApexOrcamentosProps {
  totalOrcamentos: Pedido[];
  tipoGrafico: "linha" | "barras" | string; // Definir o tipo de gráfico 
}

const ApexPedidosTotal: React.FC<ApexOrcamentosProps> = ({ totalOrcamentos, tipoGrafico }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const parseValor = (valor: string | number): number => {
    if (valor) {
      if (typeof valor === "string") {
        const valorLimpo = valor.replace(/[^0-9.]/g, '');
        return parseFloat(parseFloat(valorLimpo).toFixed(2));
      } else {
        return parseFloat(valor.toFixed(2));
      }
    } else {
      return 0;
    }
  };

  // Agrupar os valores por dia
  const orcamentosPorDia = totalOrcamentos.reduce((acc, pedido) => {
    const data = dayjs(pedido.created_at).format("YYYY-MM-DD");
    acc[data] = (acc[data] || 0) + parseValor(pedido.total_orcamento);
    return acc;
  }, {} as Record<string, number>);

  // Ordenar as datas
  const categoriasDia = Object.keys(orcamentosPorDia).sort();
  const seriesDataDia = categoriasDia.map(date => orcamentosPorDia[date]);

  // Agrupar os valores por mês
  const orcamentosPorMes = totalOrcamentos.reduce((acc, pedido) => {
    const mes = dayjs(pedido.created_at).format("YYYY-MM");
    acc[mes] = (acc[mes] || 0) + parseValor(pedido.total_orcamento);
    return acc;
  }, {} as Record<string, number>);

  // Ordenar os meses
  const categoriasMes = Object.keys(orcamentosPorMes).sort();
  const seriesDataMes = categoriasMes.map(mes => orcamentosPorMes[mes]);

  // Configuração do gráfico
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: tipoGrafico === "linha" ? "area" : "bar",
      height: 350,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: { show: false },
    },
    colors: [secondary],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 1,
        gradientToColors: [primary],
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    stroke: {
      width: tipoGrafico === "linha" ? 1 : 0,
      curve: 'smooth',
    },
    xaxis: {
      categories: tipoGrafico === "linha" ? categoriasDia : categoriasMes,
      title: { text: tipoGrafico === "linha" ? "Data" : "Mês" },
      labels: {
        show: false,
      },
      axisBorder: {
        show: false, // remove a linha horizontal
      },
      axisTicks: {
        show: false, // remove as marcações
      },
    },
    yaxis: {
      title: { text: "Total de Orçamentos (R$)" },
      decimalsInFloat: 2,
    },
    tooltip: {
      theme: 'dark',
    },
    grid: { show: false, borderColor: theme.palette.divider },
    dataLabels: {
      enabled: false, // <- desativa os números nos pontos
    },
  };

  // Definir os dados do gráfico
  const series = [{ name: "Orçamentos", data: tipoGrafico === "linha" ? seriesDataDia : seriesDataMes }];

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type={tipoGrafico === "linha" ? "area" : "bar"}
        height={350}
        width={"100%"}
      />
    </div>
  );
};

export default ApexPedidosTotal;