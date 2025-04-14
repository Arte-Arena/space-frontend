'use client'
import React, { useState, useEffect } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useQuery } from '@tanstack/react-query';
import ApexOrcamentos from "@/app/components/charts/quantidadeOrcamentoChart";
import ParentCard from "@/app/components/shared/ParentCard";
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Orcamento {
  date: string;
  count: number;
}

const BCrumb = [
  { to: "/", title: "Home" },
  { to: '/apps/vendas/', title: "Vendas" },
  { to: '/apps/vendas/relatorios/', title: "Relatórios de Vendas" },
  { to: '/apps/vendas/relatorios/orcamentos', title: "Orçamentos" },
];

const VendasRelatoriosOrcamentosPorData = () => {
  const [dados, setDados] = useState<Orcamento[]>([]);
  const [filtro, setFiltro] = useState("mes");
  const theme = useTheme(); // Pega o tema atual (light ou dark)

  // Pega token do localStorage
  const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

  if (!accessToken) {
    console.error('Access token is missing');
  }

  // Fetch da API usando react-query
  const { data, isFetching, error } = useQuery({
    queryKey: ['orcamentosPorDia'],
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

    console.log("Dados brutos recebidos:", data);

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
    <PageContainer title="Relatório de Vendas - Orçamentos" description="Histórico de Orçamentos do Vendedor">
      {/* breadcrumb */}
      <Breadcrumb title="Relatório de Vendas - Orçamentos" items={BCrumb} />

      {/* Filtro */}
      <div style={{ marginBottom: '50px', fontSize: '15px' }}>
      {/* Rótulo do select */}
      <FormControl fullWidth>
        <div style={{ marginBottom: '15px'}}>
          <InputLabel id="filtro-label" style={{ color: theme.palette.text.primary }}>
            Filtrar por:
          </InputLabel>
        </div>
        <Select
          labelId="filtro-label"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          label="Filtrar por"
          style={{
            background: 'transparent', // Fundo invisível
            color: theme.palette.text.primary, // Cor do texto
            border: `1px solid ${theme.palette.text.primary}`, // Cor da borda
            padding: '2px', // Ajuste de padding
            fontSize: '15px', // Tamanho da fonte
          }}
        >
          <MenuItem value="semana">Últimos 7 dias</MenuItem>
          <MenuItem value="mes">Último mês</MenuItem>
          <MenuItem value="ano">Último ano</MenuItem>
        </Select>
      </FormControl>
    </div>

      {/* Passando dados para o gráfico */}
      <div style={{ marginBottom: '50px' }}>
        <ParentCard title="Orçamentos Dia a Dia">
          {dados.length > 0 ? (
            <ApexOrcamentos totalOrcamentos={dados} />
          ) : (
            <div>Sem dados disponíveis para exibir.</div>
          )}
        </ParentCard>
      </div>
    </PageContainer>
  );
};

export default VendasRelatoriosOrcamentosPorData;