'use client'
import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';
import ApexOrcamentosMes from "../charts/quantidadeOrcamentoChartMes";

interface Orcamento {
  date: string;
  count: number;
}

const VendasRelatoriosOrcamentosPorDataComponent = () => {
  const [dados, setDados] = useState<Orcamento[]>([]);
  const [filtro, setFiltro] = useState("mes"); // seta o estado que faz o filtro precisa disso pra funcionar

  // Pega token do localStorage
  const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

  if (!accessToken) {
    // console.error('Access token is missing');
    console.error('Access token is missing');
  }

  // Fetch da API usando react-query
  const { data, isFetching, error } = useQuery({
    queryKey: ['OrcamentosPorData'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Token de acesso não disponível');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/orcamentos-por-dia`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar dados");
      }

      return res.json();
    },
    enabled: !!accessToken, // Só executa a query se houver token
  });

  // Filtragem dos dados com base no filtro selecionado
  useEffect(() => {
    if (!data || !Array.isArray(data.totalOrcamentos)) return;

    // console.log("Dados brutos recebidos:", data);

    // Ordenar os dados por data
    const sortedData = [...data.totalOrcamentos].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const now = new Date();
    let dataFiltrada = sortedData;

    if (filtro === "semana") {
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(now.getDate() - 7);
      dataFiltrada = sortedData.filter((d: Orcamento) => new Date(d.date) >= seteDiasAtras);
    } else if (filtro === "mes") {
      const umMesAtras = new Date();
      umMesAtras.setMonth(now.getMonth() - 1);
      dataFiltrada = sortedData.filter((d: Orcamento) => new Date(d.date) >= umMesAtras);
    } else if (filtro === "ano") {
      const umAnoAtras = new Date();
      umAnoAtras.setFullYear(now.getFullYear() - 1);
      dataFiltrada = sortedData.filter((d: Orcamento) => new Date(d.date) >= umAnoAtras);
    }

    setDados(dataFiltrada);
  }, [data, filtro]);

  return (
    <div>
      {dados.length > 0 ? (
        <ApexOrcamentosMes totalOrcamentos={dados} />
      ) : (
        <div>Sem dados disponíveis para exibir.</div>
      )}
    </div>
  );
};

export default VendasRelatoriosOrcamentosPorDataComponent;