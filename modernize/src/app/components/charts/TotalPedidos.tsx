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

  // Função para converter valores monetários em número
  const parseValor = (valor: string | number): number => {
    if (typeof valor === "string") {
      // Remove qualquer caractere que não seja número ou ponto decimal
      const valorLimpo = valor.replace(/[^0-9.]/g, '');
      return parseFloat(parseFloat(valorLimpo).toFixed(2));
    }
    return parseFloat(valor.toFixed(2));
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
      type: tipoGrafico === "linha" ? "line" : "bar",
      height: 350,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: { show: false },
    },
    colors: ['#0b73e5'],
    stroke: {
      width: tipoGrafico === "linha" ? 2 : 0,
      curve: 'smooth',
    },
    xaxis: {
      categories: tipoGrafico === "linha" ? categoriasDia : categoriasMes,
      title: { text: tipoGrafico === "linha" ? "Data" : "Mês" },
    },
    yaxis: {
      title: { text: "Total de Orçamentos (R$)" },
      decimalsInFloat: 2,
    },
    tooltip: {
      theme: 'dark',
    },
    grid: { show: true, borderColor: theme.palette.divider }, 
  };

  // Definir os dados do gráfico
  const series = [{ name: "Orçamentos", data: tipoGrafico === "linha" ? seriesDataDia : seriesDataMes }];

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type={tipoGrafico === "linha" ? "line" : "bar"}
        height={350}
        width={"100%"}
      />
    </div>
  );
};

export default ApexPedidosTotal;